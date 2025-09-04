import { React, useContext, useEffect, useState } from "react";
import "./sign.css";
import WebFont from "webfontloader";
import { Input } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { prismaBaseApi } from "../../config";
import { AuthContext } from "../../Contexts/Auth/AuthProvider";
export default function () {
  const { setAuth } = useContext(AuthContext);
  const [loginBody, setLoginBody] = useState({});
  const [inputError, setInputError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    if (
      !loginBody.email ||
      !loginBody.password ||
      loginBody.email.length === 0 ||
      loginBody.password.length === 0
    ) {
      return toast.error("requied both fields", toastConfig);
    }

    axios
      .post(`${prismaBaseApi}/user/userlogin`, loginBody)
      .then((res) => {
        console.log(res.data);
        const { userType, logged_id, access, isUserAuthenticated } = res.data;
        const roles = [userType];
        const accessToken = res.data.accessToken;
        const refreshToken = res.data.refreshToken;
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        if (res.status === 200) {
          setAuth({
            user: isUserAuthenticated,
            roles,
            logged_id,
            userType,
            allowedPages: access,
          });
          switch (userType) {
            case "SU":
              navigate("/adm_navigate");
              break;
            case "ADM":
              navigate("/addproducts");
              break;
            case "SUP":
              navigate("/supplier_view");
              break;
            case "CUS":
              navigate("/product_list");
              break;
            default:
              break;
          }
        }
      })
      .catch((error) => {
        if (error?.response?.data?.message === "Please check your password!") {
          toast.warning(error.response.data.message, toastConfig);
          setInputError(true);
        } else if (
          error?.response?.data?.message === "Incorrect Email or password!"
        ) {
          toast.warning(error.response.data.message, toastConfig);
          setEmailError(true);
        }
      });
  };
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Droid Sans", "Glamsy", "Chilanka", "DM Sans", "Gilroy"],
      },
    });
  }, []);
  const toastConfig = {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  return (
    <>
      <div className="container-fluid ps-md-0">
        <div className="row g-0">
          <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image">
            <div>
              <img className="top-rightpic" src="./assets/tRight.png" alt="" />
            </div>
            <div>
              <img className="bottom-leftpic" src="./assets/bLeft.png" alt="" />
            </div>

            <div className="login-hppy">
              <img
                className="login-logo img-fluid"
                src="./assets/logo.png"
                alt=""
              />
              <span
                className="Happygroup-txt"
                style={{ fontFamily: "Glamsy", fontSize: "2vw" }}
              >
                Happy group
              </span>
            </div>
          </div>
          <div id="log" className="col-md-8 col-lg-6">
            <div className="login d-flex align-items-center py-5">
              <div id="log-container" className="container">
                <div className="row">
                  <div className="col-md-9 col-lg-8 mx-auto ">
                    <div className="login-heading mb-4">
                      <div style={{ fontSize: "2rem", fontFamily: "Gilroy" }}>
                        <span
                          style={{ color: "#B9974B", fontFamily: "Gilroy" }}
                        >
                          Welcome
                        </span>
                        ,please login to Get started
                      </div>
                    </div>

                    <form id="login-form">
                      <div
                        className="form-floating mb-3"
                        style={{ position: "relative" }}
                      >
                        <Input
                          autoFocus={true}
                          required={true}
                          error={emailError}
                          type="email"
                          style={{ width: "100%" }}
                          color="primary"
                          placeholder="Username"
                          onChange={(event) => {
                            setLoginBody({
                              ...loginBody,
                              email: event.target.value,
                            });
                            setInputError(false);
                            setEmailError(false);
                          }}
                        />

                        {/* <div
                          style={{
                            top: "0",
                            padding: "3px",
                            fontSize: "1.1rem",
                           

                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex",
                            background: "#ef4444",
                            borderRadius: "5px",

                            color: "white",
                            // position: "absolute",
                          }}
                        >
                          <p
                            className="m-0 p-1"
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                              display: "flex",
                            }}
                          >
                            This field is required
                            
                            <ErrorOutline sx={{marginLeft:2,fontSize:"26px"}}/>
                          </p>
                        </div> */}
                      </div>
                      <div className="form-floating mb-3">
                        <Input
                          error={inputError}
                          style={{ width: "100%" }}
                          color="primary"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          onChange={(event) => {
                            setLoginBody({
                              ...loginBody,
                              password: event.target.value,
                            });
                            setInputError(false);
                            setEmailError(false);
                          }}
                        />
                      </div>

                      {/* <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="rememberPasswordCheck"
                        />
                        <label
                          className="form-check-label"
                          for="rememberPasswordCheck"
                        >
                          Remember password
                        </label>
                      </div> */}

                      <div className="d-grid">
                        <button
                          id="login-btn"
                          className="btn btn-lg  btn-login text-uppercase fw-bold mb-2"
                          type="submit"
                          onClick={handleLogin}
                        >
                          <span style={{ color: "white" }}> Login</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/register_new");
                          }}
                          id="sign-btn"
                          className="btn btn-lg  btn-login text-uppercase fw-bold mb-2"
                          type="submit"
                        >
                          Sign up
                        </button>
                        <div
                          onClick={() => {
                            navigate("/login_create_pass");
                          }}
                          className="forgot-pwd"
                        >
                          <p className="pwd-fgt" href="#">
                            Forgot password?
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer>
        position="top-right" autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
      </ToastContainer>
    </>
  );
}
