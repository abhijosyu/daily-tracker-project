import React, { useState, useEffect } from "react";

import Task from "../model/Task";
import TaskModel from "../model/TaskModel";

import CategoryModel from "../model/CategoryModel";
import ProgressModel from "../model/ProgressModel";

import TaskPage from "../view/TaskPage";

import {
  loadCategoryList,
  loadProgressList,
  loadSelectedCategoryList,
  loadSelectedProgressList,
  loadSortTypeAndAscending,
  loadTaskList,
} from "../../FirebaseStorage/TaskLoading";

/**
 * represents a controller for tasks.
 * @returns a task page with:
 *
 * information for sidebar:
 *
 * - progress of model (modelProgress)
 * - add category & progress (onAddType)
 * - delete category & progress (onDeleteType)
 * - edit category & progress (onEditType)
 * - if a task is being edited (onPauseScreen)
 * - selected (checked) categories (selectedCategories)
 * - selected (checked) progress (selectedProgress)
 * - tracking which categories & progress are being checked or unchecked (onTypeChange)
 * - status of the screen (if a task is being edited) - (onShowPauseScreen)
 * - a list of options to sort by (sortList)
 * - sorting tasks with given properties (onSortTasks)
 * - swapping progress or category fields (onSwap)
 * - lists of the progress & category models sorted (progressList & categoriesList)
 *
 *
 *
 *
 * information for taskpage:
 *
 * - progress of model (modelProgress)
 * - task list (taskList)
 * - add tasks (onAddTask)
 * - delete tasks (onDeleteTask)
 * - edit tasks (onEditTask)
 * - if a task is being edited (onPauseScreen)
 * - lists of the progress & category models sorted (progressList & categoriesList)
 *
 *
 *
 *
 *
 *
 *
 */
