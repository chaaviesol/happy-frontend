import React, { useContext, useEffect } from "react";
import { Button, Col, FormGroup, Row } from "react-bootstrap";

import { Checkbox, FormControlLabel, Modal } from "@mui/material";
import BackpackIcon from "@mui/icons-material/Backpack";
import { BorderColor } from "@mui/icons-material/";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../Contexts/Contexts";
import { DirectionsBike } from "@mui/icons-material/";
import { PedalBike } from "@mui/icons-material/";
import { RocketLaunch } from "@mui/icons-material/";
import { Block } from "@mui/icons-material/";
import { CancelPresentation } from "@mui/icons-material/";
import "./supplierco.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
// import Button from '@mui/material/Button';
import { prismaBaseApi } from "../../config";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
export default function Suppcomponent() {
  const { supplierlist, setSupplierlist } = useContext(MyContext);
  console.log("supplierlist", supplierlist);
  const [state1, setState1] = useState(false);
  const [state2, setState2] = useState(false);
  const [state3, setState3] = useState(false);
  const [checkboxes, setCheckboxes] = useState(false);
  const [product, setProduct] = useState(supplierlist?.product_type);
  const [products, setProducts] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [addressdata, setAddressdata] = useState(supplierlist?.address);
  const [loading, setloading] = useState(false);
  const [opened, setopened] = useState(false);
  const [opened1, setopened1] = useState(false);
  const [buttonState, setButtonState] = useState("Active");
  const [isChecked, setIsChecked] = useState();
  const [state, setState] = useState(false);
  const [modaltext, setModaltext] = useState("");
  const [style, setStyle] = useState("registercolor");
  const [checkboxstyle, setCheckboxstyle] = useState("success");
  const [checkstyle, setCkeckstyle] = useState("stylecheck");
  const [editstyle, setEditstyle] = useState("");
  const [blacklistButton, setblacklistButton] = useState("buttonblacklist1");
  const [oldstatus, setOldstatus] = useState();
  const [newstatus, setnewstatus] = useState();
  const [newflagged, setnewflagged] = useState();
  const [postdata, setPostdata] = useState(false);
  const [postdata1, setPostdata1] = useState(false);
  const [postal, setPostal] = useState();
  const axiosPrivate=useAxiosPrivate()
  const navigate = useNavigate();
  console.log(addressdata);
  console.log(product);
  console.log("supplierlist", supplierlist);
  const handlePostChange = (event) => {
    setPostal(event.target.value);
    console.log(postal);
  };
  useEffect(() => {
    console.log("postal", postal);
    if (postal?.length === 6) {
      console.log(6);
      axios
        .get(`https://api.postalpincode.in/pincode/${postal}`)
        .then((res) => {
          console.log(res.data[0].PostOffice[0]);
          setAddressdata({
            ...addressdata,
            district: res.data[0].PostOffice[0].District,
            state: res.data[0].PostOffice[0].State,
            pincode: postal,
          });
          // setAddressdata({...addressdata,"state":res.data[0].PostOffice[0].State})
        });
    } else {
      console.log("no");
    }
  }, [postal]);

  useEffect(() => {
    if (supplierlist.is_active === "Y") {
      console.log("active");
      setIsChecked(false);
      setOldstatus("active");
    } else {
      if (supplierlist.is_user_flagged === "Y") {
        setOldstatus("flagged");
      } else {
        setOldstatus("inactive");
      }

      setIsChecked(true);
      setStyle("supcolor");
      setCkeckstyle("supcolor");
      setModaltext("");
      setCheckboxstyle("default");
      setEditstyle("styledit");
      setblacklistButton("buttonblacklist1");
      console.log("inactive");
    }
  }, []);

  console.log(oldstatus);

  useEffect(() => {
    const initialState = {};
    Object.values(product)?.forEach((key) => {
      initialState[key] = true;
    });
    setProducts(initialState);
  }, []);

  useEffect(() => {
    setCheckboxes(products);
  }, [products]);



  const editdata1 = () => {
    setState1(true);
    setStyle("registercolor2");

    console.log(supplierlist);
  };

  const editdata2 = () => {
    setState2(true);
  };
  const editdata3 = () => {
    setState3(true);
  };

  const discard = () => {
    navigate("/supp");
  };
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };
  console.log("checkbox", checkboxes);

  useEffect(() => {
    const filteredData = Object.entries(checkboxes)
      .filter(([key, value]) => value === true)
      .reduce((result, [key, value], index) => {
        const newKey = `prod${index + 1}`;
        result[newKey] = key;
        return result;
      }, {});

    console.log("filterdata", filteredData);
    setSupplierlist({ ...supplierlist, product_type: filteredData });
  }, [checkboxes]);

  const handleSupplierdetails = (event, index) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(value);
    setSupplierlist({ ...supplierlist, [name]: value });
  };

  const handleAddressdetails = (event, index) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log("value", value);
    console.log("name", name);
    setAddressdata({ ...addressdata, [name]: value });
    console.log(addressdata);
  };
  useEffect(() => {
    setSupplierlist({ ...supplierlist, address: addressdata });
  }, [addressdata]);
  console.log(addressdata);
  const [isApproved, setIsApproved] = useState(supplierlist?.is_active);
  console.log(isApproved);
  console.log(supplierlist?.isApproved);

  const confirmdata = () => {
    setloading(true);
    const u_id = supplierlist.user_id;
    const prod_type = supplierlist.product_type;
    const landline = supplierlist.landline;
    const website = supplierlist.website;
    const mobile = supplierlist.mobile;
    const address = supplierlist.address;
    // const account_number=supplierlist.account_number
    // const ifsc_code=supplierlist.ifsc_code
    const data = { prod_type, landline, mobile, website, address };
    console.log(data);
    axios
      .post(`${prismaBaseApi}/user/supplieredit/${u_id}`, data)
      .then((res) => {
        console.log(res);
        // setSupplierlist(setSupplierlist)
        console.log(res.data);

        toast.success(res.data.message);
        setloading(false);
        // navigate('/supplierlist')
      })
      .catch((err) => {
        setloading(false);
        // toast.error(err.response.data.message)
        console.log(err);
      });
    console.log(supplierlist);
  };

  const handleclosed = () => {
    setopened(false);
    setIsChecked(!isChecked);
    if (supplierlist.is_user_flagged === "N") {
      setblacklistButton("buttonblacklist1");
    }
  };
  const handleOpend = () => {
    setopened(true);
    // setIsChecked(true)//changed
    setIsChecked(!isChecked);
  };

  const handleToggleActive = () => {
    setIsChecked(!isChecked);
    console.log(isChecked);
  };
  useEffect(() => {
    if (isChecked === false) {
      console.log("false", false);
      setSupplierlist({ ...supplierlist, is_active: "Y" });
      setStyle("registercolor");
      setCkeckstyle("stylecheck");
      setModaltext("");
      setCheckboxstyle("success");
      setEditstyle("");
      setnewstatus("active");
    }
    if (isChecked === true) {
      console.log("true", true);
      setSupplierlist({ ...supplierlist, is_active: "N" });
      setStyle("supcolor");
      setCkeckstyle("supcolor");
      setModaltext("");
      setCheckboxstyle("default");
      setEditstyle("styledit");
      setnewstatus("inactive");
    }
  }, [isChecked]);

  const handletoggleclick = () => {
    if (isChecked === false) {
      handleOpend();
      console.log("hloo");
    }
    if (isChecked === true) {
      handleOpend();

      console.log("hii");
      setStyle("registercolor");
      setEditstyle("");
      setCheckboxstyle("success");
      setCkeckstyle("stylecheck");
    }
  };

  const handleModalchange = (event) => {
    const value = event.target.value;
    console.log(value);
    setModaltext(value);

    console.log(modaltext);
  };

  const Postdata = () => {
    if (modaltext === "") {
      setblacklistButton("buttonblacklist1");
      console.log("hii");
      setIsChecked(!isChecked);
      console.log(isChecked);
      setopened(false);

      console.log(supplierlist);
    } else {
      console.log(supplierlist.is_active);
      console.log(supplierlist);
      console.log(newstatus);
      console.log(oldstatus);

      console.log("else");
      if (supplierlist.is_active === "N") {
        setStyle("supcolor");
        setCkeckstyle("supcolor");
        // setModaltext("")
        setCheckboxstyle("default");
        setEditstyle("styledit");
        setblacklistButton("buttonblacklist1");
        setPostdata(true);

        setTimeout(function () {
          navigate("/supplierlist");
        }, 5000);
      } else {
        setSupplierlist({ ...supplierlist, is_user_flagged: "N" });

        setStyle("registercolor");
        setCkeckstyle("stylecheck");
        // setModaltext("")
        setCheckboxstyle("success");
        setEditstyle("");
        setblacklistButton("buttonblacklist1");
        setPostdata(true);
      }
      setopened(false);
    }
  };

  useEffect(() => {
    if (postdata === true) {
      const data1 = {
        method: "add",
        is_user_flagged: supplierlist.is_user_flagged,
        post: modaltext,
        post_by: "6",
        user_id: supplierlist.id,
        old_status: oldstatus,
        new_status: newstatus,
        is_active: supplierlist.is_active,
      };
      // axios.post(`${baseApi}/supplierfeedback`)
      axiosPrivate.post(`/user/userfeedback`, data1).then((res) => {
        console.log(res);
        toast.success(res.data);
        
      });
      console.log("data1", data1);
      console.log(supplierlist);
      setPostdata(false);
    }
  }, [postdata, modaltext]);

  useEffect(() => {
    if (supplierlist.is_user_flagged === "Y") {
      setblacklistButton("buttonblacklist");
      // setOldstatus("flagged")
      // setnewstatus("active")
      //
    }
  }, [supplierlist]);

  //blacklist//

  const handleclosed1 = () => {
    setopened1(false);

    setSupplierlist({ ...supplierlist, is_user_flagged: "N" });
    setblacklistButton("buttonblacklist1");
  };
  const handleOpend1 = () => {
    setSupplierlist({ ...supplierlist, is_user_flagged: "Y" });
    setnewflagged("flagged");

    setopened1(true);

    setblacklistButton("buttonblacklist");

    if (supplierlist.is_user_flagged === "Y") {
      setSupplierlist({ ...supplierlist, is_active: "N" });
      setIsChecked(true);
    }
  };

  const handleCloseloading = () => {
    setloading(false);
  };

  const Postdata1 = () => {
    if (modaltext === "") {
      setSupplierlist({ ...supplierlist, is_user_flagged: "N" });
      // setnewstatus("active")
      setnewflagged(oldstatus);
      console.log("hii");
      // setIsChecked(!isChecked)
      console.log(isChecked);
      setopened1(false);
      setblacklistButton("buttonblacklist1");
      console.log(supplierlist);
    } else {
      console.log(supplierlist);
      setSupplierlist({ ...supplierlist, is_active: "N" });
      setIsChecked(true);
      console.log(supplierlist.is_user_flagged);
      console.log(supplierlist.is_active);
      console.log("new", newflagged);
      console.log("old", oldstatus);

      console.log("else");
      setStyle("supcolor");
      setCkeckstyle("supcolor");

      setCheckboxstyle("default");
      setEditstyle("styledit");
      setopened1(false);
      setPostdata1(true);
    }
  };
  useEffect(() => {
    console.log(modaltext);
    if (postdata1 === true) {
      const data = {
        method: "flag",
        is_user_flagged: supplierlist.is_user_flagged,
        post: modaltext,
        post_by: "6",
        user_id: supplierlist.id,
        old_status: oldstatus,
        new_status: newflagged,
        is_active: supplierlist.is_active,
      };
      console.log("data", data);
      // axios.post(`${baseApi}/supplierfeedback`)
      axiosPrivate.post(`/user/userfeedback`, data).then((res) => {
        console.log(res);
        toast.success(res.data);
      });
      setPostdata1(false);
      // setModaltext("")
      // toast.success("res.data")
      setTimeout(function () {
        navigate("/supplierlist");
      }, 5000); // (5 seconds)
    }
  }, [postdata1]);

  // console.log(supplierlist);
  return (
    <>
      <ToastContainer>
        position="top-right" autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
      </ToastContainer>

      <Modal
        open={opened}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={{
            backgroundColor: "white",
            width: "60%",
            padding: "20px",
            marginLeft: "30%",
            marginTop: "15%",
            borderRadius: "10px",
          }}
        >
          <Row>
            <Col lg={11}></Col>
            <Col lg={1}>
              <CancelPresentation
                onClick={handleclosed}
                style={{ textAlign: "right", padding: "0" }}
              />
            </Col>
          </Row>

          <div class="form-group">
            <label for="exampleFormControlTextarea1">Post new feedback</label>
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              onChange={handleModalchange}
              value={modaltext}
            ></textarea>
          </div>
          <div className="row">
            <div className="col-sm-9"></div>
            <div className="col-sm-3">
              <Button
                onClick={Postdata}
                style={{
                  backgroundColor: "#67BEB8",
                  borderRadius: "25px",
                  width: "145px",
                }}
              >
                POST
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={opened1}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={{
            backgroundColor: "white",
            width: "60%",
            padding: "20px",
            marginLeft: "30%",
            marginTop: "15%",
            borderRadius: "10px",
          }}
        >
          <Row>
            <Col lg={11}></Col>
            <Col lg={1}>
              <CancelPresentation
                onClick={handleclosed1}
                style={{ textAlign: "right", padding: "0" }}
              />
            </Col>
          </Row>

          <div class="form-group">
            <label for="exampleFormControlTextarea1">Post new feedback</label>
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              onChange={handleModalchange}
              value={modaltext}
            ></textarea>
          </div>
          <div className="row">
            <div className="col-sm-9"></div>
            <div className="col-sm-3">
              <Button
                onClick={Postdata1}
                style={{
                  backgroundColor: "#67BEB8",
                  borderRadius: "25px",
                  width: "145px",
                }}
              >
                POST
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* <Row>
  <Col lg={8}></Col>
  <Col  lg={4}>
  <div className='mt-2' >
  <select name="cars" id="cars" style={{ backgroundColor:isApproved === "Y" ? "green" : isApproved === "N" ? "yellow" : "red" }}
    value={supplierlist.isApproved} onChange={handleChange}>
    <option value="Y" style={{backgroundColor:"green"}}>Active</option>
    <option value="N" style={{backgroundColor:"yellow"}}>Inactive</option>
    <option value="B" style={{backgroundColor:"red"}}>Block List</option>
  </select>
  </div>
</Col>
</Row> */}

      <Row className="mt-2">
        <Col lg={8}></Col>
        <Col lg={1}>
          <h6 style={{ color: "red", marginTop: "29%" }}>
            {supplierlist?.is_user_flagged === "Y" ? <>Blacklisted</> : ""}
          </h6>
        </Col>
        <Col lg={2}>
          {/* <div class="toggle-button-cover">
      <div class="button-cover">
        <div class="button b2"  id="button-10">
          <input type="checkbox" class="checkbox"
          checked={isChecked}
          onChange={handleToggleActive} />
          <div class="knobs" style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2)"}}>
            <span>Active</span>
          </div>
          <div class="layer" style={{backgroundColor:"#fcebeb",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2)"}}></div>
        </div>
      </div>
    </div> */}

          <div class="onoffswitch mt-2 ml-5">
            <input
              type="checkbox"
              name="onoffswitch"
              class="onoffswitch-checkbox"
              id="myonoffswitch"
              checked={isChecked}
              onChange={handleToggleActive}
              onClick={handletoggleclick}
            />
            <label class="onoffswitch-label" for="myonoffswitch">
              <span class="onoffswitch-inner"></span>
              <span class="onoffswitch-switch"></span>
            </label>
          </div>

          {/* <input type="checkbox"checked={isChecked}
          onChange={handleToggleActive}   data-toggle="toggle" data-on="Ready" data-off="Not Ready" data-onstyle="success" data-offstyle="danger"></input> */}

          {/* <div>
      
  <FormControlLabel control= {<Switch defaultChecked onClick={()=>{handletogglebutton(buttonState)}}/>} 
  label={buttonState}
   />
  
    </div> */}
        </Col>
        {/* <Col lg={2}>
    <button onClick={handleOpend} style={{color:"white",backgroundColor:"red", height: "31px",border:"none",marginTop:"8px",borderRadius:"25px",fontSize:"16px",
    fontWeight:"bold" }}><Block style={{color:"black"}}/> blacklist</button>
    </Col> */}

        <Col lg={1}></Col>
      </Row>

      <Row>
        <Col lg={1}></Col>
        <Col lg={5}>
          <div
            class="card  mt-2 p-1"
            style={{
              backgroundColor: "rgb(103 163 159)",
              // height: "23vh",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <div class="card-body">
              <div className="row form-group">
                <label
                  className="col-sm-5 col-form-label"
                  style={{ textAlign: "left", fontSize: "15px" }}
                >
                  TradeName
                </label>
                <div
                  className="col-sm-7 col-form-label"
                  style={{ textAlign: "left", fontSize: "15px" }}
                >
                  {supplierlist?.trade_name}
                </div>
              </div>
              <div className="row form-group">
                <label
                  className="col-sm-5 col-form-label"
                  style={{ textAlign: "left", fontSize: "15px" }}
                >
                  Gstin
                </label>
                <div
                  className="col-sm-7 col-form-label"
                  style={{ textAlign: "left", fontSize: "15px" }}
                >
                  : {supplierlist?.gst_num}
                </div>
              </div>
              <div className="row form-group">
                <label
                  className="col-sm-5 col-form-label"
                  style={{ textAlign: "left", fontSize: "15px" }}
                >
                  e-mail address
                </label>
                <div
                  className="col-sm-7 col-form-label"
                  style={{ textAlign: "left", fontSize: "15px" }}
                >
                  : {supplierlist?.email}
                </div>
              </div>
            </div>
          </div>

          <div
            class="card mt-3 p-1"
            style={{
              // height: "48vh",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <BorderColor
              onClick={editdata1}
              style={{
                border: "1px solid black",
                color: "black",
                marginLeft: "2%",
                fontSize: "30px",
                marginTop: "1%",
                cursor: "pointer",
              }}
              id={editstyle}
            />
            {state1 === false ? (
              <>
                <div class="card-body">
                  <div className="form-group row">
                    <label
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                      style={{ textAlign: "left", fontSize: "12px" }}
                    >
                      Supplier Name :
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ cursor: "default", fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="customer"
                        value={supplierlist?.user_name}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                      style={{ textAlign: "left", fontSize: "12px" }}
                    >
                      Mobile :
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ cursor: "default", fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="customer"
                        value={supplierlist?.mobile}
                      />
                    </div>
                  </div>
                  <Row>
                    <Col lg={4}></Col>
                    <Col lg={2}>
                      {checkboxes?.bikes && <DirectionsBike id={checkstyle} />}
                    </Col>
                    <Col lg={2}>
                      {checkboxes?.toys && <RocketLaunch id={checkstyle} />}
                    </Col>
                    <Col lg={2}>
                      {checkboxes.baby && <PedalBike id={checkstyle} />}
                    </Col>
                    <Col lg={2}>
                      {checkboxes.accessories && (
                        <BackpackIcon id={checkstyle} />
                      )}
                    </Col>
                  </Row>
                  <div>
                    <FormGroup className="registration-form__FormGroup">
                      <div className="form-group row">
                        <label
                          htmlFor="tradeNumber"
                          className="col-sm-4 col-form-label"
                        >
                          Product type:
                        </label>
                        <FormControlLabel
                          id={checkstyle}
                          style={{ fontSize: "12px" }}
                          value=""
                          control={
                            <Checkbox
                              name="bikes"
                              color={checkboxstyle}
                              checked={checkboxes?.bikes || false}
                            />
                          }
                          label="Bikes"
                          labelPlacement="top"
                        />

                        <FormControlLabel
                          id={checkstyle}
                          style={{ fontSize: "12px" }}
                          value=""
                          control={
                            <Checkbox
                              name="toys"
                              color={checkboxstyle}
                              checked={checkboxes?.toys || false}
                            />
                          }
                          label=" Toys"
                          labelPlacement="top"
                        />
                        <FormControlLabel
                          id={checkstyle}
                          style={{ fontSize: "12px" }}
                          value=""
                          control={
                            <Checkbox
                              name="baby"
                              color={checkboxstyle}
                              checked={checkboxes?.baby || false}
                            />
                          }
                          label=" Baby"
                          labelPlacement="top"
                        />
                        <FormControlLabel
                          id={checkstyle}
                          style={{ fontSize: "12px" }}
                          value=""
                          control={
                            <Checkbox
                              name="accessories"
                              color={checkboxstyle}
                              checked={checkboxes?.accessories || false}
                            />
                          }
                          label="Accessories"
                          labelPlacement="top"
                        />
                      </div>
                    </FormGroup>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                      style={{ textAlign: "left", fontSize: "12px" }}
                    >
                      Website:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ cursor: "default", fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="customer"
                        value={supplierlist.website}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                      style={{ textAlign: "left", fontSize: "12px" }}
                    >
                      Landline :
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ cursor: "default", fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="customer"
                        value={supplierlist.landline}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div class="card-body">
                  <div className="form-group row">
                    <label
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                      style={{ textAlign: "left", fontSize: "12px" }}
                    >
                      Supplier Name :
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="sup_code"
                        value={supplierlist?.user_name}
                        onChange={(event, index) =>
                          handleSupplierdetails(event, index)
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                      style={{ textAlign: "left", fontSize: "12px" }}
                    >
                      Mobile :
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="mobile"
                        value={supplierlist.mobile}
                        onChange={(event, index) =>
                          handleSupplierdetails(event, index)
                        }
                      />
                    </div>
                  </div>
                  <Row>
                    <Col lg={4}></Col>
                    <Col lg={2}>
                      {checkboxes?.bikes && <DirectionsBike id={checkstyle} />}
                    </Col>
                    <Col lg={2}>
                      {checkboxes?.toys && <RocketLaunch id={checkstyle} />}
                    </Col>
                    <Col lg={2}>
                      {checkboxes.baby && <PedalBike id={checkstyle} />}
                    </Col>
                    <Col lg={2}>
                      {checkboxes.accessories && (
                        <BackpackIcon id={checkstyle} />
                      )}
                    </Col>
                  </Row>

                  <div>
                    <FormGroup className="registration-form__FormGroup">
                      <div
                        className="form-group row"
                        style={{ fontSize: "12px" }}
                      >
                        <label
                          htmlFor="tradeNumber"
                          className="col-sm-4 col-form-label"
                        >
                          Product type:
                        </label>
                        <FormControlLabel
                          className="col-form-label"
                          id={checkstyle}
                          value=""
                          control={
                            <Checkbox
                              name="bikes"
                              id={checkboxstyle}
                              color={checkboxstyle}
                              checked={checkboxes?.bikes || false}
                              onChange={handleCheckboxChange}
                            />
                          }
                          label=" Bikes"
                          labelPlacement="top"
                        />

                        <FormControlLabel
                          className="col-form-label"
                          id={checkstyle}
                          value=""
                          control={
                            <Checkbox
                              name="toys"
                              color={checkboxstyle}
                              checked={checkboxes?.toys || false}
                              onChange={handleCheckboxChange}
                            />
                          }
                          label=" Toys"
                          labelPlacement="top"
                        />
                        <FormControlLabel
                          className="col-form-label"
                          id={checkstyle}
                          value=""
                          control={
                            <Checkbox
                              name="baby"
                              color={checkboxstyle}
                              checked={checkboxes?.baby || false}
                              onChange={handleCheckboxChange}
                            />
                          }
                          label=" Baby"
                          labelPlacement="top"
                        />
                        <FormControlLabel
                          className="col-form-label"
                          id={checkstyle}
                          value=""
                          control={
                            <Checkbox
                              name="accessories"
                              color={checkboxstyle}
                              checked={checkboxes?.accessories || false}
                              onChange={handleCheckboxChange}
                            />
                          }
                          label="Accessories"
                          labelPlacement="top"
                        />
                      </div>
                    </FormGroup>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                      style={{ textAlign: "left", fontSize: "12px" }}
                    >
                      Website:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="website"
                        value={supplierlist.website}
                        onChange={(event, index) =>
                          handleSupplierdetails(event, index)
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                      style={{ textAlign: "left", fontSize: "12px" }}
                    >
                      Landline :
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="landline"
                        value={supplierlist.landline}
                        onChange={(event, index) =>
                          handleSupplierdetails(event, index)
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Col>
        <Col lg={5}>
          <div
            class="card mt-2 p-1"
            style={{
              // height: "40vh",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <Row>
              <Col lg={2}>
                {/* <BorderColor
                  onClick={editdata1}
                  style={{
                    border: "1px solid black",
                    color: "black",
                    marginLeft: "2%",
                    fontSize: "30px",
                    marginTop: "6%",
                    cursor: "pointer",
                  }}
                  id={editstyle}
                /> */}
              </Col>
              <Col lg={7}>
                <b>Address </b>
              </Col>
              <Col lg={3}></Col>
            </Row>

            {state1 === false ? (
              <>
                <div class="card-body">
                  <div className="form-group row">
                    <label
                      style={{ textAlign: "left", fontSize: "12px" }}
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                    >
                      Pincode:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="number"
                        style={{ cursor: "default", fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="customer"
                        value={supplierlist?.address?.pincode}
                        placeholder="000000"
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      style={{ textAlign: "left", fontSize: "12px" }}
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                    >
                      building:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ cursor: "default", fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="address.building"
                        value={supplierlist?.address?.building}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      style={{ textAlign: "left", fontSize: "12px" }}
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                    >
                      Address:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ cursor: "default", fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="address.address"
                        value={supplierlist?.address?.address}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      style={{ textAlign: "left", fontSize: "12px" }}
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                    >
                      District:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ cursor: "default", fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="address.district"
                        value={supplierlist?.address?.district}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      style={{ textAlign: "left", fontSize: "12px" }}
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                    >
                      State:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ cursor: "default", fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="address.state"
                        value={supplierlist?.address?.state}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div class="card-body">
                  <div className="form-group row">
                    <label
                      style={{ textAlign: "left", fontSize: "12px" }}
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                    >
                      Pincode:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="customer"
                        value={postal}
                        onChange={handlePostChange}
                        placeholder="000000"
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      style={{ textAlign: "left", fontSize: "12px" }}
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                    >
                      building:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="building"
                        value={addressdata.building}
                        onChange={(event, index) =>
                          handleAddressdetails(event, index)
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      style={{ textAlign: "left", fontSize: "12px" }}
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                    >
                      Address:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="address"
                        value={addressdata.address}
                        onChange={(event, index) =>
                          handleAddressdetails(event, index)
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      style={{ textAlign: "left", fontSize: "12px" }}
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                    >
                      District:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ fontSize: "12px", cursor: "default" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="district"
                        value={addressdata.district}
                        // onChange={(event, index) =>
                        //                   handleAddressdetails(event, index)}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      style={{ textAlign: "left", fontSize: "12px" }}
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                    >
                      State:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ fontSize: "12px", cursor: "default" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="state"
                        value={addressdata.state}
                        // onChange={(event, index) =>
                        //                   handleAddressdetails(event, index)}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div
            class="card mt-3 p-1"
            style={{
              // height: "20vh",
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <Row>
              <Col lg={2}>
                {/* <BorderColor
                  onClick={editdata1}
                  style={{
                    border: "1px solid black",
                    color: "black",
                    marginLeft: "2%",
                    fontSize: "30px",
                    marginTop: "6%",
                    cursor: "pointer",
                  }}
                  id={editstyle}
                /> */}
              </Col>
              <Col lg={7}>
                <b>Banking Details</b>{" "}
              </Col>
              <Col lg={3}></Col>
            </Row>
            {state1 === false ? (
              <>
                <div class="card-body">
                  <div className="form-group row">
                    <label
                      style={{ textAlign: "left", fontSize: "12px" }}
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                    >
                      Bank AC No:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ cursor: "default", fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="account_number"
                        value="xxxxxx567"
                        // value={supplierlist.account_number}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      style={{ textAlign: "left", fontSize: "12px" }}
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                    >
                      IFSC Code:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ cursor: "default", fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="ifsc_code"
                        value="pincode"
                        // value={supplierlist.ifsc_code}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div class="card-body">
                  <div className="form-group row">
                    <label
                      style={{ textAlign: "left", fontSize: "12px" }}
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                    >
                      Bank AC No:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="account_number"
                        value="xxxxxx123"
                        // value={supplierlist.account_number}
                        onChange={(event, index) =>
                          handleSupplierdetails(event, index)
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      style={{ textAlign: "left", fontSize: "12px" }}
                      htmlFor="tradeNumber"
                      className="col-sm-4 col-form-label"
                    >
                      IFSC Code:
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        style={{ fontSize: "12px" }}
                        class="form-control register_form readonly"
                        id={style}
                        name="ifsc_code"
                        value="pincode"
                        // value={supplierlist.ifsc_code}
                        onChange={(event, index) =>
                          handleSupplierdetails(event, index)
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <Row className="mt-5">
            <Col lg={1}></Col>

            <Col lg={5}>
              <Button
                onClick={confirmdata}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  borderRadius: "25px",
                  width: "145px",
                }}
              >
                Confirm
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={loading}
                  onClick={handleCloseloading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              </Button>
            </Col>
            <Col lg={5}>
              <Button
                style={{
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "25px",
                  width: "145px",
                }}
              >
                Discard
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col lg={1}></Col>
        <Col lg={2}>
          <Button
            onClick={handleOpend1}
            //   style={{backgroundColor:"white",color:"red",borderRadius:"25px",fontSize:"16px",border:"1px solid red",
            // fontWeight:"bold" }}
            id={blacklistButton}
          >
            <Block style={{ color: "black" }} /> blacklist
          </Button>
        </Col>
      </Row>
    </>
  );
}
