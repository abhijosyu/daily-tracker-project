import { db, auth } from "../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Task from "../Tasks/model/Task";
import type TaskModel from "../Tasks/model/TaskModel";

// loads the saved task list of the user into the model (given by the controller)
export async function loadTaskList(model: TaskModel): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const tasksCollection = collection(db, "users", user.uid, "taskList");
  const snapshot = await getDocs(tasksCollection);

  snapshot.forEach((doc) => {
    const t = doc.data();
    const AddTask = new Task(
      t.name,
      t.category,
      t.progress,
      new Date(t.dateDue),
      t.id
    );
    model.addTask(AddTask);
  });
}

// loads the saved category list of the user into the model (given by the controller)
export async function loadCategoryList(model: TaskModel): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const categoryDocRef = doc(
    db,
    "users",
    user.uid,
    "categories",
    "categoriesSortedList"
  );
  const snapshot = await getDoc(categoryDocRef);

  if (snapshot.exists()) {
    console.log("in task loading reseting things");
    model.categoryModel.categoriesMap = new Map<string, string>();
    console.log(model.categoryModel.categoriesMap.size);
    model.categoryModel.categoriesList = [];
    const data = snapshot.data();
    const categoryList: { key: string; value: string }[] =
      data?.categoryList ?? [];
    console.log("category list: " + categoryList);

    for (const { key, value } of categoryList) {
      model.addCategory(key, value);
    }
  }
}

// loads the saved progress list of the user into the model (given by the controller)
export async function loadProgressList(model: TaskModel): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const progressRef = doc(
    db,
    "users",
    user.uid,
    "progress",
    "progressListSorted"
  );
  const snapshot = await getDoc(progressRef);

  if (snapshot.exists()) {
    console.log("in task loading reseting things");
    model.progressModel.progressMap = new Map<string, string>();
    console.log(model.progressModel.progressMap.size);
    model.progressModel.progressList = [];
    const data = snapshot.data();
    const progressList: { name: string; color: string }[] =
      data?.progressList ?? [];
    console.log("progress list in firebase: " + progressList);

    for (const { name, color } of progressList) {
      console.log("name: " + name + " color: " + color);
      model.addProgress(name, color);
    }
    // model.addProgress("hdtrs", "#27590f"); // remove this later
  }
}

// loads the saved selected category list of the user into the model (given by the controller)
export async function loadSelectedCategoryList(
  model: TaskModel
): Promise<string[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const categoryDocRef = doc(
    db,
    "users",
    user.uid,
    "categories",
    "selectedCategoriesList"
  );
  const snapshot = await getDoc(categoryDocRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    const categoryList: [] = data?.categoryList ?? [];
    console.log("category list: " + categoryList);

    return categoryList;
  } else {
    return model.getCategoriesListSorted().map(([key, _]) => key);
  }
}

// loads the saved selected progress list of the user into the model (given by the controller)
export async function loadSelectedProgressList(
  model: TaskModel
): Promise<string[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const progressDocRef = doc(
    db,
    "users",
    user.uid,
    "progress",
    "selectedProgressList"
  );
  const snapshot = await getDoc(progressDocRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    const progressList: [] = data?.progressList ?? [];
    console.log("selected progress list: " + progressList);

    return progressList;
  } else {
    return model.getProgressListSorted().map(([key, _]) => key);
  }
}

// loads the saved sort type settings of the user into the model (given by the controller)
export async function loadSortTypeAndAscending(
  model: TaskModel
): Promise<[string, boolean]> {
  const user = auth.currentUser;
  if (!user) return ["NONE", true];

  const sortTypeRef = doc(db, "users", user.uid, "sort", "sortType");

  const sortAscendingRef = doc(db, "users", user.uid, "sort", "ascendingType");

  const sortSnapshot = await getDoc(sortTypeRef);

  const ascendSnapshot = await getDoc(sortAscendingRef);

  if (sortSnapshot.exists() && ascendSnapshot.exists()) {
    const sortData = sortSnapshot.data();
    const ascendData = ascendSnapshot.data();

    const sortDataSend = sortData.sort;

    const ascendDataSend = ascendData.ascending;

    model.sortType = sortDataSend;

    model.sortAscending = ascendDataSend;

    return [sortDataSend, ascendDataSend];
  } else {
    return ["NONE", true];
  }
}
