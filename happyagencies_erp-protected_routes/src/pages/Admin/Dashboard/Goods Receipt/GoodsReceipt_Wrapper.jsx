import { React, useContext } from "react";
import Sidebar from "../../../../components/admin components/Sidebar";
import GoodsReceipt from "./GoodsReceipt";
import H_Side from "../../../hidden/components/H_Side";
import { MyContext } from "../../../../Contexts/Contexts";

export default function GoodsReceipt_Wrapper() {
  const { isHidden } = useContext(MyContext);
  const SidebarToRender = isHidden ? H_Side : Sidebar;
  return (
    <>
      <SidebarToRender>
        <GoodsReceipt />
      </SidebarToRender>
    </>
  );
}
