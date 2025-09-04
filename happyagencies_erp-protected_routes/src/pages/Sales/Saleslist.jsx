import Topbar from '../../components/admin components/Topbar'
import { Col, Container, Row } from 'react-bootstrap'
import Side from '../../components/Side'
import React, {
    useState,
    useRef,
    useEffect,
    useMemo,
    useCallback,
    useContext,
  } from "react";
  import axios from "axios";
  import { render } from "react-dom";
  import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
  
  import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
  import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { baseApi, prismaBaseApi } from '../../config';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
export default function Saleslist() {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row
  const axiosPrivate=useAxiosPrivate()
  const cellStyle = {
    fontSize: "13px",
    // textAlign: "left",
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "product_name",
      headerName: "Date",
      headerClass: "center-align-header",
      cellStyle:{textAlign:"left",fontSize:"13px"},
      width: 100,
    },
    {
      field: "brand_name",
      headerName: "Invoice",
      headerClass: "center-align-header",
      cellStyle,
      width: 100,
    },
    {
      field: "product_type",
      headerName: "Customer",
      headerClass: "center-align-header",
      cellStyle,
      width: 200,
    },
    {
      field: "batch_id",
      headerName: "Contact",
      headerClass: "center-align-header",
      cellStyle,
      width:100
    },

    {
      field: "total_quantity",
      headerName: "Sales types",
      headerClass: "center-align-header",
      cellStyle,
      width: 150,
    },
    {
      field: "blocked_quantity",
      headerName: "Sales",
      headerClass: "center-align-header",
      cellStyle,
      width: 100,
    },
    {
      field: "mrp",
      headerName: "Createrby",
      headerClass: "center-align-header",
      cellStyle,
      width: 200,
    },
    {
      field: "mrp",
      headerName: "Status",
      headerClass: "center-align-header",
      cellStyle,
      width: 100,
    },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
  }));

  //consuming
  const cellClickedListener = useCallback((event) => {
    console.log(event);
  }, []);

  // Example load data from server
  useEffect(() => {
    // `${baseApi}/inventry`
    const fetchApi = async () => {
      try {
        const response = await axiosPrivate.get(`inventory`);

        console.log(response);

        setRowData(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchApi();
  }, []);
  return (
    <>
    <Row style={{ width: "100%" }}>
      <Col lg={3}>
        <Side/>
      </Col>
      <Col lg={9}>
        <Topbar/>
        <Row className="p-1.5 mb-3">
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
                    Sales order
                  </span>
                </Col>
              </Row>
      
        <Container fluid>
       <Row>
        <Col lg={4}><input
                              style={{ fontSize: "20px", padding: "2px" }}
                              className="form-control products-form__form-control pt-3 pb-3"
                            placeholder='Customer Name '
                              // value={receiptData.dod}
                              name="name"
                              type="text"
                            /></Col>
        <Col lg={4}><input
                              style={{ fontSize: "20px", padding: "2px" }}
                              className="form-control products-form__form-control pt-3 pb-3"
                              placeholder='Sales Type'
                              // value={receiptData.dod}
                              name="name"
                              type="text"
                            /></Col>
        <Col lg={4}><input
                              style={{ fontSize: "20px", padding: "2px" }}
                              className="form-control products-form__form-control pt-3 pb-3"
                              placeholder='Contact'
                              // value={receiptData.dod}
                              name="name"
                              type="text"
                            /></Col>

      </Row>
      </Container>

        <Container fluid>
      <Row className='mt-5'>
        {/* Example using Grid's API */}
        {/* <button onClick={buttonListener}>Push Me</button> */}

        {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
        <div
          className="ag-theme-alpine"
          style={{
            width: "98%",
            height: 300,
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

      </Col>
    </Row>
  
    
    </>
  )
}


