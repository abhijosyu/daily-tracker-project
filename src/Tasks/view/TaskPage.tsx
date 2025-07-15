import React, { useState } from "react";

import TaskView from "./TaskListView";
import SideBar from "../view/SideBarView";
import Task from "../model/Task";
import "./TaskPage.css";

/* represents an interface for props for the task page.
   this contains everything needed for the elements of the task page.
*/
interface TaskPageProps {
  onAddTask: (
    name: string,
    category: string,
    progress: string,
    dateDue?: string
  ) => void;

  onDeleteTask: (id: number) => void;

  onEditTask: (
    name: string,
    category: string,
    id: number,
    progress: string,
    dateDue?: string
  ) => void;

  onTypeChange: (categories: string[], progress: string[]) => void;

  onAddType: (category: string, type: number, color: string) => void;

  onDeleteType: (category: string, type: number) => void;

  onEditType: (
    originalItem: string,
    newItem: string,
    type: number,
    color: string
  ) => void;

  taskList: Task[];

  modelCategories: Map<string, string>;

  selectedCategories: string[];

  modelProgress: Map<string, string>;

  selectedProgress: string[];

  onPauseScreen: (screen: boolean) => void;

  onShowPauseScreen: () => boolean;

  sortList: string[][];

  onSortTasks: (type: string, ascending: boolean) => void;

  currentSort: string;

  currentAscend: boolean;

  categoriesList: string[][];

  progressList: string[][];

  onSwap: (item: string, type: number, swapUp: boolean) => void;

  isLoading: boolean;
}

// represents the TaskPage.
const TaskPage: React.FC<TaskPageProps> = ({
  taskList,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onTypeChange,
  onAddType,
  onDeleteType,
  selectedCategories,
  modelProgress,
  selectedProgress,
  onEditType,
  onPauseScreen,
  onShowPauseScreen,
  sortList,
  onSortTasks,
  currentSort,
  categoriesList,
  progressList,
  onSwap,
  currentAscend,
  isLoading,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(window.innerWidth > 600);

  const toggleMobileSidebar = () => {
    console.log("hi");
    setIsMobileOpen((prev) => !prev);
  };

  // sorts the props into the correct places

  return (
    <>
      <button className="mobile-sidebar-toggle" onClick={toggleMobileSidebar}>
        ☰{" "}
      </button>
      <div className="task-view-layout">
        <SideBar
          onTypeChange={onTypeChange}
          onAddType={onAddType}
          onDeleteType={onDeleteType}
          selectedCategories={selectedCategories}
          modelProgress={modelProgress}
          selectedProgress={selectedProgress}
          onEditType={onEditType}
          onPauseScreenStatus={onShowPauseScreen}
          sortList={sortList}
          onSortTasks={onSortTasks}
          currentSort={currentSort}
          categoriesList={categoriesList}
          progressList={progressList}
          onSwap={onSwap}
          currentAscend={currentAscend}
          isLoading={isLoading}
          isMobileOpen={isMobileOpen}
        />

        <TaskView
          taskList={taskList}
          onAddTask={onAddTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          modelProgress={modelProgress}
          onPauseScreen={onPauseScreen}
          categoriesList={categoriesList}
          progressList={progressList}
          isLoading={isLoading}
          isMobileOpen={isMobileOpen}
        />
      </div>
    </>
  );
};

export default TaskPage;
