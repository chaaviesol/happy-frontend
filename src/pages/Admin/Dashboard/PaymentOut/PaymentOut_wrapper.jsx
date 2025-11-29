import React, { useContext } from "react";
import Sidebar from "../../../../components/admin components/Sidebar";
import PaymentOut from "./PaymentOut";
import Newtopbar_ from "../../../../components/admin components/Newtopbar_";
import { MyContext } from "../../../../Contexts/Contexts";
import H_Side from "../../../hidden/components/H_Side";

export default function PaymentOutWrapper() {
  const { isHidden } = useContext(MyContext);
  const SidebarToRender = isHidden ? H_Side : Sidebar;

  return (
    <>
      <SidebarToRender type="payment_out">
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
          <PaymentOut />
        </div>
      </SidebarToRender>
    </>
  );
}
