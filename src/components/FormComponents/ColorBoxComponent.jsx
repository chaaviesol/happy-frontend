import { KeyboardArrowDown } from "@mui/icons-material";
import { React, useState } from "react";
// import "./Products.css";

export default function ColorBoxComponent({ setColor }) {
  const [showColorBox, setShowColorBox] = useState(false);
  const [selectedColor, setSelectedColor] = useState();
  // Show/Hide color Box
  const handleShowColorBox = (e) => {
    // console.log("Show");
    if (e.keyCode === 13 || e.type === "click") {
      setShowColorBox(!showColorBox);
    }
    // console.log(showColorBox);
  };

  //selecting color via tab and enter button
  const handleColorClick = (e, color) => {
    if (e.keyCode === 13 || e.type === "click") {
      setShowColorBox(!showColorBox);
      setSelectedColor(color);
      setColor(color);
    } else if (e.keyCode === 9 && color === "black") {
      setShowColorBox(!showColorBox);
    }
  };
  return (
    <>
      <div>
        <div
          tabIndex="0"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${selectedColor}`,
          }}
          onClick={(e) => {
            handleShowColorBox(e);
          }}
          onKeyDown={(e) => {
            handleShowColorBox(e);
          }}
          className="col-form-label form-control products-form__form-control product-colorBox-dropdown"
        >
          <KeyboardArrowDown />
          {/* {selectedColor} */}
        </div>
      </div>

      <div>
        {showColorBox === true ? (
          <div className="colortest-color-colors">
            <div className="row ">
              <div
                tabIndex="0"
                className="product-color-box"
                style={{ backgroundColor: "#FC0808" }}
                onKeyDown={(e) => {
                  handleColorClick(e, "red");
                }}
                onClick={(e) => handleColorClick(e, "red")}
              ></div>
              <div
                tabIndex="0"
                className="product-color-box"
                style={{ backgroundColor: "#FC9A07" }}
                onKeyDown={(e) => {
                  handleColorClick(e, "Orange");
                }}
                onClick={(e) => handleColorClick(e, "Orange")}
              ></div>
              <div
                tabIndex="0"
                className="product-color-box"
                style={{ backgroundColor: "#FCE308" }}
                onKeyDown={(e) => {
                  handleColorClick(e, "yellow");
                }}
                onClick={(e) => handleColorClick(e, "yellow")}
              ></div>
            </div>
            <div className="row">
              <div
                tabIndex="0"
                className="product-color-box"
                style={{ backgroundColor: "green" }}
                onKeyDown={(e) => {
                  handleColorClick(e, "green");
                }}
                onClick={(e) => handleColorClick(e, "green")}
              ></div>
              <div
                tabIndex="0"
                className="product-color-box"
                style={{ backgroundColor: "magenta" }}
                onKeyDown={(e) => {
                  handleColorClick(e, "magenta");
                }}
                onClick={(e) => handleColorClick(e, "magenta")}
              ></div>
              <div
                tabIndex="0"
                className="product-color-box"
                style={{ backgroundColor: "blue" }}
                onKeyDown={(e) => {
                  handleColorClick(e, "blue");
                }}
                onClick={(e) => handleColorClick(e, "blue")}
              ></div>
            </div>
            <div className="row">
              <div
                tabIndex="0"
                className="product-color-box"
                style={{
                  backgroundColor: "white",
                  border: "1px solid black",
                }}
                onKeyDown={(e) => {
                  handleColorClick(e, "white");
                }}
                onClick={(e) => handleColorClick(e, "white")}
              ></div>
              <div
                tabIndex="0"
                className="product-color-box"
                style={{ backgroundColor: "black" }}
                onKeyDown={(e) => {
                  handleColorClick(e, "black");
                }}
                onClick={(e) => handleColorClick(e, "black")}
              ></div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
