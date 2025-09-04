import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext,
  //   useContext,
} from "react";

import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { Col, Container, Row } from "react-bootstrap";
import moment from "moment";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { prismaBaseApi } from "../../../../config";
import Topbar from "../../../../components/admin components/Topbar";
import { useLocation, useNavigate } from "react-router-dom";
import { MyContext } from "../../../../Contexts/Contexts";
import Sidebar from "../../../../components/admin components/Sidebar";
import H_Side from "../../../hidden/components/H_Side";
import Newtopbar_ from "../../../../components/admin components/Newtopbar_";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
export default function Worklist() {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const { worklistData, setWorklistData, isHidden } = useContext(MyContext);
  const cellStyle = {
    fontSize: "13px",
  };
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const navigatedWorklist = { navPage: location.state };

  const SidebarToRender = isHidden ? H_Side : Sidebar;

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "user_type",
      headerName: "User type",
      headerClass: "center-align-header ",
      cellStyle,
      flex: 1,
    },
    {
      field: "user_name",
      headerName: "User name",
      headerClass: "center-align-header ",
      cellStyle: { textAlign: "left", fontSize: "13px", },
      flex: 2,
    },
    {
      field: "trade_name",
      headerName: "Trade name",
      headerClass: "center-align-header",
      cellStyle: { textAlign: "left", fontSize: "13px", },
      flex: 2,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      headerClass: "center-align-header",
      cellStyle: { textAlign: "left", fontSize: "13px", },
      flex: 2,
    },
    {
      field: "email",
      headerName: "email",
      headerClass: "center-align-header",
      cellStyle: { textAlign: "left", fontSize: "13px", },
      flex: 2,
    },
    {
      field: "created_date",
      headerName: "created date",
      headerClass: "center-align-header",
      cellStyle: { textAlign: "center", fontSize: "13px", },
      flex: 2,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
  }));

  //consuming
  const navigate = useNavigate();
  const cellClickedListener = useCallback((event) => {
    console.log(event.data.user_id);
    const data = { user_id: event.data.user_id };
    console.log("data", data);
    axiosPrivate.post(`/user/viewuserdetails`, data).then((res) => {
      console.log(res.data);
      setWorklistData(res.data);
      navigate("/approveuser");
    });
  }, []);

  // Example load data from server
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await axiosPrivate.post(`/user/getapprovals`);

        console.log(response.data);

        setRowData(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchApi();
  }, []);
  console.log(rowData);
  return (
    <>
      <div>
        <Row>
          {/* <Col lg={3} className="products-sm p-0">
       <Side/>
       </Col> */}
          <Col lg={12}>
            <SidebarToRender
              type="worklist"
              activeWorklistPage={navigatedWorklist.navPage}
            >
              <Newtopbar_ isActive={false} />
              <Row className="p-1.5 mb-1">
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
                    Work List
                  </span>
                </Col>
              </Row>

              <div
                className="ag-theme-alpine"
                style={{
                  width: "100%",
                  height: 500,
                  border: "1px solid #A6C991",
                  fontSize: "13px",
                  marginTop: "3%",
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
            </SidebarToRender>
          </Col>
        </Row>
      </div>
    </>
  );
}
