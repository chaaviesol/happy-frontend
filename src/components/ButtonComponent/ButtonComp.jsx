import React from "react";
import { Button, IconButton, styled } from "@mui/material";

export const ButtonComp = ({ onClick, text, type }) => {
  const CancelButton = styled(Button)(({ theme }) => ({
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    height: 40,
    width: "7rem",
    padding: "6px 12px",
    lineHeight: 1.5,
    color: theme.palette.getContrastText("#78716c"),
    backgroundColor: "#78716c",
    "&:hover": {
      backgroundColor: "#484644",
    },
  }));
  const SaveButton = styled(Button)(({ theme }) => ({
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    height: 40,
    width: "7rem",
    padding: "6px 12px",
    lineHeight: 1.5,
    color: theme.palette.getContrastText("#78716c"),
    backgroundColor: "#4CAF50",
    "&:hover": {
      backgroundColor: "#2c822e",
    },
  }));

  const AddNewButton = styled(Button)(({ theme }) => ({
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    height: 35,
    width: "7rem",
    padding: "6px 12px",
    lineHeight: 1.5,
    color: theme.palette.getContrastText("#78716c"),
    backgroundColor: "#3b82f6",
    "&:hover": {
      backgroundColor: "#2563eb",
    },
  }));
  const GenerateButton = styled(Button)(({ theme }) => ({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 13,   // slightly smaller text
  height: 32,     // smaller height
  width: "6.3rem", // reduced width
  padding: "4px 10px", // tighter padding
  lineHeight: 1.4,
  margin: "2px",  // adds small spacing so it’s not stuck to borders
  color: theme.palette.getContrastText("#78716c"),
  backgroundColor: "#f59e0b", // amber
  "&:hover": {
    backgroundColor: "#d97706",
  },
}));
  const PrintButton = styled(Button)(({ theme }) => ({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 13,   // slightly smaller text
  height: 32,     // smaller height
  width: "6.3rem", // reduced width
  padding: "4px 10px", // tighter padding
  lineHeight: 1.4,
  margin: "2px",  // adds small spacing so it’s not stuck to borders
  color: theme.palette.getContrastText("#78716c"),
  backgroundColor: "#0bf51bff",
  "&:hover": {
    backgroundColor: "#06d942ff",
  },
}));

  return (
    <>
      {type === "green" && <SaveButton onClick={onClick}>{text}</SaveButton>}
      {type === "red" && <CancelButton onClick={onClick}>{text}</CancelButton>}
      {type === "blue" && <AddNewButton onClick={onClick}>{text}</AddNewButton>}
      {type === "generate" && (
        <GenerateButton onClick={(e) => onClick(e)}>{text}</GenerateButton>
      )}
      {type === "print" && <PrintButton onClick={onClick}>{text}</PrintButton>}
    </>
  );
};
