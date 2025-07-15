import type { JSX } from "react";
import "../ComponentCSS/TaskCard.css";

interface TaskInfoProps {
  keyForTask: number;
  name: string; // task name to uppercase
  category: string;
  progress: string;
  dueDate: string;
  style?: React.CSSProperties;
  customElement?: JSX.Element;
}

// represents a task info component which displays info about a given task
const TaskInfo: React.FC<TaskInfoProps> = ({
  keyForTask,
  name,
  category,
  progress,
  dueDate,
  style,
  customElement,
}) => (
  <>
    <div key={keyForTask} className="task-card" style={style}>
      <h3>
        {name} {/* converts the task to uppdercase */}
      </h3>
      <p>
        <b>Category</b>: {category}
      </p>
      <p>
        <b>Progress</b>: {progress}
      </p>
      <p
        style={{
          color:
            new Date(dueDate) < new Date() || dueDate == "Yesterday"
              ? "red"
              : "white",
        }}
      >
        <b>Due</b>: {dueDate}
      </p>
      <div>{customElement}</div>
    </div>
  </>
);

export default TaskInfo;
