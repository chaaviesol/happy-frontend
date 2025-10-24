import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  IconButton,
  TextField,
  MenuItem ,
  FormHelperText,
} from "@mui/material";
import { React, useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { ToastContainer, toast } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";
import { Add, Remove } from "@mui/icons-material";
import { baseApi, prismaBaseApi } from "../../../config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Customer.css";
import { useRef } from "react";
export default function Register() {
  const [entertrue, setentertrue] = useState(false);
  const [showForm1, setShowForm1] = useState(true);
  const [addressObj, setAddressobj] = useState({state: "Kerala",});
  const [data, setData] = useState({});
  const [years, setYears] = useState(0);
  const [terms, setTerms] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
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
     prod_type: false,
  });
  const navigate = useNavigate();
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
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
  console.log("showForm1", showForm1);
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    switch (name) {
      case "mob":
        setIsMobileValid(true);
        break;
      case "email":
        setIsEmailValid(true);
        break;
    }

    setData({ ...data, [name]: value });
    setreq_check((prev) => {
      return {
        ...prev,
        [name]: false,
      };
    });
  };
  console.log(data);

  const handleAddress = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setAddressobj({ ...addressObj, [name]: value });
    setData((prev) => ({
      ...prev,
      ...(showForm1 ? {} : { exp: years }),
      type: "CUS",
      address: addressObj,
    }));
  };
  console.log(addressObj);

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    const name = event.target.name;

    if (checked) {
      const prodIndex = Object.keys(data.prod_type || {}).length + 1;
      setData((prev) => ({
        ...prev,
        prod_type: { ...prev.prod_type, [`prod${prodIndex}`]: name },
      }));
    } else {
      const updatedProdType = { ...data.prod_type };
      for (const key in updatedProdType) {
        if (updatedProdType[key] === name) {
          delete updatedProdType[key];
        }
      }

      const updatedObj = Object.fromEntries(
        Object.keys(updatedProdType).map((key, index) => [
          `prod${index + 1}`,
          updatedProdType[key],
        ])
      );

      setData((prev) => ({
        ...prev,
        prod_type: updatedObj,
      }));
    }
  };
  const validateMob = (mobileNumber) => {
    return new Promise((resolve, reject) => {
      const mobileNumberRegex = /^\d{10}$/;

      if (mobileNumberRegex.test(mobileNumber)) {
        setIsMobileValid(true);
        resolve(true);
      } else {
        setIsMobileValid(false);
        // alert("invalid mobile number");
        resolve(false);
      }
    });
  };
  const validateEmail = (email) => {
    return new Promise((resolve, reject) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        setIsEmailValid(true);
        resolve(true);
      } else {
        setIsEmailValid(false);
        resolve(false);
      }
    });
  };
  const handleSubmitForm = async (event) => {
    console.log(data);
    event.preventDefault();
    setentertrue(true);
   // Check if product type is selected
const productTypeSelected = data.prod_type && Object.keys(data.prod_type).length > 0;
setreq_check((prev) => ({ ...prev, prod_type: !productTypeSelected }));

    // if (!checkinput_address.current?.value) {
    //   setreq_check((previous) => ({ ...previous, address: true }));
    // } else {
    //   setreq_check((previous) => ({ ...previous, address: false }));
    // }
    if (!checkinput_state?.current?.value) {
      setreq_check((previous) => ({ ...previous, state: true }));
    } else {
      setreq_check((previous) => ({ ...previous, state: false }));
    }
    // if (!checkinput_building.current?.value) {
    //   setreq_check((previous) => ({ ...previous, building: true }));
    // } else {
    //   setreq_check((previous) => ({ ...previous, building: false }));
    // }
    if (!checkinput_dis.current?.value) {
      setreq_check((previous) => ({ ...previous, dis: true }));
    } else {
      setreq_check((previous) => ({ ...previous, dis: false }));
    }
    // if (!checkinput_email.current?.value) {
    //   setreq_check((previous) => ({ ...previous, email: true }));
    // } else {
    //   setreq_check((previous) => ({ ...previous, email: false }));
    // }
    if (!checkinput_mob.current?.value) {
      setreq_check((previous) => ({ ...previous, mob: true }));
    } else {
      setreq_check((previous) => ({ ...previous, mob: false }));
    }
    if (!checkinput_name.current?.value) {
      setreq_check((previous) => ({ ...previous, name: true }));
    } else {
      setreq_check((previous) => ({ ...previous, name: false }));
    }
    // if (!checkinput_website.current?.value) {
    //   setreq_check((previous) => ({ ...previous, website: true }));
    // } else {
    //   setreq_check((previous) => ({ ...previous, website: false }));
    // }
    // if (!checkinput_trade.current?.value) {
    //   setreq_check((previous) => ({ ...previous, trade: true }));
    // } else {
    //   setreq_check((previous) => ({ ...previous, trade: false }));
    // }
    // if (!checkinput_landline.current?.value) {
    //   setreq_check((previous) => ({ ...previous, landline: true }));
    // } else {
    //   setreq_check((previous) => ({ ...previous, landline: false }));
    // }
    // if (!checkinput_pin.current?.value) {
    //   setreq_check((previous) => ({ ...previous, pin: true }));
    // } else {
    //   setreq_check((previous) => ({ ...previous, pin: false }));
    // }
    // if (!checkinput_gst.current?.value) {
    //   setreq_check((previous) => ({ ...previous, gst: true }));
    // } else {
    //   setreq_check((previous) => ({ ...previous, gst: false }));
    // }
    // if (!checkinput_pass.current?.value) {
    //   setreq_check((previous) => ({ ...previous, password: true }));
    // } else {
    //   setreq_check((previous) => ({ ...previous, password: false }));
    // }

    if (
      // !req_check.address &&
      // !req_check.building &&
      !req_check.dis &&
      // !req_check.email &&
      // !req_check.gst &&
      // !req_check.landline &&
      // !req_check.mob &&
      !req_check.name &&
      // !req_check.pin &&
      !req_check.state &&
      // !req_check.trade &&
      // !req_check.website
      productTypeSelected
    ) {
      try {
        // const EmailValidationResponse = await validateEmail(data.email);
        const isMobileValidResponse = await validateMob(data.mob);
        if ( isMobileValidResponse) {
          axios
            .post(`${prismaBaseApi}/user/add`,data)
            .then((res) => {
              console.log("data", res);
              if (res.status === 201) {
                toast.success("Successful, Wait for approval", toastConfig);
                setTimeout(function () {
                  navigate("/worklist");
                }, 3000);
              }
            })
            .catch((err) => {
              console.log("API error =>", err);
            });
        }
      } catch (err) {
        console.log("validation error");
      }
    }
  };
  const close = () => {
    navigate("/");
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

  useEffect(() => {
    if (entertrue) {
      if (!checkinput_address.current?.value) {
        setreq_check((previous) => ({ ...previous, address: true }));
      } else {
        setreq_check((previous) => ({ ...previous, address: false }));
      }
      if (!checkinput_state?.current?.value) {
        setreq_check((previous) => ({ ...previous, state: true }));
      } else {
        setreq_check((previous) => ({ ...previous, state: false }));
      }
      if (!checkinput_building.current?.value) {
        setreq_check((previous) => ({ ...previous, building: true }));
      } else {
        setreq_check((previous) => ({ ...previous, building: false }));
      }
      if (!checkinput_dis.current?.value) {
        setreq_check((previous) => ({ ...previous, dis: true }));
      } else {
        setreq_check((previous) => ({ ...previous, dis: false }));
      }
      if (!checkinput_email.current?.value) {
        setreq_check((previous) => ({ ...previous, email: true }));
      } else {
        setreq_check((previous) => ({ ...previous, email: false }));
      }
      if (!checkinput_mob.current?.value) {
        setreq_check((previous) => ({ ...previous, mob: true }));
      } else {
        setreq_check((previous) => ({ ...previous, mob: false }));
      }
      if (!checkinput_name.current?.value) {
        setreq_check((previous) => ({ ...previous, name: true }));
      } else {
        setreq_check((previous) => ({ ...previous, name: false }));
      }
      if (!checkinput_website.current?.value) {
        setreq_check((previous) => ({ ...previous, website: true }));
      } else {
        setreq_check((previous) => ({ ...previous, website: false }));
      }
      if (!checkinput_trade.current?.value) {
        setreq_check((previous) => ({ ...previous, trade: true }));
      } else {
        setreq_check((previous) => ({ ...previous, trade: false }));
      }
      if (!checkinput_landline.current?.value) {
        setreq_check((previous) => ({ ...previous, landline: true }));
      } else {
        setreq_check((previous) => ({ ...previous, landline: false }));
      }
      if (!checkinput_pin.current?.value) {
        setreq_check((previous) => ({ ...previous, pin: true }));
      } else {
        setreq_check((previous) => ({ ...previous, pin: false }));
      }
      if (!checkinput_gst.current?.value) {
        setreq_check((previous) => ({ ...previous, gst: true }));
      } else {
        setreq_check((previous) => ({ ...previous, gst: false }));
      }
      if (!checkinput_pass.current?.value) {
        setreq_check((previous) => ({ ...previous, password: true }));
      } else {
        setreq_check((previous) => ({ ...previous, password: false }));
      }
    }
  }, [data]);

  console.log({ req_check });
  console.log({ data });

// State district dropdowns
const [keralaSelected, setKeralaSelected] = useState(false);

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const keralaDistricts = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];



  return (
    <>
      <ToastContainer>
        position="top-right" autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
      </ToastContainer>
      <div id="home_admn_reg_align1">
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
                    id="outlined-basghic"
                    label="Customer Name"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red",
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
                    id="outlined-basghic"
                    label="Trade Name"
                    variant="outlined"
                    // required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                {/* <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red",
                  }}
                >
                  {req_check.trade && "required"}
                </FormHelperText> */}
              </div>
              <br />
              {/* ---------- CUSTOMER GRADE ---------- */}
