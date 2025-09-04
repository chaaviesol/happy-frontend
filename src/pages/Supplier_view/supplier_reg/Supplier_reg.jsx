import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  IconButton,
  TextField,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import { React, useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Supplier_reg.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Add, Remove } from "@mui/icons-material";
import { prismaBaseApi } from "../../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
export default function Supplier_reg() {
  const [showForm1, setShowForm1] = useState(true);
  const [addressObj, setAddressobj] = useState({});
  const [data, setData] = useState({
    name: "",
    tradename: "",
    gst: "",
    website: "",
    address: "",
    prod_type: "",
    type: "",
    email: "",
    mob: "",
    landline: "",
    password: "",
  });
  const [years, setYears] = useState(0);
  const [req_check, setreq_check] = useState({
    name: false,
    building: false,
    dis: false,
    email: false,
    gst: false,
    landline: false,
    mob: false,
    pin: false,
    state: false,
    trade: false,
    website: false,
    address: false,
    password: false,
  });
  const [validationErrors, setValidationErrors] = useState({ email: false, mob: false })
  const toastConfig = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
  const checkinput_address = useRef(null);
  const checkinput_name = useRef(null);
  const checkinput_building = useRef(null);
  const checkinput_dis = useRef(null);
  const checkinput_email = useRef(null);
  const checkinput_gst = useRef(null);
  const checkinput_landline = useRef(null);
  const checkinput_mob = useRef(null);
  const checkinput_pin = useRef(null);
  const checkinput_state = useRef(null);
  const checkinput_trade = useRef(null);
  const checkinput_website = useRef(null);
  const checkinput_pass = useRef(null);
  const theme = createTheme({
    components: {
      MuiInputLabel: {
        styleOverrides: {
          asterisk: {
            color: "red",
          },
        },
      },
    },
  });
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate()

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "tradename") {
      setreq_check((prev) => ({
        ...prev,
        trade: false,
      }));
    } else {
      setreq_check((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
    setData({ ...data, [name]: value });
  };

  function handleDecrement() {
    if (years > 0) {
      setYears((prev) => prev - 1);
    }
  }

  function handleIncrement() {
    setYears((prev) => years + 1);
  }
  useEffect(() => {
    console.log({ years });

    if (years > 0) {
      setData((prev) => ({
        ...data,
        ...(showForm1 ? {} : { exp: years }),
      }));
    } else {
      setData((prev) => ({
        ...data,
        ...(showForm1 ? {} : { exp: years }),
      }));
    }
  }, [years]);

  const handleAddress = (event, field) => {
    const name = event.target.name;
    const value = event.target.value;
    setreq_check((prev) => ({
      ...prev,
      [field]: false,
    }));
    setAddressobj({ ...addressObj, [name]: value });
    setData((prev) => ({
      ...prev,
      password: "",
      ...(showForm1 ? {} : { exp: years }),
      type: "SUP",
      address: addressObj,
    }));
  };
  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    const name = event.target.name;
    if (checked && !data.prod_type?.prod1) {
      setData((prev) => ({
        ...prev,
        prod_type: { ...prev.prod_type, prod1: name },
      }));
    } else if (checked && !data.prod_type?.prod2) {
      setData((prev) => ({
        ...prev,
        prod_type: { ...prev.prod_type, prod2: name },
      }));
    } else if (checked && !data.prod_type?.prod3) {
      setData((prev) => ({
        ...prev,
        prod_type: { ...prev.prod_type, prod3: name },
      }));
    } else if (checked && !data.prod_type?.prod4) {
      setData((prev) => ({
        ...prev,
        prod_type: { ...prev.prod_type, prod4: name },
      }));
    } else if (checked === false) {
      const prod_value = { ...data.prod_type };
      for (let key in prod_value) {
        if (prod_value[key] === name) {
          delete prod_value[key];
        }
      }
      //replacing the deleted keyvalues key to 1,2,3
      let keyArr = Object.keys(prod_value);
      for (let i = 0; i < keyArr.length; i++) {
        keyArr[i] = `prod${i + 1}`;
      }
      const updatedObj = {};
      keyArr.forEach((key, index) => {
        updatedObj[key] = prod_value[Object.keys(prod_value)[index]];
      });

      console.log(updatedObj);

      setData((prev) => ({
        ...prev,
        prod_type: updatedObj,
      }));
    }
  };

  const updateReqCheck = (field, value) => {
    if (value) {
      value = false;
    } else {
      value = true;
    }
    setreq_check((previous) => ({ ...previous, [field]: value }));
  };
  const validateInputs = () => {
    updateReqCheck("address", checkinput_address.current?.value);
    updateReqCheck("state", checkinput_state?.current?.value);
    updateReqCheck("building", checkinput_building.current?.value);
    updateReqCheck("dis", checkinput_dis.current?.value);
    updateReqCheck("email", checkinput_email.current?.value);
    updateReqCheck("mob", checkinput_mob.current?.value);
    updateReqCheck("name", checkinput_name.current?.value);
    updateReqCheck("website", checkinput_website.current?.value);
    updateReqCheck("trade", checkinput_trade.current?.value);
    updateReqCheck("landline", checkinput_landline.current?.value);
    updateReqCheck("pin", checkinput_pin.current?.value);
    updateReqCheck("gst", checkinput_gst.current?.value);
    updateReqCheck("password", checkinput_pass.current?.value);
  };
  const validateMob = (mobileNumber) => {
    return new Promise((resolve, reject) => {
      const mobileNumberRegex = /^\d{10}$/;

      if (mobileNumberRegex.test(mobileNumber)) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };

  const validateEmail = (email) => {
    return new Promise((resolve, reject) => {
      const emailRegex = /^([^\s!@#$%^&*()+~\'\"]{1,64})@((?:[a-z0-9]{1,63}\.)+[a-z]{2,63})$/;
      if (emailRegex.test(email)) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };
  const handleFormSubmit = async (event) => {
    validateInputs();
    if (
      Object.values(req_check).every((value) => !value) &&
      Object.values(data).every((value) => value != "")
    ) {

      const [isMobileValid, isEmailValid] = await Promise.all([
        validateMob(data.mob), validateEmail(data.email)
      ])
      setValidationErrors({
        mob: !isMobileValid,
        email: !isEmailValid
      })

      if (!isMobileValid || !isEmailValid) {
        return;
      }


      try {
        const response = await axios.post(`${prismaBaseApi}/user/add`, data);
        console.log({ response });
        if (response.status === 201) {
          toast.success("Successful, Wait for approval", toastConfig);

          setTimeout(function () {
            window.location.reload();
          }, 3000);
        }
      } catch (err) {
        console.log(err);
      } finally {
      }
    }
  };


  console.log({ req_check });
  console.log({ validationErrors });
  console.log({ data });


  return (
    <>
      <ToastContainer>
        position="top-right" autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
      </ToastContainer>
      <div id="home_admn_reg_align1" style={{ padding: "10px" }}>
        <a className="admn_reg_singup">Sign Up</a>

        <br />
        <div className="home_admn_reg_card1">
          <div id="cus_admn_reg_sec1">
            <div>
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_name}
                    onChange={handleInputChange}
                    name="name"
                    type="text"
                    placeholder=""
                    id="outlined-basic1"
                    label="Representative Name"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red", left: "10px"
                  }}
                >
                  {req_check.name && "required"}
                </FormHelperText>
              </div>
              <br />
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_trade}
                    onChange={handleInputChange}
                    name="tradename"
                    type="text"
                    placeholder=""
                    id="outlined-basic2"
                    label="Trade name"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>

                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red", left: "10px"
                  }}
                >
                  {req_check.trade && "required"}
                </FormHelperText>
              </div>
              <br />
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_gst}
                    onChange={handleInputChange}
                    name="gst"
                    type="text"
                    placeholder=""
                    id="outlined-basic3"
                    label="Gst IN"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>

                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red", left: "10px"
                  }}
                >
                  {req_check.gst && "required"}
                </FormHelperText>
              </div>
              <br />
              <div
                style={{ alignItems: "center" }}
                className="form-group row  "
              >
                <label
                  htmlFor="mobileNumber"
                  className="col-sm-4 col-form-label"
                >
                  <b style={{ color: "red" }}>*</b>
                  Years In Business
                </label>

                <div id="sup_rer_btns" className="col-sm-4">
                  <div id="sup_alighn_box">
                    <IconButton onClick={handleDecrement}>
                      <Remove />
                    </IconButton>
                    <div style={{ width: "15px" }}></div>
                    <span>{years}</span>
                    <div style={{ width: "15px" }}></div>
                    <IconButton onClick={handleIncrement}>
                      <Add />
                    </IconButton>
                  </div>
                </div>
                <div className="col-sm-4"></div>
              </div>

              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_website}
                    onChange={handleInputChange}
                    name="website"
                    type="text"
                    placeholder=""
                    id="outlined-basic4"
                    label="Website"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red", left: "10px"
                  }}
                >
                  {req_check.website && "required"}
                </FormHelperText>
              </div>
              <br />
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_email}
                    onChange={handleInputChange}
                    name="email"
                    type="email"
                    placeholder=""
                    id="outlined-basic5"
                    label="Email"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red", left: "10px"
                  }}
                >
                  {

                    !req_check.email ? validationErrors.email && "format error" : "required"}
                </FormHelperText>
              </div>
              <br />
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_landline}
                    onChange={handleInputChange}
                    name="landline"
                    type="number"
                    placeholder=""
                    id="outlined-basic6"
                    label="Landline"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>

                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red", left: "10px"
                  }}
                >
                  {req_check.landline && "required"}
                </FormHelperText>
              </div>
              <br />
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_mob}
                    onChange={handleInputChange}
                    name="mob"
                    type="number"
                    placeholder=""
                    id="outlined-basic7"
                    label="Mobile"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>

                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red", left: "10px"
                  }}
                >
                  {!req_check.mob ? validationErrors.mob && "format error" : "required"}
                </FormHelperText>
              </div>
              <br />
              <br />
            </div>
          </div>
          <div id="cus_admn_reg_sec1">
            <div>
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_building}
                    onChange={(event) => handleAddress(event, "building")}
                    name="building"
                    type="text"
                    placeholder=""
                    id="outlined-basic8"
                    label="Building"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>

                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red", left: "10px"
                  }}
                >
                  {req_check.building && "required"}
                </FormHelperText>
              </div>
              <br />
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_address}
                    onChange={(event) => handleAddress(event, "address")}
                    name="address"
                    type="text"
                    placeholder=""
                    id="outlined-basic9"
                    label="Address"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>

                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red", left: "10px"
                  }}
                >
                  {req_check.address && "required"}
                </FormHelperText>
              </div>
              <br />
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_dis}
                    onChange={(e) => handleAddress(e, "dis")}
                    name="district"
                    type="text"
                    placeholder=""
                    id="outlined-basic10"
                    label="District"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red", left: "10px"
                  }}
                >
                  {req_check.dis && "required"}
                </FormHelperText>
              </div>
              <br />

              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_state}
                    onChange={(e) => handleAddress(e, "state")}
                    name="state"
                    type="text"
                    placeholder=""
                    id="outlined-basic11"
                    label="State"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>

                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red", left: "10px"
                  }}
                >
                  {req_check.state && "required"}
                </FormHelperText>
              </div>
              <br />
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_pin}
                    onChange={(e) => handleAddress(e, "pin")}
                    name="pincode"
                    type="number"
                    placeholder=""
                    id="outlined-basic12"
                    label="Pincode"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red", left: "10px"
                  }}
                >
                  {req_check.pin && "required"}
                </FormHelperText>
              </div>
              <br />
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_pass}
                    onChange={handleInputChange}
                    name="password"
                    type="password"
                    placeholder=""
                    id="outlined-basic13"
                    label="Password"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red", left: "10px"
                  }}
                >
                  {req_check.password && "required"}
                </FormHelperText>
              </div>
              <br />
              <div
                style={{ display: "flex" }}
                className="form-group row registration-form__checkboxes"
              >
                <span>
                  <b style={{ color: "red" }}>*</b>
                  Product Types
                </span>
                <br />
                <div
                  style={{ display: "flex", justifyContent: "center" }}
                  className="FormGroup registration-form__FormGroup"
                >
                  <FormControlLabel
                    className="formControlLabel"
                    value="start"
                    control={
                      <Checkbox
                        label="Bikes"
                        name="bikes"
                        color="success"
                        onChange={handleCheckboxChange}
                      />
                    }
                    label="Bikes"
                    labelPlacement="start"
                    classes={{ label: "label-gilroy" }}
                  />

                  <FormControlLabel
                    className="formControlLabel"
                    value="start"
                    control={
                      <Checkbox
                        name="toys"
                        color="success"
                        onChange={handleCheckboxChange}
                      />
                    }
                    label="Toys"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="start"
                    control={
                      <Checkbox
                        name="baby"
                        color="success"
                        // defaultChecked
                        onChange={handleCheckboxChange}
                      />
                    }
                    label="Baby"
                    labelPlacement="start"
                  />
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="admn_reg_enter2"
          >
            Back
          </button>
          <div style={{ width: "20px" }}></div>
          <button
            onClick={handleFormSubmit}
            type="button"
            className="register_admin-reg_btn"
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
}
