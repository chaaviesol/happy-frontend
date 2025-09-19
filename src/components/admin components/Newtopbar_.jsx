import { NotificationAdd, Settings } from "@mui/icons-material";
import { React, useState, useEffect, useContext } from "react";
import "../../components/styles.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRef } from "react";
import { prismaBaseApi } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { trflseSetting } from "../../Redux/SliceRedux";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
export default function Newtopbar_() {
  const state = useSelector((state) => state.happy_store);
  const lang = navigator.language;
  const dispatch = useDispatch();
  const [calender, setCalender] = useState({
    dayNumber: "",
    dayName: "",
    monthName: "",
    monthNumber: "",
    year: "",
  });
  const axiosPrivate = useAxiosPrivate();

  const { auth, authLogout } = useAuth();
  const [notificationcndtion, setnotificationcndtion] = useState(false);
  const [notification, setnotification] = useState([]);
  const notifref = useRef(null);
  useEffect(() => {
    axiosPrivate.post(`/notification/getadm_notification`).then((res) => {
      // console.log("res noti>>>>>>", res)
      const notification = res.data.admin_notification.filter(
        (fil) => fil.read == "N"
      );
      setnotification(notification);
      // console.log("notification===>", notification)
    });
  }, [state.tempTflse]);
  const navigate = useNavigate();

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
      monthNumber: month,
      year: year,
    });
  }, []);
  const remve_local = () => {
    navigate("/login");
  };

  const redirecting = async (type, id) => {
    const response = await axiosPrivate.post(
      `/notification/admread_notification`,
      {
        id: id,
      }
    );
    switch (type) {
      case "PD":
        navigate("/productworklist");
        break;
      case "OR":
        navigate("/admin_quotation");
        break;
      case "CO":
        navigate("/so_list");
        break;
      case "RT":
      case "SR":
        navigate("/adm_service_view");
        break;
      case "PC":
      case "DC":
      case "FC":
      case "FP":
      case "FD":
        navigate("/taskworklist");
        break;
    }
  };
  useEffect(() => {
    const closeBoxes = (event) => {
      if (!notifref.current?.contains(event.target)) {
        setnotificationcndtion(false);
      }
    };
    document.body.addEventListener("click", closeBoxes, true);

    return () => document.body.removeEventListener("click", closeBoxes);
  }, []);
  return (
    <>
      <div style={{ height: "60px", marginBottom: "20px" }} className="topbar p-3 ">
        {/* <div className="left topbar_aligh3">
          <div style={{ height: "10px" }}></div>
          <p>
            {calender.dayName.slice(0,3)}&nbsp;{calender.dayNumber}/{calender.monthNumber}/{calender.year}
          </p>

        </div> */}

        <div className="newTopBarCAl">
          <div className="newTopBarin p-1">
            <div className="newTopBariner ">
              <div className="newTopBariner_div">
                <p
                  style={{
                    height: "1px",
                    fontSize: "12px",
                    letterSpacing: "2px",
                    fontWeight: "600",
                  }}
                >
                  {" "}
                  {calender.dayName.slice(0, 3).toUpperCase()}
                </p>
                <p
                  style={{
                    height: "1px",
                    fontSize: "20px",
                    letterSpacing: "5px",
                    margin: "-6px 3px",
                    color: "red",
                  }}
                >
                  {" "}
                  {calender.dayNumber}
                </p>
              </div>
              <div className="newTopBariner_div">
                <p
                  style={{
                    height: "1px",
                    fontSize: "15px",
                    letterSpacing: "5px",
                    fontWeight: "600",
                  }}
                >
                  {" "}
                  {calender.monthName.slice(0, 3).toUpperCase()}
                </p>
                <p
                  className="newTopBariner_fonts"
                  style={{
                    height: "1px",
                    letterSpacing: "5px",
                    fontSize: "15px",
                    fontWeight: "300",
                  }}
                >
                  {" "}
                  {calender.year}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="admin_na_image">
          <div
            onClick={() => {
              const userType = auth?.userType;
              if (userType === "ADM" || userType === "SU" || userType === "TA") {
                navigate("/adm_navigate");
              }
            }}
            style={{ cursor: "pointer" }}
            className="admin_na_image_setting"
          >
            <img className="admin_na_image" src="./assets/logo.png" alt="" />
            <div>
              <p className="admn_na_ptg">Happy Group</p>
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
          <div>
            <div
              onClick={() => {
                if (notificationcndtion) {
                  setnotificationcndtion(false);
                } else {
                  setnotificationcndtion(true);
                }
              }}
              style={{
                display: "flex",
                margin: "10px 00px 00px 00px",
                cursor: "pointer",
              }}
            >
              <NotificationAdd style={{ fontSize: "30px" }} />
              <p id="top_bar_cart_Icn">{notification.length}</p>
            </div>
            {notificationcndtion ? (
              <div ref={notifref} className="cus_top_dropdown2 p-3">
                <p
                  style={{
                    fontSize: "1.2rem",
                    textAlign: "start",
                    borderBottom: "1px solid black",
                  }}
                >
                  Notification - {notification.length}
                </p>
                {notification.map((data) => (
                  <p
                    onClick={() => {
                      redirecting(data.type, data.id);
                    }}
                    id="cus_top_dropdown_text"
                    style={{
                      fontSize: "1rem",
                      textAlign: "start",
                      cursor: "pointer",
                    }}
                  >
                    {" "}
                    {data.text}{" "}
                  </p>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="topbar-right-icons">
            <LogoutIcon
              onClick={authLogout}
              style={{ fontSize: "inherit", cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
