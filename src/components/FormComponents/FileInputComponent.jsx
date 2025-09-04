import { AttachFile } from "@mui/icons-material";
import React from "react";

export default function FileInput({ text,index, onChange }) {

  return (
    <>
      <label
        title="Attach file"
        htmlFor={`file-input-${index}`} 
        className="file-input-label  "
      >
        <AttachFile /> {text}
        <input
          type="file"
          id={`file-input-${index}`}
          onChange={(e)=>onChange(e,index)}
          multiple
          style={{ display: "none" }}
        />
      </label>
    </>
  );
}
