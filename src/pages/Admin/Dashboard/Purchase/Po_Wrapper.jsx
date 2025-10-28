import {React,useContext} from "react";
import Sidebar from "../../../../components/admin components/Sidebar";
import CreatePo from "./CreatePO";
import { MyContext } from "../../../../Contexts/Contexts";
import H_Side from "../../../hidden/components/H_Side";
import Newtopbar_ from "../../../../components/admin components/Newtopbar_";
import Headline from "../../../../components/admin components/Headline";

export default function Po_Wrapper() {
  const {isHidden} = useContext(MyContext);
  const SidebarToRender = isHidden ? H_Side : Sidebar;
  return (
    <>
      <SidebarToRender type="purchase">
        <div
          style={{
            height: "calc(100vh - 60px)",
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
            <Headline title="New Purchase Order" />
          </div>
          <CreatePo />
        </div>
      </SidebarToRender>
    </>
  );
}
