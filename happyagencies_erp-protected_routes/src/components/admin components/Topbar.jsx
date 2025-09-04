import {
  Backpack,
  DirectionsBike,
  NotificationAdd,
  PedalBike,
  RocketLaunch,
  Settings,
  
} from "@mui/icons-material";
import axios from "axios";
import { React, useState, useEffect, useReducer } from "react";
import "../styles.css";
import { prismaBaseApi } from "../../config";
import { productDeatilsReducer } from "../topBarReducer";
import { INITIAL_STATE } from "../topBarReducer";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
export default function Topbar(props) {
  const [state, dispatch] = useReducer(productDeatilsReducer, INITIAL_STATE);
  const [runApi, setRunApi] = useState(false);
  const [calender, setCalender] = useState({
    dayNumber: "",
    dayName: "",
    monthName: "",
    monthNumber: "",
    year: "",
  });
  const {authLogout}=useAuth()
  const navigate = useNavigate();
  const lang = navigator.language;
  const axiosPrivate=useAxiosPrivate()
  // console.log("Reducer State>>>>>>", state);

  const handleBikeData = async (prodType) => {
    const data = {
      main_type: prodType,
    };
    props.productType(prodType);
    await axiosPrivate
      .post(`/product/categories`, data)
      .then((apiData) => {
        console.log(apiData)
        dispatch({ type: "Type", payload: prodType });

        dispatch({ type: "CATEGORY_SPECS", payload: apiData.data });
      })
      .catch((error) => {
        console.log(error, ">>>error");
      });
    await axiosPrivate
      .post(`/user/viewsup`, data)
      .then((apiData) => {
        const { data: supplierList } = apiData;
        console.log(supplierList);
        let arr = [];
        for (let i = 0; i < supplierList.length; i++) {
          const supplier_name = supplierList[i].trade_name;
          if (supplier_name) {
            arr.push(supplier_name);
          }
        }

        dispatch({ type: "SUPPLIERS", payload: arr });
      })
      .catch((error) => {
        console.log(error);
      });
    const brandBody = {
      prod_type: prodType,
    };
    await axiosPrivate
      .post(`/product/viewBrands`, brandBody)
      .then((brandRes) => {
        let arr = [];
        for (let i = 0; i < brandRes.data.length; i++) {
          const brand_names = brandRes.data[i]?.brand_name;
          if (brand_names) {
            arr.push(brand_names);
          }
        }

        dispatch({ type: "BRANDS", payload: arr });
      });
    setRunApi(true);
  };

  useEffect(() => {
    if (props.isActive === true && runApi) {
      console.log(state);
      props.handleApi(state);
      setRunApi(false);
    }
  }, [runApi]);

  //calender
  const remve_local = () => {
    navigate("/login");
  };

  useEffect(() => {
    const date = new Date();

    const dayNumber = date.getDate();
    const month = date.getMonth();
    const dayName = date.toLocaleString(lang, { weekday: "long" });
    const monthName = date.toLocaleString(lang, { month: "long" });
    const year = date.getFullYear();

    setCalender({
      dayNumber: dayNumber,
      dayName: dayName,
      monthName: monthName,
      year: year,
    });
  }, []);

  const handleLogout=()=>{
    authLogout()
  }
  return (
    <>
      <div className="topbar">
        <div className="left">
          <div className="left-logos">
            <div
              onClick={props.isActive ? () => handleBikeData("bikes") : null}
              className="topBar-bikes topBar-icon-flex"
            >
              <DirectionsBike
                className="topBar-logo"
                style={{
                  fontSize: "inherit",
                  cursor: "pointer",
                }}
              />

              <span
                className="m-0"
                style={{ fontSize: "1rem", color: "#00342E", fontWeight: 600 }}
              >
                Bikes
                {state?.type === "bikes" ? (
                  <hr className="topBar-red-hr" />
                ) : (
                  ""
                )}
              </span>
            </div>
            <div
              style={{ cursor: "pointer" }}
              className="topBar-bikes topBar-icon-flex"
              onClick={props.isActive ? () => handleBikeData("toys") : null}
            >
              <RocketLaunch
                className="topBar-logo"
                style={{
                  fontSize: "inherit",

                  cursor: "pointer",
                }}
              />
              <span
                style={{ fontSize: "1rem", color: "#00342E", fontWeight: 600 }}
              >
                Toys
                {state?.type === "toys" ? <hr className="topBar-red-hr" /> : ""}
              </span>
            </div>
            <div
              style={{ cursor: "pointer" }}
              className="topBar-bikes topBar-icon-flex"
              onClick={props.isActive ? () => handleBikeData("baby") : null}
            >
              <PedalBike
                className="topBar-logo"
                style={{
                  fontSize: "inherit",
                  cursor: "pointer",
                }}
              />
              <span
                style={{ fontSize: "1rem", color: "#00342E", fontWeight: 600 }}
              >
                Baby
                {state?.type === "baby" ? <hr className="topBar-red-hr" /> : ""}
              </span>
            </div>
            <div
              style={{ cursor: "pointer" }}
              className="topBar-bikes topBar-icon-flex"
              onClick={props.isActive ? () => handleBikeData("accessories") : null}
            >
              <Backpack
                className="topBar-logo"
                style={{
                  fontSize: "inherit",
                  cursor: "pointer",
                }}
              />
              <span
                style={{ fontSize: "1rem", color: "#00342E", fontWeight: 600 }}
              >
                Accessories
                {state?.type === "accessories" ? <hr className="topBar-red-hr" /> : ""}
              </span>
            </div>
          </div>
        </div>
        <div className="topbar-right">
          <div className="calendar">
            <div></div>
            <div id="monthName"></div>
            <div id="dayName"></div>
            <div id="dayNumber"></div>
            <div id="year"></div>
          </div>
          {/* Calender>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          <div className="topbar-right-Date">
            <div
              style={{
                fontSize: "12px",
                fontfamily: "Poppins",
                padding: ".2rem",
                minWidth: "5rem",
              }}
              className="row topbar-calender"
            >
              <div
                style={{ border: "1px solid grey", borderRadius: "5px" }}
                className="col topbar-calender-col"
              >
                <div className="row">
                  <div
                    style={{
                      background: "#A6C991",
                      color: "#00342E",
                      fontWeight: "800",
                    }}
                    className="col"
                  >
                    {calender?.monthName}
                  </div>
                </div>
                <div
                  style={{
                    flexDirection: "column",
                    paddingLeft: ".5rem",
                    paddingRight: ".5rem",
                  }}
                  className="row d-flex"
                >
                  <div style={{ paddingTop: ".1rem" }}>{calender?.dayName}</div>
                  <div style={{ fontWeight: "700", fontSize: "20px" }}>
                    {" "}
                    <b>{calender?.dayNumber}</b>{" "}
                  </div>
                  <div>{calender?.year}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="topbar-right-icons">
            <NotificationAdd style={{ fontSize: "inherit" }} />
          </div>
          <div className="topbar-right-icons">
            <Settings style={{ fontSize: "inherit" }} />
          </div>
          <div onClick={remve_local} className="topbar-right-icons">
            <LogoutIcon onClick={handleLogout} style={{ fontSize: "inherit", cursor: "pointer" }} />
          </div>
        </div>
      </div>
    </>
  );
}

Topbar.defaultProps = {
  isActive: false,
};
