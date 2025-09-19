import React from "react";
import Sidebar from "../../../../components/admin components/Sidebar";
import New_sales_order from "./New_sales_order";
import Newtopbar_ from "../../../../components/admin components/Newtopbar_"; // This was already here, which is great!
export default function New_sales_wrapper() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar type="new_sales_order" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Newtopbar_ />
        <New_sales_order />
      </div>
    </div>
  );
}
