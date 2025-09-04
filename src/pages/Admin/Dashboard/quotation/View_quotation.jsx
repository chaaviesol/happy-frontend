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




import { useNavigate } from "react-router-dom";
import { MyContext } from "../../../../Contexts/Contexts";
import { prismaBaseApi } from "../../../../config";
import moment from "moment";
import { useDispatch } from "react-redux";
import { trflseSetting } from "../../../../Redux/SliceRedux";
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'

export default function View_quotation() {
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [notification, setnotification] = useState([])
  const { quotatedlist, setquotatedlist } = useContext(MyContext);
  const [select, setSelect] = useState("");
  const axiosPrivate=useAxiosPrivate()
  const cellStyle = {
    fontSize: "13px",
  };
  const dispatch = useDispatch()
  const columnDefs = useMemo(
    () => [
      {
        field: "so_number",
        headerName: "So number",
        headerClass: "center-align-header",
        cellStyle,
        flex:"1",
      },
      {
        field: "users.user_name",
        headerName: "Supplier Name",
        headerClass: "center-align-header",
        cellStyle,
        flex:"1",
      },
      {
        field: "so_status",
        headerName: "Status",
        headerClass: "center-align-header",
        cellStyle,
        flex:"1",
        cellStyle: (params) => {
          return {
            color: params.value === "quote_rejected" ? "orange" : "black",
            fontSize: "14px",
          };
        },
      },
      {
        field: "created_date",
        headerName: "Created date",
        headerClass: "center-align-header",
        cellStyle,
        flex:"1",
        valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY")
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

  const cellClickedListener = async (event) => {
    try {
      const filternoti = await notification.filter((ele => (ele.verification_id == event.data.so_number && ele.read == "N")))
      console.log("filternoti>>>>>", filternoti)
      console.log("event>>>>>", event.data.so_number)

      if (filternoti[0]) {
        const id = {
          id: filternoti[0]?.id
        }
        axiosPrivate.post(`/notification/admread_notification`, id).then((res) => {
          console.log("res>>>>", res)
          dispatch(trflseSetting())
        })

      }

      if (event.data.so_status == "quote_rejected") {
        await navigate("/new_sales_order", { state: { data: event.data.sales_id, quoted: true, rejected: true } });
      } else {
        await navigate("/new_sales_order", { state: { data: event.data.sales_id, quoted: true } });
      }
    } catch (error) {
      console.log(error)
    }


  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(
          `/sales/viewquotation`
        );
        console.log("respp", response);
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
  //   console.log("setproductlist", productlist);
  useEffect(() => {
    axiosPrivate.post(`/notification/getadm_notification`).then((res) => {
      setnotification(res.data.admin_notification)
    })
  }, [])
  console.log(notification)

  return (
    <div>
      <Row className="p-2">
        <Col>
          <span
            style={{
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#00342E",
              borderRadius: "4px",
              padding: ".1rem"
            }}
          >
            Quotation- Approve
          </span>
        </Col>
      </Row>
      <div>
        <Container fluid>
          <Row className="mt-5" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
              />
            </div>
          </Row>
        </Container>
      </div>

    </div>
  )
}
