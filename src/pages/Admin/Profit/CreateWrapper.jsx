import React from "react";
import Sidebar from "../../../components/admin components/Sidebar";
import Create from "./Create";
import Newtopbar_ from "../../../components/admin components/Newtopbar_";

export const CreateWrapper = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar type="updateaccounts" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Newtopbar_ />
        <Create />
      </div>
    </div>
  );
};
