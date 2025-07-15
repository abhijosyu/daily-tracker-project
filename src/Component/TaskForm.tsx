import type { JSX } from "react";
import SelectionList from "./SelectionList";
import "../ComponentCSS/TaskCard.css";

interface TaskFormProps {
  nameValue: string;
  nameOnChange: (e: any) => void;
  namePlaceholder: string;

  categoryValue: string;
  categoryOnChange: (e: any) => void;
  categoryList: string[][];

  progressValue: string;
  progressOnChange: (e: any) => void;
  progressList: string[][];

  dateValue: string;
  dateOnChange: (e: any) => void;

  button?: JSX.Element;
}

// represents a task form component
const TaskForm: React.FC<TaskFormProps> = ({
  nameValue,
  nameOnChange,
  namePlaceholder,

  categoryValue,
  categoryOnChange,
  categoryList,

  progressValue,
  progressOnChange,
  progressList,

  dateValue,
  dateOnChange,

  button,
}) => (
  <div
    className="task-card-form"
    style={{ ["--hover-glow" as any]: "#471a58" }}
  >
    <p className="input-form">
      {/* the text input (name) */}
      <input
        type="text"
        value={nameValue}
        onChange={nameOnChange}
        placeholder={namePlaceholder}
        required
      />
    </p>

    {/* the categories are inputted */}
    <p className="selection-list">
      <SelectionList
        value={categoryValue}
        onChange={categoryOnChange}
        stringList={categoryList}
      ></SelectionList>
    </p>

    {/* the progress tags are inputted */}
    <p className="selection-list">
      <SelectionList
        value={progressValue}
        onChange={progressOnChange}
        stringList={progressList}
      ></SelectionList>
    </p>

    {/*  the date */}
    <p className="input-form">
      <input type="date" value={dateValue} onChange={dateOnChange} />
    </p>

    <div>{button}</div>
  </div>
);

export default TaskForm;
