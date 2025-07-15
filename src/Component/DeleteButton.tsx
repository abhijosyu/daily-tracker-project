import "../ComponentCSS/CircularButtons.css";

interface DeleteButtonProps {
  onClick: () => void;
  style?: React.CSSProperties;
}

// represents a delete button (use: tasks, progress, categories)
const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, style }) => (
  <button
    type="button"
    className="delete-button"
    style={{ backgroundImage: 'url("/Images/Trash2.png")', ...style }}
    onClick={onClick}
  ></button>
);

export default DeleteButton;
