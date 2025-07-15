interface SideBarRadioButtonsProps {
  textName: string;
  value: string;
  isChecked: boolean;
  onClick: () => void;
  radioName: string;
  className: string;
}

// represents a side bar radio button (uses: sidebar)
const SideBarRadioButtons: React.FC<SideBarRadioButtonsProps> = ({
  textName,
  value,
  isChecked,
  onClick,
  radioName,
  className,
}) => (
  <label className={className}>
    <input
      className="toggle"
      type="radio"
      name={radioName}
      value={value}
      checked={isChecked}
      onClick={onClick}
    ></input>
    <span>{textName}</span>
  </label>
);

export default SideBarRadioButtons;
