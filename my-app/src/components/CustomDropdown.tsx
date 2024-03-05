import Dropdown from 'react-dropdown';

interface CustomDropDownProps {
  onSelect: any;
};

export const CustomDropdown = ({onSelect}: CustomDropDownProps) => {
  return (
    <Dropdown
      options={["EASY", "MEDIUM", "HARD"]}
      onChange={(value) => onSelect(value.value)}
      placeholder={"Select a difficulty"}
      className={"dropdown"}
      arrowClosed={<span className="arrow-closed" />}
      arrowOpen={<span className="arrow-open" />}
    />
  )
}