import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { Col, Row } from "react-bootstrap";
import "./Prodlist.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

import { MyContext } from "../../../../Contexts/Contexts";
import { useNavigate } from "react-router-dom";

import Newtopbar_ from "../../../../components/admin components/Newtopbar_";
import useAuth from "../../../../hooks/useAuth";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { ButtonComp } from "../../../../components/ButtonComponent/ButtonComp";
export default function Prodlist() {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [category, setCategory] = useState({});
  const [searchKey, setSearchKey] = useState({});
  const [originalProdlistData, setOriginalProdlistData] = useState([]); //

  const { prodlistData, setprodlistData, } =
    useContext(MyContext);
  const { auth } = useAuth({});
  const division = auth?.division;
  const axiosPrivate = useAxiosPrivate();

  console.log("rowData", rowData);
  console.log("category", category);
  console.log("searchKey", searchKey);

  const cellStyle = {
    fontSize: "13px",
    // background: "#00342E"
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      flex: 2,
      headerName: "Sl No",
      headerClass: "center-align-header",
      cellStyle: { fontSize: "13px" },
      // width: 250,
      valueGetter: (params) => params.node.rowIndex + 1,
    },
    {
      flex: 3,
      field: "brand_name",
      headerName: "Brand Name",
      headerClass: "center-align-header",
      cellStyle: { fontSize: "13px", textAlign: "left" },
      // width: 250,
      valueGetter: (params) => params.data.brand?.brand_name || "", // Access the nested value
    },
    {
      flex: 3,
      field: "product_name",
      headerName: "Product Name",
      headerClass: "center-align-header",
      cellStyle: { textAlign: "left", fontSize: "13px" },
      // width: 480,
    },
    {
      flex: 3,
      field: "color",
      headerName: "Color",
      headerClass: "center-align-header",
      cellStyle: { fontSize: "13px", textAlign: "left" },
      backgroundColor: "green",
      color: "white",
      // width: 340,
    },
    {
      flex: 3,
      field: "trade_name",
      headerName: "Suppliers",
      headerClass: "center-align-header",
      cellStyle: { fontSize: "13px", textAlign: "left" },
      // width: 285,
      valueGetter: (params) => params.data.users?.trade_name || "", // Access the nested value
    },
    {
      flex: 3,
      field: "product_code",
      headerName: "Product Code",
      headerClass: "center-align-header",
      cellStyle: { fontSize: "13px", textAlign: "left" },
      // width: 285,
    },
    {
      flex: 3,
      field: "barcode",
      headerName: "Barcode",
      headerClass: "center-align-header",
      cellStyle: { fontSize: "13px", textAlign: "left" },
      suppressCellClickSelection: true,
      suppressClickEdit: true,  
      // width: 285,
       cellRenderer: (params) => {
          return (
             <ButtonComp
                type="generate"
                text="Generate"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Generate Barcode for:", params.data.brand?.brand_name);
              alert(
              `Generate barcode for product: ${
                params.data.brand?.brand_name || "Unknown"
              }`
            );
                  // 🔥 replace alert with your actual barcode generation logic
                }}
              />
          )
        },
    },
  ]);

  ////newcode///

  // Function to filter products based on the searchKey type
  const filterDataByTypeAndCategory = (
    type,
    subcategory,
    category,
    products
  ) => {
    let filteredData = [...products];
    console.log("filteredData>>>>>>>", type, subcategory, category);
    console.log("====>filttt", filteredData);

    // Apply filtering based on type
    if (
      type === "bikes" ||
      type === "toys" ||
      type === "baby" ||
      type === "accessories"
    ) {
      filteredData = filteredData.filter(
        (product) => product.product_type === type
      );
      console.log("====>type", filteredData.length);
      if (filteredData.length === 0) {
        filteredData = null;
        setRowData(filteredData);
      } else {
        // Apply filtering based on category
        if (category) {
          filteredData = filteredData.filter(
            (product) =>
              product.product_type === type &&
              product.product_sub_type === category
          );
          console.log("====>cat", filteredData.length);
          if (filteredData.length === 0) {
            console.log("hhhh");
            setRowData(filteredData);
            filteredData = null;
          } else {
            // Apply filtering based on subcategory
            if (subcategory) {
              filteredData = filteredData.filter(
                (product) =>
                  product.product_type === type &&
                  product.product_sub_type === category &&
                  product.prod_subtype2 === subcategory
              );
              console.log("====>subcat", filteredData.length);
              if (filteredData.length === 0) {
                filteredData = null;
                setRowData(filteredData);
              }
            }
          }
        }
      }
    }
    return filteredData;
  };

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.post(`/product/productlist`);
        setRowData(response?.data);

        // Set originalProdlistData with the API response data
        setOriginalProdlistData(response?.data);

        // Apply filtering based on the searchKey type and the originalProdlistData
        const filteredData = filterDataByTypeAndCategory(
          searchKey.type,
          searchKey.subCategory,
          searchKey.category,
          response?.data
        );

        setprodlistData(filteredData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    // if(rowData?.length===0){
    fetchApi();

    // }
  }, [searchKey.type, searchKey.category, searchKey.subCategory]);

  useEffect(() => {
    // Filter the original data based on the selected category and subcategory
    const filteredData = filterDataByTypeAndCategory(
      searchKey.type,
      searchKey.subCategory,
      searchKey.category,
      originalProdlistData
    );

    // Update rowData with the filtered data
    setRowData(filteredData);
  }, [searchKey.category, searchKey.subCategory]);

  // ...

  const handleSearch = async (event) => {
    const value = event.target.value;
    const req = { main: value };
    console.log(value);
    try {
      const response = await axiosPrivate.post(
        `/category/categorymasterview`,
        req
      );
      console.log("handleSearch", response);

      setSearchKey({ ...searchKey, type: req.main });

      setCategory({
        category: response.data.category,

      });
    } catch (err) {
      console.log("error>>>>", err);
    }
  };
  //only works whn logged in as bike or ,,, adm
  useEffect(() => {
    if (division) {
      const handleSearch2 = async () => {
        const main = division;
        try {
          const response = await axiosPrivate.post(
            `/category/categorymasterview`,
            { main: division }
          );
          console.log("handleSearch", response);

          // Update the searchKey type
          setSearchKey({ ...searchKey, type: main });

          setCategory({
            category: response.data.category,
            subCategory: response.data.sub_category,
          });
        } catch (err) {
          console.log("error>>>>", err);
        }
      };
      handleSearch2();
    }
  }, [division]);

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

          subCategory: res.data[0].sub_categories,
        });
      });
    }

    // Update the searchKey with the selected key and value
    setSearchKey((prevSearchKey) => ({
      ...prevSearchKey,
      [key]: val,
    }));
  };

  // ... (previous code)
  useEffect(() => {
    // Check if prodlistData is an empty array before updating rowData
    if (Array.isArray(prodlistData) && prodlistData.length > 0) {
      setRowData(prodlistData);
    }
  }, [prodlistData]);

  useEffect(() => {
    const filteredData = filterDataByTypeAndCategory(
      searchKey.type,
      searchKey.subCategory,
      searchKey.category,
      originalProdlistData
    );

    setprodlistData(filteredData);
  }, [
    searchKey.category,
    searchKey.subCategory,
    searchKey.type,
    originalProdlistData,
  ]);


  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
  }));


  const navigate = useNavigate();
  const cellClickedListener = useCallback((event) => {
     if (event.colDef.field === "barcode") return;
    const data = { type: "detail", product_id: event.data.product_id };
    console.log("data", data);
    axiosPrivate.post(`/product/proddetails`, data).then((res) => {
      console.log("res===========", res?.data);
      setprodlistData(res?.data);
      navigate("/proddetails");
    });
  }, []);

  // useEffect(() => {
  //   const fetchApi = async () => {
  //     try {
  //       const response = await axiosPrivate.post(`/product/productlist`);

  //       console.log("colorrrrr===", response?.data);

  //       setRowData(response?.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchApi();
  // }, []);
  console.log("rowData>>", rowData);

  console.log(searchKey);
  return (
    <>
      <div>
        <div>
          <Newtopbar_ />
          <Row className="p-1.5 mb-4">
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
                Product List
              </span>
            </Col>
          </Row>
          <Row className="mb-0">
            <Col lg={2}>
              <select
                required
                onChange={handleSearch}
                name="sup_name"
                id="tradeNumber"
                className="form-control products-form__form-control"
                style={{ borderRadius: "30px", fontSize: "13px" }}
              // value=""
              >
                {division ? (
                  <>
                    <option>{division}</option>
                  </>
                ) : (
                  <>
                    <option
                      value=""

                      style={{ fontSize: "0px" }}
                    >
                      type
                    </option>
                    <option value="bikes">Bikes</option>
                    <option value="toys">Toys</option>
                    <option value="baby">Baby</option>
                    <option value="accessories">Accessories</option>
                  </>
                )}
              </select>
            </Col>
            <Col lg={2}>
              <select
                required
                onChange={(event) => handleSelectChanges(event, "category")}
                name="sup_name"
                id="tradeNumber"
                className="form-control products-form__form-control"
                style={{ borderRadius: "30px", fontSize: "13px" }}
              >
                <option value="" disabled selected style={{ fontSize: "0px" }}>
                  {/* <h1>Category</h1> */}
                  category
                </option>
                {category &&
                  category.category &&
                  category.category.map((value, index) => (
                    <option key={index}> {value}</option>
                  ))}
              </select>
            </Col>
            <Col lg={3}>
              <select
                required
                onChange={(event) => handleSelectChanges(event, "subCategory")}
                name="sup_name"
                id="tradeNumber"
                className="form-control products-form__form-control"
                style={{ borderRadius: "30px", fontSize: "13px" }}
              >
                <option value="" disabled selected style={{ fontSize: "0px" }}>
                  sub category
                </option>
                {category &&
                  category.subCategory &&
                  category.subCategory.map((value, index) => (
                    <option key={index}> {value}</option>
                  ))}
              </select>
            </Col>
            <Col
              style={{
                display: "flex",
                // justifyContent: "center",
                alignItems: "center",
              }}
              lg={5}
            >
              <Row></Row>

              {/* <InputComponent /> */}
            </Col>
          </Row>
          <div className="flex-center">
            <div
              className="ag-theme-alpine"
              style={{
                backgroundColor: "green",
                width: "100%",
                height: 500,
                border: "1px solid #A6C991",
                fontSize: "13px",
                marginTop: "5%",
                // color:"white",
                // textAlign:"left"
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
          </div>
        </div>
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
    </>
  );
}
