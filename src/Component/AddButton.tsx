import "../ComponentCSS/CircularButtons.css";

interface AddButtonProps {
  onClick: () => void;
}

// represents an add button component (used in adding tasks or categories/progress)
const AddButton: React.FC<AddButtonProps> = ({ onClick }) => (
  <>
    <button
      type="button"
      className="add-button"
      style={{ backgroundImage: 'url("/Images/Plus.png")' }}
      onClick={onClick}
    ></button>
  </>
);

export default AddButton;
