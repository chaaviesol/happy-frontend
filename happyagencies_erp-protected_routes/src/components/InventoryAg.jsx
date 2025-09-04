import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { Container, Row } from "react-bootstrap";

import { MyContext } from "../Contexts/Contexts";
import {
  CheckCircle,
  CropSquareOutlined,
  HighlightOff,
  SquareRounded,
} from "@mui/icons-material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ButtonComponent from "./ButtonComponent/ButtonComponent";
import { ButtonComp } from "./ButtonComponent/ButtonComp";
import Modal from "./modal";

export default function InventoryAg({ onOpenModal }) {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isHidden } = useContext(MyContext);
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const cellStyle = {
    fontSize: "13px",
  };


  const [columnDefs, setColumnDefs] = useState([
    {
      flex: 2,
      field: "product_master.product_name",
      headerName: "Product Name",
      headerClass: "center-align-header",
      cellStyle: (params) => {
        return {
          display: "flex",
          alignItems: "center",      // vertical center
          justifyContent: "flex-start",
          fontSize: "13px",
          color: params.data.status === "outofstock" ? "red" : "inherit",
        };
      },
      // cellStyle: { textAlign: "left", fontSize: "13px" },
    },
    {
      flex: 1,
      field: "product_master.color",
      headerName: "Color",
      headerClass: "center-align-header",
      cellStyle,
      cellRendererFramework: (params) => {
        const { color, color_family } = params?.data?.product_master || {};

        if (color && color_family) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                height: "100%",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                // gap: "1rem",
                // marginTop: "2px",
              }}
            >
              <SquareRounded
                style={{ color: color_family }}
                titleAccess={color}
              />
            </div>
          );
        } else {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                height: "100%",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                // gap: "1rem",
                // marginTop: "2px",
              }}
            >
              <CropSquareOutlined />
            </div>
          );
        }
      },
    },
    {
      flex: 1,
      field: "product_master.brand.brand_name",
      headerName: "Brand",
      headerClass: "center-align-header",
      cellStyle: (params) => {
        return {
          display: "flex",
          alignItems: "center",      // vertical center
          justifyContent: "flex-start",
          textAlign: "left",
          fontSize: "13px",
          color: params.data.status === "outofstock" ? "red" : "inherit",
        };
      },
    },
    {
      flex: 1,
      field: "product_master.product_type",
      headerName: "Type",
      headerClass: "center-align-header",
      cellStyle,
      cellStyle: (params) => {
        return {
          display: "flex",
          alignItems: "center",      // vertical center
          justifyContent: "flex-start",
          textAlign: "left",
          fontSize: "13px",
          color: params.data.status === "outofstock" ? "red" : "inherit",
        };
      },
    },
    {
      flex: 1,
      field: "batch_id",
      headerName: "Batch",
      cellStyle: (params) => {
        return {
          display: "flex",
          alignItems: "center",      // vertical center
          justifyContent: "flex-start",
          textAlign: "left",
          fontSize: "13px",
          color: params.data.status === "outofstock" ? "red" : "inherit",
        };
      },
      headerClass: "center-align-header",
    },

    {
      flex: 1,
      field: "total_quantity",
      headerName: "Total Qty",
      headerClass: "center-align-header",
      cellStyle: (params) => {
        return {
          display: "flex",
          alignItems: "center",      // vertical center
          justifyContent: "flex-start",
          textAlign: "left",
          fontSize: "13px",
          color: params.data.status === "outofstock" ? "red" : "inherit",
        };
      },
    },
    {
      flex: 1,
      field: "blocked_quantity",
      headerName: "Blocked Qty",
      headerClass: "center-align-header",
      cellStyle: (params) => {
        return {
          display: "flex",
          alignItems: "center",      // vertical center
          justifyContent: "flex-start",
          textAlign: "left",
          fontSize: "13px",
          color: params.data.status === "outofstock" ? "red" : "inherit",
        };
      },
    },
    {
      flex: 1,
      field: "mrp",
      headerName: "Selling Price",
      headerClass: "center-align-header",
      cellStyle: (params) => {
        return {
          display: "flex",
          alignItems: "center",      // vertical center
          justifyContent: "flex-start",
          textAlign: "left",
          fontSize: "13px",
          color: params.data.status === "outofstock" ? "red" : "inherit",
        };
      },
    },
    {
      flex: 1,
      field: "barcode",
      headerName: "Barcode",
      autoHeight: true,
      width: 300,      // default width for barcode column
      minWidth: 200,
      headerClass: "center-align-header",
      cellStyle: { textAlign: "center", fontSize: "13px" },
      cellRendererFramework: (params) => {
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            {
              !params.data.barcode && !params.data.barcode_text ? (

                <ButtonComp
                  type="generate"
                  text="Generate"
                  onClick={() => {
                    console.log("Generate Barcode for:", params);
                    genBarcode(params.data);

                  }}
                />
              ) : (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "1px",
                  minHeight: "100px", // <-- makes sure row has enough height
                }}>
                  <div>

                    <ButtonComp
                      type="print"
                      text="Print"
                      onClick={() => {
  if (params.data.barcode) {
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (printWindow) {
      const doc = printWindow.document;
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>Print Labels (100×30mm Roll)</title>
            <style>
              @page {
                size: 100mm 30mm; /* paper roll size */
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
              }
              .row {
                display: flex;
                width: 100mm; /* exactly 2 labels per row */
                height: 30mm;
                page-break-inside: avoid;
              }
              .label {
                width: 50mm;
                height: 30mm;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                text-align: center;
                font-size: 10px;
                box-sizing: border-box;
              }
              .top-text {
                font-weight: bold;
                margin-bottom: 2px;
              }
              .barcode {
                margin: 2px 0;
              }
              .small-text {
                font-size: 8px;
                margin: 1px 0;
              }
              .bottom-text {
                font-weight: bold;
                margin-top: 2px;
              }
            </style>
          </head>
          <body>
            <div class="row">
              <div class="label">
                <div class="top-text">${params.data.product_master.product_name}</div>
                <div class="barcode">
                  <img src="${params.data.barcode}" style="max-height:12mm;" />
                </div>
                <div class="small-text">LTO</div>
                <div class="bottom-text">TO</div>
              </div>
              <div class="label">
                <div class="top-text">${params.data.product_master.product_name}</div>
                <div class="barcode">
                  <img src="${params.data.barcode}" style="max-height:12mm;" />
                </div>
                <div class="small-text">LTO</div>
                <div class="bottom-text">TO</div>
              </div>
            </div>
          </body>
        </html>
      `);
      doc.close();

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
        }, 500);
      };
    }
  } else {
    alert("No barcode available to print.");
  }
}}
// onClick={() => {
//   if (params.data.barcode) {
//     const printWindow = window.open("", "_blank", "width=800,height=600");

//     if (printWindow) {
//       const doc = printWindow.document;
//       doc.open();
//       doc.write(`
//         <html>
//           <head>
//             <title>Print Labels (A4 Preview)</title>
//             <style>
//               @page {
//                 size: A4;
//                 margin: 5mm;
//               }
//               body {
//                 margin: 0;
//                 padding: 0;
//                 font-family: Arial, sans-serif;
//               }
//               .row {
//                 display: flex;
//                 width: 100mm; /* lock row to 100mm = 2 labels only */
//                 margin: 2mm auto; /* center row on page */
//                 page-break-inside: avoid;
//               }
//               .label {
//                 width: 50mm;
//                 height: 30mm;
//                 border: 1px dotted #ccc; /* keep for preview */
//                 display: flex;
//                 flex-direction: column;
//                 justify-content: flex-start;
//                 align-items: center;
//                 text-align: center;
//                 font-size: 10px;
//                 box-sizing: border-box;
//               }
//               .top-text {
//                 font-weight: bold;
//                 margin-bottom: 2px;
//               }
//               .barcode {
//                 margin: 2px 0;
//               }
//               .small-text {
//                 font-size: 8px;
//                 margin: 1px 0;
//               }
//               .bottom-text {
//                 font-weight: bold;
//                 margin-top: 2px;
//               }
//             </style>
//           </head>
//           <body>
//             ${Array(10) // 10 rows = 20 labels
//               .fill("")
//               .map(
//                 () => `
//                   <div class="row">
//                     <div class="label">
//                       <div class="top-text">${params.data.product_master.product_name}</div>
//                       <div class="barcode">
//                         <img src="${params.data.barcode}" style="max-height:12mm;" />
//                       </div>
//                       <div class="small-text">LTO</div>
//                       <div class="bottom-text">TO</div>
//                     </div>
//                     <div class="label">
//                       <div class="top-text">${params.data.product_master.product_name}</div>
//                       <div class="barcode">
//                         <img src="${params.data.barcode}" style="max-height:12mm;" />
//                       </div>
//                       <div class="small-text">LTO</div>
//                       <div class="bottom-text">TO</div>
//                     </div>
//                   </div>`
//               )
//               .join("")}
//           </body>
//         </html>
//       `);
//       doc.close();

//       printWindow.onload = () => {
//         printWindow.focus();
//         printWindow.print();
//         setTimeout(() => {
//           printWindow.close();
//         }, 500);
//       };
//     }
//   } else {
//     alert("No barcode available to print.");
//   }
// }}



                      // onClick={() => {
                      //   if (params.data.barcode) {
                      //     const printWindow = window.open("", "_blank", "width=400,height=400");

                      //     if (printWindow) {
                      //       const doc = printWindow.document;

                      //       // Reset document cleanly
                      //       doc.open();
                      //       doc.close();

                      //       // Set title
                      //       printWindow.document.title = "Print Barcode";

                      //       // Apply body styles
                      //       doc.body.style.margin = "0";
                      //       doc.body.style.display = "flex";
                      //       doc.body.style.justifyContent = "center";
                      //       doc.body.style.alignItems = "center";
                      //       doc.body.style.height = "100vh";

                      //       // Add barcode image
                      //       const img = doc.createElement("img");
                      //       img.src = params.data.barcode;
                      //       img.style.maxWidth = "100%";
                      //       img.style.maxHeight = "100%";
                      //       doc.body.appendChild(img);

                      //       // Delay print until DOM is ready
                      //       img.onload = () => {
                      //         printWindow.focus();
                      //         printWindow.print();
                      //         setTimeout(() => {
                      //           printWindow.close();
                      //         }, 500);
                      //         //  printWindow.onafterprint = () => {
                      //         //   printWindow.close();
                      //         // };

                      //       };
                      //     }
                      //   } else {
                      //     alert("No barcode available to print.");
                      //   }
                      // }}
                    />
                  </div>
                  <div>
                    {/* Show barcode image below button */}
                    {params.data.barcode && (
                      <img
                        src={params.data.barcode}
                        alt="Barcode"
                        style={{ maxWidth: "160px", maxHeight: "60px" }}
                      />
                    )}

                    {/* Show barcode text below image */}
                    {params.data.barcode_text && (
                      <div style={{ fontSize: "8px", marginTop: "2px" }}>
                        {params.data.barcode_text}
                      </div>
                    )}
                  </div>
                </div>
              )
            }

          </div>
        );

      },
    },


    {
      flex: 1,
      field: "status",
      headerName: "Stock status",
      headerClass: "center-align-header",
      cellStyle,
      width: 150,
      cellRendererFramework: (params) => {
        const { status } = params.data;
        if (status === "instock") {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                height: "100%",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                // gap: "1rem",
                // marginTop: "2px",
              }}
            >
              <CheckCircle style={{ color: "#22c55e" }} titleAccess="instock" />
            </div>
          );
        } else if (status === "outofstock") {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                height: "100%",
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                // gap: "1rem",
                // marginTop: "2px",
              }}
            >
              <HighlightOff
                style={{ color: "#ef4444" }}
                titleAccess="out of stock"
              />
            </div>
          );
        }
      },
    },
  ]);
  const axiosPrivate = useAxiosPrivate();

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
  }));

  //consuming
  // const cellClickedListener = useCallback((event) => {
  //   // console.log(event);
  // }, []);
  const cellClickedListener = useCallback((event) => {
    if (event.colDef.field === "barcode") return;
    if (onOpenModal) {
      onOpenModal(event.data); // pass selected row to parent
    }
  }, [onOpenModal]);


  // Example load data from server
  const fetchApi = async () => {
    try {
      setLoading(true);
      const body = {
        isHidden: isHidden ? true : false,
      };
      const response = await axiosPrivate.post(`/inventory`, body);

      console.log("resss", response);

      setRowData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchApi();
  }, []);

  // generate barcode

  const genBarcode = async (pData) => {
    try {
      setLoading(true);
      const body = {
        prod_id: pData.product_master.product_id,
        po_num: pData.po_num,
        batch_id: pData.batch_id,
        INVENTORY_id: pData.INVENTORY_id,
      };
      console.log("GenBarcode body", body);

      const response = await axiosPrivate.post(`/inventory/generatebarcode`, body);

      console.log("barcode", response);

      if (response.data.success) {
  const { INVENTORY_id, barcode, barcode_text } = response.data.data;

  const rowNode = gridRef.current.api.getRowNode(INVENTORY_id);

  if (rowNode) {
    const updatedData = {
      ...rowNode.data,        // keep existing fields like product_master
      barcode,
      barcode_text,
    };

    rowNode.setData(updatedData); // 👈 safe replace (with preserved structure)

    gridRef.current.api.flashCells({
      rowNodes: [rowNode],
      columns: ["barcode"],
    });

    gridRef.current.api.refreshCells({
      rowNodes: [rowNode],
      force: true,
    });
  }
}




    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };




  return (
    <Container fluid>
      <Row>
        {/* Example using Grid's API */}
        {/* <button onClick={buttonListener}>Push Me</button> */}

        {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
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
            getRowId={(params) => params.data.INVENTORY_id}
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