<div style={{ alignItems: "center", marginTop: "20px" }} className="form-group row">
  <label htmlFor="gradeOption" className="col-sm-4 col-form-label">
    Customer Grade
  </label>
  <div className="col-sm-8">
    <RadioGroup row name="grade" onChange={handleInputChange}>
      <FormControlLabel value="A" control={<Radio />} label="A" />
      <FormControlLabel value="B" control={<Radio />} label="B" />
      <FormControlLabel value="C" control={<Radio />} label="C" />
    </RadioGroup>
  </div>
</div>


              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_gst}
                    onChange={handleInputChange}
                    name="gst"
                    type="text"
                    placeholder=""
                    id="outlined-basghic"
                    label="Gst IN"
                    variant="outlined"
                    // required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                {/* <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red",
                  }}
                >
                  {req_check.gst && "required"}
                </FormHelperText> */}
              </div>
              <br />
              <div style={{ alignItems: "center" }} className="form-group row">
  <label htmlFor="tradeOption" className="col-sm-4 col-form-label">
    Trade Type
  </label>
  <div className="col-sm-8">
    <RadioGroup row name="Tradeoption" onChange={handleInputChange}>
      <FormControlLabel
        name="Tradeoption"
        value="Wholesale"
        control={<Radio />}
        label="Wholesale"
      />
      <FormControlLabel
        name="Tradeoption"
        value="Retail"
        control={<Radio />}
        label="Retail"
      />
      <FormControlLabel
        name="Tradeoption"
        value="Agent"
        control={<Radio />}
        label="Agent"
      />
    </RadioGroup>
  </div>
