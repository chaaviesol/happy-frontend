import { React, useContext, useState, useEffect, useRef } from "react";
import { Row, Col, Form, FormControl } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Newtopbar_ from "../../../../components/admin components/Newtopbar_";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import {
  AddCircleOutline,
  AttachFileOutlined,
  CurrencyRupeeSharp,
  Download,
  Edit,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classNames from "classnames";
import "./goodsReceipt.css";
import { MyContext } from "../../../../Contexts/Contexts";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { Handling } from "./Handling";

export default function GoodsReceipt() {
  const { data, isHidden } = useContext(MyContext);
  const [form, setForm] = useState({ po_num: data?.po_num });
  const [productsData, setProductsData] = useState({
    received: data?.products,
    po: data?.po_num,
    type: "bikes",
    user: "2",
    isHidden: isHidden ? true : false,
  });
  const [validateerror, setvalidateerror] = useState(" ");
  const [selecteddate, setselecteddate] = useState(new Date());
  const [isHandleOpen, setIsHandleOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subCosts, setSubCosts] = useState([{ costName: "", cost: "", id: 1 }]);
  const axiosPrivate = useAxiosPrivate();
  const receivedUnitRef = useRef([]);
  const pendingRef = useRef([]);
  const logisticsRef = useRef(null);
  const navigate = useNavigate();
  const toastConfig = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
  console.log("data", data);
  console.log("productsData===", productsData);

  useEffect(() => {
    if (!data) {
      navi();
    }
  }, []);

  const handleCheckLr = () => {
    if (!productsData.lr_num || productsData.lr_num.length < 1) {
      setvalidateerror("LR number is required.");
    } else {
      setvalidateerror("");
    }
  };

  useEffect(() => {
    logisticsRef.current.focus();
    handleCheckLr();
  }, []);




  const navi = () => {
    navigate("/purchaseorders");
  };

  console.log(">>>>>State", productsData);

  //saving and updating values from the state
  const handleProducts = (event, index) => {
    const { name, value } = event.target;
    let clonedProductData = { ...productsData };
    switch (name) {
      case "received":
        if (!productsData.received[index].pricing_unit) {
          alert("select pricing unit");
        } else {
          console.log({ productsData });
          handleReceived(clonedProductData, value, index, event);
        }

        break;
      case "mrp":
      case "rate":
      case "invoice_amt":
        clonedProductData.received[index][name] = parseInt(value);
        break;
      case "pricing_unit":
        clonedProductData.received[index][name] = value;
        handlePending(value, clonedProductData, index); //change pending qty according to the selected pricing_unit
        break;
      default:
        clonedProductData[name] = value;
    }
    setProductsData(clonedProductData);
  };
  const handleReceived = (clonedProductData, value, index, event) => {
    let intValue = parseInt(value);
    if (value == "") {
      intValue = 0;
    }

    handleReceivedUpdates(clonedProductData, intValue, index, event);
  };
  const handleReceivedUpdates = (clonedProductData, intValue, index, event) => {
    const receivedItem = clonedProductData.received[index];
    const currQty = clonedProductData.received[index].received_qty;
    //
    if (!receivedItem) {
      return;
    }
    //
    receivedItem.received_qty = intValue;

    //
    const dbPendingQty = parseInt(receivedItem?.balance_qty);
    const pricing_unit = receivedItem?.pricing_unit;
    if (pricing_unit === "Bundle") {
      const pieces = receivedItem?.no_of_items;
      const recQtyBasedPcs = intValue * pieces;
      const pending_qty = dbPendingQty - recQtyBasedPcs;
      if (recQtyBasedPcs > dbPendingQty) {
        alert("cannot exceed pendingQty");
        event.target.value = "";
        receivedItem.received_qty = currQty;
        receivedItem.pending_qty = receivedItem.pending_qty;
      } else if (recQtyBasedPcs === dbPendingQty) {
        receivedItem.pending_qty = pending_qty;
      } else {
        receivedItem.pending_qty = pending_qty || dbPendingQty;
      }
    } else if (pricing_unit === "Pieces") {
      const pieces = receivedItem?.qty;
      const pending_qty = dbPendingQty - intValue;
      if (intValue > dbPendingQty) {
        event.target.value = "";
        receivedItem.received_qty = currQty;
        receivedItem.pending_qty = receivedItem.pending_qty;
        alert("cannot exceed pendingQty");
      } else if (intValue === dbPendingQty) {
        receivedItem.pending_qty = pending_qty;
      } else if (pending_qty) {
        receivedItem.pending_qty = pending_qty;
      }
    }
  };
  const handlePending = (value, clonedProductData, index) => {
    const receivedItem = clonedProductData.received[index];
    const dbPendingQty = receivedItem?.balance_qty;
    const receivedQty = receivedItem.received_qty;

    if (value === "Bundle") {
      const ordered_pcs = receivedItem?.qty;
      const pieces = receivedItem?.no_of_items;
      const recQtyBasedPcs = receivedQty * pieces;
      const pending_qty = dbPendingQty - recQtyBasedPcs;
      if (recQtyBasedPcs > dbPendingQty) {
        alert("cannot exceed pendingQty");
        receivedItem.received_qty = 0;
        receivedItem.pending_qty = dbPendingQty;
      } else if (recQtyBasedPcs === dbPendingQty) {
        receivedItem.pending_qty = pending_qty;
      } else {
        receivedItem.pending_qty = pending_qty || dbPendingQty;
      }
    } else if (value === "Pieces") {
      const pieces = receivedItem?.qty;
      const pending_qty = dbPendingQty - receivedQty;
      receivedItem.pending_qty = pending_qty;
    }
  };

  //deleting !required data from state and set form data For Sending

  const handleFormData = async () => {
    setIsLoading(true);
    try {
      if (await hasEmptyFieldOrZeroBalance(productsData)) {
        alert("all fields required");
        return;
      }
      const clonedProductsData =await prepareProductData(productsData);
      const response = await axiosPrivate.post(
        `/goodsreceipt`,
        clonedProductsData
      );
      console.log({ response });
      toast.success("Success! Goods receipt created.", toastConfig);
      navigate("/purchaseorders");
    } catch (err) {
      console.error("Error submitting form data:", err);
      toast.error("Failed to submit form data. Please try again.", toastConfig);
    } finally {
      setIsLoading(false);
    }
  };
  //check
  const hasEmptyFieldOrZeroBalance = (productsData) => {
    const hasEmptyFieldAndZeroBalance = productsData.received.some((item) => {
      const isAnyFieldEmpty = !item.invoice_amt || !item.mrp;
      return isAnyFieldEmpty && item.balance_qty !== 0;
    });
    return (
      hasEmptyFieldAndZeroBalance ||
      !productsData.handling_cost ||
      !productsData.logistics_cost ||
      !productsData.lr_num
    );
  };
  //prepare for api
  const prepareProductData = (productsData) => {
    const clonedProductsData = { ...productsData };
    const updatedRec = clonedProductsData.received.map((ele) => {
      if (ele.pricing_unit === "Bundle") {
        const calcQty = ele?.received_qty * ele?.no_of_items;
        ele.received_qty = calcQty;
        return {
          ...ele,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    clonedProductsData.received = updatedRec;
    return clonedProductsData;
  };

  //goodsreceipt
  const flexCenter = classNames(
    "d-flex",
    "align-items-center",
    "justify-content-center"
  );

  const handledatechange = (date) => {
  };
  const today = new Date(); // Get today's date
  today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

  //download po pdf
  const handlePdfDownload = () => {
    const po = {
      po_num: data?.po_num,
    };
    if (data.po_num) {
      navigate("/popdf", { state: po });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  // navigate to payment page
  const handlePayment = () => {
    const po = {
      po_num: data?.purchase_id,
    };
    if (data.po_num) {
      navigate("/payment", { state: po });
    }
  };
  useEffect(() => {
    if (subCosts[0]?.cost) {
      let totalCost = 0;
      subCosts.forEach((ele) => {
        if (ele.cost) {
          totalCost += parseInt(ele.cost);
        }
      });

      setProductsData({ ...productsData, handling_cost: totalCost });
    }
  }, [subCosts]);

  //show box only when enter key pressed
  const handleEnterPress = (event) => {
    if (event.keyCode === 13) {
      setIsHandleOpen(true);
    }
  };

  console.log({ subCosts });

  return (
    <div className="GoodsReceipt-container" style={{ fontFamily: "Poppins" }}
    onPointerDown={(e) => {
    // ✅ Skip clicks inside Toast container or LR input itself
    if (
      e.target.closest(".Toastify__toast-container") ||
      e.target.name === "lr_num"
    ) {
      return;
    }

    // ✅ Show warning only if LR number empty
    if (!productsData.lr_num || productsData.lr_num.trim().length < 1) {
      e.preventDefault();
      toast.warning("LR number is required!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  }}
    >
      <Row style={{ width: "100%" }}>
        <Col lg={12}>
          <div>
            <Newtopbar_ />

            <Row className=" mb-1">
              <Col md={12} xs={12} lg={12}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#00342E",
                    borderRadius: "4px",
                    color: "white",
                    height: "28px",
                    // fontSize:"13px"
                  }}
                >
                  Assign Goods Receipts
                </span>
              </Col>
            </Row>
            <Row className="p-3 mb-2 " style={{ fontSize: "13px" }}>
              <Col className="p-2" md={5}>
                <Row className="mb-5  text-left">
                  <Col md={2}>
                    <span style={{ color: "#20201F" }}>PO#:</span>
                  </Col>
                  <Col style={{ color: "#001D19" }} md={4}>
                    <span>{data ? data.po_num : ""}</span>
                  </Col>
                  <Col md={5}>
                    <span style={{ color: "#001D19" }}>
                      Po Date:{" "}
                      {moment &&
                        moment(data && data?.created_date)?.format(
                          "DD-MM-YYYY"
                        )}
                    </span>
                  </Col>
                </Row>
                <Row className="text-left">
                  <Col md={2}>
                    <span style={{ color: "#20201F" }}>Supplier:</span>
                  </Col>
                  <Col md={4}>
                    <span style={{ color: "#001D19" }}>
                      {data ? data.trade_name : ""}
                    </span>
                  </Col>
                  <Col md={5} />
                </Row>
              </Col>
              <Col md={7}>
                <Row>
                  <Col
                    className="p-3"
                    style={{ border: "1px solid grey", borderRadius: "19px" }}
                    md={10}
                  >
                    <Row className="mb-3 ">
                      <Col md={5}>
                        <Row>
                          <Col className={`${flexCenter} p-0 m-0`} md={3}>
                            <label style={{ margin: "0" }} htmlFor="">
                              DOD:
                            </label>
                          </Col>
                          <Col md={9} style={{ zIndex: "9999" }}>
                            <ReactDatePicker
                              className="form-control products-form__form-control"
                              selected={selecteddate}
                              onChange={handledatechange}
                              maxDate={today}
                            ></ReactDatePicker>
                          </Col>
                        </Row>
                      </Col>

                      <Col md={1}></Col>
                      <Col md={1}></Col>

                      <Col md={5}>
                        <Row>
                          <Col className={`${flexCenter} p-0 m-0`} md={3}>
                            <label style={{ margin: "0" }} htmlFor="">
                              Logistics
                            </label>
                          </Col>
                          <Col md={9}>
                            <div className="Gr-td">
                              <Form.Control
                                type="number"
                                ref={logisticsRef}
                                min={0}
                                onChange={handleProducts}
                                name="logistics_cost"
                                style={{ paddingLeft: "1.5rem" }}
                                className="products-form__form-control"
                              />
                              <CurrencyRupeeSharp
                                style={{ fontSize: "1rem" }}
                                className="Gr-td-iconStart"
                              />
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={5} style={{ position: "relative" }}>
                        <Row>
                          <Col className={`${flexCenter} p-0 m-0`} md={3}>
                            <label style={{ margin: "0" }} htmlFor="">
                              LR&nbsp;no:
                            </label>
                          </Col>
                          <Col md={9}>
                            <input
                              name="lr_num"
                              type="text"
                              className="form-control products-form__form-control"
                              value={productsData?.lr_num ?? ""}
                              onChange={(event) => {
                                handleProducts(event);
                                setvalidateerror("");
                              }}
                              // onBlur={handlevalidation}
                            />
                          </Col>
                        </Row>
                        {validateerror && (
                          <div
                            style={{
                              color: "red",
                              position: "absolute",
                              left: "30.5%",
                            }}
                          >
                            {validateerror}
                          </div>
                        )}
                      </Col>

                      <Col md={2} />

                      <Col md={5}>
                        <Row>
                          <Col className={`${flexCenter} p-0 m-0`} md={3}>
                            <label style={{ margin: "0" }} htmlFor="">
                              Handling
                            </label>
                          </Col>
                          <Col md={9} style={{ position: "relative" }}>
                            {isHandleOpen ? (
                              <Handling
                                close={() => {
                                  setIsHandleOpen(false);
                                  receivedUnitRef.current.focus();
                                }}
                                openBox={isHandleOpen}
                                subCosts={subCosts}
                                setSubCosts={setSubCosts}
                              />
                            ) : (
                              <div className="Gr-td">
                                <Form.Control
                                  min={0}
                                  type="number"
                                  // onChange={handleProducts}
                                  value={productsData.handling_cost ?? ""}
                                  name="handling_cost"
                                  className="products-form__form-control pl-1.5rem"
                                  style={{ paddingLeft: "1.5rem" }}
                                  onClick={() => setIsHandleOpen(true)}
                                  onKeyDown={handleEnterPress}
                                  onFocus={() => setIsHandleOpen(true)}
                                />
                                <CurrencyRupeeSharp
                                  style={{ fontSize: "1rem" }}
                                  className="Gr-td-iconStart"
                                />
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>

                  <Col className={flexCenter} md={2}>
                    <Row>
                      <Col className="p-0" xs={12} lg={12} sm={12} md={12}>
                        <div
                          title="Attach file"
                          style={{
                            cursor: "pointer",
                            border: "1px solid grey",
                            padding: ".3rem",
                            borderRadius: "5px",
                          }}
                        >
                          <AttachFileOutlined style={{ color: "#01244C" }} />
                          <span>Add</span>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* <Container> */}
            <Row>
              <Col>
                <div
                  id="style-2"
                  className="scroll"
                  style={{
                    height: "400px",
                    border: ".5px solid green",
                    borderRadius: "10px",
                    // width: "1390px",
                  }}
                >
                  <ToastContainer>
                    position="top-right" autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick rtl={false}, pauseOnFocusLoss draggable
                    pauseOnHover
                  </ToastContainer>

                  <table className="table landscape GoodsReceipt-Table">
                    <thead
                      style={{ zIndex: "999", fontSize: "13px" }}
                      className="table-head"
                    >
                      <tr>
                        <th>SI No:</th>
                        <th>Product</th>
                        <th>Mfg Code</th>
                        <th>Pcs/pk</th>
                        <th> Ordered Qty</th>
                        <th>Ordered Pieces</th>

                        <th>Received Unit</th>
                        <th style={{ width: "auto" }}>Received</th>
                        <th>Pending</th>
                        <th>Po rate</th>
                        <th>Invoice rate</th>
                        <th>MRP</th>
                        <th></th>
                      </tr>
                    </thead>
                    {/* {<Checkbox color="success" defaultChecked />} */}

                    <tbody
                      style={{ fontSize: "13px" }}
                      className="poList-tableBody"
                    >
                      {productsData?.received?.map((value, index) => (
                        <tr
                          key={index}
                          style={{
                            background:
                              value.balance_qty === 0
                                ? "#bbf7d0"
                                : index === 0
                                ? "white"
                                : index % 2 !== 0
                                ? "#f5f5f4"
                                : "white",
                          }}
                        >
                          <td>
                            <span> {index + 1}</span>
                          </td>
                          <td style={{ textAlign: "left" }}>
                            {value?.prod_name}
                          </td>
                          <td>{value?.manufacturer_code}</td>

                          <td>
                            <div className="Gr-td">
                              <div>{value?.no_of_items}</div>
                            </div>
                          </td>
                          <td>{value?.qty / value?.no_of_items}</td>
                          <td>{value?.qty}</td>
                          <td>
                            <select
                             ref={index===0 ? receivedUnitRef : null}
                              onChange={(event) => {
                                handleProducts(event, index);
                              }}
                              onFocus={()=>{  setIsHandleOpen(false);}}
                              disabled={
                                !productsData.lr_num ||
                                productsData.lr_num.length < 1 ||
                                value?.balance_qty === 0
                                  ? true
                                  : false
                              }
                              value={
                                !productsData.lr_num ||
                                productsData.lr_num.length < 1 ||
                                value?.balance_qty === 0
                                  ? ""
                                  : value?.pricing_unit
                              }
                              className="form-control purchase-form__form-control"
                              id="purchase-form__form-control"
                              type="number"
                              name="pricing_unit"
                              style={{ height: "29px" }}
                            >
                              <option disabled selected></option>

                              <option>Bundle</option>

                              <option>Pieces</option>
                            </select>
                          </td>
                          <td style={{ textAlign: "center", width: "4.5rem" }}>
                            <div className="Gr-td">
                              {/* <input
                               
                                style={{ width: "5rem", textAlign: "center" }}
                                className="form-control products-form__form-control"
                                onChange={(event) =>
                                  handleProducts(event, index)
                                }
                                min={0}
                                disabled={
                                  !productsData.lr_num ||
                                  productsData.lr_num.length < 1 ||
                                  value?.balance_qty === 0
                                    ? true
                                    : false
                                }
                                // value={value?.received_qty ?? ""}
                                value={
                                  !productsData.lr_num ||
                                  productsData.lr_num.length < 1 ||
                                  value?.balance_qty === 0
                                    ? ""
                                    : value?.received_qty
                                }
                                name="received"
                                type="number"
                              /> */}
                              <input
  style={{ width: "5rem", textAlign: "center" }}
  className="form-control products-form__form-control"
  onChange={(event) => handleProducts(event, index)}
  min={0}
  disabled={
    !productsData.lr_num ||
    productsData.lr_num.length < 1 ||
    value?.balance_qty === 0
      ? true
      : false
  }
  value={
    !productsData.lr_num ||
    productsData.lr_num.length < 1 ||
    value?.balance_qty === 0
      ? ""
      : value?.received_qty === undefined || value?.received_qty === null|| value?.received_qty === 0
      ? ""
      : value?.received_qty
  }
  name="received"
  type="number"
/>


                              <Edit
                                style={{ fontSize: "1rem" }}
                                className="Gr-td-icon"
                              />
                            </div>
                          </td>

                          <td ref={pendingRef} style={{ color: "#c2410c" }}>
                            {value?.pending_qty}
                          </td>

                          <td style={{ textAlign: "center" }}>
                            <div className="Gr-td">
                              <div>{value?.rate}</div>

                              <CurrencyRupeeSharp
                                style={{ fontSize: "1rem" }}
                                className="Gr-td-iconStart_po"
                              />
                            </div>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <div className="Gr-td">
                              {!productsData.lr_num ||
                              productsData.lr_num.length < 1 ||
                              value?.balance_qty === 0 ? (
                                <input
                                  style={{ width: "8rem" }}
                                  className="form-control products-form__form-control"
                                  disabled
                                />
                              ) : (
                                <Form.Control
                                  onChange={(event) => {
                                    handleProducts(event, index);
                                  }}
                                  min={0}
                                  type="number"
                                  name="invoice_amt"
                                  value={value?.invoice_amt}
                                  style={{
                                    paddingLeft: "1.5rem",
                                    width: "8rem",
                                  }}
                                  className="products-form__form-control"
                                />
                              )}

                              <CurrencyRupeeSharp
                                style={{ fontSize: "1rem" }}
                                className="Gr-td-iconStart"
                              />
                              <Edit
                                style={{ fontSize: "1rem" }}
                                className="Gr-td-icon"
                              />
                            </div>
                          </td>

                          <td style={{ textAlign: "center", width: "7rem" }}>
                            <div className="Gr-td">
                              {!productsData.lr_num ||
                              productsData.lr_num.length < 1 ||
                              value?.balance_qty === 0 ? (
                                <input
                                  style={{ width: "8rem" }}
                                  className="form-control products-form__form-control"
                                  disabled
                                />
                              ) : (
                                <Form.Control
                                  style={{
                                    paddingLeft: "1.5rem",
                                    width: "8rem",
                                  }}
                                  onChange={(event) => {
                                    handleProducts(event, index);
                                  }}
                                  min={0}
                                  type="number"
                                  name="mrp"
                                  className="products-form__form-control"
                                />
                              )}

                              <CurrencyRupeeSharp
                                style={{ fontSize: "1rem" }}
                                className="Gr-td-iconStart"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
            {/* </Container> */}

            <Row className="p-3 mb-3 ">
              <Col md={4}>
                <Row>
                  {/* <Col md={1}>
                    <Autorenew />
                  </Col> */}
                  {/* <Col md={1}>
                    <AddCircleOutline />
                  </Col> */}
                  <Col
                    className="text-danger text-left font-weight-bold"
                    md={5}
                  >
                    {/* <span style={{ color: "#F40404" }}> Raise Service Req</span> */}
                  </Col>
                  <Col md={6} />
                </Row>
              </Col>

              <Col md={8}></Col>
            </Row>
            <Row className="p-3 mb-3 ">
              <Col md={4}>
                <Row>
                  {/* <Col md={1}>
                    <Feedback />
                  </Col> */}
                  <div className="d-flex justify-content-end">
                    <Col md={1}>
                      <AddCircleOutline />
                    </Col>
                    <Col
                      className="text-danger text-left font-weight-bold"
                      md={4}
                    >
                      <span style={{ color: "#F40404" }}>Notes</span>
                    </Col>
                  </div>
                  <Col md={6} />
                </Row>
              </Col>

              <Col md={8}>
                <Row>
                  <Col>
                    <Row>
                      <div
                        style={{ cursor: "pointer" }}
                        title="Download pdf"
                        onClick={handlePdfDownload}
                      >
                        <Download
                          style={{
                            backgroundColor: "#64748b",
                            color: "white",
                            fontSize: "15px",
                          }}
                          // onClick={handleOpen}
                        />{" "}
                        <span style={{ fontSize: "13px" }}>
                          Download Po Pdf
                        </span>
                      </div>
                    </Row>
                  </Col>

                  <Col>
                    <button
                      disabled={isLoading}
                      type="button"
                      className="btn btn-success"
                      style={{ borderRadius: "12px" }}
                      onClick={handleFormData}
                    >
                      {" "}
                      Add to Inventory
                      <Backdrop
                        sx={{
                          color: "#fff",
                          zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                        open={isLoading}
                      >
                        <CircularProgress color="inherit" />
                      </Backdrop>
                    </button>
                  </Col>
                  <Col md={2}>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        borderRadius: "12px",
                        width: "7rem",
                        background: "#0369a1",
                        color: "white",
                      }}
                      onClick={handlePayment}
                    >
                      Payment
                    </button>
                  </Col>
                  <Col md={2}>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        borderRadius: "12px",
                        width: "7rem",
                        background: "#ef4444",
                        color: "white",
                      }}
                      // onClick={handleFormData}
                    >
                      Cancel
                    </button>
                  </Col>
                  <Col className="">
                    <button
                      type="button"
                      classname="btn btn-danger"
                      onClick={navi}
                      style={{
                        borderRadius: "12px",
                        width: "7rem",
                        padding: ".3rem",
                        background: "#fb923c",
                        color: "white",
                        border: "1px solid #fb923c",
                      }}
                    >
                      Close
                    </button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          {/* </Container> */}
        </Col>
      </Row>
    </div>
  );
}
