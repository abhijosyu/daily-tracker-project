import { db, auth } from "../firebase";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import Task from "../Tasks/model/Task";
import type TaskModel from "../Tasks/model/TaskModel";

// saves a given task to firebase
export async function saveTaskInFirebase(task: Task) {
  const user = auth.currentUser;
  if (!user) return;

  const taskBrokenDown = {
    name: task.name,
    category: task.category,
    progress: task.progress,
    dateDue: task.dateDue.toISOString(),
    id: task.getID(),
  };

  await setDoc(
    doc(db, "users", user.uid, "taskList", taskBrokenDown.id.toString()),
    taskBrokenDown
  );
}

// deletes a given task to firebase
export async function deleteTaskInFirebase(task: Task) {
  const user = auth.currentUser;
  if (!user) return;

  const taskRef = doc(
    db,
    "users",
    user.uid,
    "taskList",
    task.getID().toString()
  );
  if (taskRef) {
    await deleteDoc(taskRef);
  }
}

// saves a category list to firebase
export async function updateCategoriesInFirebase(categoryList: string[][]) {
  const user = auth.currentUser;
  if (!user) return;

  const categoryRef = doc(
    db,
    "users",
    user.uid,
    "categories",
    "categoriesSortedList"
  );
  const converted = categoryList.map(([key, value]) => ({ key, value }));

  await setDoc(categoryRef, { categoryList: converted });
}

// saves a progress list to firebase
export async function updateProgressInFirebase(progressList: string[][]) {
  const user = auth.currentUser;
  if (!user) return;

  const progressRef = doc(
    db,
    "users",
    user.uid,
    "progress",
    "progressListSorted"
  );
  const converted = progressList.map(([name, color]) => ({ name, color }));

  await setDoc(progressRef, { progressList: converted });
}

// saves a selected category list to firebase
export async function updateSelectedCategoriesInFirebase(
  categories: string[],
  model: TaskModel
) {
  const user = auth.currentUser;
  if (!user) return;

  const selectedCategoriesRef = doc(
    db,
    "users",
    user.uid,
    "categories",
    "selectedCategoriesList"
  );

  const validKeys = model.getCategoriesListSorted().map(([key, _]) => key);

  const filteredCategoriesSelected = categories.filter((item) =>
    validKeys.includes(item)
  );

  await setDoc(selectedCategoriesRef, {
    categoryList: filteredCategoriesSelected,
  });
}

// saves a selected progress list to firebase
export async function updateSelectedProgressInFirebase(
  progress: string[],
  model: TaskModel
) {
  const user = auth.currentUser;
  if (!user) return;

  const progressRef = doc(
    db,
    "users",
    user.uid,
    "progress",
    "selectedProgressList"
  );

  const validKeys = model.getProgressListSorted().map(([key, _]) => key);

  const filteredProgressSelected = progress.filter((item) =>
    validKeys.includes(item)
  );

  await setDoc(progressRef, { progressList: filteredProgressSelected });
}

// saves a sort settings to firebase
export async function updateSortTypeAndAscendingInFirebase(
  type: string,
  ascending: boolean
) {
  const user = auth.currentUser;
  if (!user) return;

  const sortTypeRef = doc(db, "users", user.uid, "sort", "sortType");

  const sortAscendingRef = doc(db, "users", user.uid, "sort", "ascendingType");

  await setDoc(sortTypeRef, { sort: type });
  await setDoc(sortAscendingRef, { ascending: ascending });
}
