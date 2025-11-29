import React from 'react';
import ReactDOM from 'react-dom';

export default function RowOptionsPortal({ coords, children }) {
  if (!coords) return null;

  // Default menu width; the CSS handles exact visuals
  const width = 140;
  const left = (coords.right - width) > 8 ? coords.right - width : coords.left;
  const top = coords.bottom + 6; // small offset below the trigger

  const style = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 4000,
  };

  return ReactDOM.createPortal(
    <div style={style} className="row-options-menu">
      {children}
    </div>,
    document.body
  );
}
