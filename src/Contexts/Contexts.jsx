import React, { useState } from "react";
import { createContext } from "react";

export const MyContext = createContext();

export default function Contexts({ children }) {
  const [data, setData] = useState(null);
  const [draftData, setDraftData] = useState(null);
  const [prodlistData, setprodlistData] = useState("data");
  const [worklistData, setWorklistData] = useState(null);
  const [supplierlist, setSupplierlist] = useState("data");
  const [isHidden, setIsHidden] = useState(false);
  const [productlist, setproductlist] = useState("data");
  const [quotatedlist, setquotatedlist] = useState("data");

  const value = {
    data,
    setData,
    draftData,
    setDraftData,
    prodlistData,
    setprodlistData,
    worklistData,
    setWorklistData,
    supplierlist,
    setSupplierlist,
    productlist,
    setproductlist,
    isHidden,
    setIsHidden,
    quotatedlist,
    setquotatedlist,
  };

  return (
    <>
      <MyContext.Provider value={value}>{children}</MyContext.Provider>
    </>
  );
}
