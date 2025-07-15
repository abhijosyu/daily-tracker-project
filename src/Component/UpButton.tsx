import "../ComponentCSS/CircularButtons.css";

interface UpButtonProps {
  onClick: () => void;
  editStyle?: React.CSSProperties;
}

// represents an up button (use: categories and progress)
const UpButton: React.FC<UpButtonProps> = ({ onClick, editStyle }) => (
  <>
    <button
      type="button"
      className="up-button"
      style={{ backgroundImage: 'url("/Images/Up.png")', ...editStyle }}
      onClick={onClick}
    ></button>
  </>
);

export default UpButton;
