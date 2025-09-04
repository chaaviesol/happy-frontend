import React from "react";
import { Logout, NotificationAdd, Settings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles.css";
import { prismaBaseApi } from "../../config";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function Supplier_Top() {
  const { auth ,authLogout} = useAuth();
  const axiosPrivate=useAxiosPrivate()
  const [notificationcndtion, setnotificationcndtion] = useState(false);
  const [notification, setnotification] = useState([]);
  useEffect(() => {
  

    axiosPrivate
      .post(`/notification/get_notification`)
      .then((res) => {
        console.log("res>>>>>>", res);
        const notification = res.data.customer_notification.filter(
          (fil) => fil.read == "N"
        );
        setnotification(notification);
        console.log("notification===>", notification);
      });
  }, []);

  const navigate = useNavigate();
  const redirecting = (type, id) => {
    const not = {
      id: id,
    };
    if (type == "OR") {
      // navigate("/customer_list")
    } else if (type == "PM") {
      // navigate("/PM")
    }

    axiosPrivate
      .post(`/notification/cusread_notification`, not)
      .then((res) => {
        console.log("res=>", not);
      });
  };
  const notifref = useRef(null);
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
      <div className="topbar">
        <div className="left">
          <div
            onClick={() => {
              navigate("/supplier_view");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              cursor: "pointer",
            }}
          >
            <img id="Supplier_Top_img" src="./assets/logo.png" alt="" />
            <p id="Supplier_Top_logo">Happy Group</p>
          </div>
        </div>
        <div className="topbar-right">
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
              <NotificationAdd style={{ fontSize: "30px",cursor:"pointer" }} />
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
            <Settings style={{ fontSize: "inherit",cursor:"pointer" }} />
          </div>
          <div className="topbar-right-icons">
            <Logout onClick={authLogout} style={{fontSize: "inherit",cursor:"pointer"}} />{" "}
          </div>
        </div>
      </div>
    </>
  );
}
