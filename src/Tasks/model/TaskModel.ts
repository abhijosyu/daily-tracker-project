import Task from "./Task";

import CategoryModel from "./CategoryModel";
import ProgressModel from "./ProgressModel";
import {
  deleteTaskInFirebase,
  saveTaskInFirebase,
  updateCategoriesInFirebase,
  updateProgressInFirebase,
  updateSelectedCategoriesInFirebase,
  updateSelectedProgressInFirebase,
  updateSortTypeAndAscendingInFirebase,
} from "../../FirebaseStorage/TaskStorage";

/**
 * represents a model for a collection of tasks. The model will have
 * a list of tasks as a map, along with having its own categories and
 * progression tags.
 *
 */
export default class TaskModel {
  taskList: Map<number, Task>; // the collection of tasks with ID as key, and Task as value
  categoryModel: CategoryModel; // the category model to follow
  progressModel: ProgressModel; // the progress model to follow

  categories: Map<string, string>; // the category map from the category Model
  progress: Map<string, string>; // the progress map from the progress Model

  sortType: string; // the type of way that is set to sort the tasks by
  sortAscending: boolean; // whether the sort is ascending or descenging

  /**
   * represents the constructor for the taskmodel.
   * @param categoryModel the given categorymodel to follow
   * @param progressModel the given progressmodel to follow
   */
  constructor(categoryModel: CategoryModel, progressModel: ProgressModel) {
    this.categoryModel = categoryModel;
    this.progressModel = progressModel;

    this.taskList = new Map<number, Task>();

    this.categories = categoryModel.categoriesMap;
    this.progress = progressModel.progressMap;

    this.sortType = "none";
    this.sortAscending = true;
  }

  // #region task methods

  /**
   * adds a task to the taskList.
   * @param task the given task to add.
   */
  async addTask(task: Task): Promise<void> {
    this.taskList.set(task.getID(), task);
    this.saveToFirebase(task);
  }

  /**
   * deleted a task.
   * @param id the given id of the task to delete.
   */
  async deleteTask(id: number): Promise<void> {
    this.removeFromFirebase(id);
    await this.taskList.delete(id);
  }

  /**
   * edits a task in the task list.
   * @param id the given id of the task to edit
   * @param task the task to replace that id with
   */
  async editTask(id: number, task: Task): Promise<void> {
    this.taskList.set(id, task);
    this.saveToFirebase(task);
  }

  //#endregion

  // #region category functions

  /**
   * signals to the model's category to add a category
   * @param key the key of the category
   * @param value the value of the category
   */
  addCategory(key: string, value: string): void {
    this.categoryModel.addCategory(key, value);
  }

  /**
   * signals the model's categor to delete a category
   * @param cat the name of the category to delete
   */
  deleteCategory(cat: string): void {
    this.categoryModel.deleteCategory(cat);
  }

  /**
   * updates a category to its new name and updates all tasks with that category to the new name
   * @param original the original name of the category
   * @param newName the new name of the category
   */
  updateEditedCategory(original: string, newName: string) {
    try {
      this.categoryModel.editCategory(original, newName);
      this.categories = this.categoryModel.categoriesMap;

      const TasksToReplace = this.getTasksAsArray().filter(
        (task) => task.category == original
      );

      TasksToReplace.forEach((task) => {
        const updatedTask = new Task(
          task.name,
          newName,
          task.progress,
          task.dateDue,
          task.getID()
        );
        this.editTask(task.getID(), updatedTask);
      });
    } catch {}
  }

  // #endregion category functions

  // #region progress functions

  /**
   * adds a progress tag to the progress map
   * @param key the name of the tag
   * @param value the color to set it to
   */
  addProgress(key: string, value: string): void {
    this.progressModel.addProgress(key, value);
  }

  /**
   * deletes a progress tag from the progress map
   * @param prog the name (key) of the progress tag
   */
  deleteProgress(prog: string): void {
    this.progressModel.deleteProgress(prog);
  }

  /**
   * updates the progress tag to its new name and/or color
   * @param original the original name of the tag
   * @param newName the new name of the tag
   * @param color the new color of the tag
   */
  updateEditedProgress(original: string, newName: string, color: string) {
    try {
      this.progressModel.editProgress(original, newName, color);
      this.progress = this.progressModel.progressMap;

      const TaskToReplace = this.getTasksAsArray().filter(
        (task) => task.progress == original
      );

      TaskToReplace.forEach((task) => {
        const updatedTask = new Task(
          task.name,
          task.category,
          newName,
          task.dateDue,
          task.getID()
        );
        this.editTask(task.getID(), updatedTask);
      });
    } catch {}
  }

  // #endregion

  // #region sorting/filtering

