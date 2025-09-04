import { React, useContext } from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { Col, Container, Row } from "react-bootstrap";
import "./Prodlist.css";
import Sidebar from "../../../../components/admin components/Sidebar";
import Categorytopbar from "../../../../components/admin components/Categorytopbar";
import Prodlist from "./Prodlist";
import { MyContext } from "../../../../Contexts/Contexts";
import H_Side from "../../../hidden/components/H_Side";
export default function M_prodlist() {
  const { isHidden } = useContext(MyContext);
  const SidebarToRender = isHidden ? H_Side : Sidebar;
  return (
    <div>
      <Row style={{ width: "100%" }}>
        <Col lg={12}>
          <SidebarToRender type="productlist">
            <>
              <Prodlist />
            </>
          </SidebarToRender>
        </Col>
      </Row>
    </div>
  );
}
