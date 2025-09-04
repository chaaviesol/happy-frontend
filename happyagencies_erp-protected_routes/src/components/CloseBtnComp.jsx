import { React, useState } from "react";

function CloseBtnComp({handleClose,txt}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleIconHover = () => {
    setIsHovered(true);
  };

  const handleIconLeave = () => {
    setIsHovered(false);
  };

  const closeDiv = () => {
    handleClose();
  };

  const wrapperStyle = {
    display: "inline-flex",
    listStyle: "none",

    fontFamily: "Poppins, sans-serif",
    justifyContent: "center",
  };

  const iconStyle = {
    color: "white",
    position: "relative",
    background: isHovered ? "#f91505" : "#f97316",
    borderRadius: "50%",
    margin: "10px",
    width: "30px",
    height: "30px",
    fontSize: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    boxShadow: "0 10px 10px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  };

  const tooltipStyle = {
    position: "absolute",
    top: isHovered ? "-45px" : "0",
    fontSize: "14px",
    background: "	#f91505",
    color: "#fff",
    padding: "5px 8px",
    borderRadius: "5px",
    boxShadow: "0 10px 10px rgba(0, 0, 0, 0.1)",
    opacity: isHovered ? "1" : "0",
    pointerEvents: isHovered ? "auto" : "none",
    transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    textShadow: isHovered ? "0px -1px 0px rgba(0, 0, 0, 0.1)" : "none",
  };

  const tooltipBeforeStyle = {
    position: "absolute",
    content: '""',
    height: "8px",
    width: "8px",
    background: "#f91505",
    bottom: "-3px",
    left: "50%",
    transform: "translate(-50%) rotate(45deg)",
    transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  };
  return (
    <>
      <div className="wrapper" style={wrapperStyle} onClick={closeDiv}>
        <div
          style={iconStyle}
          onMouseEnter={handleIconHover}
          onMouseLeave={handleIconLeave}
        >
          <span>X</span>
          <div style={tooltipStyle}>
            <div style={tooltipBeforeStyle}></div>
            <span>{txt}</span>
          </div>
        </div>
      </div>
    </>
  );
}
CloseBtnComp.defaultProps = {
  txt: "Close",
};


export default CloseBtnComp;
