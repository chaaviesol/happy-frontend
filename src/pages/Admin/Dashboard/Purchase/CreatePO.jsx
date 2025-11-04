import React, { useEffect, useState, useRef, useContext } from "react";
import { AttachFile, CheckCircleOutline, HighlightOff } from "@mui/icons-material";
import "./Purchase.css";
import { Add } from "@mui/icons-material";
import { Divider, IconButton, Modal } from "@mui/material";
import { KeyboardBackspace } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MyContext } from "../../../../Contexts/Contexts";
import Newproduct from "./Newproduct";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import * as PoSlice from "../../../../Redux/slices/PoSlices";
import useDivBoxCloser from "../../../../hooks/useDivBoxCloser";
import useFileUpload from "../../../../hooks/useFileUpload";
import useAuth from "../../../../hooks/useAuth";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

export default function CreatePO() {
  const { draftData, setDraftData } = useContext(MyContext);
  const dispatch = useDispatch();
  const state = useSelector((state) => state.poSlices);
  const [renderCount, setRenderCount] = useState(0);
  const [showNewProdWindow, setShowNewProdWindow] = useState(false);
  const [canTotUpdate, setCanTotUpdate] = useState(false);
  const [indexForRemoveProd, setIsIndexForRemoveProd] = useState(0);
  const [
    isProductDeleteConfirmationModalOpen,
    setIsProductDeleteConfirmationModalOpen,
  ] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const {
    setSelectedFile,
    setUpload,
    setIndex,
    links,
    setLinks,
    setFolder,
    selectedFile,
  } = useFileUpload();
  const { auth } = useAuth()

  const open_sup_list_ref = useRef(null);
  const open_logistics_list_ref = useRef(null);
  const open_prod_lists = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLinks([]);
    setSelectedFile([]);
    setIndex(-1);
  }, []);

  //if draftData setting up the states
  useEffect(() => {
    if (draftData) {
      // alert("drafted");
      console.log(draftData);
      const draftedData = draftData;
      const data = {
        logistics_name: draftedData.logistics_name,
        trade_name: draftedData.trade_name,
      };
      const updatedArray = draftedData?.products?.map((item) => {
        if (item.rate) {
          // Create a new object with the updated key name, leaving the rest of the data intact
          item.enter_qty = item.qty / item.no_of_items;
          const { rate, ...rest } = item;
          return { amt: rate, ...rest };
        }
        return item;
      });

      const total_amount = parseInt(draftedData.total_amount);
      dispatch(PoSlice.UPDATE_FORM_DATA_DRAFT(data));
      dispatch(PoSlice.UPDATE_PRODUCT_TABLE_ARRAY(updatedArray));
      dispatch(PoSlice.UPDATE_TOTAL(total_amount));

      //adding notes part---------------------
      let draftNotes = [];
      const { note1, note2, note3 } = draftedData?.po_notes || {};

      if (note1) {
        draftNotes.push({ note1 });
      }

      if (note2) {
        draftNotes.push({ note2 });
      }

      if (note3) {
        draftNotes.push({ note3 });
      }
      const backupNote = [{}]; //if no drafted notes, added an single object to display notes input field
      dispatch(
        PoSlice.ADD_NOTES(draftNotes.length > 0 ? draftNotes : backupNote)
      );
    }
  }, [state.draftDataExist]);

  console.log("REDUX STATE=>>", state);
  // console.log("REDUX STATE=>>", fff);

  //render
  useEffect(() => {
    setRenderCount((prevRenderCount) => prevRenderCount + 1);
  }, []);
  // console.log("rendered this component", renderCount);

  //getting suppliers and logistics data
  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axiosPrivate.post(
          `/logistics/suppliersandlogistics`,

        );
        const supplierAndLogisticsNames = response.data;
        // console.log("supplierAndLogisticsNames =>", supplierAndLogisticsNames);
        if (supplierAndLogisticsNames) {
          dispatch(PoSlice.SET_SUP_AND_LOGISTICS(supplierAndLogisticsNames));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [state.showNewLogistics]);
  const closeFunction = () => {
    dispatch(PoSlice.HIDE_BOXES());
    dispatch(PoSlice.TOGGLE_SHOW_PRODUCT_BOXES(""));
  };
  useDivBoxCloser(
    [open_sup_list_ref, open_logistics_list_ref, open_prod_lists],
    [closeFunction]
  );

  //select supplier and logistics : CLICK

  const handleSelectSupNlog = (name, value) => {
    const data = { name, value };
    dispatch(PoSlice.HIDE_BOXES());
    dispatch(PoSlice.UPDATE_FORM_DATA(data));
  };
  const axiosPrivate = useAxiosPrivate()
  //filter suppliers and logistics
  const handleSupLogFilter = (event) => {
    if (!state.supplierNames || !state.logisticsNames) {
      return null;
    }
    const { name, value } = event.target;

    const mapping = {
      trade_name: {
        targetArray: "supplierNames",
        filterArray: "filteredSupplier",
      },
      logistics_name: {
        targetArray: "logisticsNames",
        filterArray: "filteredLogistics",
      },
    };
    const { targetArray, filterArray } = mapping[name];

    const filteredData = state[targetArray].filter((ele) => {
      return ele && ele.toLowerCase().includes(value.toLowerCase());
    });

    const data = {
      name: filterArray,
      filteredData,
    };
    // console.log(data);
    dispatch(PoSlice.UPDATE_FORM_DATA(event.target));
    dispatch(PoSlice.FILTER_SUP_OR_LOGISTICS(data));
  };
  //add notes
  const handleAddNotes = (event, index) => {
    const { value } = event.target;
    const noteData = {
      [`note${index + 1}`]: value,
    };
    const updatedNotes = [...state.notesArray];
    updatedNotes[index] = noteData;
    dispatch(PoSlice.ADD_NOTES(updatedNotes));
  };
  //click input to show products based on supplier
  const handleDisplayProducts = async (index) => {
    const data = {
      query: "",
      trade_name: state?.formData?.trade_name,
    };

    dispatch(PoSlice.TOGGLE_SHOW_PRODUCT_BOXES(index));
    dispatch(PoSlice.SET_PRODUCTS_FOR_SELECTED_SUPPLIER([]));

    try {
      const response = await axiosPrivate.post(
        // `${prismaBaseApi}/product/productlist`,
        `/product/productlist`,
        data
      );
      const prodNamesArr = response.data;
      console.log(response);
      console.log(data);
      console.log(prodNamesArr);
      dispatch(PoSlice.SET_PRODUCTS_FOR_SELECTED_SUPPLIER(prodNamesArr));
    } catch (error) {
      console.error("error fetching products", error);
    }
  };
  // type to filter products
  const handleChangeProdName = (event, index) => {
    setDraftData([]);
    const updatedProductTableArr = [...state.productTableArr];
    updatedProductTableArr[index] = {
      ...updatedProductTableArr[index],
      prod_name: event.target.value,
    };
    dispatch(PoSlice.UPDATE_PRODUCT_TABLE_ARRAY(updatedProductTableArr));
    const query = event.target.value.toLowerCase();
    const filteredData = state.productsForSelectedSupplierArr.filter(
      (ele) => ele && (ele.product_name.toLowerCase().includes(query) || ele.product_code.toLowerCase().includes(query))
    );
    const remainingData = state.productsForSelectedSupplierArr.filter(
      (ele) => ele && !(ele.product_name.toLowerCase().includes(query) || ele.product_code.toLowerCase().includes(query))
    );
    const sortedProductsArray = [...filteredData, ...remainingData];
    dispatch(PoSlice.SET_PRODUCTS_FOR_SELECTED_SUPPLIER(sortedProductsArray));
  };
  //click to get prod details
  const handleSelectProduct = async (product_id, index, product) => {
    console.log("prod id", product_id, index, product);

    //Show The Box
    dispatch(PoSlice.TOGGLE_SHOW_PRODUCT_BOXES(""));

    //get clicked product details and update table
    const item = { type: "detail", product_id: product_id };
    try {
      const response = await axiosPrivate.post(
        `/product/proddetails`,
        item
      );
      console.log(response);
      const productDetails = response.data;
      const { color_family, manufacturer_code, no_of_items, product_id } =
        productDetails;
      const p_package = productDetails.package;
      const updatedProductTableArr = [...state.productTableArr];
      updatedProductTableArr[index] = {
        ...updatedProductTableArr[index],
        prod_name: product,
        color_family,
        manufacturer_code,
        p_package,
        no_of_items,
        product_id,
      };
      dispatch(PoSlice.UPDATE_PRODUCT_TABLE_ARRAY(updatedProductTableArr));
    } catch (error) {
      console.error("error fetching product details", error);
    }
  };

  const handleChangeQtyOrAmt = (event, index) => {
    const { name, value } = event.target;

    if (name === "qty") {
      const updatedProductTableArr = [...state.productTableArr];
      const no_of_items = state.productTableArr[index].no_of_items;
      let val = parseInt(value);
      const pieces = val * no_of_items;
      updatedProductTableArr[index] = {
        ...updatedProductTableArr[index],
        [name]: pieces,
        enter_qty: value,
      };
      dispatch(PoSlice.UPDATE_PRODUCT_TABLE_ARRAY(updatedProductTableArr));
    } else {
      const updatedProductTableArr = [...state.productTableArr];
      updatedProductTableArr[index] = {
        ...updatedProductTableArr[index],
        [name]: value,
      };
      dispatch(PoSlice.UPDATE_PRODUCT_TABLE_ARRAY(updatedProductTableArr));
    }
    if (draftData) {
      setCanTotUpdate(true);
    }
  };
  const handleProdPricingUnit = (event, index) => {
    const { name, value } = event.target;
    console.log(value);
    const updatedProductTableArr = [...state.productTableArr];
    updatedProductTableArr[index] = {
      ...updatedProductTableArr[index],
      [name]: value,
    };
    dispatch(PoSlice.UPDATE_PRODUCT_TABLE_ARRAY(updatedProductTableArr));
    if (draftData) {
      setCanTotUpdate(true);
    }
  };
  //add extra product table rows
  const handleAddExtraProductRow = () => {
    const updatedProductTableArr = [...state.productTableArr];
    const isAnyRowEmpty = updatedProductTableArr.some((dta) => !dta.product_id)
    if (!isAnyRowEmpty) {
      updatedProductTableArr.push({});
      dispatch(PoSlice.UPDATE_PRODUCT_TABLE_ARRAY(updatedProductTableArr));

    } else {
      alert("Add product in previous rows")
    }
  };

  useEffect(() => {
    if (!draftData || draftData === null || draftData.length === 0) {
      let total = 0;
      state?.productTableArr?.forEach((ele) => {
        const qty = parseInt(ele?.enter_qty);
        const amt = parseInt(ele?.amt);
        const unit = parseInt(ele?.no_of_items);
        if (!isNaN(qty) && !isNaN(amt)) {
          if (ele.pricing_unit === "Bundle") {
            total += qty * amt;
          } else {
            total += unit * qty * amt;
          }
        }
      });
      dispatch(PoSlice.UPDATE_TOTAL(total));
    } else if (canTotUpdate) {
      let total = 0;
      state.productTableArr.forEach((ele) => {
        const qty = parseInt(ele?.enter_qty);
        const amt = parseInt(ele?.amt);
        const unit = parseInt(ele?.no_of_items);
        if (!isNaN(qty) && !isNaN(amt)) {
          if (ele.pricing_unit === "Bundle") {
            total += qty * amt;
          } else {
            total += unit * qty * amt;
          }
        }
      });
      dispatch(PoSlice.UPDATE_TOTAL(total));
    }
  }, [state.productTableArr, canTotUpdate]);
  const deleteProdConfirmation = (index) => {
    setIsIndexForRemoveProd(index);
    setIsProductDeleteConfirmationModalOpen(true);
  };
  //delete product row with its data------------
  const handleDeleteProductRowData = (index) => {
    // alert(index)
    let updatedProductTableArr = [...state.productTableArr];
    if (index > 2) {

      updatedProductTableArr.splice(index, 1);

    } else {
      // updatedProductTableArr[index] = {}
      for (let i = 0; i < updatedProductTableArr.length; i++) {
        if (i >= index) {
          if (updatedProductTableArr[i + 1]) {
            updatedProductTableArr[i] = updatedProductTableArr[i + 1];
          } else {


            updatedProductTableArr[i] = {}
          }
        }

      }

      //    arrr= updatedProductTableArr.filter((dta,index)=>index>2&&dta.product_id)
      // updatedProductTableArr.push(arr)
      // updatedProductTableArr[index] = updatedProductTableArr[index+1];
      // updatedProductTableArr[index+1] = {};
    }

    dispatch(PoSlice.UPDATE_PRODUCT_TABLE_ARRAY(updatedProductTableArr));
  };
  const handleSendFormData = async (poStatus) => {
    if (state.formData.trade_name) {
      const form = state.formData;

      const noteArray = state.notesArray;
      const mergedObject = noteArray.reduce((acc, obj) => {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            acc[key] = obj[key];
          }
        }
        return acc;
      }, {});

      let products = state.productTableArr;
      if (draftData) {
        products = products
          .map((ele) => {
            if (ele.amt && ele.prod_name) {
              return {
                amt: ele.amt,
                prod_name: ele.prod_name,
                qty: ele.qty,
                prod_id: ele.product_id,
                pricing_unit: ele.pricing_unit,
              };
            }
            return null; // Skip the element by returning null if amt or prod_name is empty
          })
          .filter(Boolean); // Filter out the null elements from the array
      } else {
        products = products
          .map((ele) => {
            if (ele.amt && ele.prod_name) {
              return {
                amt: ele.amt,
                prod_name: ele.prod_name,
                qty: ele.qty,
                prod_id: ele.product_id,
                pricing_unit: ele.pricing_unit,
              };
            }
            return null; // Skip the element by returning null if amt or prod_name is empty
          })
          .filter(Boolean); // Filter out the null elements from the array
      }

      const total = state.totalAmount;
      console.log(total);
      const doclink = links ? links[0] : "";
      setOpen(true);
      const postatus = poStatus === "placed" ? "placed" : "draft";
      const user = "admin1";
      const remarks = "no remarks";

      const dta = {
        trade_name: form.trade_name,
        logistics_name: form.logistics_name,
        notes: mergedObject,
        doclink,
        remarks,
        total,
        products,
        postatus,
        user,
      };
      console.log("dtaa", dta);
      const po_number = draftData?.po_num;
      console.log("po_number", po_number);
      if (dta.products.length > 0 && dta.trade_name) {
        try {
          const data = {
            trade_name: form.trade_name,
            logistics_name: form.logistics_name,
            notes: mergedObject,
            doclink,
            remarks,
            total,
            products,
            postatus,
            user,
            po_number,
          };
          // const data = { dta: dta, po_number: po_number };
          console.log("jjjj =>", data);
          if (po_number === undefined) {
            const formData = new FormData();

            selectedFiles.forEach((image, index) => {
              formData.append("image", image);
            });
            formData.append("data", JSON.stringify(dta));
            console.log("last updated form>>", formData);
            const response = await axiosPrivate.post(
              `/purchase/newpurchase`,
              formData
            );
            console.log("responseresponse", response);
            const toastText =
              poStatus === "placed"
                ? ` po ${response?.data} placed successfully`
                : ` po ${response?.data} saved as draft`;
            toast.success(toastText, { autoClose: 2000 });
            dispatch(PoSlice.RESET_STATE());
            setDraftData(null);
            setSelectedFile([]);
            setIndex(-1);
            setFolder(false);
            setOpen(false);

            setTimeout(function () {
              navigate("/purchaseorders");
            }, 2100);
          } else {
            // alert("hola defined");
            const response = await axiosPrivate.post(
              `/purchase/update_po`,
              data
            );
            // console.log(response);
            const toastText =
              poStatus === "placed"
                ? ` po ${response?.data} placed successfully`
                : ` po ${response?.data} saved as draft`;
            toast.success(toastText, { autoClose: 2000 });
            dispatch(PoSlice.RESET_STATE());
            setDraftData(null);
            setSelectedFile([]);
            setIndex(-1);
            setFolder(false);
            setOpen(false);

            setTimeout(function () {
              navigate("/purchaseorders");
            }, 2100); // (2.1 seconds)
          }
          // }
        } catch (error) {
          console.log("Api error>>>>>", error);
        }
      }
    }
  };
  const handleShowNewLogistics = () => {
    dispatch(PoSlice.SHOW_NEW_LOGISTICS(!state.showNewLogistics));
    dispatch(PoSlice.CLEAR_NEW_LOGISTICS());
  };
  const handleNewLogisticsChange = (event) => {
    const { name, value } = event.target;
    // console.log(name, value);
    dispatch(PoSlice.NEW_LOGISTICS({ name, value }));
  };

  const handleAddNewLogistics = async () => {
    if (
      state?.newLogistics?.name?.length > 0 &&
      state?.newLogistics?.address?.length > 0
    ) {
      try {
        const updatedLogistics = { ...state.newLogistics };
        updatedLogistics.type = "add";
        updatedLogistics.user = "admin1";
        // console.log(updatedLogistics);
        const response = await axiosPrivate.post(
          `/logistics/managelogistics`,
          updatedLogistics
        );
        if (response.status === 201) {
          toast.success(response.data);
          handleShowNewLogistics();
        }
        // console.log(response);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleAddProductWindow = (isShow) => {
    setShowNewProdWindow(isShow);
  };

  const handleFileChange = (event) => {
    // const fileList = event.target.files;
    // const newFiles = Array.from(fileList);
    // setSelectedFile(newFiles);
    // setFolder(true);
    // setUpload(true);
    // setIndex(0);
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setSelectedFiles([...selectedFiles, selectedFile])
  };
  // console.log(links);

  //////////////////////////

  const handleClose = () => {
    setOpen(false);
  };

  const closeNewProdWindow = () => {
    setShowNewProdWindow(false);
  };
  console.log("state===>", state.productsForSelectedSupplierArr);
  return (
    <div className="purchase-container">
      <div className="row">
        <div style={{ padding: 0 }} className="col-xl-12 col-md-12">
          <div style={{ paddingBottom: "1rem" }} className="row"></div>
          <div className="row purchase-row-sec p-2 m-2">
            <div className="col-sm-7">
              <div
                className="mb-1 mt-1 row"
                style={{ display: "flex", justifyContent: "space-around" }}
              >
                <div className="slct-supplier">
                  <label
                    htmlFor="tradeNumber"
                    className=" col-form-label"
                    style={{ fontSize: "12px" }}
                  >
                    <b> Supplier</b>
                  </label>
                  <div>
                    <input
                      autoComplete="off"
                      type="text"
                      name="trade_name"
                      className="form-control purchase-form__form-control"
                      id="purchase-form__form-control"
                      placeholder="Enter a value"
                      style={{ width: "200px" }}
                      value={state?.formData?.trade_name ?? ""}
                      onChange={handleSupLogFilter}
                      onClick={() => {
                        dispatch(PoSlice.SHOW_SUPPLIER_NAMES());
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          dispatch(PoSlice.SHOW_SUPPLIER_NAMES());
                        }
                      }}

                    />

                    {state?.showSupplierNames && (
                      <div
                        className="log-supp-dropdown-scrollbar2"
                        // id="style-2"
                        ref={open_sup_list_ref}
                        tabIndex={-1}
                      >
                        {(state?.filteredSupplier.length > 0
                          ? state?.filteredSupplier
                          : state?.supplierNames
                        ).map((value, index) =>
                          value !== null || "" ? (
                            <div
                              tabIndex={0}
                              key={index}
                              className="dropdown_map"
                              style={{ fontSize: "12px", textAlign: "left" }}
                              onClick={() =>

                                handleSelectSupNlog("trade_name", value)
                              }
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                  handleSelectSupNlog("trade_name", value);
                                }
                              }}
                            >
                              {value}
                            </div>
                          ) : null
                        )}
                        <div
                          className="dropdown_map"
                          style={{ fontSize: "14px", color: "blue" }}
                          onClick={() =>
                            navigate("/register_new", { state: "sup" })
                          }
                        >
                          New Supplier
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className=" slct-supplier">
                  <label
                    htmlFor="tradeNumber"
                    className=" col-form-label"
                    style={{ fontSize: "12px" }}
                  >
                    <b>Logistics</b>
                  </label>
                  <div style={{ marginLeft: "10%" }}>
                    <input
                      autoComplete="off"
                      type="text"
                      name="logistics_name"
                      className="form-control purchase-form__form-control"
                      id="purchase-form__form-control"
                      placeholder="Enter a value"
                      style={{ width: "200px" }}
                      value={state?.formData?.logistics_name ?? ""}
                      onChange={handleSupLogFilter}
                      onClick={() => {
                        dispatch(PoSlice.SHOW_LOGISTICS_NAMES());
                      }}
                      onFocus={() => {
                        dispatch(PoSlice.SHOW_LOGISTICS_NAMES());
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          dispatch(PoSlice.SHOW_LOGISTICS_NAMES());
                        }
                      }}
                    />
                    {state.showLogisticsNames && (
                      <div
                        tabIndex={-1}
                        ref={open_logistics_list_ref}
                        className="log-supp-dropdown-scrollbar2"
                      // id="style-2"
                      >
                        {(state?.filteredLogistics.length > 0
                          ? state?.filteredLogistics
                          : state?.logisticsNames
                        ).map((value, index) => (
                          <div
                            tabIndex={0}
                            key={index}
                            className="dropdown_map"
                            style={{ fontSize: "12px", textAlign: "left" }}
                            onClick={() =>
                              handleSelectSupNlog("logistics_name", value)
                            }
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                handleSelectSupNlog("logistics_name", value)
                              }
                            }}
                          >
                            {value}
                          </div>
                        ))}
                        <div
                          className="dropdown_map"
                          onClick={handleShowNewLogistics}
                          style={{ fontSize: "14px", color: "blue" }}
                        >
                          New logistics
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "row" }}
              className=" col-sm-5"
            >
              <div
                className=""
                style={{
                  flex: 2,
                  flexDirection: "row",
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    borderRadius: "5px",
                    width: "250px",
                    overflowX: "hidden",
                  }}
                  className="purchase-scrollbar"
                  id="style-2"
                >
                  <div
                    className="force-overflow text-left"
                    style={{ flex: 2 }}
                  >
                    {selectedFile?.map((file, index) => (
                      <>
                        <div className="row">
                          <span
                            style={{
                              fontSize: "12px",
                              paddingLeft: "1.5rem",
                            }}
                          >
                            {index + 1} -: {file?.name}
                          </span>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
                <div className="">
                  <label
                    htmlFor="file-input"
                    style={{
                      // marginRight: "200px",
                      cursor: "pointer",
                      border: "1px solid gray",
                      borderRadius: "5px",
                      fontSize: "12px",
                    }}
                  >
                    <AttachFile />
                    Add{" "}
                  </label>
                  <input
                    type="file"
                    id="file-input"
                    onChange={handleFileChange}
                    multiple
                    style={{ display: "none" }}
                  />
                </div>
              </div>
              <div style={{ flex: 1 }}></div>
            </div>
          </div>

          <div
            className="mt-2"
            style={{ border: "2px solid #E0E9FF", borderRadius: "10px" }}
          >
            <div className="scroll" id="style-2" style={{ height: "400px" }}>
              {/* <table className="table  table-borderless purchase-table ">
              <thead className="purchase-table-thead table-head 
              "> */}
              <table className="table table-container table-borderless landscape">
                <thead className="table-head purchase-table-the">
                  <tr>
                    <th style={{ padding: "1px", fontSize: "12px" }}>
                      Sl No
                    </th>
                    <th style={{ width: "18%", fontSize: "12px" }}>
                      Product
                    </th>

                    <th style={{ width: "8%", fontSize: "12px" }}>Color</th>
                    <th style={{ fontSize: "12px" }}>Manf.code</th>
                    <th style={{ fontSize: "12px" }}>Instock</th>
                    {/* <th style={{ width: "8%", fontSize: "12px" }}>packing</th> */}
                    <th style={{ width: "15%", fontSize: "12px" }}>Qty</th>
                    <th style={{ width: "8%", fontSize: "12px" }}>Pieces</th>
                    <th style={{ width: "15%", fontSize: "12px" }}>Rate/Piece</th>
                    {/* <th style={{ padding: "1px", fontSize: "12px" }}>
                      Pricing unit
                    </th> */}
                    <th style={{ padding: "1px", fontSize: "12px" }}>
                      Net Amt
                    </th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  <tr style={{ border: "1px solid grey" }}></tr>
                  {state?.productTableArr?.map((value, index) => (
                    <tr key={index}>
                      <th scope="row" style={{ fontSize: "12px" }}>
                        {index + 1}
                      </th>

                      <td>
                        <div style={{ height: "2vh" }}>
                          <div>
                            {state?.formData.trade_name ? (
                              <input
                                autoComplete="off"
                                type="text"
                                className="form-control purchase-form__form-control "
                                id="purchase-form__form-control"
                                placeholder="Enter Product"
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                    handleDisplayProducts(index)
                                  }
                                }}
                                onFocus={() => handleDisplayProducts(index)}
                                onClick={() => handleDisplayProducts(index)}
                                onChange={(event) => {
                                  handleChangeProdName(event, index);
                                }}
                                value={value?.prod_name ?? ""}
                              />
                            ) : (
                              <input
                                className="form-control purchase-form__form-control "
                                id="purchase-form__form-control"
                                placeholder="Enter Product"
                                onClick={() =>
                                  alert("select a supplier to continue")
                                }
                                readOnly
                                style={{ background: "#e0e9ff" }}
                              />
                            )}

                            {state.productsForSelectedSupplierArr.length >
                              0 && index === state?.showProductNamesBox ? (
                              <div
                                tabIndex={-1}
                                ref={open_prod_lists}
                                className="purchase-dropdown-scrollbar"
                              >
                                <div id="create_po_table_align2">
                                  <div
                                    style={{
                                      borderBottom: "1px solid black",
                                      zIndex: "100",
                                      paddingTop: "5px"
                                    }}
                                    className="create_po_table_align"
                                  >
                                    <div className="create_po_column1">
                                      <p
                                        style={{
                                          fontSize: "0.7rem",
                                          textAlign: "center",
                                        }}
                                      >
                                        Name
                                      </p>
                                    </div>
                                    <div className="create_po_column_code">
                                      <p
                                        style={{
                                          fontSize: "0.7rem",
                                          textAlign: "center",
                                        }}
                                      >
                                        Product Code
                                      </p>
                                    </div>
                                    <div className="create_po_column2">
                                      <p
                                        style={{
                                          fontSize: "0.7rem",
                                          textAlign: "center",
                                        }}
                                      >
                                        Color
                                      </p>
                                    </div>
                                    <div className="create_po_column3">
                                      <p
                                        style={{
                                          fontSize: "0.7rem",
                                          textAlign: "center",
                                        }}
                                      >
                                        Qty
                                      </p>
                                    </div>
                                    <div className="create_po_column3">
                                      <p
                                        style={{
                                          fontSize: "0.7rem",
                                          textAlign: "center",
                                        }}
                                      >
                                        Stock status
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <br />
                                {state.productsForSelectedSupplierArr
                                  .filter((value) => {
                                    const isMatch =
                                      state.productTableArr.some(
                                        (item) =>
                                          value.prod_id === item.product_id
                                      );
                                    return !isMatch;
                                  })
                                  .map((value) => (
                                    <>
                                      <div
                                        tabIndex={0}
                                        className="cpo_prod_row"
                                        onKeyDown={(event) => {
                                          if (event.key === 'Enter') {
                                            handleSelectProduct(
                                              value.prod_id,
                                              index,
                                              value.product_name
                                            );
                                          }
                                        }}
                                        onClick={() => {
                                          handleSelectProduct(
                                            value.prod_id,
                                            index,
                                            value.product_name
                                          );
                                        }}
                                      >
                                        <div className="cpo_prod_col1">
                                          <p
                                            style={{
                                              fontSize: "0.7rem",
                                              textAlign: "start",
                                            }}
                                          >
                                            {value.product_name}
                                          </p>
                                        </div>
                                        <div className="cpo_prod_col2">
                                          <p
                                            style={{
                                              fontSize: "0.7rem",
                                              textAlign: "start",
                                            }}
                                          >
                                            {value?.product_code}
                                          </p>
                                        </div>
                                        <div className="cpo_prod_col3">
                                          <div
                                            style={{
                                              width: "20px",
                                              height: "20px",
                                              backgroundColor: `${value.color_family}`,
                                              borderRadius: "15px",
                                            }}
                                          ></div>
                                        </div>
                                        <div className="cpo_prod_col4">
                                          <span
                                            style={{
                                              fontSize: "0.7rem",

                                            }}
                                          >
                                            {value?.total_quantity}
                                          </span>
                                        </div>
                                        <div className="cpo_prod_col5">
                                          <span
                                            style={{
                                              fontSize: "0.7rem",

                                            }}
                                          >
                                            {value?.stock_status ===
                                              "instock" ? (
                                              <CheckCircleOutline
                                                style={{
                                                  color: "#22c55e",
                                                  cursor: "pointer",
                                                }}
                                                titleAccess="Instock"
                                              />
                                            ) : (
                                              <HighlightOff
                                                style={{
                                                  color: "#ef4444",
                                                  cursor: "pointer",
                                                }}
                                                titleAccess="Out of stock"
                                              />
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                      <Divider />
                                    </>
                                  ))}

                                <div
                                  style={{ fontSize: "12px" }}
                                  className="dropdown_map"
                                  onClick={() => handleAddProductWindow(true)}
                                >
                                  New Product
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            borderRadius: "5px",
                            backgroundColor: value?.color_family,
                            height: "25px",
                            width: "25px",
                            border: "1px solid gray",
                          }}
                        ></div>
                      </td>

                      <td style={{ fontSize: "12px" }}>
                        {value?.manufacturer_code || value?.mfgcode}
                      </td>
                      <td style={{ fontSize: "12px" }}>{value?.instoke}</td>
                      {/* <td style={{ fontSize: "12px" }}>{value?.p_package}</td> */}
                      <td>
                        {state?.productTableArr[index]?.prod_name ? (
                          <input
                            className="form-control purchase-form__form-control"
                            id="purchase-form__form-control"
                            type="number"
                            name="qty"
                            min={0}
                            value={value?.enter_qty ?? ""} //changed to pieces so not displaying
                            onChange={(event) => {
                              handleChangeQtyOrAmt(event, index);
                            }}
                            style={{ textAlign: "center" }}
                          />
                        ) : (
                          <input
                            min={0}
                            className="form-control purchase-form__form-control"
                            id="purchase-form__form-control"
                            disabled
                            value=""
                            style={{ background: "#e0e9ff" }}
                          />
                        )}
                      </td>
                      <td style={{ fontSize: "12px" }}>
                        {value?.no_of_items}
                        {value?.no_of_items && value?.p_package ? "/" : ""}
                        {value?.p_package}
                      </td>
                      <td>
                        {state?.productTableArr[index]?.prod_name ? (
                          <input
                            className="form-control purchase-form__form-control"
                            id="purchase-form__form-control"
                            type="number"
                            name="amt"
                            min={0}
                            value={value?.amt ?? value?.rate}
                            onChange={(event) =>
                              handleChangeQtyOrAmt(event, index)
                            }
                            style={{ textAlign: "center" }}
                          />
                        ) : (
                          <input
                            className="form-control purchase-form__form-control"
                            id="purchase-form__form-control"
                            disabled
                            value=""
                            style={{ background: "#e0e9ff" }}
                          />
                        )}
                      </td>
                      {/* <td>
                        <select
                          onChange={(event) =>
                            handleProdPricingUnit(event, index)
                          }
                          value={value.pricing_unit ?? ""}
                          className="form-control purchase-form__form-control"
                          id="purchase-form__form-control"
                          type="number"
                          name="pricing_unit"
                          style={{ height: "29px" }}
                        >
                          <option disabled></option>
                          <option>Bundle</option>
                          <option>Pieces</option>
                        </select>
                      </td> */}

                      <td style={{ fontSize: "12px" }}>
                        {value.pricing_unit === "Bundle"
                          ? value.enter_qty && value.amt
                            ? value.enter_qty * value.amt
                            : 0
                          : value.enter_qty && value.amt
                            ? value.no_of_items * value.enter_qty * value.amt
                            : 0}
                      </td>
                      <td>
                        <Delete
                          onClick={() => deleteProdConfirmation(index)}
                          // onClick={() => handleDeleteProductRowData(index)}
                          style={{ cursor: "pointer" }}
                          id="delete"
                        ></Delete>
                      </td>
                    </tr>
                  ))}
                  {state?.productTableArr?.length < 100 && (
                    <tr>
                      <td onClick={handleAddExtraProductRow}>
                        <IconButton>
                          <Add style={{ cursor: "pointer" }} />
                        </IconButton>
                      </td>
                    </tr>
                  )}

                  {/* <tr style={{ border: "1px solid grey" }}></tr> */}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <span className="purchase-grand-total">
              Grand total :{state.totalAmount}
            </span>
            <span style={{ fontSize: "12px" }}></span>
          </div>
          <div className="row">
            <div className="col-sm-1" style={{ fontSize: "12px" }}>
              Note
            </div>

            <div className="col-sm-10">
              {state?.notesArray?.map((value, index) => (
                <div key={index} className="row mt-3">
                  <div className=" col-sm-1">
                    <label className="label" style={{ fontSize: "12px" }}>
                      {index + 1}
                    </label>
                  </div>
                  <div className=" col-sm-5">
                    <input
                      type="text"
                      className=" form-control purchase-form__form-control"
                      name={`note${index + 1}`}
                      onChange={(event) => handleAddNotes(event, index)}
                      value={value[`note${index + 1}`] ?? ""}
                    />
                  </div>
                  {index === state.notesArray.length - 1 &&
                    state.notesArray.length < 3 && (
                      <div style={{ marginTop: "-7px" }}>
                        <IconButton
                          onClick={() => {
                            dispatch(PoSlice.EXTRA_NOTE());
                          }}
                        >
                          <Add style={{ cursor: "pointer" }} />
                        </IconButton>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
          <div className="container">
            <div className="row purchase-btnns container mt-3">
              <button
                className="purchase-btnns-close"
                id="purchase-btnns"
                style={{ fontSize: "12px" }}
                onClick={() => navigate("/purchaseorders")}
              >
                Close
              </button>
              {/* {conform === false ? ( */}

              <button
                className="purchase-btnns-draft"
                id="purchase-btnns"
                style={{ fontSize: "12px" }}
                onClick={() => handleSendFormData("draft")}
              >
                Save as draft
              </button>

              {/* )} */}
              <button
                disabled={open}
                style={{ fontSize: "12px" }}
                className="purchase-btnns-confirm "
                id="purchase-btn"
                onClick={() => handleSendFormData("placed")}
              >
                Confirm
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={open}
                // onClick={handleClose}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              </button>
            </div>
          </div>

          <Newproduct
            show={showNewProdWindow}
            handleClose={setShowNewProdWindow}
            supplier={state.formData.trade_name}
            closeWindow={closeNewProdWindow}
          />
          <ToastContainer>
            position="top-right" autoClose={500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
          </ToastContainer>

          <Modal
            open={state.showNewLogistics}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div
              style={{
                backgroundColor: "#E1FFCF",
                width: "30%",
                padding: "16px",
                marginLeft: "37%",
                marginTop: "15%",
                borderRadius: "2%",
              }}
            >
              <p style={{ fontSize: "18px", fontWeight: "600" }}>
                New Transporter{" "}
                <KeyboardBackspace
                  onClick={handleShowNewLogistics}
                  style={{
                    marginLeft: "80%",
                    fontSize: "30px",
                    backgroundColor: "#DB8300",
                    color: "#E1FFCF",
                    borderRadius: "50px",
                    marginTop: "-15%",
                    cursor: "pointer",
                  }}
                />
              </p>
              <table>
                <tr>
                  <td>
                    <label htmlFor="">Trade name <h6 style={{ color: "red", display: "inline" }}>*</h6> : </label>
                  </td>
                  <td>
                    <input
                      onChange={handleNewLogisticsChange}
                      type="text"
                      name="name"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="">Address <h6 style={{ color: "red", display: "inline" }}>*</h6> :</label>
                  </td>
                  <td>
                    <textarea
                      id="address"
                      name="address"
                      rows="4"
                      onChange={handleNewLogisticsChange}
                    ></textarea>
                  </td>
                </tr>

                <tr>
                  <td>
                    <label htmlFor="">Contact number : </label>
                  </td>
                  <td>
                    <input
                      onChange={handleNewLogisticsChange}
                      type="number"
                      name="contact_no"
                      min={0}
                    />
                  </td>
                </tr>
              </table>
              <button
                type="button"
                onClick={handleAddNewLogistics}
                className="btn btn-success"
              >
                Submit
              </button>
            </div>
          </Modal>
        </div>
      </div>
      <Modal
        open={isProductDeleteConfirmationModalOpen}
        close={() => setIsProductDeleteConfirmationModalOpen(false)}
      >
        <div className="po_DltProdModalContainer">
          <div style={{ textAlign: "center" }}>
            <span>Are you sure?</span>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}
          >
            <button
              onClick={() => {
                handleDeleteProductRowData(indexForRemoveProd);
                setIsProductDeleteConfirmationModalOpen(false);
              }}
            >
              Yes
            </button>
            <button
              onClick={() => setIsProductDeleteConfirmationModalOpen(false)}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
