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
import { Container, Row } from "react-bootstrap";
import { prismaBaseApi } from "../../config";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Button, Modal } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function AgCustomerOrder({ salesData, activeTab }) {
  const navigate = useNavigate();
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState();
  const axiosPrivate=useAxiosPrivate()
  const [isShowModal, setIsShowModal] = useState(true);
  const cellStyle = {
    fontSize: "13px",
  };
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
  }));
  const rowHeight = 50;
  const defaultCol = [
    {
      flex: 2,
      field: "so_number",
      headerName: "Sales Number",
      headerClass: "center-align-header",
      cellStyle,
      width: 200,
    },
    {
      flex: 1,
      field: "total_amount",
      headerName: "Total",
      headerClass: "center-align-header",
      cellStyle,
      width: 150,
    },
    {
      flex: 1,
      field: "so_status",
      headerName: "SO Status",
      headerClass: "center-align-header",
      cellStyle,
      width: 150,
    },

    {
      flex: 1,
      field: "created_date",
      headerName: "Created date",
      headerClass: "center-align-header",
      width: 200,
      cellStyle,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    {
      flex: 1,
      field: "updated_date",
      headerName: "Updated date",
      headerClass: "center-align-header",
      width: 200,
      cellStyle,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

   
    {
      
      flex: 1,
      cellClass: "sr",
      width: 130,
      headerClass: "center-align-header",
      // cellStyle,

      cellStyle: { textAlign: "center", alignItems: "center" },

      cellRendererFramework: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              marginTop: "2px",
            }}
          >
            <button
              // onClick={}
              style={{
                width: "90%",
                background: "#708090",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.7rem",
                outline: "none",
                height: "40px",
              }}
              variant="outlined"
            >
              Service req
            </button>{" "}
          </div>
        );
      },
    },
    {
      // headerName: "return",
      flex: 1,
      cellClass: "return",
      width: 130,
      headerClass: "center-align-header",
      // cellStyle,
      cellStyle: { textAlign: "center", alignItems: "center" },
      cellRendererFramework: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              marginTop: "2px",
            }}
          >
            <button
              style={{
                width: "90%",
                background: "#24a0ed ",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.7rem",
                outline: "none",
                height: "40px",
              }}
              variant="outlined"
            >
              Return
            </button>{" "}
          </div>
        );
      },
    },
  ];
  const [columnDefs, setColumnDefs] = useState(defaultCol);
  useEffect(() => {
    if (salesData?.length > 0) {
      setRowData(salesData);
      filter();
    } else {
      setRowData([]);
      filter();
    }
  }, [salesData, activeTab]);
  const filter = () => {
    if (activeTab !== "confirmed") {
      if (activeTab === "sent") {
        const updatedColumnDefs = columnDefs.filter(
          (column) =>

            column.headerName !== "Total" &&
            column.cellClass !== "sr" &&
            column.cellClass !== "return"
        );
        setColumnDefs(updatedColumnDefs);
      } else {
        const updatedColumnDefs = defaultCol.filter(
          (column) => column.cellClass !== "sr" && column.cellClass !== "return"
        );
        setColumnDefs(updatedColumnDefs);
      }
    } else {
      setColumnDefs(defaultCol);
    }
  };

  const cellClickedListener = useCallback(async (event) => {

    const columnId = event.column.colId;
    console.log("columnId => ", typeof (columnId))
    if (event.type === "cellClicked") {
      const column = columnId === "0" ? "Sr" : "Return";
      console.log(column);
      if (columnId === "0" || columnId === "1") {
        try {
          console.log(event?.data?.so_number);
          const so = event?.data?.so_number;
          const response = await axiosPrivate.post(
            `/sales/solist`,
            {
              so_number: so,
            }
          );
          const dta = response.data;
          dta.compType = column;
          // const type = {
          //   type: column,
          //   data: response.data,
          // };
          console.log(response.data);
          // navigate("/custservicereqs", { state: type });
          navigate("/custservicereqs", { state: dta });
        } catch (err) {
          console.error("error getting in so prod details");
        }

        const type = columnId === "0" ? "Sr" : "Return";

        // alert(`${type} 😎`);
      } else {

        if (activeTab === "received") {

          navigate("/cus_order_confirmation", { state: { data: event.data.sales_id } })
        }

      }
    }
  }, [activeTab]);
  console.log(salesData);
  return (
    <>
      <Container fluid>
        <Row className="flex-center">
          <div
            className="ag-theme-alpine"
            style={{
              width: "100%",
              height: 550,
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
              getRowHeight={() => rowHeight}
            // suppressRowHoverHighlight= {false}
            />
          </div>
        </Row>
      </Container>
    </>
  );
}