</div>


              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_website}
                    onChange={handleInputChange}
                    name="website"
                    type="text"
                    placeholder=""
                    id="outlined-basghic"
                    label="Website"
                    variant="outlined"
                    // required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                {/* <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red",
                  }}
                >
                  {req_check.website && "required"}
                </FormHelperText> */}
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
      id="outlined-basghic"
      label="Email"
      variant="outlined"
      sx={{ width: "100%", height: "55px" }}
    />
  </ThemeProvider>

  {/* Show only format validation, not required */}
  {!isEmailValid && data.email && (
    <FormHelperText
      sx={{
        position: "absolute",
        color: "red",
      }}
    >
      invalid email
    </FormHelperText>
  )}
</div>

              {/* <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_email}
                    onChange={handleInputChange}
                    name="email"
                    type="email"
                    placeholder=""
                    id="outlined-basghic"
                    label="Email"
                    variant="outlined"
                    // required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red",
                  }}
                >
                  {req_check.email
                    ? "required"
                    : !isEmailValid && data.email && "invalid email"}
                </FormHelperText>
              </div> */}
              <br />
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_landline}
                    onChange={handleInputChange}
                    name="landline"
                    type="number"
                    min={0}
                    maxLength={10}
                    placeholder=""
                    id="outlined-basghic"
                    label="Landline"
                    variant="outlined"
                    // required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                {/* <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red",
                  }}
                >
                  {req_check.landline && "required"}
                </FormHelperText> */}
              </div>
              <br />
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_mob}
                    onChange={handleInputChange}
                    name="mob"
                    type="number"
                    min={0}
                    maxLength={10}
                    placeholder=""
                    id="outlined-basghic"
                    label="Mobile"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red",
                  }}
                >
                  {req_check.mob
                    ? "required"
                    : !isMobileValid && data.mob && "invalid mobile"}
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
                    onChange={handleAddress}
                    name="building"
                    type="text"
                    placeholder=""
                    id="outlined-basic1"
                    label="Building"
                    variant="outlined"
                    // required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                {/* <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red",
                  }}
                >
                  {req_check.building && "required * "}
                </FormHelperText> */}
              </div>
              <br />
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_address}
                    onChange={handleAddress}
                    name="address"
                    type="text"
                    placeholder=""
                    id="outlined-basghic"
                    label="Address"
                    variant="outlined"
                    // required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                {/* <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red",
                  }}
                >
                  {req_check.address && "required * "}
                </FormHelperText> */}
              </div>
              <br />
              {/* ---------- STATE DROPDOWN ---------- */}
