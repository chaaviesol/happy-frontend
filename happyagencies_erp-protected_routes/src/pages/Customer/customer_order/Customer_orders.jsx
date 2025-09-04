import React, { useState, useEffect } from "react";
import styles from "./customer_order.module.css";
import AgCustomerOrder from "./AgCustomerOrder";
import { prismaBaseApi } from "../../../config";
import axios from "axios";
import Customer_Topbar from "../../../components/Customer_component/Customer_Topbar";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Customer_orders() {
  const [activeTab, setActiveTab] = useState("sent");
  const axiosPrivate = useAxiosPrivate();
  const [so, setSo] = useState({});
  const [passingSo, setPassingSo] = useState({});
  const [isTrue, setIsTrue] = useState(false);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  useEffect(() => {
    const fetchSoDetails = async () => {
      setLoading(true)
      try {
        const response = await axiosPrivate.post(`/sales/solist`, {
          customer_id: auth.logged_id,
        });
        const { requested_quote, responded, placed } = response.data;
        console.log(placed);
        setPassingSo(requested_quote);
        setSo({
          requested_quote,
          responded,
          placed,
        });
        setIsTrue(true);
      } catch (err) {
        console.error(err);
      }finally{
        setLoading(false)
      }
    };
    fetchSoDetails();
  }, []);

  const handleTabSwitch = (clickedTab) => {
    console.log(`clickedTab is ${clickedTab}`);
    if (isTrue) {
      switch (clickedTab) {
        case "sent":
          setPassingSo(so.requested_quote);
          break;
        case "received":
          setPassingSo(so.responded);
          break;
        case "confirmed":
          setPassingSo(so.placed);
          break;
      }
      setActiveTab(clickedTab);
    }
  };
  console.log(passingSo);
  console.log(so);
  return (
    <>
      <Customer_Topbar />
      <div className={styles.container}>
        <div className={styles.box}>
          <div className={styles.switch}>
            <div
              className={activeTab === "sent" ? styles.activeTab : ""}
              onClick={() => {
                handleTabSwitch("sent");
              }}
            >
              Sent
            </div>
            <div
              className={activeTab === "received" ? styles.activeTab : ""}
              onClick={() => {
                handleTabSwitch("received");
              }}
            >
              Received
            </div>
            <div
              className={activeTab === "confirmed" ? styles.activeTab : ""}
              onClick={() => {
                handleTabSwitch("confirmed");
              }}
            >
              Confirmed
            </div>
          </div>
          <div className="agg">
            <AgCustomerOrder salesData={passingSo} activeTab={activeTab} />
          </div>
        </div>
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
}
