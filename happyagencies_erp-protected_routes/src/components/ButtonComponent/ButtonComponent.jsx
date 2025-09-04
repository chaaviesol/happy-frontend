import React from "react";
// import { Button } from "react-bootstrap";
import { PropTypes } from "prop-types";
import { Button } from "@mui/material";

export default function ButtonComponent({
  background,
  onClick,
  color,
  variant,
  children,
  border,
}) {
  const buttonStyle = {
    backgroundColor: background,
    color: color,
    borderRadius: "15px",
    border: border,
    padding:".7rem",
    textTransform:"capitalize"
  };
  return (
    <>
    
      <Button
        style={buttonStyle}
        onClick={onClick}
        background={background}
        variant={variant}
        color={color}
      >
        {children}
      </Button>
    </>
  );
}
ButtonComponent.propTypes = {
  background: PropTypes.string,

  variant: PropTypes.string,
  onClick: PropTypes.func,
  border: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ButtonComponent.defaultProps = {
  variant: "primary",
  onClick: () => {},
  color: "white",
  background: "black",

  border: "0px",
};