  /**
   * Swaps an item in the categories or progress section up or down through delegating it to the respective model
   * @param item the item to swap
   * @param type if its a category (1) or a progess (2)
   * @param swapUp whether to swap up or down
   */
  swapItem(item: string, type: number, swapUp: boolean): void {
    if (type == 1) {
      this.categoryModel.swapItems(item, swapUp);
    } else if (type == 2) {
      this.progressModel.swapItems(item, swapUp);
    }
  }
  /**
   * sorts the tasks in a given way
   * @param type whhich way to sort tasks (none, date, category, etc.)
   * @param ascending sort it ascending or descending
   * @returns the sorted task list
   */
  sortTasksBy = (type: string, ascending: boolean): Task[] => {
    this.sortType = type;
    this.sortAscending = ascending;
    const unsortedTasks = this.getTasksAsArray();
    this.updateSortTypeAndAscendingFromFirebase(type, ascending);

    let sortedTasks;

    switch (this.sortType) {
      case "DATE": {
        ascending
          ? (sortedTasks = unsortedTasks.sort(
              (task1, task2) =>
                task1.dateDue.getTime() - task2.dateDue.getTime()
            ))
          : (sortedTasks = unsortedTasks.sort(
              (task1, task2) =>
                task2.dateDue.getTime() - task1.dateDue.getTime()
            ));
        break;
      }
      case "FILTER": {
        const categoryList = Array.from(
          this.getCategoriesListSorted().map(([key]) => key)
        );
        ascending
          ? (sortedTasks = unsortedTasks.sort(
              (task1, task2) =>
                categoryList.indexOf(task1.category) -
                categoryList.indexOf(task2.category)
            ))
          : (sortedTasks = unsortedTasks.sort(
              (task1, task2) =>
                categoryList.indexOf(task2.category) -
                categoryList.indexOf(task1.category)
            ));
        break;
      }
      case "PROGRESS": {
        const progressList = Array.from(
          this.getProgressListSorted().map(([key]) => key)
        );
        ascending
          ? (sortedTasks = unsortedTasks.sort(
              (task1, task2) =>
                progressList.indexOf(task1.progress) -
                progressList.indexOf(task2.progress)
            ))
          : (sortedTasks = unsortedTasks.sort(
              (task1, task2) =>
                progressList.indexOf(task2.progress) -
                progressList.indexOf(task1.progress)
            ));
        break;
      }

      case "NONE": {
        ascending
          ? (sortedTasks = this.getTasksAsArray())
          : (sortedTasks = this.getTasksAsArray().reverse());
        break;
      }

      default: {
        sortedTasks = this.getTasksAsArray();
        break;
      }
    }

    return sortedTasks;
  };

  /**
   * filters the tasks based on the given categories.
   * @param categories the categories to filter by
   * @returns an array of tasks that match the given categories
   */
  filterTasks(categories: string[], progress: string[]): Task[] {
    if (categories.length === 0 && progress.length === 0) {
      return this.getTasksAsArray();
    }
    this.updateSelectedCategoriesFromFirebase(categories);
    this.updateSelectedProgressFromFirebase(progress);
    return this.getTasksAsArray().filter(
      (task) =>
        categories.includes(task.category) && progress.includes(task.progress)
    );
  }

  //#endregion

  // #region getters

  /**
   * converts the task map into an array.
   * @returns the tasks in an array format.
   */
  getTasksAsArray(): Task[] {
    return Array.from(this.taskList.values()).reverse();
  }

  /**
   * the possible options to sort the tasks by
   */
  sortMap(): string[][] {
    return [
      ["None", "None"],
      ["Filter", "Filter"],
      ["Progress", "Progress"],
      ["Date", "Date"],
    ];
  }

  /**
   * gets the sorted category list
   * @returns
   */
  getCategoriesListSorted(): string[][] {
    const sortedCategoryList = this.categoryModel.categoriesList;
    this.updateCategoriesFromFirebase(sortedCategoryList);
    return sortedCategoryList;
  }

  /**
   * gets the sorted progress list
   * @returns
   */
  getProgressListSorted(): string[][] {
    const sortedProgressList = this.progressModel.progressList;
    this.updateProgressFromFirebase(sortedProgressList);
    return sortedProgressList;
  }

  /**
   * gets the largest ID + 1 to assign to a new task
   * @returns the largest ID + 1
   */
  getNextID(): number {
    const taskList = this.getTasksAsArray();
    if (taskList.length !== 0) {
      const maxID = Math.max(...taskList.map((task) => task.getID()));
      return maxID + 1;
    } else {
      return 1;
    }
  }

  // #endregion

  // #region firebase

  // saves a given task to fire base
  async saveToFirebase(task: Task): Promise<void> {
    await saveTaskInFirebase(task);
  }

  // removes a given task from fire base
  async removeFromFirebase(id: number): Promise<void> {
    const taskToDelete = this.taskList.get(id);
    if (taskToDelete) {
      await deleteTaskInFirebase(taskToDelete);
    } else {
      console.warn("Task With ID, ", id, "not found in database taskList");
    }
  }

  // updates the categories list to firebase
  async updateCategoriesFromFirebase(categories: string[][]): Promise<void> {
    await updateCategoriesInFirebase(categories);
  }

  // updates the progress list to firebase
  async updateProgressFromFirebase(progress: string[][]): Promise<void> {
    await updateProgressInFirebase(progress);
  }

  // updates the selected categories to firebase
  async updateSelectedCategoriesFromFirebase(
    categories: string[]
  ): Promise<void> {
    await updateSelectedCategoriesInFirebase(categories, this);
  }

  // updates the seleted progress to firebase
  async updateSelectedProgressFromFirebase(progress: string[]): Promise<void> {
    await updateSelectedProgressInFirebase(progress, this);
  }

  // updates the sort and ascending type to firebase
  async updateSortTypeAndAscendingFromFirebase(
    type: string,
    ascending: boolean
  ) {
    await updateSortTypeAndAscendingInFirebase(type, ascending);
  }

  //#endregion
}
