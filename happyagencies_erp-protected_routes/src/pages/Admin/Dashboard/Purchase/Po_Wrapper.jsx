import {React,useContext} from "react";
import Sidebar from "../../../../components/admin components/Sidebar";
import CreatePo from "./CreatePO";
import { MyContext } from "../../../../Contexts/Contexts";
import H_Side from "../../../hidden/components/H_Side";

export default function Po_Wrapper() {
  const {isHidden} = useContext(MyContext);
  const SidebarToRender = isHidden ? H_Side : Sidebar;
  return (
    <>
      <SidebarToRender type="purchase">
        <CreatePo />
      </SidebarToRender>
    </>
  );
}
