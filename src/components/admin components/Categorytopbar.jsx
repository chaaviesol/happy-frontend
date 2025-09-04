import { NotificationAdd, Settings, Logout } from "@mui/icons-material";
import { React, useState, useEffect } from "react";
import "../../components/styles.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Categorytopbar(props) {
  const {authLogout}=useAuth()
  const lang = navigator.language;
  const remve_local = () => {
    authLogout()
    navigate("/login")
  }
  const [calender, setCalender] = useState({
    dayNumber: "",
    dayName: "",
    monthName: "",
    monthNumber: "",
    year: "",
  });
  const navigate = useNavigate()


  //calender

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
  return (
    <>
      <div className="topbar">
        <div className="left"></div>
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
                    {calender.monthName}
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
                  <div style={{ paddingTop: ".1rem" }}>{calender.dayName}</div>
                  <div style={{ fontWeight: "700", fontSize: "20px" }}>
                    {" "}
                    <b>{calender.dayNumber}</b>{" "}
                  </div>
                  <div>{calender.year}</div>
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
            <Logout style={{ fontSize: "inherit", cursor: "pointer" }} />
          </div>
        </div>
      </div>
    </>
  );
}
