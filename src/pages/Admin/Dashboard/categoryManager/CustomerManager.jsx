import { React, useContext } from "react";
import "./CustomerManager.css";
import Sidebar from "../../../../components/admin components/Sidebar";
import CustomerManagerCntrl from "../../Dashboard/categoryManager/CustomerManagerCntrl";
import H_Side from "../../../../pages/hidden/components/H_Side";
import Newtopbar_ from "../../../../components/admin components/Newtopbar_";
import Headline from "../../../../components/admin components/Headline";
import { MyContext } from "../../../../Contexts/Contexts";
export default function CustomerManager() {
  const { isHidden } = useContext(MyContext);
  const SidebarToRender = isHidden ? H_Side : Sidebar;
  return (
    <SidebarToRender type="category">
      <>
        <div
          id="cstmr_mn_alighns"
          style={{
            height: "calc(100vh - 60px)", // Adjust height to account for Newtopbar_
            overflowY: "auto",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "white",
            }}
          >
            <Newtopbar_ />
            <Headline title="Category Manager" />
          </div>
          <CustomerManagerCntrl />
        </div>
      </>
    </SidebarToRender>
  );
}
