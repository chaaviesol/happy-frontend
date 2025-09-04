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
import { DirectionsBike } from "@mui/icons-material/";
import { PedalBike } from "@mui/icons-material/";
import { RocketLaunch } from "@mui/icons-material/";
import { DoNotDisturb } from "@mui/icons-material/";
import { FiberManualRecord } from "@mui/icons-material/";
import { prismaBaseApi } from "../../../../config";
import { useDispatch } from "react-redux";
import moment from "moment";
import { trflseSetting } from "../../../../Redux/SliceRedux";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
export default function View_service_request() {
    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
     
    const [select, setSelect] = useState("");
    const cellStyle = {
        fontSize: "13px",
    };
    const axiosPrivate=useAxiosPrivate()
    const columnDefs = useMemo(
        () => [
            {
                field: "sr_number",
                headerName: "SR number",
                headerClass: "center-align-header",
                cellStyle,
                width: 300,
            },
            {
                field: "product_qty",
                headerName: "Product qty",
                headerClass: "center-align-header",
                cellStyle,
                width: 200,
            },
            // {
            //   field: "users.user_name",
            //   headerName: "Supplier Name",
            //   headerClass: "center-align-header",
            //   cellStyle,
            //   width: 500,
            // },
            {
                field: "created_date",
                headerName: "Created date",
                headerClass: "center-align-header",
                cellStyle,
                width: 250,
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

    // const rowDat = rowData?.map((item, index) => ({
    //   productType: item.product_type,
    // }));
    // console.log(rowDat);

    const navigate = useNavigate();

    // const cellClickedListener = useCallback((event) => {
    // //   navigate("/new_sales_order", { state: { data: event.data.sales_id, quoted: true } });
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosPrivate.post(
                    `/order/service_reqlist`
                );
                console.log("respp", response.data.reqlist);
                setRowData(response.data.reqlist);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
   
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
                                // onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                                columnHoverHighlight={true}
                            />
                        </div>
                    </Row>
                </Container>
            </div>

        </div>

    )
}
