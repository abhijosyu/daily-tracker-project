import DeleteButton from "./DeleteButton";
import DownButton from "./DownButton";
import UpButton from "./UpButton";
import "../ComponentCSS/CheckboxItem.css";

interface CheckboxItemProps {
  id: string;
  disabled: boolean;
  onCheck: boolean;
  onDeleteClick: () => void;
  onChange: (e: any) => void;
  style?: React.CSSProperties;
  onEditClick: () => void;
  editStyle?: React.CSSProperties;
  onDownClick: () => void;
}

// represents a checkbox component for the sidebar
const CheckboxItem: React.FC<CheckboxItemProps> = ({
  id,
  disabled,
  onCheck,
  onDeleteClick,
  onChange,
  style,
  onEditClick,
  editStyle,
  onDownClick,
}) => (
  <div key={id} className="checkbox-item">
    <h3 className="checkbox-content">
      <input
        type="checkbox"
        id={id}
        disabled={disabled}
        checked={onCheck}
        onChange={onChange}
        style={style}
      />
      <label htmlFor={id}>{id}</label>
    </h3>

    <div className="checkbox-icons">
      <UpButton
        onClick={onEditClick}
        editStyle={{
          width: 20,
          height: 20,
          marginLeft: 8,
          ...editStyle,
        }}
      />
      <DownButton
        onClick={onDownClick}
        downStyle={{
          width: 20,
          height: 20,
          marginLeft: 4,
          ...editStyle,
        }}
      />
      <DeleteButton
        onClick={onDeleteClick}
        style={{
          width: 20,
          height: 20,
          marginLeft: 4,
        }}
      />
    </div>
  </div>
);

export default CheckboxItem;
