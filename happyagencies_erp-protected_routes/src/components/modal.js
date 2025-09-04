import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 2147483647,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* White modal content */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    margin: "16px",
                    padding: "32px",
                    width: "1000px",
                    maxWidth: "95vw",
                    maxHeight: "80vh",
                    overflowY: "auto",
                    position: "relative",
                    border: `2px solid rgb(184,138,68)`,
                    color: "rgb(0,52,46)",
                }}
            >
                {children}
            </div>

            {/* Close button floating outside the white modal */}
            <button
                onClick={onClose}
                style={{
                    position: "absolute",
                    // adjust these offsets so button is just outside top-right corner of modal
                    top: "calc(50% - 42vh)", // half of overlay height minus half of modal approx
                    right: "calc(50% - 515px)", // half of overlay width minus half modal width
                    transform: "translate(50%, -50%)", // fine adjustment
                    backgroundColor: "white",
                    color: "rgb(0,52,46)",
                    borderRadius: "47%",
                    padding: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    cursor: "pointer",
                    border: `1px solid rgb(184,138,68)`,
                    fontSize: "16px",
                    overflow: "hidden",
                    zIndex: 2147483648,
                }}
            >
                ✕
            </button>
        </div>,
        document.body
    );
}
