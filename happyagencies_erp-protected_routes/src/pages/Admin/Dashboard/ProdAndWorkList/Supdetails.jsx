import React, { useContext, useEffect } from "react";
import { Button, Col, FormGroup, Row } from "react-bootstrap";
import Sidebar from "../../../../components/admin components/Sidebar";
import "./Register.css";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
import { BorderColor } from "@mui/icons-material/";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../../../Contexts/Contexts";
import { DirectionsBike } from "@mui/icons-material/";
import { PedalBike } from "@mui/icons-material/";
import { RocketLaunch } from "@mui/icons-material/";
import Categorytopbar from "../../../../components/admin components/Categorytopbar";
import Suppcomponent from "../../../../components/Suppliercomponent/Suppcomponent";
import Transation from "../../../../components/Suppliercomponent/Transaction";
import Service from "../../../../components/Suppliercomponent/Service";
import Feedback from "../../../../components/Suppliercomponent/Feedback";
export default function Supdetails() {
  const [activeComponent, setActiveComponent] = useState("profile");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { supplierlist, setSupplierlist } = useContext(MyContext);
  console.log("supplierlist", supplierlist);
  const handleButtonClick = (componentName) => {
    setActiveComponent(componentName);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "profile":
        return <Suppcomponent />;
      case "transation":
        return <Transation />;
      case "service":
        return <Service />;
      case "feedback":
        return <Feedback />;

      // Add cases for the remaining components
      default:
        return null;
    }
  };

  return (
    <>
      <Sidebar>
        <Row>
          <Col lg={12}>
            <Categorytopbar />
            <Row className="p-1.5 mb-0">
              <Col>
                <span
                  style={{
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#00342E",
                    borderRadius: "4px",
                  }}
                >
                  Supplier Details
                </span>
              </Col>
            </Row>

            <Row
              className="tab-bar mt-2"
              style={{ marginLeft: "2px", cursor: "pointer", fontSize: "16px" }}
            >
              {/* <Col lg={1}></Col>  */}
              <Col
                lg={3}
                className={activeComponent === "profile" ? "active" : ""}
                variant="outline-dark"
                onClick={() => handleButtonClick("profile")}
                style={{ width: "150px" }}
              >
                Profile
              </Col>
              <Col
                lg={3}
                className={activeComponent === "transation" ? "active" : ""}
                variant="outline-dark"
                onClick={() => handleButtonClick("transation")}
                style={{ width: "150px" }}
              >
                Transaction
              </Col>
              <Col
                lg={3}
                className={activeComponent === "service" ? "active" : ""}
                variant="outline-dark"
                onClick={() => handleButtonClick("service")}
                style={{ width: "150px" }}
              >
                Service
              </Col>
              <Col
                lg={3}
                className={activeComponent === "feedback" ? "active" : ""}
                variant="outline-dark"
                onClick={() => handleButtonClick("feedback")}
                style={{ width: "150px" }}
              >
                Feedback
              </Col>
            </Row>

            <div
              className={
                activeComponent === "profile"
                  ? "content-row active"
                  : "content-row"
              }
            >
              {renderComponent()}
            </div>
          </Col>
        </Row>
      </Sidebar>
    </>
  );
}
