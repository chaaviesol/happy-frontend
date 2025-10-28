import { Col, Container, Row } from "react-bootstrap";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import Topbar from "../../../../components/admin components/Topbar";
import { prismaBaseApi } from "../../../../config";
import Sidebar from "../../../../components/admin components/Sidebar";
import { MyContext } from "../../../../Contexts/Contexts";
import { useNavigate } from "react-router-dom";
import "./Register.css";

import { DirectionsBike } from "@mui/icons-material/";
import { PedalBike } from "@mui/icons-material/";
import { RocketLaunch } from "@mui/icons-material/";
import { DoNotDisturb } from "@mui/icons-material/";
import { FiberManualRecord } from "@mui/icons-material/";
import useAuth from "../../../../hooks/useAuth";
export default function Supplierlist() {
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const { supplierlist, setSupplierlist } = useContext(MyContext);
  const [select, setSelect] = useState("");
  const {auth}=useAuth()
  const division = auth?.division;
  const cellStyle = {
    fontSize: "13px",
    textAlign:"left"
  };

  const IconRenderer = ({ value }) => {
    const icons = {
      bikes: <DirectionsBike />,
      toys: <PedalBike />,
      baby: <RocketLaunch />,
    };

    const icon = icons[value] || null;
    console.log(icon);
    return icon;
  };

  const columnDefs = useMemo(
    () => [
      {
        field: "is_active",
        headerName: "Status",
        headerClass: "center-align-header",
        cellStyle,
        width: 100,
        cellRenderer: (params) => {
          if (params.data.is_active === "Y") {
            return <FiberManualRecord />;
          } else {
            if (params.data.is_user_flagged === "Y") {
              return <DoNotDisturb />;
            } else {
              return <FiberManualRecord />;
            }
          }
        },
        cellClassRules: {
          "red-cell": (params) => params.data.is_active === "N",
          "green-cell": (params) => params.data.is_active === "Y",
          "black-cell": (params) => params.data.is_user_flagged === "Y",
        },
      },
      {
        field: "user_id",
        headerName: "Supplier ID",
        headerClass: "center-align-header",
        cellStyle,
        // width: 200,
        cellRenderer: (params) => {
          if (params.data.is_user_flagged === "Y") {
            return `${params.value} * `;
          } else {
            return `${params.value}`;
          }
        },
        cellClassRules: {
          "red-cell": (params) => params.data.is_user_flagged === "Y",
        },
      },

      {
        field: "sup_code",
        headerName: "Suppliercode",
        headerClass: "center-align-header",
        cellStyle,
        width: 200,
      },
      {
        field: "trade_name",
        headerName: "Tradename",
        headerClass: "center-align-header",
        cellStyle,
        width: 200,
      },
      {
        field: "user_name",
        headerName: "Supplier Contact",
        headerClass: "center-align-header",
        cellStyle,
        width: 400,
      },

      {
        field: "mobile",
        headerName: "Contact",
        headerClass: "center-align-header",
        cellStyle,
        width: 200,
      },
      {
        field: "address.district",
        headerName: "District",
        headerClass: "center-align-header",
        cellStyle,
        width: 250,
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
    }),
    []
  );

  const rowDat = rowData?.map((item, index) => ({
    productType: item.product_type,
  }));
  console.log(rowDat);

  const navigate = useNavigate();

  const cellClickedListener = useCallback((event) => {
    const { id } = event.data;
    const data = { id, user_type: "" };

    axios
      .post(`${prismaBaseApi}/user/userinfo`, data)
      .then((res) => {
        setSupplierlist(event.data);
        navigate("/supp");
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = { id: "", user_type: "sup" ,division:division}
        const response = await axios.post(`${prismaBaseApi}/user/userinfo`, data);
        setRowData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleSelect = (event) => {
    setSelect(event.target.value);
  };
  console.log("supplierlist", supplierlist);
  return (
    <>
      {/* <Sidebar>
        <Row style={{ width: "100%" }}>
          <Col lg={12}>
            <Topbar /> */}
            
            {/* <Row>
              <Col lg={5}>
                <select
                  value={select}
                  name="type"
                  onChange={(event, index) => handleSelect(event, index)}
                  class="form-control "
                >
                  <option value="" disabled selected>
                    Select Division
                  </option>
                  <option value="bikes">Bikes</option>
                  <option value="toys">Toys</option>
                  <option value="baby">Baby</option>
                </select>
              </Col>
              <Col lg={7}></Col>
            </Row> */}

            <Container fluid>
              <Row className="mt-5">
                <div
                  className="ag-theme-alpine"
                  style={{
                    width: "98%",
                    height: 500,
                    border: "1px solid #A6C991",
                    fontSize: "13px",
                  }}
                >
                  <AgGridReact
                    ref={gridRef} // Ref for accessing Grid's API
                    rowData={rowData} // Row Data for Rows
                    columnDefs={columnDefs} // Column Defs for Columns
                    defaultColDef={defaultColDef} // Default Column Properties
                    animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                    rowSelection="multiple" // Options - allows click selection of rows
                    onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                    columnHoverHighlight={true}
                    // suppressRowHoverHighlight= {false}
                  />
                </div>
              </Row>
            </Container>
          {/* </Col>
        </Row>
      </Sidebar> */}
    </>
  );
}
