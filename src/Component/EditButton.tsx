import "../ComponentCSS/CircularButtons.css";

interface EditButtonProps {
  onClick: () => void;
}

// represents an edit button component  (use: tasks, categories, progress)
const EditButton: React.FC<EditButtonProps> = ({ onClick }) => (
  <button
    type="button"
    className="edit-button"
    style={{
      backgroundImage: 'url("/Images/Edit.png")',
    }}
    onClick={onClick}
  ></button>
);

export default EditButton;
