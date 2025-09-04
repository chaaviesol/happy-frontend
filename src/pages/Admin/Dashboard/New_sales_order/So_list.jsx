import { Col, Container, Row } from "react-bootstrap";

import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import moment from "moment";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import { Addchart } from "@mui/icons-material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import { MyContext } from "../../../../Contexts/Contexts";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { trflseSetting } from "../../../../Redux/SliceRedux";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
const flexCenter = classNames(
  "d-flex",
  "align-items-center",
  "justify-content-center"
);

export default function So_list() {
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [selectedcustomer, setSelectedcustomer] = useState();
  const [select, setSelect] = useState("");
  const [Customer, setcustomer] = useState([]);
  const [filtercus, setFilterCus] = useState({});
  const { setDraftData, isHidden } = useContext(MyContext);
  const [showcustomers, setshowcustomers] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(rowData);
  const cellStyle = {
    fontSize: "13px",
    textAlign:"left"
  };
  const dispatch = useDispatch();
  const [notification, setnotification] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const columnDefs = useMemo(
    () => [
      {
        field: "so_number",
        headerName: "SO Number",
        headerClass: "center-align-header",
        cellStyle,
        //   width: 400,
      },
      {
        field: "users.trade_name",
        headerName: "Trade Name",
        headerClass: "center-align-header",
        cellStyle,
        width: 250,
      },

      {
        field: "total_amount",
        headerName: "Total Amount",
        headerClass: "center-align-header",
        cellStyle,
        //   width: 200,
      },
      {
        field: "so_status",
        headerName: "So Status",
        headerClass: "center-align-header",
        cellStyle,

        // width: 200,
      },
      {
        field: "status",
        headerName: "Payment Status",
        headerClass: "center-align-header",
        cellStyle: (params) => {
          return {
            color: params.value === "pending" ? "orange" : "black",
            fontSize: "14px",
            textAlign:"left"
          };
        },
        // width: 250,
      },

      {
        field: "users.user_name",
        headerName: "Created_by",
        headerClass: "center-align-header",
        cellStyle,
        // width: 200,
      },
      {
        field: "created_date",
        headerName: "Created date",
        headerClass: "center-align-header",
        cellStyle,
        width: 300,
        valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
      },
    ],
    []
  );
  const navigate = useNavigate();
  useEffect(() => {
    const fetchcustomers = async () => {
      try {
        const division = "";
        const response = await axiosPrivate.post(
          `/sales/viewcustomers`,
          division
        );
        const data = response.data.customers;
        data.sort();
        setcustomer(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchcustomers();
  }, []);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.post(`/sales/solist`);
        setRowData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleSelect = (event) => {
    setSelect(event.target.value);
  };

  const handleChange = (event) => {
    setSelectedcustomer(null);
    const { value } = event.target;
    const supData = [...Customer];
    if (value === "") {
      let customersClone = [...Customer];
      customersClone.sort();
      setSelectedcustomer(customersClone);
    } else {
      const filteredArr = supData.filter(
        (ele) => ele && ele.toLowerCase().includes(value.toLowerCase())
      );
      const remainingArr = supData.filter(
        (ele) => ele && !ele.toLowerCase().includes(value.toLowerCase())
      );
      setcustomer([...filteredArr, ...remainingArr]);
    }
  };

  //Selecting Supplier
  const handlecustomer = (e, index) => {
    if (e.keyCode === 13 || e.type === "click") {
      const supplierName = Customer[index];
      const supplierData = { trade_name: supplierName };
      setFilterCus(supplierData);
      setSelectedcustomer(supplierName);
      setshowcustomers(false);
    }
  };

  const handleCloseBox = () => {
    if (showcustomers) {
      setshowcustomers(false);
    }
  };
  const cellClickedListener = async (event) => {
    try {
      const filternoti = notification.filter(
        (ele) => ele.verification_id == event.data.so_number && ele.read == "N"
      );
      console.log("filternoti>>>>>", filternoti);
      console.log("event>>>>>", event.data.so_number);
      console.log("event>>>>>", notification);
      if (filternoti[0]) {
        const id = {
          id: filternoti[0]?.id,
        };
        axiosPrivate
          .post(`/notification/admread_notification`, id)
          .then((res) => {
            console.log("res>>>>", res);
            dispatch(trflseSetting());
          });
      }
      if (event.data.so_status == "draft") {
        navigate("/new_sales_order", {
          state: {
            data: event.data.sales_id,
            so_status: event.data.so_status,
            quoted: true,
            draft: true,
          },
        });
      } else {
        navigate("/new_sales_order", {
          state: {
            data: event.data.sales_id,
            so_status: event.data.so_status,
            quoted: true,
            solist: true,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    axiosPrivate.post(`/notification/getadm_notification`).then((res) => {
      setnotification(res.data.admin_notification);
    });
  }, []);

  return (
    <>
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
              padding: ".1rem",
            }}
          >
            Sales Orders
          </span>
        </Col>
      </Row>
      <Row className="mb-1">
        <Col lg={8} md={9} sm={9}>
          <Row className="p-1.5 mb-5 mt-2 align-items-center">
            <Col lg={6} />
          </Row>
        </Col>
        <Col lg={4} sm={3} md={3}>
          <Link style={{ textDecoration: "none" }} to="/new_sales_order">
            <ButtonComponent
              border="1px solid #0785D2"
              color="#0785D2"
              background="white"
            >
              <Col style={{ gap: "5px" }} className={flexCenter}>
                <span onClick={() => setDraftData(null)}>Create New So</span>
                <Addchart />
              </Col>
            </ButtonComponent>
          </Link>
        </Col>
      </Row>

      <Container fluid>
        <Row
          className="mt-5"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
              onCellClicked={cellClickedListener}
              columnHoverHighlight={true}
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
    </>
  );
}
