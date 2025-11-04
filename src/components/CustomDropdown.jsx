import React from "react";
import Select, { components } from "react-select";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // FontAwesome icons

const CustomDropdown = ({
  options = [],
  placeholder = "Select",
  onChange,
  value,
  maxHeight = 200,
  isDisabled = false,
  hideDropdownIndicator = false,
}) => {
  // Capitalize first letter
  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

  // Custom SingleValue
  const SingleValue = (props) => (
    <components.SingleValue {...props}>
      {capitalize(props.data.label)}
    </components.SingleValue>
  );

  // Custom DropdownIndicator
  const DropdownIndicator = (props) => {
    if (hideDropdownIndicator) return null;

    const { selectProps } = props;
    const menuIsOpen = selectProps.menuIsOpen; // react-select prop

    return (
      <components.DropdownIndicator {...props}>
        {menuIsOpen ? (
          <FaChevronUp style={{ marginRight: 5, color: "#0785D2" }} />
        ) : (
          <FaChevronDown style={{ marginRight: 5, color: "#0785D2" }} />
        )}
      </components.DropdownIndicator>
    );
  };

  return (
    <Select
      options={options}
      placeholder={placeholder}
      isDisabled={isDisabled}
      value={options.find((opt) => opt.value === value) || null}
      onChange={(selected) => onChange(selected?.value)}
      components={{ DropdownIndicator, SingleValue }}
      styles={{
        control: (provided, state) => ({
          ...provided,
          borderRadius: 30,
          border: "none",
          boxShadow: state.isFocused
            ? "0 0 8px 2px rgba(0, 123, 255, 0.6)"
            : "none",
          fontSize: 13,
          minHeight: 40,
          cursor: isDisabled ? "not-allowed" : "pointer",
          backgroundColor: isDisabled ? "#f5f5f5" : "#fff",
        }),
        menu: (provided) => ({
          ...provided,
          borderRadius: 15,
          boxShadow: "0 4px 12px rgba(0, 123, 255, 0.4)",
          overflow: "hidden",
        }),
        menuList: (provided) => ({
          ...provided,
          maxHeight: maxHeight,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#0785D2 #f5f5f5",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "#f5f5f5", borderRadius: "10px" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#0785D2", borderRadius: "10px", border: "1px solid #f5f5f5" },
        }),
        option: (provided, state) => ({
          ...provided,
          padding: "6px 12px",
          backgroundColor: state.isFocused ? "#e8f5ff" : "#fff",
          color: "#000",
          cursor: "pointer",
        }),
        singleValue: (provided) => ({ ...provided, color: "#000" }),
      }}
    />
  );
};

export default CustomDropdown;
