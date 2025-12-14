import React, { useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";

export default function CustomDateInput({ value, onChange }) {

  const hiddenInputRef = useRef(null);

  // Convert ISO → dd-mm-yyyy for display
  const toDisplay = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}-${m}-${y}`;
  };

  // Convert dd-mm-yyyy → ISO before sending back
  const toISO = (val) => {
    const [d, m, y] = val.split("-");
    return `${y}-${m}-${d}`;
  };

  // Clicking wrapper opens real date picker
  const handleOpenPicker = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.showPicker();  // open native calendar
    }
  };

  return (
    <div
      onClick={handleOpenPicker}
      style={{
        position: "relative",
        width: "100%",
        cursor: "pointer"
      }}
    >
      {/* Visible formatted field */}
      <input
        type="text"
        className="table-input"
        value={toDisplay(value)}
        placeholder="dd-mm-yyyy"
        readOnly
        style={{
          width: "100%",
          padding: "8px 35px 8px 10px",
          cursor: "pointer",
          background: "white"
        }}
      />

      {/* Hidden real date input */}
      <input
        type="date"
        ref={hiddenInputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          pointerEvents: "none"
        }}
      />

      {/* Calendar Icon */}
      <FaCalendarAlt
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: "#555"
        }}
      />
    </div>
  );
}