const TaskController: React.FC = () => {
  // #region states and consts
  const useModel = new TaskModel(new CategoryModel(), new ProgressModel());
  // creates a new model which will be used for the program
  const [model] = useState(() => useModel);

  // updates the tasks that will be given/visible to the view
  const [taskList, setTaskList] = useState<Task[]>([
    ...model.getTasksAsArray(),
  ]);

  // updates the categories that will be given/visible to the view based on the
  // current categories in the model
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // updates the progress that will be given/visible to the view based on the
  // current progress in the model
  const [selectedProgress, setSelectedProgress] = useState<string[]>([]);

  // determines whether the screen should be "frozen" ie. when editing a task
  const [pauseScreen, setPauseScreen] = useState<boolean>(false);

  //  the sorted category list
  const [sortedCategoryList, setSortedCategoryList] = useState<string[][]>([]);

  // the sorted progress list
  const [sortedProgressList, setSortedProgressList] = useState<string[][]>([
    ["Not Started", "#791a22"],
    ["Low Progress", "#8d772e"],
    ["Medium Progress", "#183b58"],
    ["High Progress", "#351853"],
    ["Completed", "#0e3f1a"],
  ]);

  // sets to false once all the information from firebase loads and is set
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // the list of options to sort
  const sortList = model.sortMap();

  //#endregion

  // retrieves the information from firebase and loads it up on first render
  useEffect(() => {
    const loadTasks = async () => {
      await loadTaskList(model);
      await loadCategoryList(model);
      await loadProgressList(model);
      setTaskList([...model.getTasksAsArray()]);

      setSortedCategoryList([...model.getCategoriesListSorted()]);
      setSortedProgressList([...model.getProgressListSorted()]);

      const loadSelectedCategories = await loadSelectedCategoryList(model);
      const loadSelectedProgress = await loadSelectedProgressList(model);

      model.progress = model.progressModel.progressMap;

      setSelectedCategories(loadSelectedCategories);
      setSelectedProgress(loadSelectedProgress);

      await loadSortTypeAndAscending(model);

      sortTasksBy(model.sortType, model.sortAscending);

      filterTasks(loadSelectedCategories, loadSelectedProgress);
      setIsLoading(false);
    };
    loadTasks();
  }, []);

  //#region task view methods

  // adds a task with the given information from the view
  const addItem = async (
    name: string,
    category: string,
    progress: string,
    dateDue?: string
  ) => {
    const NewItem = new Task(
      name,
      category,
      progress,
      dateDue ? parseDateFromInput(dateDue) : new Date(),
      model.getNextID()
    );
    model.addTask(NewItem);
    filterTasks(selectedCategories, selectedProgress); // makes sure that still only the tasks of
    // selected categories are shown
  };

  // deletes a task with the given id
  const deleteItem = async (id: number) => {
    model.deleteTask(id);
    filterTasks(selectedCategories, selectedProgress); // makes sure that still only the tasks of
    // selected categories are shown
  };

  // TODO: edits an item with the given new properties from the view and the ID
  const editItem = (
    name: string,
    category: string,
    id: number,
    progress: string,
    dateDue?: string
  ) => {
    const newItem = new Task(
      name,
      category,
      progress,
      dateDue ? parseDateFromInput(dateDue) : new Date(),
      id
    );
    model.editTask(id, newItem);

    filterTasks(selectedCategories, selectedProgress); // makes sure that still only the tasks of
    // selected categories are shown
  };

  // sorts tasks by the given type and with how it should be sequentially
  const sortTasksBy = (type: string, ascending: boolean): void => {
    setTaskList(model.sortTasksBy(type.toUpperCase(), ascending));
    filterTasks(selectedCategories, selectedProgress);
  };

  // #endregion

  //#region progress & categories

  // filters tasks based on their category, updating the selectedCategories and taskList
  const filterTasks = async (categories: string[], progress: string[]) => {
    const filteredTasks = [...model.filterTasks(categories, progress)];
    const sortedTasks = [
      ...model.sortTasksBy(model.sortType, model.sortAscending),
    ];
    const sharedTasks = sortedTasks.filter((item) =>
      filteredTasks.includes(item)
    );
    setTaskList(sharedTasks);
    setSelectedCategories(categories); // the selected categories list updates
    setSelectedProgress(progress); // the selected progress list updates here
  };

  // adds a category to the categories through the model
  const addCategoryOrProgress = (item: string, type: number, color: string) => {
    if (type == 1) {
      model.addCategory(item, item);
      const updatedCategories = [...selectedCategories, item];
      setSelectedCategories(updatedCategories);
    } else if (type == 2) {
      model.addProgress(item, color);
      const updatedProgress = [...selectedProgress, item];
      setSelectedProgress(updatedProgress);
    }

    const updatedCategories = [...selectedCategories, item];
    const updatedProgress = [...selectedProgress, item];

    setSortedCategoryList(model.getCategoriesListSorted()); // makes sure that it updates the list
    setSortedProgressList(model.getProgressListSorted()); // makes sure that it updates the list
    filterTasks(updatedCategories, updatedProgress);
  };

  // deletes a category to the categories through the model
  const deleteCategoryOrProgress = (item: string, type: number) => {
    if (type === 1) {
      model.deleteCategory(item);
      let updatedCategories = selectedCategories;
      updatedCategories.includes(item)
        ? updatedCategories.filter((cat) => cat != item)
        : updatedCategories;

      setSelectedCategories(updatedCategories);
      filterTasks(updatedCategories, selectedProgress);
      setSortedCategoryList(model.getCategoriesListSorted());
    } else if (type === 2) {
      model.deleteProgress(item);
      let updatedProgress = selectedProgress;
      updatedProgress.includes(item)
        ? updatedProgress.filter((prog) => prog != item)
        : updatedProgress;
      setSelectedProgress(updatedProgress);
      filterTasks(selectedCategories, updatedProgress);

      setSortedProgressList(model.getProgressListSorted());
    }
  };

  // edits a category or progress name through the model
  const editType = async (
    originalItem: string,
    newItem: string,
    type: number,
    color: string
  ) => {
    if (type == 2) {
      model.updateEditedProgress(originalItem, newItem, color);
      if (selectedProgress.includes(originalItem)) {
        setSelectedProgress([...selectedProgress, newItem]);
      }
      const updatedProgress = selectedProgress.includes(originalItem)
        ? [...selectedProgress.filter((prog) => prog != originalItem), newItem]
        : [...selectedProgress.filter((prog) => prog != originalItem)];
      setSortedCategoryList(model.getCategoriesListSorted());
      setSortedProgressList([...model.getProgressListSorted()]);
      filterTasks(selectedCategories, updatedProgress);
    } else if (type == 1) {
      model.updateEditedCategory(originalItem, newItem);
      if (selectedCategories.includes(originalItem)) {
        setSelectedCategories([...selectedCategories, newItem]);
      }
      const updatedCategories = selectedCategories.includes(originalItem)
        ? [...selectedCategories.filter((cat) => cat != originalItem), newItem]
        : [...selectedCategories.filter((cat) => cat != originalItem)];
      setSortedCategoryList(model.getCategoriesListSorted()); // makes sure that it updates the list
      setSortedProgressList(model.getProgressListSorted()); // makes sure that it updates the list
      filterTasks(updatedCategories, selectedProgress);
    }
  };

  // swaps the category or progress through the model
  const swapType = (item: string, type: number, swapUp: boolean): void => {
    model.swapItem(item, type, swapUp);

    setSortedCategoryList(model.getCategoriesListSorted()); // makes sure that it updates the list
    setSortedProgressList(model.getProgressListSorted()); // makes sure that it updates the list

    filterTasks(selectedCategories, selectedProgress);
  };

  //#endregion

  // sets whether the screen is paused or not
  const receivePauseScreen = (screen: boolean) => {
    setPauseScreen(screen);
  };

  // returns the status of the pause screen
  const showPauseScreenStatus = () => {
    return pauseScreen;
  };

  if (isLoading == false) {
    return (
      <div className="task-view-layout">
        <TaskPage
          onAddTask={addItem}
          onDeleteTask={deleteItem}
          onEditTask={editItem}
          onTypeChange={filterTasks}
          onAddType={addCategoryOrProgress}
          onDeleteType={deleteCategoryOrProgress}
          taskList={taskList} // to provide the task list to the taskview
          modelCategories={model.categories} // to provide the categories to the taskview & side bar
          selectedCategories={selectedCategories} // to provide the selected categories to the side bar
          modelProgress={model.progress} // to provide the progress tags to the taskview
          selectedProgress={selectedProgress}
          onEditType={editType}
          onPauseScreen={receivePauseScreen}
          onShowPauseScreen={showPauseScreenStatus}
          sortList={sortList}
          onSortTasks={sortTasksBy}
          currentSort={model.sortType}
          currentAscend={model.sortAscending}
          categoriesList={sortedCategoryList}
          progressList={sortedProgressList}
          onSwap={swapType}
          isLoading={isLoading}
        />
      </div>
    );
  }
};

export default TaskController;

// parses the date correctly from a string
const parseDateFromInput = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};
