import { React, useContext } from "react";
import Sidebar from "../../../../components/admin components/Sidebar";
import New_sales_order from "./New_sales_order";
import Newtopbar_ from "../../../../components/admin components/Newtopbar_"; // This was already here, which is great!
import { MyContext } from "../../../../Contexts/Contexts";
import H_Side from "../../../hidden/components/H_Side";
import Headline from "../../../../components/admin components/Headline";

export default function New_sales_wrapper() {
  const { isHidden } = useContext(MyContext);
  const SidebarToRender = isHidden ? H_Side : Sidebar;
  return (
    <>
      <SidebarToRender type="new_sales_order">
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
          
          </div>
          <New_sales_order />
        </div>
      </SidebarToRender>
    </>
  );
}
