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

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
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
import moment from "moment";
import { trflseSetting } from "../../../../Redux/SliceRedux";
import { useDispatch } from "react-redux";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

export default function ProdWorklist() {
  const axiosPrivate=useAxiosPrivate()
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const { productlist, setproductlist } = useContext(MyContext);
  const [select, setSelect] = useState("");
  const dispatch = useDispatch();
  const [notification, setnotification] = useState([]);

  const cellStyle = {
    fontSize: "13px",
  };

  const columnDefs = useMemo(
    () => [
      {
        flex:1,
        field: "product_name",
        headerName: "Product Name",
        headerClass: "center-align-header",
        cellStyle,
      },
      {
        flex:1,
        field: "users.trade_name",
        headerName: "Supplier Name",
        headerClass: "center-align-header",
        cellStyle,
      },

      {
        flex:1,
        field: "color",
        headerName: "color",
        headerClass: "center-align-header",
        cellStyle,
      },
      {
        flex:1,
        field: "created_date",
        headerName: "Created date",
        headerClass: "center-align-header",
        cellStyle,
        valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
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
    //   const { id } = event.data;

    try {
      const filternoti = await notification.filter(
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
      const data = await { type: "detail", product_id: event.data.product_id };
      axiosPrivate
        .post(`/product/proddetails`, data)
        .then((res) => {
          console.log(res);
          setproductlist(res.data);
          navigate("/productapprove");
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    axiosPrivate
      .post(`/notification/getadm_notification`)
      .then((res) => {
        setnotification(res.data.admin_notification);
      });
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(
          `/product/productapprovelist`
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
  console.log("setproductlist", productlist);
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
            Product-Worklist
          </span>
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
              onCellClicked={cellClickedListener} // Optional - registering for Grid Event
              columnHoverHighlight={true}
              // suppressRowHoverHighlight= {false}
            />
          </div>
        </Row>
      </Container>
    </>
  );
}
