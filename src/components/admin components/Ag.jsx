import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "./ag.css";
import { Container, Row } from "react-bootstrap";
import { MyContext } from "../../Contexts/Contexts";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function Ag({ filterSup }) {
  const navigate = useNavigate();
  const [rowData,setRowData]=useState([])
  const [loading, setLoading] = useState(false);
  const { setData, setDraftData, isHidden} =
    useContext(MyContext);
  console.log("filterSup======", filterSup.trade_name);
  const gridRef = useRef(); // Optional - for accessing Grid's API
  // Each Column Definition results in one Column.
  const cellStyle = {
    fontSize: "13px",
    textAlign:"left"
  };
  const [columnDefs, setColumnDefs] = useState([
    {
      flex: 1,
      field: "po_number",
      headerName: "PO Number",
      headerClass: "center-align-header",
      cellStyle,
    },
    {
      flex: 1,
      field: "users.trade_name",
      headerName: "Trade Name",
      headerClass: "center-align-header",
      cellStyle,
    },
    {
      flex: 1,
      field: "total_amount",
      headerName: "Total Amount",
      headerClass: "center-align-header",
      cellStyle,
    },
    {
      flex: 1,
      field: "po_status",
      headerName: "PO Status",
      headerClass: "center-align-header",
      cellStyle,
    },

    {
      flex: 1,
      field: "created_by",
      headerName: "Created by",
      headerClass: "center-align-header",
      cellStyle,
    },
    {
      flex: 1,
      field: "created_date",
      headerName: "Created date",
      headerClass: "center-align-header",
      cellStyle,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
  }));
  const axiosPrivate = useAxiosPrivate();

  // Example of consuming Grid Event
  const cellClickedListener = useCallback((event) => {
    if (event.type === "cellClicked") {
      const tradeName = event.data.users.trade_name;
      console.log(event.data.users);

      const goodsData = {
        po: event.data.po_number,
        trade_name: tradeName,
        isHidden: isHidden ? true : false,
      };
      console.log("goodsDatagoodsData", goodsData);
      axiosPrivate
        .post(`/purchase/polist`, goodsData)
        .then((res) => {
          console.log(res.data);
          setData(res.data);
          if (
            event.data.po_status === "placed" ||
            event.data.po_status === "receipt_wip" ||
            event.data.po_status === "receipt in progress" 
          ) {
            navigate("/goodsreceipt");

            // navigate("/S_goodsreceipt");
          } else if (event.data.po_status === "draft") {
            setDraftData(res.data);

            navigate("/purchase");
          } else {
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  const trade_name = filterSup.trade_name;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tradeName = trade_name;
        const requestBody = {
          division: "",
          isHidden: isHidden ? true : false,
          trade_name: tradeName,
        };
        const response = await axiosPrivate.post(
          `/purchase/polist`,
          requestBody
        );
        console.log(response);
        setRowData(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (trade_name) {
      fetchData();
    }
  }, [trade_name]);

  //fetch all purchase orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const requestBody = {
          division: "",
          isHidden: isHidden ? true : false,
        };
        const response = await axiosPrivate.post(
          `/purchase/polist`,
          requestBody
        );

        setRowData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

      fetchData();

  }, []);

  // Example using Grid's API
  const buttonListener = useCallback((e) => {
    gridRef.current.api.deselectAll();
  }, []);
  return (
    <Container fluid>
      <Row className="flex-center">
        <div
          className="ag-theme-alpine"
          style={{
            width: "100%",
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
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </Row>
    </Container>
  );
}
