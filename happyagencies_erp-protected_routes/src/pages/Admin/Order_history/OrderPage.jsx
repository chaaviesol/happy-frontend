// src/pages/OrderPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './orderpage.css';
import { useLocation, useNavigate } from "react-router-dom";
import { prismaBaseApi } from '../../../config';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
const OrderPage = ({ sales_id }) => {
    const location = useLocation();
    const fetchedSo = location?.state;
    console.log(fetchedSo);
    const axiosPrivate=useAxiosPrivate()
    const [orders, setOrders] = useState([]);
    const [status, setstatus] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const data = { sales_id }
            try {
                const response = await axiosPrivate.post(`/salesorders/history`, data);
                setOrders(response.data.data?.statusDetails);
                setstatus(response.data.data?.A)
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchData();
    }, []);
    console.log(status)

    return (
        <div style={{ height: "30vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* <h3>History</h3> */}
            <div className="vertical-line-container">
                {status.map(
                    (step, index) => (
                        <React.Fragment key={index}>
                            <div
                                style={{ position: "relative" }}
                                className={`dot ${orders.some((order) => order.status === step && order.tick) ? 'completed' : ''
                                    } ${orders.some((order) => order.status === step && order.matched) ? 'matched' : ''
                                    }`}
                            >
                                <span style={{ position: "absolute", color: "black", left: "-13px", top: "-34px", fontSize: "12px", whiteSpace: "nowrap" }}>{step}</span>
                            </div>
                            {index === status.length - 1 ? "" : <div className={`line ${orders.some((order) => order.status === step && order.tick) ?
                                step === orders[orders.length - 1].status ? 'halfcompleted' : "completed" : ""
                                }`}>

                            </div>}
                        </React.Fragment>
                    )
                )}
            </div>
        </div>
    );




};

export default OrderPage;
