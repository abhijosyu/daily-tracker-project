import "../ComponentCSS/CircularButtons.css";

interface DownButtonProps {
  onClick: () => void;
  downStyle?: React.CSSProperties;
}

// represents a down button (use: categories and progress)
const DownButton: React.FC<DownButtonProps> = ({ onClick, downStyle }) => (
  <>
    <button
      type="button"
      className="up-button"
      style={{
        backgroundImage: 'url("/Images/Down.png")',
        ...downStyle,
      }}
      onClick={onClick}
    ></button>
  </>
);

export default DownButton;
