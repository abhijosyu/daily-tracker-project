import "../ComponentCSS/SidarBarSubmitCancelButton.css";

interface SideBarSubmitCancelButtonProp {
  onSubmitClick: () => void;
  onCancelClick: () => void;
  submitStyle: React.CSSProperties;
  cancelStyle: React.CSSProperties;
}

// represents an submit and cancel component for the sidebar
const SideBarSubmitCancelButton: React.FC<SideBarSubmitCancelButtonProp> = ({
  onSubmitClick,
  onCancelClick,
  submitStyle,
  cancelStyle,
}) => (
  <div
    className="side-bar-button-container"
    style={{ gap: 4, borderRadius: 8, margin: 0, padding: 0 }}
  >
    <button
      style={submitStyle}
      type="button"
      className="side-bar-button"
      onClick={onSubmitClick}
    >
      Submit
    </button>
    <button
      style={cancelStyle}
      type="button"
      className="side-bar-button"
      onClick={onCancelClick}
    >
      Cancel
    </button>
  </div>
);

export default SideBarSubmitCancelButton;
