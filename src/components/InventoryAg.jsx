import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { Container,Col, Row } from "react-bootstrap";
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
import CustomHeaderFilter from "./CustomHeaderFilter";
import useAuth from "../hooks/useAuth";
import CustomDropdown from "./CustomDropdown";


export default function InventoryAg({ onOpenModal }) {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState({});
  const [category, setCategory] = useState({});

  const { auth } = useAuth();
const division = auth?.division; // e.g. "bikes", "toys", "baby", "accessories"

    // Category options
  const categoryOptions = [
    { value: "", label: "All Category" }, // your default option
    ...(category?.category?.map((v) => ({ value: v, label: v })) || []),
  ];

  // SubCategory options
  const subCategoryOptions =
    category?.subCategory?.map((v) => ({ value: v, label: v })) || [];

  //type options
  const typeOptions = division
    ? [{ value: division, label: division }]
    : [
      { value: "bikes", label: "Bikes" },
      { value: "toys", label: "Toys" },
      { value: "baby", label: "Baby" },
      { value: "accessories", label: "Accessories" },
    ];


  const { isHidden } = useContext(MyContext);
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const cellStyle = {
    fontSize: "13px",
  };


  const [columnDefs, setColumnDefs] = useState([
    {
      flex: 2,
      minWidth: 200,
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
      minWidth: 150,
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
      minWidth: 150,
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
      minWidth: 150,
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
      minWidth: 150,
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
      minWidth: 150,
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
      minWidth: 150,
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
      field: "selling_price",
      minWidth: 150,
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
      minWidth: 150,
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
                      onClick={async () => {
                        const { product_master, barcode_text } = params.data;

                        // 1️⃣ Validate input
                        if (!barcode_text) {
                          alert("No barcode text available to print.");
                          return;
                        }
                        if (!product_master?.product_name) {
                          alert("No product name available to print.");
                          return;
                        }

                        // 2️⃣ Generate base64 barcode
                        const generateBarcodeBase64 = (text) => {
                          const canvas = document.createElement("canvas");
                          JsBarcode(canvas, text, {
                            format: "CODE128",
                            displayValue: false,
                            height: 50,
                            width: 2,
                            margin: 0,
                          });
                          return canvas.toDataURL("image/png");
                        };

                        const barcodeBase64 = generateBarcodeBase64(barcode_text);

                        // 3️⃣ Create label HTML with 2 copies
                        const labelDiv = document.createElement("div");
                        labelDiv.style.width = "100mm";
                        labelDiv.style.height = "30mm";
                        labelDiv.style.display = "flex";
                        labelDiv.style.fontFamily = "Arial, sans-serif";

                        for (let i = 0; i < 2; i++) {
                          const label = document.createElement("div");
                          label.style.width = "50mm";
                          label.style.height = "30mm";
                          label.style.display = "flex";
                          label.style.flexDirection = "column";
                          label.style.justifyContent = "center";
                          label.style.alignItems = "center";
                          label.style.textAlign = "center";

                          label.innerHTML = `
        <div style="font-weight:bold;font-size:11px;margin-bottom:2px;">
          ${product_master.product_name}
        </div>
        <div style="margin:2px 0;">
          <img src="${barcodeBase64}" style="max-height:12mm;" />
        </div>
        <div style="font-size:9px;margin-top:2px;">
          ${barcode_text}  ${product_master.assign_code || "---"}
        </div>
      `;

                          labelDiv.appendChild(label);
                        }

                        // 4️⃣ Append to DOM (hidden), snapshot, then remove
                        document.body.appendChild(labelDiv);
                        labelDiv.style.position = "fixed";
                        labelDiv.style.left = "-9999px"; // hide off-screen

                        try {
                          const canvas = await html2canvas(labelDiv, { scale: 2 });
                          const imgData = canvas.toDataURL("image/png");

                          const pdf = new jsPDF({
                            orientation: "landscape",
                            unit: "mm",
                            format: [100, 30], // 100×30mm roll
                          });

                          pdf.addImage(imgData, "PNG", 0, 0, 100, 30);
                          pdf.autoPrint();
                          pdf.output("dataurlnewwindow");
                        } catch (err) {
                          console.error("Error generating PDF:", err);
                        } finally {
                          document.body.removeChild(labelDiv); // cleanup
                        }
                      }}
                    />



                    {/* <ButtonComp
  type="print"
  text="Print"
  onClick={() => {
    const { barcode, barcode_base64, product_master, barcode_text } = params.data;

    // 1️⃣ Validate data
    if (!barcode && !barcode_base64) {
      alert("No barcode available to print.");
      return;
    }
    if (!product_master?.product_name) {
      alert("No product name available to print.");
      return;
    }

    // 2️⃣ Prefer base64 (safer), fallback to S3 URL
    const barcodeImg = barcode_base64 || barcode;

    // 3️⃣ Single row with 2 labels
    const rowsHtml = `
      <div class="row">
        <div class="label">
          <div class="top-text">${product_master.product_name}</div>
          <div class="barcode">
            <img src="${barcodeImg}" style="max-height:12mm;" />
          </div>
          <div class="bottom-text">${barcode_text || ""}</div>
        </div>
        <div class="label">
          <div class="top-text">${product_master.product_name}</div>
          <div class="barcode">
            <img src="${barcodeImg}" style="max-height:12mm;" />
          </div>
          <div class="bottom-text">${barcode_text || ""}</div>
        </div>
      </div>
    `;

    // 4️⃣ Full HTML with styles
    const labelHtml = `
      <html>
        <head>
          <title>Print Labels (100×30mm Roll)</title>
          <style>
            @page {
              size: 100mm 30mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            .row {
              display: flex;
              width: 100mm;
              height: 30mm;
              page-break-inside: avoid;
            }
            .label {
              width: 50mm;
              height: 30mm;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              box-sizing: border-box;
            }
            .top-text {
              font-weight: bold;
              font-size: 11px;
              margin-bottom: 2px;
            }
            .barcode {
              margin: 2px 0;
            }
            .bottom-text {
              font-size: 9px;
              margin-top: 2px;
            }
          </style>
        </head>
        <body>
          ${rowsHtml}
        </body>
      </html>
    `;

    // 5️⃣ Open popup
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.documentElement.innerHTML = labelHtml;

    // 6️⃣ Wait for all images to load before printing
    const checkLoaded = () => {
      const imgs = printWindow.document.querySelectorAll("img");
      if (!imgs.length) {
        triggerPrint();
        return;
      }

      let loaded = 0;
      imgs.forEach(img => {
        if (img.complete) {
          loaded++;
        } else {
          img.onload = () => {
            loaded++;
            if (loaded === imgs.length) triggerPrint();
          };
        }
      });

      if (loaded === imgs.length) triggerPrint();
    };

    const triggerPrint = () => {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => printWindow.close(), 500);
    };

    setTimeout(checkLoaded, 500);
  }}

                    /> */}



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
      minWidth: 150,
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
    headerComponent: CustomHeaderFilter,
    //     cellStyle: {
    //   display: "flex",
    //   justifyContent: "center", // horizontal center
    //   alignItems: "center",     // vertical center
    //   textAlign: "center",      // fallback for text
    // },
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

        type: searchKey.type || "",
        category: searchKey.category || "",
        subCategory: searchKey.subCategory || "",

      };
      console.log("ff inventory fetch body",body);
      
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
  }, [searchKey.type, searchKey.category, searchKey.subCategory]);

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





  const handleSearch = async (event) => {
    const value = event.target.value;
    const req = { main: value };
    try {
      const response = await axiosPrivate.post(`/category/categorymasterview`, req);
      setSearchKey({ ...searchKey, type: req.main });
      setCategory({
        category: response.data.category,
        subCategory: response.data.sub_category,
      });
    } catch (err) {
      console.log("error>>>>", err);
    }
  };

  const handleSelectChanges = (event, selected) => {
    const key = selected;
    const val = event.target.value;
    if (key === "category") {
      const specD = {
        main_type: searchKey.type,
        category: val,
      };
      axiosPrivate.post(`/product/getspec`, specD).then((res) => {
        setCategory({
          ...category,
          subCategory: res.data[0]?.sub_categories || [],
        });
      });
    }

    setSearchKey((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  useEffect(() => {
  if (division) {
    const fetchCategories = async () => {
      try {
        const response = await axiosPrivate.post(`/category/categorymasterview`, { main: division });
        setSearchKey({ type: division });
        setCategory({
          category: response.data.category,
          subCategory: response.data.sub_category,
        });
      } catch (err) {
        console.error("Error loading division categories:", err);
      }
    };
    fetchCategories();
  }
}, [division]);



  return (
    <Container fluid>
      <div style={{margin:'5px'}}>
  <Row className="mb-0" >
            <Col lg={2}>

              <CustomDropdown
                options={typeOptions}
                placeholder="Type"
                value={searchKey.type}
                onChange={(val) => handleSearch({ target: { value: val } })}
                isDisabled={!!division} // disable if division exists
                hideDropdownIndicator={true} // remove arrow
              />


            </Col>
            <Col lg={6}>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <CustomDropdown
                    options={categoryOptions}
                    placeholder="Category"
                    value={searchKey.category}
                    onChange={(val) =>
                      handleSelectChanges({ target: { value: val } }, "category")
                    }
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <CustomDropdown
                    options={subCategoryOptions}
                    placeholder="Sub Category"
                    value={searchKey.subCategory}
                    onChange={(val) =>
                      handleSelectChanges({ target: { value: val } }, "subCategory")
                    }
                  />
                </div>
              </div>
            </Col>
</Row>

</div>
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
            overflowX: "auto",

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
