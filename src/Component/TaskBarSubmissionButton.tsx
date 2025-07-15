import "../ComponentCSS/CircularButtons.css";

interface TaskBarSubmissionButtonProp {
  onSubmitClick: () => void;
  onCancelClick: () => void;
}

// represents a submit and cancel button for editing a task
const TaskBarSubmissionButton: React.FC<TaskBarSubmissionButtonProp> = ({
  onSubmitClick,
  onCancelClick,
}) => (
  <p className="buttonEdits">
    <button
      type="button"
      className="buttonCheck"
      style={{ backgroundImage: 'url("/Images/Check.png")' }}
      onClick={onSubmitClick}
    ></button>
    <button
      type="button"
      className="buttonCancel"
      style={{ backgroundImage: 'url("Images/Cancel.png")' }}
      onClick={onCancelClick}
    ></button>
  </p>
);

export default TaskBarSubmissionButton;
