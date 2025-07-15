interface SelectionItemsProp {
  stringList: string[][];
}

// represents a selection items component with a given set of string[][] (uses: category, progress)
const SelectionItems: React.FC<SelectionItemsProp> = ({ stringList }) => (
  <>
    {stringList &&
      stringList.map(([name, key]) => (
        <option key={key} value={name}>
          {name}
        </option>
      ))}
  </>
);

export default SelectionItems;
