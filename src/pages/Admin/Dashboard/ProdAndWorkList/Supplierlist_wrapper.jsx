import {React,useContext} from "react";
import Topbar from "../../../../components/admin components/Topbar";
import { prismaBaseApi } from "../../../../config";
import Sidebar from "../../../../components/admin components/Sidebar";
import { Col, Container, Row } from "react-bootstrap";
import Supplierlist from "./Supplierlist";
import { MyContext } from "../../../../Contexts/Contexts";
import H_Side from "../../../hidden/components/H_Side";
import Newtopbar_ from "../../../../components/admin components/Newtopbar_";
import Headline from "../../../../components/admin components/Headline";
export default function Supplierlist_wrapper() {
  const {isHidden}=useContext(MyContext)
  const SidebarToRender = isHidden ? H_Side : Sidebar;
  return (
    <div>
      <SidebarToRender type="supplier list">
        <Row style={{ width: "100%" }}>
          <Col lg={12}>
            <Newtopbar_ />
            <Headline title="Supplierlist" />
            <Supplierlist />
          </Col>
        </Row>
      </SidebarToRender>
    </div>
  );
}