<div className="admn_reg_inputBox">
  <ThemeProvider theme={theme}>
    <TextField
      select
      inputRef={checkinput_state}
      name="state"
      label="State"
      variant="outlined"
      required
      value={addressObj.state || ""}
      onChange={(e) => {
        handleAddress(e);
        const selectedState = e.target.value;
        setAddressobj({ ...addressObj, state: selectedState });
        if (selectedState === "Kerala") {
          setKeralaSelected(true);
        } else {
          setKeralaSelected(false);
          setAddressobj((prev) => ({ ...prev, district: "" }));
        }
      }}
      sx={{ width: "100%", height: "55px" }}
      SelectProps={{
        displayEmpty: true, // 👈 ensures placeholder appears
      }}
    >
      <MenuItem value="" disabled>
        <em>Select State</em>
      </MenuItem>
      {indianStates.map((state) => (
        <MenuItem key={state} value={state}>
          {state}
        </MenuItem>
      ))}
    </TextField>
  </ThemeProvider>
  <FormHelperText sx={{ position: "absolute", color: "red" }}>
    {req_check.state && "required * "}
  </FormHelperText>
</div>

<br />

{/* ---------- DISTRICT FIELD (conditional) ---------- */}
{keralaSelected ? (
  <div className="admn_reg_inputBox">
    <ThemeProvider theme={theme}>
      <TextField
        select
        inputRef={checkinput_dis}
        name="district"
        label="District"
        variant="outlined"
        required
        value={addressObj.district || ""}
        onChange={handleAddress}
        sx={{ width: "100%", height: "55px" }}
        SelectProps={{
          displayEmpty: true,
        }}
      >
        <MenuItem value="" disabled>
          <em>Select District</em>
        </MenuItem>
        {keralaDistricts.map((dist) => (
          <MenuItem key={dist} value={dist}>
            {dist}
          </MenuItem>
        ))}
      </TextField>
    </ThemeProvider>
    <FormHelperText sx={{ position: "absolute", color: "red" }}>
      {req_check.dis && "required"}
    </FormHelperText>
  </div>
) : (
  <div className="admn_reg_inputBox">
    <ThemeProvider theme={theme}>
      <TextField
        inputRef={checkinput_dis}
        onChange={handleAddress}
        name="district"
        type="text"
        placeholder=""
        id="outlined-basghic"
        label="District"
        variant="outlined"
        required
        sx={{ width: "100%", height: "55px" }}
      />
    </ThemeProvider>
    <FormHelperText sx={{ position: "absolute", color: "red" }}>
      {req_check.dis && "required"}
    </FormHelperText>
  </div>
)}


              {/* <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_dis}
                    onChange={handleAddress}
                    name="district"
                    type="text"
                    placeholder=""
                    id="outlined-basghic"
                    label="District"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red",
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
                    onChange={handleAddress}
                    name="state"
                    type="text"
                    placeholder=""
                    id="outlined-basghic"
                    label="State"
                    variant="outlined"
                    required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red",
                  }}
                >
                  {req_check.state && "required * "}
                </FormHelperText>
              </div> */}
              <br />
              <div className="admn_reg_inputBox">
                {" "}
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_pin}
                    onChange={handleAddress}
                    type="number"
                    min={0}
                    name="pin"
                    max={999999}
                    placeholder=""
                    id="outlined-basghic"
                    label="Pincode"
                    variant="outlined"
                    // required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                {/* <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red",
                  }}
                >
                  {req_check.pin && "required * "}
                </FormHelperText> */}
              </div>
              <br />
              <div className="admn_reg_inputBox">
                <ThemeProvider theme={theme}>
                  <TextField
                    inputRef={checkinput_pass}
                    onChange={handleInputChange}
                    type="password"
                    name="password"
                    placeholder=""
                    id="outlined-basghic"
                    label="Password"
                    variant="outlined"
                    // required={true}
                    sx={{ width: "100%", height: "55px" }}
                  />
                </ThemeProvider>
                {/* <FormHelperText
                  sx={{
                    position: "absolute",
                    color: "red",
                  }}
                >
                  {req_check.password && "required * "}
                </FormHelperText> */}
              </div>
              <br />
              <div
                style={{ display: "flex",
                   flexDirection: "column",
    alignItems: "flex-start",
    position: "relative", 
    marginBottom: "16px",
                 }}
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
                        // color="success"
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
                        // color="success"
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
                        // color="success"
                        // defaultChecked
                        onChange={handleCheckboxChange}
                      />
                    }
                    label="Baby"
                    labelPlacement="start"
                  />
                          <FormHelperText
                  sx={{
                    marginTop:'36px',
                    
                    position: "absolute",
                    color: "red",
                    left: "10px",
                  }}
                >
                  {req_check.prod_type && "required"}
                </FormHelperText>
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
          <button onClick={handleSubmitForm} className="register_admin-reg_btn">
            Register
          </button>
        </div>
      </div>
    </>
  );
}
