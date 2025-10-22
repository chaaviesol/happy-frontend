import { Add, Delete, HighlightOff } from "@mui/icons-material";
import { IconButton, styled, Button } from "@mui/material";
import { React, useEffect, useRef, useState } from "react";

export const Handling = ({ close, openBox, subCosts, setSubCosts }) => {
  const [shouldFocus, setShouldFocus] = useState(false);
  const CloseButton = styled(Button)(({ theme }) => ({
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    height: 30,
    width: "fitcontent",
    padding: "6px 12px",
    lineHeight: 1.5,
    color: theme.palette.getContrastText("#78716c"),
    backgroundColor: "#78716c",
    "&:hover": {
      backgroundColor: "#484644",
    },
  }));

  const AddNewButton = styled(Button)(({ theme }) => ({
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    width: "fitcontent",
    padding: "3px 3px",
    lineHeight: 1.5,
    color: theme.palette.getContrastText("#78716c"),
    backgroundColor: "#3b82f6",
    "&:hover": {
      backgroundColor: "#2563eb",
    },
  }));
  const typeRef = useRef(null);
  useEffect(() => {
    typeRef.current.focus();
  }, []);

    
   


  const handleChanges = (key, value, index) => {
    const clonedSubCosts = [...subCosts];
    let currTypingIndex = clonedSubCosts[index];
    currTypingIndex = { ...currTypingIndex, [key]: value };
    clonedSubCosts[index] = currTypingIndex;
    setSubCosts(clonedSubCosts);
  };
  const handleAddNewLine = (event) => {
    if (event.keyCode === 13 || event.type === "click") {
      const newLine = { costName: "", cost: "",id:subCosts.length+1 };
      const clonedSubCosts = [...subCosts];
      clonedSubCosts.push(newLine);
      setShouldFocus(true);
      setSubCosts(clonedSubCosts);
    }
  };

  const handleDeleteCharge = (index) => {
    const dataLength = subCosts.length;
    if (dataLength === 1) {
      return setSubCosts([{ costName: "", cost: "" }]);
    }
    const clonedSubCosts = [...subCosts];
    clonedSubCosts.splice(index, 1);
    setSubCosts(clonedSubCosts);
  };


  useEffect(() => {
    if (shouldFocus&&subCosts.length > 0) {
      const lastRowId = subCosts[subCosts.length - 1].id;
      const lastRowInput = document.getElementById(`value1-${lastRowId}`);
      if (lastRowInput) {
        lastRowInput.focus();
      }
      setShouldFocus(false)
    }
  }, [shouldFocus, subCosts]);
  console.log({ subCosts });
  return (
    <div
      style={{
        cursor: "pointer",
        background: "#e0e9ff",
        borderRadius: "7px",
        width: !openBox ? "185px" : "300px",
        minHeight: "35px",
        overflowX: "scroll",
        border: openBox ? "1px solid blue" : "none",
        position: "absolute",
        top: 0,
        left: 15,
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          padding: 10,
          paddingTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center",paddingBottom:".7rem" }}>
          <div
            style={{
              borderRadius: "1px",
              paddingLeft: "10px",
              border: "none",
              width: "50%",
            }}
          >
            Type
          </div>
          <div
            style={{
              borderRadius: "1px",
              paddingLeft: "10px",
              border: "none",
              width: "30%",
            }}
          >
            Cost
          </div>
          <div style={{ width: "20%" }}>
            {/* <IconButton tabIndex="-1" onClick={close}>
              <HighlightOff />
            </IconButton> */}
          </div>
        </div>
        <div
          style={{
            minHeight: "50px",
            overflow: "scroll",
          }}
        >
          {subCosts &&
            subCosts.map((value,index) => (
              <div
             
                key={value.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <input
                   ref={typeRef}
                   id={`value1-${value.id}`}
                  style={{
                    background: "white",
                    borderRadius: "5px",
                    paddingLeft: "10px",
                    border: "none",
                    width: "50%",
                  }}
                  value={value.costName ?? ""}
                  onChange={(event) =>
                    handleChanges("costName", event.target.value, index)
                  }
                />
                <input
                  type="number"
                  min={0}
                  id={`value2-${value.id}`}
                  value={value.cost ?? ""}
                  style={{
                    background: "white",
                    borderRadius: "5px",
                    paddingLeft: "10px",
                    border: "none",
                    width: "30%",
                  }}
                  onChange={(event) =>
                    handleChanges("cost", event.target.value, index)
                  }
                />
                <div style={{ width: "20%" }}>
                  <IconButton
                    tabIndex="-1"
                    onClick={() => handleDeleteCharge(index)}
                  >
                    <Delete sx={{ color: "#f87171" }} />
                  </IconButton>
                </div>
              </div>
            ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          {subCosts.length < 5 && (
            <AddNewButton
              title="Add line"
              onKeyDown={handleAddNewLine}
              onClick={handleAddNewLine}
            >
              <Add />
            </AddNewButton>
          )}
          <CloseButton onClick={close}>Confirm</CloseButton>
        </div>
      </div>
    </div>
  );
};
