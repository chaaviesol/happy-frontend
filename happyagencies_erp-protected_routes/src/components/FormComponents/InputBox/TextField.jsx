import React from "react";
import { TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export default function TextFieldOut({ handleChanges, value, name,type,label,refData,required }) {
  const theme = createTheme({
    components: {
      MuiInputLabel: {
        styleOverrides: {
          asterisk: {
            color: "red",
          },
        },
      },
    },
  });
  return (
    <>
      {/* <ThemeProvider theme={theme}> */}
        <TextField
          onChange={handleChanges}
          name={name}
          id={name}
          autoComplete="off"
          value={value}
          type={type}
          label={label}
          inputProps={{ maxLength: 20 }}
          inputRef={refData}
          required={required ? true : false}
          variant="outlined"
          size="small"
          sx={{
            "& label": {      
              fontFamily:"Poppins"
            },
            "& .MuiInputBase-root": {
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
            },
          }}
        />
      {/* </ThemeProvider> */}
    </>
  );
}

TextFieldOut.defaultProps = {
  handleChanges: () => {},
  name: "textField",
  // size: "medium",
  type:"text",
  label:"field label"
};