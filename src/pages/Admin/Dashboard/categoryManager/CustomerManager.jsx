import { React, useContext } from "react";
import "./CustomerManager.css";
import Sidebar from "../../../../components/admin components/Sidebar";
import CustomerManagerCntrl from "../../Dashboard/categoryManager/CustomerManagerCntrl";
import H_Side from "../../../../pages/hidden/components/H_Side";
import Newtopbar_ from "../../../../components/admin components/Newtopbar_";
import { MyContext } from "../../../../Contexts/Contexts";
export default function CustomerManager() {
  const { isHidden } = useContext(MyContext);
  const SidebarToRender = isHidden ? H_Side : Sidebar;
  return (
    <SidebarToRender type="category">
      <div id="cstmr_mn_alighns">
        <Newtopbar_ />
        <CustomerManagerCntrl />
      </div>
    </SidebarToRender>
  );
}
