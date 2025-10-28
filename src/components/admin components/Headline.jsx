import React from "react";

export default function Headline({ title }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        backgroundColor: "white",
        padding: "10px 0",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#00342E",
          borderRadius: "4px",
          padding: "6px",
          color: "white",
          width: "100%",
        }}
      >
        {title}
      </span>
    </div>
  );
}