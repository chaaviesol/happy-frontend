// components/BarcodeListener.js
import React, { useEffect, useRef } from "react";

export default function BarcodeListener({ onScan }) {
  const bufferRef = useRef("");
  const lastTimeRef = useRef(Date.now());
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const now = Date.now();

      // Ignore manual typing in input boxes
      if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

      // Reset buffer if too much time between keys
      if (now - lastTimeRef.current > 50) {
        bufferRef.current = "";
      }

      if (e.key === "Enter") {
        // Debounce to ensure last key completes
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          const code = bufferRef.current.trim();
          if (code.length > 0) {
            onScan(code);
            bufferRef.current = "";
          }
        }, 30); // wait just a bit
      } else if (e.key.length === 1) {
        // Only append printable keys
        bufferRef.current += e.key;
      }

      lastTimeRef.current = now;
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeoutRef.current);
    };
  }, [onScan]);

  return null; // invisible component
}
