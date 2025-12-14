import React from "react";

export default function Loader({ message = "Loading...", minHeight = "200px" }) {
  const wrapperStyle = {
    position: "relative",
    minHeight,               // ensures loader has space to center
    width: "100%",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(2px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  };

  const spinnerStyle = {
    width: "50px",
    height: "50px",
    border: "6px solid #d1d1d1",
    borderTop: "6px solid #2d6a4f",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "10px",
    boxSizing: "border-box",
  };

  const messageStyle = {
    fontSize: "16px",
    fontWeight: 500,
    color: "#2d6a4f",
    textAlign: "center",
  };

  return (
    <div style={wrapperStyle}>
      <div style={overlayStyle}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={spinnerStyle}></div>
        <div style={messageStyle}>{message}</div>
      </div>
    </div>
  );
}
