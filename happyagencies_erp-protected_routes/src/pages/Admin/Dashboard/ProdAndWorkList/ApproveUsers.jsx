import { Button, Modal } from "@mui/material";
import { React, useContext, useEffect, useState } from "react";

import "../../../../pages/register_new/register.css";

import "./Register.css";
import { MyContext } from "../../../../Contexts/Contexts";
import { prismaBaseApi } from "../../../../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Close } from "@mui/icons-material/";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

export default function ApproveUsers() {
  const [inputValue, setInputValue] = useState("");
  const { worklistData} = useContext(MyContext);
  const [opened, setopened] = useState(false);
  const [inputData, setInputData] = useState("");
  const [supcode, setSupcode] = useState([]);
  const [loading, setLoading] = useState(false);
  const prodType = worklistData?.product_type;
  const [filterdata, setFilterdata] = useState([]);
  const prodEntries = prodType ? Object.entries(prodType) : [];
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
  const axiosPrivate=useAxiosPrivate()
  const submit = (id) => {
    const data = { user_id: worklistData?.user_id, approvalflag: id };
    if (id === "Y") {
      if (worklistData.user_type === "SUP") {
        setopened(true);
      } else if (worklistData.user_type === "CUS") {
        setopened(true);
      }
    } else {
      axiosPrivate.post(`/user/userapproval`, data).then((res) => {
        toast.error(res.data);
        setTimeout(function () {
          navigate("/worklist");
        }, 3000); // (5 seconds)
      });
    }

    // console.log(data);
  };

  const handleReadonly = (event) => {
    const { name, value } = event.target;
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      [name]: value,
    }));
  };
  // console.log(inputValue);

  const handleclosed = () => {
    setopened(false);
  };

  useEffect(() => {
    const type = { type: worklistData.user_type === "CUS" ? "CUS" : "SUP" };
    // console.log(type);
    axiosPrivate.post(`/user/supcode`, type).then((res) => {
      const values = Object.values(res.data).map((item) => item);
      setSupcode(values);
      // console.log(values);
    });
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    const regex = /^[a-zA-Z0-9 ]*$/;
    if (!regex.test(value)) {
      event.target.value = value.replace(/[^a-zA-Z0-9 ]/g, "");
    } else {
      setInputData(event.target.value);
      // console.log(inputData);
      // console.log(supcode);
      const filterdat = supcode.filter((details) => {
        return details
          ?.toLowerCase()
          .includes(event.target.value.toLowerCase());
      });
      // console.log(filterdat);
      setFilterdata(filterdat);
    }
  };

  const confirmData = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      document.getElementById("submitButton").disabled = true;
      if (filterdata.includes(inputData.toLowerCase())) {
        toast.error(" This code already in use", toastConfig);
      } else {
        const data = {
          user_id: worklistData?.user_id,
          approvalflag: "Y",
          sup_code: inputData.toLowerCase(),
        };
        try {
          const response = await axiosPrivate.post(
            `/user/userapproval`,
            data
          );

          toast.success(response.data, toastConfig);
          setTimeout(function () {
            navigate("/worklist");
          }, 2000);
        } catch (error) {
          console.error(error);
          toast.error("An Server error Occured", toastConfig);
        }
      }
    } finally {
      setLoading(false);
      setTimeout(function () {
        document.getElementById("submitButton").disabled = false;
      }, 2000);
    }
  };

  const handleCloseloading = () => {
    setLoading(false);
  };
  const handleClose = () => {
    navigate("/worklist");
  };
  return (
    <>
      <Modal
        open={opened}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={{
            backgroundColor: "white",
            width: "30%",
            padding: "20px",
            marginLeft: "40%",
            marginTop: "15%",
            borderRadius: "10px",
          }}
        >
          <div className="row">
            <div className="col-sm-10"></div>
            <div className="col-sm-2">
              <Close
                style={{ border: "1px solid black" }}
                onClick={handleclosed}
              />
            </div>
          </div>

          <div class="form-group row mt-3">
            <label for="sdgsdgs" class="col-sm-4 col-form-label text-left">
              {worklistData.user_type === "SUP"
                ? "Supplier Code"
                : "Customer code"}
            </label>
            <div class="col-sm-8">
              <input
                type="text"
                class="form-control "
                // id={style}
                // name="name"
                maxLength={3}
                value={inputData}
                onChange={handleInputChange}
              ></input>
            </div>
          </div>

          <Row>
            <Col lg={9}></Col>
            <Col lg={3}>
              <Button
              disabled={loading}
                sx={{
                  textTransform: "capitalize",
                  bgcolor: "#00342E",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#10443e",
                  },
                }}
                id="submitButton"
                onClick={confirmData}
              >
                Confirm{" "}
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={loading}
                  // onClick={handleCloseloading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>

      <div className="register">
        <div className="formBg">
          <div className=" col-sm-2"></div>

          <form
            className="container_form container"
            style={{
              backgroundColor: "white",
              margin: "0",
              paddingTop: "10px",
            }}
          >
            <div className="row">
              <div className="col-sm-11"></div>
              <div className="col-sm-1">
                <Close onClick={handleClose} />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-9"></div>
              <div className="col-sm-3"></div>
            </div>

            <div class="form-row container mt-2">
              <div class="col-md-6">
                <div className="form-group row">
                  {worklistData?.user_type === "SUP" ? (
                    <>
                      <label
                        htmlfor="customerName"
                        className="col-sm-4 col-form-label"
                      >
                        Supplier Name
                      </label>
                    </>
                  ) : worklistData?.user_type === "ADM" ? (
                    <>
                      <label
                        htmlfor="customerName"
                        className="col-sm-4 col-form-label"
                      >
                        Admin Name
                      </label>
                    </>
                  ) : (
                    <label
                      htmlfor="customerName"
                      className="col-sm-4 col-form-label"
                    >
                      Customer Name
                    </label>
                  )}

                  <div className="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form readonly"
                      id="registercolor"
                      name="customer"
                      value={worklistData?.user_name}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label for="trade_name" className="col-sm-4 col-form-label">
                    Trade Name
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form readonly"
                      name="trade_name"
                      id="registercolor"
                      value={worklistData?.trade_name}
                    ></input>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="gst" className="col-sm-4 col-form-label">
                    GST IN
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form readonly"
                      name="gst"
                      id="registercolor"
                      value={worklistData?.gst_num}
                    ></input>
                  </div>
                </div>

           

                <div
                  style={{ alignItems: "center" }}
                  className="form-group row"
                >
                  <label for="tradeOption" className="col-sm-4 col-form-label">
                    Years In Business
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form readonly"
                      name="trade_type"
                      id="registercolor"
                      value={worklistData?.yearsinbusiness}
                    ></input>
                  </div>
                </div>

                <div className="form-group row">
                  <label for="mobileNumber" className="col-sm-4 col-form-label">
                    Website
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form readonly"
                      id="registercolor"
                      name="website"
                      value={worklistData?.website}
                    ></input>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="mobileNumber" class="col-sm-4 col-form-label">
                    Email
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form readonly"
                      id="registercolor"
                      name="email"
                      value={worklistData?.email}
                    ></input>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="mobileNumber" class="col-sm-4 col-form-label">
                    Landline
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form readonly"
                      id="registercolor"
                      name="landline"
                      value={worklistData?.landline}
                    ></input>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="mobileNumber" class="col-sm-4 col-form-label">
                    Mobile Number
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form readonly"
                      id="registercolor"
                      name="mobile_number"
                      value={worklistData?.mobile}
                    ></input>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group row">
                  <label for="sdgsdg" class="col-sm-4 col-form-label">
                    Building
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form readonly"
                      id="registercolor"
                      name="building"
                      value={worklistData?.address?.building}
                    ></input>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="sdgsdgs" class="col-sm-4 col-form-label">
                    Address
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form readonly"
                      id="registercolor"
                      name="address"
                      value={worklistData?.address?.address}
                      onChange={handleReadonly}
                    ></input>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="sdgsdgs" class="col-sm-4 col-form-label">
                    District
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form readonly"
                      id="registercolor"
                      name="district"
                      value={worklistData?.address?.district}
                    ></input>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="sdgsdgs" class="col-sm-4 col-form-label">
                    State
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form readonly"
                      id="registercolor"
                      name="state"
                      value={worklistData?.address?.state}
                    ></input>
                  </div>
                </div>

                <div class="form-group row">
                  <label for="pincode" class="col-sm-4 col-form-label">
                    Product types:
                  </label>
                </div>
                <div>
                  {prodEntries &&
                    prodEntries?.map(([key, value]) => (
                      <div class="form-group row">
                        <label
                          key={key}
                          for="sdgsdgs"
                          class="col-sm-4 col-form-label"
                        >
                          {key}
                        </label>
                        <div class="col-sm-8">
                          <input
                            type="text"
                            class="form-control register_form readonly prodcontainer"
                            id="registercolor"
                            name="state"
                            value={value}
                          ></input>
                        </div>
                      </div>
                    ))}
                </div>

                {/* </div>  */}
                <div class="form-group row">
                  <label for="pincode" class="col-sm-4 col-form-label">
                    Description
                  </label>
                  <div class="col-sm-8">
                    <textarea
                      id="registercolor"
                      class="form-control"
                      name="story"
                      rows="3"
                      cols="33"
                      value={inputValue.story || ""}
                      onChange={handleReadonly}
                    ></textarea>
                  </div>
                </div>

                <div className="form-group row reg-submit d-flex justify-content-around">
                  <Button
                    sx={{
                      textTransform: "capitalize",
                      bgcolor: "#00342E",
                      "&:hover": {
                        bgcolor: "#10443e", // specify the red hover color you want to use here
                        // you can also specify other styles for the hover state here
                      },
                    }}
                    variant="contained"
                    className="reg_Submit"
                    onClick={() => {
                      submit("Y");
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    sx={{
                      textTransform: "capitalize",
                      bgcolor: "red",
                      "&:hover": {
                        bgcolor: "#d63343", // specify the red hover color you want to use here
                        // you can also specify other styles for the hover state here
                      },
                    }}
                    variant="contained"
                    className="reg_Submit"
                    onClick={() => {
                      submit("N");
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer>
        position="top-right" autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
      </ToastContainer>
    </>
  );
}
