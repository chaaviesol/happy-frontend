import React from "react";
import Sidebar from "../../../components/admin components/Sidebar";
import { Settle } from "./Settle";
import Newtopbar_ from "../../../components/admin components/Newtopbar_";

export const SettleWrapper = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar type="accountdetails" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Newtopbar_ />
        <Settle />
      </div>
    </div>
  );
};
