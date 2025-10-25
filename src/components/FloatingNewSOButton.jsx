import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Addchart } from "@mui/icons-material";

export default function FloatingNewSOButton({ setDraftData }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide button on login or specific pages
  const hideOnRoutes = ["/login", "/forgot-password", "/reset-password", "/new_sales_order"];
  if (hideOnRoutes.includes(location.pathname)) return null;

  const handleClick = () => {
    if (setDraftData) setDraftData(null);
    navigate("/new_sales_wrapper");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "25px",
        right: "25px",
        zIndex: 9999,
      }}
    >
      <button
        onClick={handleClick}
        className="floating-so-btn"
      >
        <Addchart className="icon" />
        <span className="label">Create New SO</span>
      </button>

      {/* Inline CSS — can move to App.css if you prefer */}
      <style>
        {`
          .floating-so-btn {
            background-color: #0785D2;
            color: white;
            border: none;
            border-radius: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            transition: all 0.25s ease-in-out;
            overflow: hidden;
            white-space: nowrap;
            width: 55px;
          }

          .floating-so-btn .label {
            opacity: 0;
            max-width: 0;
            transition: all 0.25s ease-in-out;
            font-weight: 600;
          }

          .floating-so-btn:hover {
            width: 170px;
            padding: 14px 20px;
          }

          .floating-so-btn:hover .label {
            opacity: 1;
            max-width: 150px;
          }

          .floating-so-btn .icon {
            font-size: 22px;
          }

          .floating-so-btn:hover .icon {
            transform: scale(1.05);
            transition: transform 0.2s;
          }
        `}
      </style>
    </div>
  );
}
