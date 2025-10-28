import { Col, Container, Row } from "react-bootstrap";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";

import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import H_Side from "../../../hidden/components/H_Side";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { DoNotDisturb } from "@mui/icons-material/";
import { FiberManualRecord } from "@mui/icons-material/";
import { MyContext } from "../../../../Contexts/Contexts";
import { Navigate, useNavigate } from "react-router-dom";
import { prismaBaseApi } from "../../../../config";
import Newtopbar_ from "../../../../components/admin components/Newtopbar_";
import Sidebar from "../../../../components/admin components/Sidebar";
import Headline from "../../../../components/admin components/Headline";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

export default function CustomerView() {
    const {isHidden}=useContext(MyContext)
  const SidebarToRender = isHidden ? H_Side : Sidebar;
    const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const { customerlist, setcustomerlist } = useContext(MyContext);
  const [select, setSelect] = useState("");
  const cellStyle = {
  fontSize: "13px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};
  const axiosPrivate=useAxiosPrivate()
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
    }),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const data = { id: "", user_type: "sup" ,division:localStorage.getItem("division")};
        const response = await axiosPrivate.post(`/user/viewcustomers`);
        console.log("response",response)
        setRowData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
    const navigate=useNavigate()
   

const cellClickedListener = useCallback((event) => {
  const { id, user_type } = event.data; // extract numeric id from grid row
console.log("List id type",id,user_type);

  const data = {
    user_id: id, // backend expects numeric id
    user_type: user_type || "CUS",
  };

  console.log("Selected customer data:", data);
  navigate("/customerdetails", { state: data });
}, [navigate]);


    // const cellClickedListener = useCallback((event) => {
    //     const { id } = event.data;
    //     const data = { id, user_type: "" };
    //     navigate("/customerdetails",{state : data});
    //     // axiosPrivate 
    //     //   .post(`/user/userinfo`, data)
    //     //   .then((res) => {
    //     //     setcustomerlist(event.data);
    //     //     navigate("/supp");
    //     //   })
    //     //   .catch((error) => {
    //     //     console.error("Error fetching user info:", error);
    //     //   });
    //   }, []);

      
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
        headerName: "Customer ID",
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
        headerName: "Customercode",
        headerClass: "center-align-header",
        cellStyle,
        width: 200,
      },
      {
        field: "user_name",
        headerName: "Customer Name",
        headerClass: "center-align-header",
        cellStyle,
        width: 400,
      },
      {
        field: "trade_name",
        headerName: "Tradename",
        headerClass: "center-align-header",
        cellStyle,
        width: 200,
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

  return (
    <>
      <SidebarToRender type="customer list">
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
            <Headline title="Customer list" />
          </div>
          <Container fluid>
            <Row className="mt-3">
              <div
                className="ag-theme-alpine"
                style={{
                  width: "98%",
                  height: "calc(100vh - 180px)",
                  border: "1px solid #A6C991",
                  fontSize: "13px",
                  margin: "auto",
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
                />
              </div>
            </Row>
          </Container>
        </div>
      </SidebarToRender>
    </>
  );
}
