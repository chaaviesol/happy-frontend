import { Add, Remove } from '@mui/icons-material'
import { Checkbox, FormControlLabel, IconButton } from '@mui/material'
import React, { useContext, useState } from 'react'
import { Button, Col, FormGroup, Row } from 'react-bootstrap'
import { MyContext } from '../../../../Contexts/Contexts'
import { useNavigate } from 'react-router-dom'

export default function SupplierDetails() {
  const [state, setState] = useState(false);
  const [item, setItem] = useState(false);
  const [checkboxes, setCheckboxes] = useState({ bikes: true, toys: true });
  const { supplierlist, setSupplierlist } = useContext(MyContext)
  console.log(supplierlist);
  const [years, setYears] = useState(8);
  function handleDecrement() {
    if (years > 0) {
      setYears(years - 1);
    }
  }

  function handleIncrement() {
    setYears(years + 1);
  }
  console.log("years", years);
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("/supplierlist");
  };
  const handleEdit = (variant, edit) => {
    console.log(variant);
    if (item === false) {
      console.log("variant");
      setItem(true);
    }

    else {
      console.log(edit);
      setItem(false);

    }
    setState(true);
  };
  console.log("item>>", item);

  const handleDiscard = () => {
    setState(false);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes((prevState) => ({
      ...prevState,
      [name]: checked,
    }));

  };
  console.log("checkbox", checkboxes);
  return (
    <>
      <div className="register">
        <div className="formBg">
          <div className="register-logo col-sm-2">
            <img src="./assets/logo.png" alt="" />
            <span style={{ color: "white" }}>Happy Group</span>
          </div>

          <form
            className="register-form container"
            style={{ backgroundColor: "white" }}
          >
            <div style={{ fontSize: "25px", marginBottom: "15px" }}> Supplier Details</div>

            <div className="form-row container">

              <div className="col-md-6">



                <div className="form-group row">
                  <label
                    htmlFor="customerName"
                    className="col-sm-4 col-form-label"
                  >
                    Supplier name
                  </label>
                  <div className="col-sm-8">
                    <input type="text" class="form-control register_form readonly" id="registercolor" name="customer" value={"supplier name"} />

                  </div>
                </div>



                <div className="form-group row">
                  <label
                    htmlFor="tradeNumber"
                    className="col-sm-4 col-form-label"
                  >
                    Trade Number
                  </label>
                  <div className="col-sm-8">
                    <input type="text" class="form-control register_form readonly" id="registercolor" name="customer" value={"trade number"} />

                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="gst" className="col-sm-4 col-form-label">
                    GST IN
                  </label>
                  <div className="col-sm-8">
                    <input type="text" class="form-control register_form readonly" id="registercolor" name="customer" value={"GST IN"} />

                  </div>
                </div>
                {/* {showForm1 === true ? ( */}


                <div
                  style={{ alignItems: "center" }}
                  className="form-group row  "
                >
                  <label
                    htmlFor="mobileNumber"
                    className="col-sm-4 col-form-label"
                  >
                    Years In Business
                  </label>
                  {/* <div className="col-sm-1 border-grey">
                   
                     
                    
                  
                  </div> */}
                  <div
                    className="col-sm-4"
                    style={{
                      textAlign: "left",
                      // backgroundColor: "#e0e9ff",
                      borderRadius: "8px",
                    }}
                  >
                    <IconButton
                      onClick={handleDecrement}
                    >
                      <Remove />
                    </IconButton>
                    <span>
                      {years}
                    </span>
                    <IconButton
                      onClick={handleIncrement}
                    >
                      <Add />
                    </IconButton>
                  </div>
                  <div className="col-sm-4"></div>
                </div>


                <div className="form-group row">
                  <label
                    htmlFor="mobileNumber"
                    className="col-sm-4 col-form-label"
                  >
                    Website
                  </label>
                  <div className="col-sm-8">
                    <input type="text" class="form-control register_form readonly" id="registercolor" name="customer" value={"website"} />

                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="mobileNumber"
                    className="col-sm-4 col-form-label"
                  >
                    Email
                  </label>
                  <div className="col-sm-8">
                    <input type="text" class="form-control register_form readonly" name="customer" id="registercolor" value={"Email"} />

                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="mobileNumber"
                    className="col-sm-4 col-form-label"
                  >
                    Landline
                  </label>
                  <div className="col-sm-8">
                    <input type="text" class="form-control register_form readonly" name="customer" id="registercolor" value={"Landline"} />

                  </div>
                </div>
                <div className="form-group row">
                  <label
                    htmlFor="mobileNumber"
                    className="col-sm-4 col-form-label"
                  >
                    Mobile Number
                  </label>
                  <div className="col-sm-8">
                    <input type="text" class="form-control register_form readonly" id="registercolor" name="customer" value={""} />

                  </div>
                </div>

              </div>
              <div className="col-md-6">
                <div className="form-group row">
                  <label htmlFor="sdgsdg" className="col-sm-4 col-form-label">
                    Building
                  </label>
                  <div className="col-sm-8">
                    <input type="text" class="form-control register_form readonly" id="registercolor" name="customer" value={""} />

                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="sdgsdgs" className="col-sm-4 col-form-label">
                    Address
                  </label>
                  <div className="col-sm-8">
                    <input type="text" class="form-control register_form readonly" id="registercolor" name="customer" value={""} />

                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="sdgsdgs" className="col-sm-4 col-form-label">
                    District
                  </label>
                  <div className="col-sm-8">
                    <input type="text" class="form-control register_form readonly" id="registercolor" name="customer" value={""} />

                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="sdgsdgs" className="col-sm-4 col-form-label">
                    State
                  </label>
                  <div className="col-sm-8">
                    <input type="text" class="form-control register_form readonly" id="registercolor" name="customer" value={""} />

                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="pincode" className="col-sm-4 col-form-label">
                    Pincode
                  </label>
                  <div className="col-sm-8">
                    <input type="text" class="form-control register_form readonly" id="registercolor" name="customer" value={""} />

                  </div>
                </div>

                <div className="form-group row registration-form__checkboxes">

                  <span>Product Types</span>




                  <div className='col-sm-6'>
                    <FormGroup className="registration-form__FormGroup " style={{ display: "flex", flexDirection: "column" }}>
                      <FormControlLabel
                        value=""
                        control={
                          <Checkbox
                            name="bikes"
                            color="success"
                            checked={checkboxes.bikes}
                          // onChange={handleCheckboxChange}
                          />
                        }
                        label="Bikes"
                        labelPlacement="start"
                      />

                      <FormControlLabel
                        value=""
                        control={
                          <Checkbox
                            name="toys"
                            color="success"
                            checked={checkboxes.toys}
                          // onChange={handleCheckboxChange}
                          />
                        }
                        label=" Toys"
                        labelPlacement="start"
                      />

                    </FormGroup>
                  </div>

                  <div className='col-sm-6'>
                    <FormGroup className="registration-form__FormGroup">
                      <FormControlLabel

                        control={
                          <Checkbox
                            name="baby"
                            color="success"
                            checked={checkboxes.baby}

                          // onChange={handleCheckboxChange}
                          />
                        }
                        label="Baby"
                        labelPlacement="start"
                      />


                    </FormGroup>
                  </div>
                  {/* </div> */}
                </div>

              </div>
            </div>
          </form>
          {/* <ToastContainer>
              position="top-right" autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
            </ToastContainer> */}
          {state === false ? (
            <>
              <Row className="mt-2">
                <Col lg={2}></Col>
                <Col lg={2}>
                  <Button
                    style={{ backgroundColor: "green", color: "white", borderRadius: "25px" }}
                    onClick={() => {
                      handleEdit("variant");
                    }}
                  >
                    Create Variant
                  </Button>
                </Col>
                <Col lg={2}>
                  <Button
                    style={{ backgroundColor: "blue", color: "white", borderRadius: "25px", width: "145px" }}
                    onClick={() => {
                      handleEdit("edit");
                    }}
                  >
                    Edit
                  </Button>
                </Col>
                <Col lg={2}>
                  {/* <div className='mt-5'>   */}
                  {/* {isDownloading?"": */}
                  <Button
                    variant="white"
                    className="custom-button"
                    // onClick={handleDownload}
                    style={{ backgroundColor: "gray", color: "white", borderRadius: "25px", width: "145px" }}
                  >
                    Download
                  </Button>
                  {/* }           */}

                  {/* </div> */}
                </Col>
                <Col lg={2}>
                  <Button
                    style={{ backgroundColor: "red", color: "white", borderRadius: "25px", width: "145px" }}
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </Col>
                <Col lg={1}></Col>
              </Row>
            </>
          ) : (
            <>
              <Row className="mt-2">
                <Col lg={4}></Col>
                {item === false ? (
                  <Col lg={2}>
                    <Button style={{ backgroundColor: "green", color: "white", borderRadius: "25px", width: "145px" }}>
                      Create
                    </Button>
                  </Col>
                ) : (
                  <Col lg={2}>
                    <Button style={{ backgroundColor: "green", color: "white", borderRadius: "25px", width: "145px" }}>
                      Save
                    </Button>
                  </Col>
                )}

                <Col lg={2}>
                  <Button
                    style={{ backgroundColor: "red", color: "white", borderRadius: "25px", width: "145px" }}
                    onClick={handleDiscard}
                  >
                    Discard
                  </Button>
                </Col>
                <Col lg={4}></Col>
              </Row>
            </>
          )}
        </div>

      </div>




    </>



  )
}

