import SelectionItems from "./SelectionItems";

interface SelectionListProp {
  value: string;
  onChange: (e: any) => void;
  stringList: string[][];
  style?: React.CSSProperties;
}

// represents a selection list component with selection items (uses: categroy, progress)
const SelectionList: React.FC<SelectionListProp> = ({
  value,
  onChange,
  stringList,
  style,
}) => (
  <select value={value} onChange={onChange} required style={style}>
    {/* takes each progress tag and puts it as an option */}
    <SelectionItems stringList={stringList}></SelectionItems>
  </select>
);

export default SelectionList;
