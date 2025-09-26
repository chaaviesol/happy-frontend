// components/BarcodeListener.js
import React, { useEffect, useRef } from "react";

export default function BarcodeListener({ onScan }) {
  const bufferRef = useRef("");
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    const handleKeyDown = (e) => {
      const now = Date.now();

      // Reset buffer if typing is too slow (manual typing)
      if (now - lastTimeRef.current > 50) {
        bufferRef.current = "";
      }

      if (e.key === "Enter") {
        if (bufferRef.current.length > 0) {
          onScan(bufferRef.current); // ✅ full barcode
          bufferRef.current = "";    // reset buffer
        }
      } else {
        bufferRef.current += e.key;  // ✅ append instantly (no async delay)
      }

      lastTimeRef.current = now;
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onScan]);

  return null; // invisible component
}
