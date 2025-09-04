import React, { useEffect, useState } from "react";
import Task from "../model/Task";
import "./TaskListView.css";
import AddButton from "../../Component/AddButton";
import EditButton from "../../Component/EditButton";
import DeleteButton from "../../Component/DeleteButton";
import TaskBarSubmissionButton from "../../Component/TaskBarSubmissionButton";
import TaskForm from "../../Component/TaskForm";
import TaskInfo from "../../Component/TaskInfo";

// represents props for the task view
interface TaskViewProps {
  modelProgress: Map<string, string>;
  taskList: Task[];
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

  onPauseScreen: (screen: boolean) => void;
  categoriesList: string[][];
  progressList: string[][];
  isLoading: boolean;
  isMobileOpen: boolean;
}

// represents the task view
const TaskView: React.FC<TaskViewProps> = ({
  taskList,
  onAddTask,
  onDeleteTask,
  onEditTask,
  modelProgress,
  onPauseScreen,
  categoriesList,
  progressList,
  isLoading,
  isMobileOpen,
}) => {
  const [name, setName] = useState(""); // the name of the task being created

  const CategoriesArrayForm = Array.from(categoriesList.map(([key]) => key)); // the categories of the model

  const ProgressArrayForm = Array.from(progressList.map(([key]) => key)); // the categories of the model

  const ProgressWithColorForm = Array.from(
    progressList.map(([key, value]) => [key, value])
  ); // the progress list with the colors included

  const [category, setCategory] = useState<string>(CategoriesArrayForm[0]); // the name of the category chosen
  const [progress, setProgress] = useState<string>(ProgressArrayForm[0]); // the progress is set to not started
  const [date, setDate] = useState(""); // sets the date blank

  const [progressSelected, setProgressSelected] = useState<boolean>(false); // states whether a progress was selected
  const [categorySelected, setCategorySelected] = useState<boolean>(false); // states whether a category was selected

  const [editTaskSelected, setEditTaskSelected] = useState<boolean>(false); // states whether a task is selected to edit
  const [editTaskID, setEditTaskID] = useState<number>(0); // states the task id for the task being edited
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // states the error message

  // makes sure that the pause screen state is updated when a task is selected for rediting
  useEffect(() => {
    onPauseScreen(editTaskSelected);
  }, [editTaskSelected]);

  // formats and calls any error messages that appear
  const callError = (error: string) => {
    const TitleCaseError = error
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    setErrorMessage(TitleCaseError);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  // updates the category to the first category option when changes are made to the category
  useEffect(() => {
    const newKeys = Array.from(categoriesList.map(([a, _]) => a));
    if (
      newKeys.length > 0 &&
      !categorySelected &&
      category !== newKeys[0] &&
      !editTaskSelected
    ) {
      setCategory(newKeys[0]);
    }
  }, [CategoriesArrayForm]);

  // updates the progress to the first progress option when changes are made to the progress
  useEffect(() => {
    const newKeys = Array.from(progressList.map(([a, _]) => a));
    if (
      newKeys.length > 0 &&
      !progressSelected &&
      progress !== newKeys[0] &&
      !editTaskSelected
    ) {
      setProgress(newKeys[0]);
    }
  }, [ProgressArrayForm]);

  // if a task is selected for editing then it will set the fields of the task to the current name, category, etc.
  useEffect(() => {
    if (editTaskSelected && editTaskID !== 0) {
      const editTask = taskList.find((task) => task.getID() === editTaskID);
      if (editTask) {
        setName(editTask.name);
        setCategory(editTask.category);
        setProgress(editTask.progress);
        setDate(editTask.dateDue?.toISOString().split("T")[0] ?? "");
      }
    }
  }, [editTaskSelected, editTaskID, taskList]);

  // when the user hits the add button when creating a task
  const handleSubmit = () => {
    if (name && category) {
      const Progress = progressSelected ? progress : ProgressArrayForm[0];
      const Category = categorySelected ? category : CategoriesArrayForm[0];

      onAddTask(name, Category, Progress, date); //calls the prop which gets directed to the controller

      setName(""); // resets the name
      setCategory(CategoriesArrayForm[0]); // sets to the first category of the model
      setProgress(ProgressArrayForm[0]);
      setDate("");
      setCategorySelected(false);
      setProgressSelected(false);
    } else {
      throw new Error("Please fill in all required fields.");
    }
  };

  // sets the fields of the task to pass to the controller
  const handleEditSubmit = (task: Task) => {
    const EditName = name ? name : task.name; // if theres no name selected then keeps task.name, applies for all
    const EditCategory = category ? category : task.category;
    const EditProgress = progress ? progress : task.progress;
    const EditDate = date ? date : task.dateDue.toISOString().split("T")[0];

    onEditTask(EditName, EditCategory, task.getID(), EditProgress, EditDate);
    setName(""); // resets the name
    setCategory(CategoriesArrayForm[0]); // sets to the first category of the model
    setProgress(ProgressArrayForm[0]);
    setDate("");
    setEditTaskSelected(false);
    setEditTaskID(0);
    setCategorySelected(false);
    setProgressSelected(false);
  };

  // shows the task form to add
  const showAddTask = () => {
    return (
      <TaskForm
        nameValue={name}
        nameOnChange={(e) => setName(e.target.value)}
        namePlaceholder="Task Name (Required)"
        categoryValue={category}
        categoryOnChange={(e) => {
          setCategory(e.target.value);
          setCategorySelected(true);
        }}
        categoryList={categoriesList}
        progressValue={progress}
        progressOnChange={(e) => {
          setProgress(e.target.value);
          setProgressSelected(true);
        }}
        progressList={progressList}
        dateValue={date}
        dateOnChange={(e) => setDate(e.target.value)}
        button={
          <AddButton
            onClick={() => {
              try {
                // tries to submit and if theres any errors at any point it displays it
                handleSubmit();
              } catch (error: any) {
                callError(error.message);
              }
            }}
          ></AddButton>
        }
      ></TaskForm>
    );
  };

  // shows the task list with the task form
  const showTaskList = () => {
    return (
      <>
        {showAddTask()}

        {taskList.map((task) => (
          <TaskInfo
            keyForTask={task.getID()}
            name={task.name.toUpperCase()}
            category={task.category}
            progress={task.progress}
            dueDate={formatDueDate(task.dateDue)}
            style={{
              background: `linear-gradient(to top, ${modelProgress.get(
                task.progress
              )} 0%, ${modelProgress.get(task.progress)} 0%, #1c1c2e 30%)`,

              ["--hover-glow" as any]: modelProgress.get(task.progress),
            }}
            customElement={
              <div className="card-buttons">
                <DeleteButton
                  onClick={() => onDeleteTask(task.getID())}
                ></DeleteButton>
                <EditButton
                  onClick={() => {
                    setEditTaskID(task.getID());
                    setEditTaskSelected(true);
                  }}
                ></EditButton>
              </div>
            }
          ></TaskInfo>
        ))}
      </>
    );
  };

  // resets all the edit fields
  const cancelSubmit = () => {
    setName(""); // resets the name
    setCategory(CategoriesArrayForm[0]); // sets to the first category of the model
    setProgress(ProgressArrayForm[0]);
    setDate("");
    setEditTaskSelected(false);
    setEditTaskID(0);
  };

  // shows the edit task information with the task form to make changes
  const showEditedTask = (id?: number) => {
    try {
      const editTask = taskList.find((task) => task.getID() === id);

      if (!editTask) return null;

      return (
        <div className="task-card-enlarge">
          <TaskInfo
            keyForTask={editTask.getID()}
            name={editTask.name.toUpperCase()}
            category={editTask.category}
            progress={editTask.progress}
            dueDate={formatDueDate(editTask.dateDue)}
            style={{
              background: `linear-gradient(to top, ${modelProgress.get(
                editTask.progress
              )} 0%, ${modelProgress.get(editTask.progress)} 0%, #1c1c2e 30%)`,

              ["--hover-glow" as any]: modelProgress.get(editTask.progress),
            }}
            customElement={
              <TaskForm
                nameValue={name}
                nameOnChange={(e) => setName(e.target.value)}
                namePlaceholder="Task Name (Required)"
                categoryValue={category}
                categoryOnChange={(e) => {
                  setCategory(e.target.value);
                  setCategorySelected(true);
                }}
                categoryList={Array.from(
                  categoriesList.map(([a, b]) => [a, b])
                )}
                progressValue={progress}
                progressOnChange={(e) => {
                  setProgress(e.target.value);
                  setProgressSelected(true);
                }}
                progressList={ProgressWithColorForm}
                dateValue={date}
                dateOnChange={(e) => setDate(e.target.value)}
                button={
                  <TaskBarSubmissionButton
                    onSubmitClick={() => handleEditSubmit(editTask)}
                    onCancelClick={() => cancelSubmit()}
                  ></TaskBarSubmissionButton>
                }
              ></TaskForm>
            }
          ></TaskInfo>
        </div>
      );
    } catch (error: any) {
      callError("something went wrong");
    }
  };

  if (isLoading == false) {
    if (
      (isMobileOpen == false && window.innerWidth < 600) ||
      window.innerWidth > 600
    ) {
      return (
        <>
          <div className="tasks-view" style={{ height: "100vh" }}>
            <div
              className={
                taskList.length === 0
                  ? "task-cards-container center-task-only"
                  : "task-cards-container"
              }
            >
              {editTaskSelected ? showEditedTask(editTaskID) : showTaskList()}
              {errorMessage && <div className="error">{errorMessage}</div>}
            </div>
          </div>
        </>
      );
    }
  }
};

export default TaskView;

/**
 * formats the date in such a way that a date that was relatively the day before, the same day, or the day
 * after to today returns respective values. Date within the week of the current day returns the day of the week.
 * the rest return the normal date format
 * @param dueDate the given string
 * @returns a string based on the date and its
 */
const formatDueDate = (dueDate: Date): string => {
  const today = new Date();

  const timeDiff = dueDate.getDate() - today.getDate();

  if (dueDate.getMonth() == today.getMonth()) {
    if (timeDiff >= 0 && timeDiff <= 7) {
      if (timeDiff == 0) {
        return "Today";
      }
      if (timeDiff == 1) {
        return "Tomorrow";
      }
      return dueDate.toLocaleDateString("en-US", { weekday: "long" });
    } else if (timeDiff == -1) {
      return "Yesterday";
    } else {
      return dueDate.toLocaleDateString();
    }
  } else {
    return dueDate.toLocaleDateString();
  }
};
