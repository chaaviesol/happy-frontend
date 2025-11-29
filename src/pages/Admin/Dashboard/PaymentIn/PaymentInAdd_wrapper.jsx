import React, { useContext } from "react";
import Sidebar from "../../../../components/admin components/Sidebar";
import AddPaymentIn from "./AddPaymentIn";
import Newtopbar_ from "../../../../components/admin components/Newtopbar_";
import { MyContext } from "../../../../Contexts/Contexts";
import H_Side from "../../../hidden/components/H_Side";

export default function PaymentInAddWrapper() {
  const { isHidden } = useContext(MyContext);
  const SidebarToRender = isHidden ? H_Side : Sidebar;

  return (
    <>
      <SidebarToRender type="payment_in">
        <div style={{ height: "calc(100vh - 60px)", overflowY: "auto" }}>
          <div style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "white" }}>
            <Newtopbar_ />
          </div>
          <AddPaymentIn />
        </div>
      </SidebarToRender>
    </>
  );
}
