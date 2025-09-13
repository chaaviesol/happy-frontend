// components/BarcodeListener.js
import React, { useEffect, useState } from "react";

export default function BarcodeListener({ onScan }) {
  const [buffer, setBuffer] = useState("");
  const [lastTime, setLastTime] = useState(Date.now());

  useEffect(() => {
    const handleKeyDown = (e) => {
      const now = Date.now();

      // Reset buffer if typing is too slow (manual typing)
      if (now - lastTime > 50) {
        setBuffer("");
      }

      if (e.key === "Enter") {
        if (buffer.length > 0) {
          onScan(buffer); // send barcode to parent
          setBuffer("");
        }
      } else {
        setBuffer((prev) => prev + e.key);
      }

      setLastTime(now);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [buffer, lastTime, onScan]);

  return null; // invisible
}
