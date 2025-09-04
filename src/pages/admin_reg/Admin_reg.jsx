import React, { useState } from "react";
import "./Admin_reg.css";
import { useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
export default function Admin_reg() {
  const [loading, setLoading] = useState(false)
  const constants = {
    division:
      ["bikes", "toys", "baby"],
    dept: ["Sales", "Purchase"]
  }
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const schema = yup.object({
    user_name: yup.string().trim().max(20, 'Name cannot exceed 20 characters'),
    mobile: yup.string().required('Mobile number is required').matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
    email: yup.string().email('Invalid email format'),
    Password: yup.string().trim().min(8, "Password must have atleast 8 characters")

  });
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



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const onSubmit = (data) => {
    console.log(data)
    data.type = "ADM"
    setLoading(true)
    axiosPrivate
      .post(`/user/addadmin`, data)
      .then((response) => {
        console.log("response=====>", response);
        if (response.status === 200) {

          toast.success("Admin registration successful", toastConfig);

          setTimeout(function () {
            window.location.reload()
          }, 3000)
        }

      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setLoading(false)
      })

  };
  return (
    <>
      <div id="home_admn_reg_align" style={{ padding: "5px 5px 5px 5px" }}>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="">
            <a className="admn_reg_singup">Sign Up</a>
            <br />
            <div className="admn_reg_inputBox">
              <ThemeProvider theme={theme}>

                <TextField
                  id="name"
                  {...register('user_name',)}
                  required={true}
                  name="user_name"
                  label="Admin name"
                  variant="standard"
                  aria-invalid={errors.user_name ? "true" : "false"}
                  sx={{ width: "100%", position: "relative" }}
                  type="text"
                />
                {errors.user_name && <p className="error-message" style={{ fontSize: "12px", color: "red", position: "absolute", left: 0 }}>{errors.user_name.message}</p>}
              </ThemeProvider>


            </div>
            <br />

            <div className="admn_reg_inputBox">
              <ThemeProvider theme={theme}>

                <TextField
                  {...register("email")}
                  required={true}
                  name="email"
                  id="standard-basicemail"
                  label="Email"
                  variant="standard"
                  sx={{ width: "100%" }}
                  type="email"
                />
                {/* {errors.email && <p className="error-message" style={{ fontSize: "13px", color: "red", position: "absolute", left: 0 }}>{errors.email.message}</p>} */}

              </ThemeProvider>

            </div>
            <br />
            <div className="admn_reg_inputBox">
              <ThemeProvider theme={theme}>

                <TextField

                  {...register("mobile")}
                  required={true}
                  name="mobile"
                  type="number"
                  id="standard-basicmob"
                  label="Mobile"
                  variant="standard"
                  sx={{ width: "100%" }}
                />
                {errors.mobile && <p className="error-message" style={{ fontSize: "13px", color: "red", position: "absolute", left: 0 }}>{errors.mobile.message}</p>}


              </ThemeProvider>

            </div>
            <br />

            <div className="admn_reg_inputBox" style={{ display: "flex" }} >



              <select className="admin_reg_sel"   {...register("division")}
                required={true}>
                <option value="" selected disabled>Select a division*</option>
                {constants.division.map((data, index) => (
                  <option value={data}>{data}</option>
                ))}
              </select>
            </div>
            <br />


            <div className="admn_reg_inputBox" style={{ display: "flex" }} >

              <select className="admin_reg_sel"    {...register("department")}
                required={true}>
                <option selected disabled value="">Select a department*</option>
                {constants.dept.map((data, index) => (
                  <option value={data}>{data}</option>
                ))}
              </select>
            </div>

            <div className="admn_reg_inputBox">
              <ThemeProvider theme={theme}>

                <TextField
                  {...register("Password")}
                  required={true}
                  name="Password"
                  id="standard-basicpwd"
                  label="Password"
                  variant="standard"
                  sx={{ width: "100%" }}
                  type="password"
                />
                {errors.Password && <p className="error-message" style={{ fontSize: "12px", color: "red", position: "absolute", left: 0 }}>{errors.Password.message}</p>}


              </ThemeProvider>

            </div>

            <div
              style={{ display: "flex", width: "100%", justifyContent: "center", paddingTop: '2rem' }}
            >
              <button
                type="button"
                onClick={() => {
                  window.location.reload();
                }}
                className="admn_reg_enter2"
              >
                Back
              </button>
              <div style={{ width: "20px" }}></div>
              <button type="submit" className="register_admin-reg_btn">
                Register
              </button>
            </div>
          </div>
        </form>
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <ToastContainer />
      </div>
    </>
  );
}
