import { React, useContext } from "react";
import Inventory from "./Inventory";
import Topbar from "../../../../components/admin components/Topbar";
import Sidebar from "../../../../components/admin components/Sidebar";
import InventoryAg from "../../../../components/InventoryAg";
import { Container, Row, Col } from "react-bootstrap";
import { MyContext } from "../../../../Contexts/Contexts";
import H_Side from "../../../hidden/components/H_Side";
import Newtopbar_ from "../../../../components/admin components/Newtopbar_";

export default function M_inventory() {
  const { isHidden } = useContext(MyContext);
  const SidebarToRender = isHidden ? H_Side : Sidebar;

  return (
    <>
      <SidebarToRender type="inventory">
        <div
          className="GoodsReceipt-container"
          style={{ fontFamily: "Poppins" }}
        >
          <Row style={{ width: "100%" }}>
            <Col sm={12} md={12} lg={12} xs={12}>
              <Newtopbar_ />

              <Inventory />
            </Col>
          </Row>
        </div>
      </SidebarToRender>
    </>
  );
}
