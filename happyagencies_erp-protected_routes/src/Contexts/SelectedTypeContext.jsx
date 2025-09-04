import { React, createContext, useState } from "react";

export const selectedTypeContext = createContext();

export default function SelectedTypeContext({ children }) {
  const [selectedType, setSelectedType] = useState(null);

  //   const handleTypeSelection = (type) => {
  //     setSelectedType(type);
  //   };
  const value = { selectedType, setSelectedType };
  return (
    <selectedTypeContext.Provider value={value}>
      {children}
    </selectedTypeContext.Provider>
  );
}
