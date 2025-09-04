import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import "./styles.css";
import {
  AssignmentTurnedIn,
  MenuBook,
  List,
  SensorOccupied,
  Person,
  PersonSearch,
  DashboardCustomize,
  Toc,
  Autorenew,
  LocalAtm,
  Home,
  AccountCircle,
  Logout,
} from "@mui/icons-material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import {Category} from '@mui/icons-material';
export default function Side() {
  
  return (
    <>
      <div>
        <div className="Sidebar ">
          <Row style={{ padding: "0", margin: "0" }}>
            <Col
              lg={12}
              md={12}
              xs={12}
              sm={12}
              style={{ background: "#00342E" }}
            >
              <Col>
                <Row>
                  <Col>
                    <Link to="/" style={{ textDecoration: "none" }}>
                      <Image
                        style={{ cursor: "pointer" }}
                        className="sideBar-happy-logo"
                        src="./assets/logo.png"
                      />
                    </Link>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <span
                      style={{
                        fontFamily: "Glamsy",
                        color: "white",
                        fontSize: "1.6rem",
                      }}
                    >
                      Happy Group
                    </span>
                  </Col>
                </Row>
              </Col>
              {/* Logo and company name>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>. */}

              {/*End of Logo and company name---------------------------------------------------- */}
              {/* Profile pic and name>>>>>>>>>>>>>>>> */}
              <Row
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="sidebar-profile-row"
              >
                <Col className="sidebar-profile-row_col " lg={5} md={2}>
                  <Box
                    sx={{
                      border: "2px solid #E5BE6D",
                      borderRadius: "50%",
                      padding: "0",
                    }}
                  >
                    <AccountCircle
                      style={{ fontSize: "3.5rem", color: "white" }}
                    />
                  </Box>
                </Col>
                <Col
                  style={{}}
                  className="sidebar-profile-row_col"
                  lg={7}
                  md={2}
                >
                  <span
                    style={{ fontSize: "1.3rem" }}
                    className="sidebar-profile-row_col_text"
                  >
                    Hey, <br /> Chaavie
                  </span>
                </Col>
              </Row>
              {/*End of Profile pic and name>>>>>>>>>>>>>>>> */}
              {/* Nav Links>>>>>>>>>>>>>> */}
              <Row className="sidebar-navlinks-container">
                <Col>
                  <Row className="sidebar-navlink-Icon-rows">
                    <Col lg={5} md={6}>
                      <AssignmentTurnedIn style={{ marginLeft: "70%" }} />
                    </Col>
                    <Col style={{ textAlign: "left" }} lg={6} md={6}>
                      <Link style={{ textDecoration: "none" }} to="/inventory">
                        <span>Inventory</span>
                      </Link>
                    </Col>
                  </Row>
                  <Row className="sidebar-navlink-Icon-rows">
                    <Col lg={5} md={6}>
                      <MenuBook style={{ marginLeft: "70%" }} />
                    </Col>
                    <Col style={{ textAlign: "left" }} lg={6} md={6}>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/addproducts"
                      >
                        <span>New Products</span>
                      </Link>
                    </Col>
                    {/* <div> <MenuBook /></div>
                <div>Products</div> */}
                  </Row>
                  <Row className="sidebar-navlink-Icon-rows">
                    <Col lg={5} md={6}>
                      <SensorOccupied style={{ marginLeft: "70%" }} />
                    </Col>
                    <Col style={{ textAlign: "left" }} lg={6} md={6}>
                      <Link to="/prodlist">
                      <span>Product list</span>
                      </Link>
                      
                    </Col>
                  </Row>
                  <Row className="sidebar-navlink-Icon-rows">
                    <Col lg={5} md={6}>
                      <Category style={{ marginLeft: "70%" }} />
                    </Col>
                    <Col style={{ textAlign: "left" }} lg={6} md={6}>
                      <Link style={{ textDecoration: "none" }} to="/category">
                        <span>Category </span>
                      </Link>
                    </Col>
                  </Row>
                  <Row style={{ padding: "1rem", textAlign: "left" }}>
                    <Col>
                      <span
                        style={{ marginLeft: "20%" }}
                        className="sidebar-nav-headings"
                      >
                        User Management
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="sidebar-navlinks-container">
                <Col>
               

             <Row className="sidebar-navlink-Icon-rows">
                    <Col lg={5} md={6}>
                      <Person style={{ marginLeft: "70%" }} />
                    </Col>
                    <Col style={{ textAlign: "left" }} lg={6} md={6}>
                      <Link style={{ textDecoration: "none" }} to="/register">
                        <span>New User</span>
                      </Link>
                    </Col>
                  </Row>
                  <Row className="sidebar-navlink-Icon-rows">
                    <Col lg={5} md={6}>
                      <PersonSearch style={{ marginLeft: "70%" }} />
                    </Col>
                    <Col style={{ textAlign: "left" }} lg={6} md={6}>
                      <Link to="/worklist">
                      <span>Work list</span>
                      </Link>
                      
                    </Col>
                  </Row>
                  <Row className="sidebar-navlink-Icon-rows">
                    <Col lg={5} md={6}>
                      <DashboardCustomize style={{ marginLeft: "70%" }} />
                    </Col>
                    <Col style={{ textAlign: "left" }} lg={6} md={6}>
                      <span>Admin</span>
                    </Col>
                  </Row>
                  <Row style={{ padding: "1rem", textAlign: "left" }}>
                    <Col lg={12}>
                      <span
                        style={{ marginLeft: "20%" }}
                        className="sidebar-nav-headings"
                      >
                        Purchase
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="sidebar-navlinks-container">
                <Col>
                  <Row className="sidebar-navlink-Icon-rows">
                    <Col lg={5} md={6}>
                      <Autorenew style={{ marginLeft: "70%" }} />
                    </Col>
                    <Col style={{ textAlign: "left" }} lg={6} md={6}>
                      <Link style={{ textDecoration: "none" }} to="/purchase">
                        <span style={{ color: "#e5be6d" }}>Create PO</span>
                      </Link>
                    </Col>
                  </Row>
                  <Row className="sidebar-navlink-Icon-rows">
                    <Col lg={5} md={6}>
                      <Toc style={{ marginLeft: "70%" }} />
                    </Col>
                    <Col style={{ textAlign: "left" }} lg={6} md={6}>
                      <Link style={{ textDecoration: "none" }} to="/purchaseorders">
                        <span>PO lists</span>
                      </Link>
                    </Col>
                  </Row>
                  {/* <Row className="sidebar-navlink-Icon-rows">
                    <Col lg={5} md={6}>
                      <LocalAtm style={{ marginLeft: "70%" }} />
                    </Col>
                    <Col lg={6} md={6}></Col>
                  </Row> */}
                  <Row style={{ padding: "1rem", textAlign: "left" }}>
                    <Col lg={12}>
                      <span
                        style={{ marginLeft: "20%" }}
                        className="sidebar-nav-headings"
                      >
                        Sales
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="sidebar-navlinks-container">
                <Col>
                  <Row className="sidebar-navlink-Icon-rows">
                    <Col lg={5} md={6}>
                      <Toc style={{ marginLeft: "70%" }} />
                    </Col>
                    <Col style={{ textAlign: "left" }} lg={6} md={6}>
                    <Link style={{ textDecoration: "none" }} to="/supplierlist">
                      <span>Supplier lists</span>
                      </Link>
                    </Col>
                  </Row>
                  <Row className="sidebar-navlink-Icon-rows">
                    <Col md={6} lg={5}>
                      <Autorenew style={{ marginLeft: "70%" }} />
                    </Col>
                    <Col style={{ textAlign: "left" }} md={6} lg={6}>
                      <span>Invoices</span>
                    </Col>
                  </Row>
                  <Row className="sidebar-navlink-Icon-rows">
                    <Col lg={5} md={6}>
                      <LocalAtm style={{ marginLeft: "70%" }} />
                    </Col>
                    <Col style={{ textAlign: "left" }} lg={6} md={6}>
                      <span>Billing</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      padding: "10px",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ color: "white" }}>Log out</span>
                    <Logout style={{ color: "#D7B669" }} />{" "}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
