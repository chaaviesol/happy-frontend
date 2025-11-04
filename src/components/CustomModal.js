import React from "react";

const CustomModal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        overflow: "auto",
      }}
    >
      <div
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "1400px",
          maxHeight: "calc(100vh - 60px)",
          overflowY: "auto", // content scrolls
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          padding: "40px 5px",
        }}
      >
        {/* 🔴 Close Button (Sticky - stays while scrolling) */}
        <button
          onClick={onClose}
          style={{
            position: "sticky",     // ✅ key change
            top: 0,                 // stick to top inside modal
            float: "right",
            marginRight: "8px",
            marginTop: "8px",
            width: "40px",
            height: "40px",
            border: "none",
            background: "transparent",
            color: "red",
            fontSize: "28px",
            fontWeight: "bold",
            cursor: "pointer",
            zIndex: 10,
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Content area */}
        <div style={{ marginTop: "20px" }}>{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
