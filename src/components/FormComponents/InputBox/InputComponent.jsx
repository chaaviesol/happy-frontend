import React from "react";
import { Form, Col, Row } from "react-bootstrap";
import { PropTypes } from "prop-types";
import { OutlinedInput } from "@mui/material";

export default function InputComponent({
  type,
  handleInputChange,
  onClick,
  onFocus,
  onBlur,
  placeholder,
  value,
  name,
  list,
  isRequired,
  min,
}) {
  const inputStyle = {
    height: "2rem",
    fontSize: "13px",
  };
  return (
    <>
      <Form.Control
        className="form-control products-form__form-control"
        type={type}
        style={inputStyle}
        placeholder={placeholder}
        onChange={handleInputChange}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        name={name}
        value={value}
        list={list}
        {...(isRequired && { required: true })}
        {...(min ? { min: min } : type==="number" &&{min:0})}
        autoComplete="off"
      />
    </>
  );
}

InputComponent.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  handleInputChange: PropTypes.func,
  type: PropTypes.string.isRequired,
};

InputComponent.defaultProps = {
 type: "text",
  handleInputChange: () => {},
  onClick: () => {},
  onFocus: () => {},
  onBlur:()=>{},
};
