import React from 'react'
import "../Product_cart/Cart.css"
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import { useState } from 'react';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Customer_Topbar from '../../../components/Customer_component/Customer_Topbar';
import { useEffect } from 'react';
import { prismaBaseApi } from '../../../config';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

export default function Cus_order_confirm_cntrl() {
    const [incrementbx, setincrementbx] = useState(false)
    const [accesory_id, setaccesory_id] = useState({})
    const [sales_id, setsales_id] = useState("")
    const [qtyincrement, setqtyincrement] = useState(1)
    const [products, setproducts] = useState([])
    const [RejectPopup, setRejectPopup] = useState(false)
    const [Rejecting_data, setRejecting_data] = useState({})
    const [total_amt, settotal_amt] = useState("")
    const axiosPrivate = useAxiosPrivate()

    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        const data = {
            sales_id: location.state.data
        };
        axiosPrivate.post(`/sales/respond_details`, data).then((res) => {
            console.log("res==>", res);
            const updatedProducts = res.data.products.map((product, index) => {
                let accessory_dt = product.product_accessory.map((accessory, index) => {
                    const qtyacc = parseInt(accessory.order_qty);
                    const sales_priceacc = parseInt(accessory.sales_price);
                    const accTl_amt = sales_priceacc * qtyacc;
                    return { ...accessory, net_amts: accTl_amt };
                });
                return { ...product, product_accessory: accessory_dt };
            });
            setproducts(updatedProducts);
            setsales_id(res.data.sales_id);
            settotal_amt(res.data.total_amount);
        });
    }, [location.state.data]);

    console.log("products====>", products)
    useEffect(() => {

        AOS.init({
            once: true,
        });
    }, [])
    const accViewfn = (prod_id) => {
        const product_id = prod_id
        if (accesory_id.accessory && accesory_id.id == prod_id) {
            setaccesory_id({ id: product_id, accessory: false })
        } else {
            setaccesory_id({ id: product_id, accessory: true })
        }
    }
    const accept_data = () => {
        const data = {
            sales_id: sales_id,
            so_status: "placed"
        }
        axiosPrivate.post(`/sales/confirm_salesorder`, data).then((res) => {
            console.log(res)
            if (res.data.success) {
                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",

                });
                setTimeout(() => {
                    navigate("/customer_orders")
                }, 2000);
            }
        })
    }

    const rejectOrder = () => {
        const data = {
            sales_id: sales_id,
            so_status: "quote_rejected",
            remarks: Rejecting_data.reason
        }
        axiosPrivate.post(`/sales/confirm_salesorder`, data).then((res) => {
            console.log(res)
            if (res.data.success) {
                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",

                });
                setTimeout(() => {
                    navigate("/customer_orders")
                }, 2000);
                setRejectPopup(false)
            }
        })
    }
    return (
        <>
            <ToastContainer />
            <>
                <Customer_Topbar />
                <div id='Cart_Cntrl_adjst'>
                    <div id='Cart_Cntrl_inner'>
                        <div id='Cart_Cntrl_heading'>
                            {!location?.state?.justShow ?
                                < p id='Cart_Cntrl_font1'>Quotation</p>
                                :
                                < p id='Cart_Cntrl_font1'>Requested Quotation</p>
                            }
                        </div>
                        <div style={{ height: "2rem" }}></div>
                        <div id='Cart_Cntrl_main_Bx'>
                            <div id='Cart_Cntrl_Bx_head'>
                                <div style={{ borderBottom: "1px solid black" }} id='Cart_Cntrl_sprte_bx1' >
                                    <p style={{ fontWeight: '600' }} id="mediaqry_adjst_fnt" >Sl No</p>
                                </div>
                                <div id='Cart_Cntrl_sprte_bx2' >
                                    <p style={{ fontWeight: '600' }} id="mediaqry_adjst_fnt">Product</p>
                                </div>
                                <div id='Cart_Cntrl_sprte_bx3' >
                                    <p style={{ fontWeight: '600' }} id="mediaqry_adjst_fnt">Delevery type</p>
                                </div>
                                <div id='Cart_Cntrl_sprte_bx6' >
                                    <p style={{ fontWeight: '600' }} id="mediaqry_adjst_fnt">Qty</p>
                                </div>
                                <div id='Cart_Cntrl_sprte_bx4' >
                                    <p style={{ fontWeight: '600' }} id="mediaqry_adjst_fnt">MRP</p>
                                </div>
                                {!location?.state?.justShow &&
                                    <>
                                        <div id='Cart_Cntrl_sprte_bx7' >
                                            <p style={{ fontWeight: '600' }} id="mediaqry_adjst_fnt">Rate</p>
                                        </div>
                                        <div id='Cart_Cntrl_sprte_bx9' >
                                            <p style={{ fontWeight: '600' }} id="mediaqry_adjst_fnt">Accessory amt</p>
                                        </div>
                                        <div id='Cart_Cntrl_sprte_bx8' >
                                            <p style={{ fontWeight: '600' }} id="mediaqry_adjst_fnt">Net Amt</p>
                                        </div>
                                    </>
                                }
                            </div>
                            {/* table inner datas  */}
                            <div>

                                <br />
                                {products.map((data, index) =>
                                    <>
                                        <div style={{ cursor: "pointer" }} onClick={() => { accViewfn(data.product_id) }} id='Cart_Cntrl_datas'>
                                            <div id='Cart_Cntrl_sprte_bx1'>
                                                <p id="mediaqry_adjst_fnt">{index + 1}</p>
                                            </div>
                                            <br />
                                            <div id='Cart_Cntrl_sprte_bx2' >
                                                <p id="mediaqry_adjst_fnt">{data.product_name} </p>
                                            </div>
                                            <div id='Cart_Cntrl_sprte_bx3' >
                                                <p id="mediaqry_adjst_fnt">{data.delivery_type}</p>
                                            </div>
                                            <div id='Cart_Cntrl_sprte_bx6' >
                                                <p id="mediaqry_adjst_fnt">{data.order_qty}</p>
                                            </div>
                                            <div id='Cart_Cntrl_sprte_bx4' >
                                                <p id="mediaqry_adjst_fnt">{data.mrp}</p>
                                            </div>
                                            {!location?.state?.justShow &&
                                                <>
                                                    <div id='Cart_Cntrl_sprte_bx7' >
                                                        <p id="mediaqry_adjst_fnt">{data.sales_price}</p>
                                                    </div>
                                                    <div id='Cart_Cntrl_sprte_bx9' >
                                                        <p id="mediaqry_adjst_fnt">{data.sum}</p>
                                                    </div>
                                                    <div id='Cart_Cntrl_sprte_bx8' >
                                                        <p id="mediaqry_adjst_fnt">{data.net_amount}</p>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        {accesory_id.id == data.product_id && accesory_id.accessory && data.product_accessory.length > 0 ?
                                            <div data-aos="fade-down" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                                <div style={{ width: '50%', height: "170px", border: "1px solid black", overflowY: "scroll" }}>
                                                    <div id='Cart_Cntrl_Bx_head' >
                                                        <div id='Cart_Cntrl_sprte_bx1' >
                                                            <p style={{ fontWeight: '600' }} id="mediaqry_adjst_fnt" >Sl No</p>
                                                        </div>
                                                        <div id='Cart_Cntrl_sprte_bx2' >
                                                            <p style={{ fontWeight: '600' }} id="mediaqry_adjst_fnt">Accessory Name</p>
                                                        </div>
                                                        <div id='Cart_Cntrl_sprte_bx6' >
                                                            <p style={{ fontWeight: '600' }} id="mediaqry_adjst_fnt">Qty</p>
                                                        </div>
                                                        <div id='Cart_Cntrl_sprte_bx4' >
                                                            <p style={{ fontWeight: '600' }} id="mediaqry_adjst_fnt">MRP</p>
                                                        </div>
                                                        <div id='Cart_Cntrl_sprte_bx7' >
                                                            <p style={{ fontWeight: '600' }} id="mediaqry_adjst_fnt">Rate</p>
                                                        </div>
                                                        <div id='Cart_Cntrl_sprte_bx8' >
                                                            <p style={{ fontWeight: '600' }} id="mediaqry_adjst_fnt">Net Amt</p>
                                                        </div>
                                                    </div>
                                                    {data.product_accessory.map((ele, index2) =>
                                                        <div id='Cart_Cntrl_datas'>
                                                            <div id='Cart_Cntrl_sprte_bx1'>
                                                                <p id="mediaqry_adjst_fnt">{index2 + 1}</p>
                                                            </div>
                                                            <br />
                                                            <div id='Cart_Cntrl_sprte_bx2' >
                                                                <p id="mediaqry_adjst_fnt">{ele.product_name} </p>
                                                            </div>
                                                            <div id='Cart_Cntrl_sprte_bx6' >
                                                                <p id="mediaqry_adjst_fnt">{ele.order_qty}</p>
                                                            </div>
                                                            <div id='Cart_Cntrl_sprte_bx4' >
                                                                <p id="mediaqry_adjst_fnt">{ele.mrp}</p>
                                                            </div>
                                                            <div id='Cart_Cntrl_sprte_bx7' >
                                                                <p id="mediaqry_adjst_fnt">{ele.sales_price}</p>
                                                            </div>
                                                            <div id='Cart_Cntrl_sprte_bx8' >
                                                                <p id="mediaqry_adjst_fnt">{ele.net_amts}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            : ""}
                                        <br />
                                    </>

                                )}
                            </div>

                        </div>
                        <div style={{ height: "2rem" }}></div>
                        {!location?.state?.justShow &&

                            <div id='Cart_Cntrl_last_bx_alighn'>
                                <div style={{ width: "20px" }}></div>
                                <p id='Cart_Cntrl_ptag3'>Note</p>
                                <div style={{ width: "50px" }}></div>
                                <div>
                                    <div id='mediaqry10'>
                                        <p id='Cart_Cntrl_ptag3' style={{ width: "20px" }}>1.</p>
                                        <div style={{ width: "10px" }}></div>
                                        <input id='Cart_Cntrl_last_bx_inp' type="text" />
                                    </div>
                                    <div id='mediaqry10'>
                                        <p id='Cart_Cntrl_ptag3' style={{ width: "20px" }}>2.</p>
                                        <div style={{ width: "10px" }}></div>
                                        <input id='Cart_Cntrl_last_bx_inp' type="text" />
                                        <div style={{ width: "10px" }}></div>
                                    </div>
                                    {incrementbx ?
                                        <div id='mediaqry10'>
                                            <p id='Cart_Cntrl_ptag3' style={{ width: "20px" }}>3.</p>
                                            <div style={{ width: "10px" }}></div>
                                            <input id='Cart_Cntrl_last_bx_inp' type="text" />
                                            <div style={{ width: "10px" }}></div>
                                        </div>
                                        : ""}

                                </div>
                                <div style={{ marginLeft: "auto" }} >
                                    <p>Grand total :
                                        <br />
                                        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                            <span style={{ textAlign: "center" }}>₹ {total_amt}</span>
                                        </div>
                                    </p>
                                </div>
                            </div>
                        }
                        <div style={{ height: "6rem" }}></div>
                        {!location?.state?.justShow &&
                            <div id='Cart_Cntrl_last_sec'>
                                <div id='Cart_Cntrl_last_button_align' >
                                    <button onClick={() => { navigate(-1) }} id='Cart_Cntrl_las_btns1'>

                                        <div style={{ display: "flex" }}>
                                            <CloseIcon style={{ fontSize: "23px", margin: "4px 00px 00px 00px " }} />
                                            <div style={{ width: "5px" }}></div>
                                            Close
                                        </div>
                                    </button>
                                    <div style={{ width: "10px", height: "10px" }}></div>
                                    <button id="Cart_Cntrl_las_btns5">
                                        <div onClick={() => { navigate('/downloadorder', { state: { data: location.state?.data } }) }} style={{ display: "flex" }}>
                                            <FileDownloadIcon style={{ fontSize: "21px", margin: "6px 00px 00px 00px " }} />
                                            <div style={{ width: "5px" }}></div>
                                            Download
                                        </div>
                                    </button>
                                    <div style={{ width: "10px", height: "10px" }}></div>
                                    <button id="Cart_Cntrl_las_btn4">
                                        <div onClick={() => { setRejectPopup(true) }} style={{ display: "flex" }}>
                                            <ThumbDownIcon style={{ fontSize: "21px", margin: "6px 00px 00px 00px " }} />
                                            <div style={{ width: "5px" }}></div>
                                            Reject
                                        </div>
                                    </button>
                                    <div style={{ width: "10px", height: "10px" }}></div>
                                    <button id="Cart_Cntrl_las_btns3">
                                        <div onClick={() => { accept_data() }} style={{ display: "flex" }}>
                                            <DoneIcon style={{ fontSize: "23px", margin: "4px 00px 00px 00px" }} />
                                            <div style={{ width: "5px" }}></div>
                                            Accept
                                        </div>
                                    </button>
                                </div>
                                {RejectPopup ?
                                    <div>
                                        <div className="popup-container">
                                            <div className="popups_msg">
                                                <div>
                                                    <p>Reason for rejecting</p>
                                                    <input name='reason' onChange={(e) => { setRejecting_data({ [e.target.name]: e.target.value }) }} type="text" id='' />
                                                </div>
                                                <br />
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <button onClick={() => { setRejectPopup(false) }} id='cus_ordr_cancel_btn1'>Cancel</button>
                                                    <div style={{ width: "10px" }}></div>
                                                    <button onClick={rejectOrder} id='cus_ordr_cancel_btn2'>Ok</button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''}
                            </div>
                        }
                        {location?.state?.justShow &&

                            <div id='Cart_Cntrl_last_sec'>
                                <div id='Cart_Cntrl_last_button_align' >
                                    <button onClick={() => { navigate(-1) }} id='Cart_Cntrl_las_btns1'>
                                        <CloseIcon style={{ fontSize: "23px", margin: "4px 00px 00px 00px " }} />
                                        <div style={{ width: "5px" }}></div>
                                        Close
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </>
        </>
    )
}

