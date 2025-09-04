import React, { useEffect, useState, useContext } from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import "./Customer_Topbar.css"
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useSelector, useDispatch } from 'react-redux'
import {
    NotificationAdd,
    Settings,
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { prismaBaseApi } from "../../config";
import { addcart, addwishlist, addwallet } from '../../Redux/SliceRedux';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useRef } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

export default function Customer_Topbar() {
    const { authLogout, auth } = useAuth()
    const [calender, setCalender] = useState({
        dayNumber: "",
        dayName: "",
        monthName: "",
        monthNumber: "",
        year: "",
    });
    const [notificationcndtion, setnotificationcndtion] = useState(false)
    const [notification, setnotification] = useState([])
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const state = useSelector((state) => state.happy_store)
    const dispatch = useDispatch()
    const lang = navigator.language;
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
    useEffect(() => {

        AOS.init({
            once: true,
        });
    }, [])
    useEffect(() => {
        axiosPrivate.get(`/customer/getwishlist`).then((res) => {
            dispatch(addwishlist(res.data.data))
        })
    }, [state.tempTflse])
    useEffect(() => {
        axiosPrivate.get(`/customer/getcart`).then((res) => {
            // console.log(res);
            dispatch(addcart(res.data.data))
        })
    }, [state.tempTflse])
    useEffect(() => {
        axiosPrivate.post(`/order/wallet`)
            .then((res) => {
                console.log(res);
                dispatch(addwallet(res.data.data))
            });
    }, [state.tempTflse])
    const remve_local = () => {
        localStorage.removeItem("logged_id")
        navigate("/login")
    }

    useEffect(() => {

        axiosPrivate.post(`/notification/get_notification`).then((res) => {
            console.log("res>>>>>>", res)
            const notification = res.data.customer_notification.filter((fil => (fil.read == "N")))
            setnotification(notification)
            console.log("notification===>", notification)
        })
    }, [])
    const redirecting = (type, id) => {
        const not = {
            id: id
        }
        if (type == "OR") {
            navigate("/customer_orders")

        } else if (type == "PM") {
            navigate("/PM")
        }

        axiosPrivate.post(`/notification/cusread_notification`, not).then((res) => {
            console.log("res=>", not)
        })

    }
    const notifref = useRef(null)
    useEffect(() => {
        const closeBoxes = (event) => {
            if (
                !notifref.current?.contains(event.target)
            ) {
                setnotificationcndtion(false)
            }

        };
        document.body.addEventListener("click", closeBoxes, true);

        return () => document.body.removeEventListener("click", closeBoxes);
    }, []);

    return (
        <>
            <div id='cmr_tpBar_wdth_adjst'>
                <div id='cmr_tpBar'>
                    <div data-aos="fade-right" onClick={() => { navigate("/product_list") }} id='cmr_tp_flx1' style={{ cursor: "pointer" }}  >
                        <img id='cmr_tp_img1' src="./assets/logo.png" alt="" />
                        <span id='cmr_tp_fnt'>
                            Happy Group
                        </span>
                    </div>
                    <div id='cmr_tp_flx2'>
                        <div data-aos="fade-left" className="topbar-right">
                            <div className="calendar">
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
                            <div className="topbar-right-icons" >
                                <div onClick={() => { navigate("/customer_cart") }} style={{ display: "flex", margin: "10px 00px 00px 00px", cursor: "pointer" }}>
                                    <ShoppingCartCheckoutIcon style={{ fontSize: "inherit" }} />
                                    <p id="top_bar_cart_Icn">{state.Customer_cart_Data.length}</p>
                                </div>
                            </div>
                            <div className="topbar-right-icons" >
                                <div onClick={() => { navigate("/wish_list") }} style={{ display: "flex", margin: "10px 00px 00px 00px", cursor: "pointer" }}>
                                    <FavoriteIcon style={{ fontSize: "inherit" }} />
                                    <p id="top_bar_cart_Icn">{state.wishlsit_data.length}</p>
                                </div>
                            </div>
                            {state.wallet_data > 0 ?
                                <div className="topbar-right-icons" >
                                    <div style={{ display: "flex", margin: "10px 00px 00px 00px", cursor: "pointer" }}>
                                        <AccountBalanceWalletOutlinedIcon style={{ fontSize: "inherit" }} />
                                        <p id="top_bar_wallet_Icn"> ₹ {state.wallet_data}</p>

                                    </div>
                                </div>
                                : ""

                            }
                            <div className="topbar-right-icons">
                                <div>
                                    <div onClick={() => {
                                        if (notificationcndtion) {
                                            setnotificationcndtion(false)
                                        } else {
                                            setnotificationcndtion(true)

                                        }
                                    }} style={{ display: "flex", margin: "10px 00px 00px 00px", cursor: "pointer" }}>
                                        <NotificationAdd style={{ fontSize: "inherit" }} />
                                        <p id="top_bar_cart_Icn">{notification.length}</p>
                                    </div>
                                    {notificationcndtion ?
                                        <div ref={notifref} className='cus_top_dropdown p-3'>
                                            <p style={{ fontSize: "1.2rem", textAlign: 'start', borderBottom: "1px solid black" }}>Notification - {notification.length}</p>
                                            {notification.map(data =>
                                                <p onClick={() => { redirecting(data.type, data.id) }} id='cus_top_dropdown_text' style={{ fontSize: "1rem", textAlign: 'start', cursor: "pointer" }}> {data.text} </p>
                                            )}
                                        </div>
                                        : ""}
                                </div>
                            </div>
                            <div className="topbar-right-icons">
                                <Settings style={{ fontSize: "inherit", cursor: "pointer" }} />
                            </div>
                            <div className="topbar-right-icons">
                                <LogoutIcon onClick={() => { authLogout(); navigate("/login") }} style={{ fontSize: "inherit", cursor: "pointer" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
