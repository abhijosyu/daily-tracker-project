interface SideBarInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: any) => void;
}

// represents an side bar input component for the user to input text (uses: category and progress)
const SideBarInput: React.FC<SideBarInputProps> = ({
  placeholder,
  value,
  onChange,
}) => (
  <input
    type="text"
    className="side-bar-textbox"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required
  />
);

export default SideBarInput;
