import React, { useEffect, useRef, useState } from 'react'
import "./Adm_service_request.css"
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment/moment'
import { Swiper, SwiperSlide } from "swiper/react";
import SearchIcon from '@mui/icons-material/Search';
import { Box, Modal, Typography } from '@mui/material'
import { Style } from '@mui/icons-material'
import { Keyboard, Pagination, Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { filter, slice } from 'lodash'
import { prismaBaseApi } from '../../../../config'
import Newtopbar_ from '../../../../components/admin components/Newtopbar_'
import { useDispatch } from 'react-redux'
import { trflseSetting } from '../../../../Redux/SliceRedux'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate'
export default function Adm_service_request() {
    const location = useLocation()
    const [products, setproducts] = useState({})
    const [cndtionproducts, setcndtionproducts] = useState([])
    const [searchBox, setsearchBox] = useState(false)
    const [notification, setnotification] = useState([])
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false);
    const [sliderOpen, setsliderOpen] = useState(false)
    const [popupreturn, setpopupreturn] = useState({
        condition: false,
        id: ""
    })
    const [sliderDt, setsliderDt] = useState({
        img1: "",
        img2: "",
        img3: ""
    })

    const [btncdtion, setbtncdtion] = useState({
        service: true,
        return: false
    })

    const axiosPrivate = useAxiosPrivate()

    const navigate = useNavigate()
    const searchCus = useRef(null)
    const searchInp = useRef(null)

    useEffect(() => {
        axiosPrivate.post(`/order/service_reqlist`).then((res) => {
            console.log("res==>", res)
            setproducts(res.data)
        })
    }, [])

    const checkingFn = (name) => {
        if (name == "service") {
            setbtncdtion({ service: true })
        } else {
            setbtncdtion({ return: true, service: false })
        }
    }

    useEffect(() => {
        if (btncdtion.service) {
            setcndtionproducts(products.service_request)
        } else {
            setcndtionproducts(products.return_request)
        }
    }, [btncdtion, products])

    const admResponce = (res, id, index, cus_id, so_number) => {


        if (res == "accept") {
            let data = {}
            if (btncdtion.service) {
                data = {
                    status: "accept",
                    request: "service_request",
                    id: id,
                    customer_id: cus_id,
                    so_number: so_number

                }
            } else if (btncdtion.return) {
                data = {
                    status: "accept",
                    request: "return_request",
                    id: id,
                    customer_id: cus_id,
                    so_number: so_number


                }
                setpopupreturn({ id: id, condition: true })
            }

            axiosPrivate.post(`/order/request_confirm`, data).then((res) => {
                console.log("res>>>>", res)
                if (res.data.success) {
                    const oldprdcts = [...cndtionproducts];
                    oldprdcts.splice(index, 1);
                    setcndtionproducts(oldprdcts);
                    console.log("oldprdcts", oldprdcts)
                    handleSelect(so_number)
                    toast(res.data.msg, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
            })
            console.log("data===>", data)

        } else if (res == "reject") {
            let data = {}
            if (btncdtion.service) {
                data = {
                    status: "reject",
                    request: "service_request",
                    id: id,
                    customer_id: cus_id,
                    so_number: so_number



                }
            } else if (btncdtion.return) {
                data = {
                    status: "reject",
                    request: "return_request",
                    id: id,
                    customer_id: cus_id,
                    so_number: so_number

                }
            }
            axiosPrivate.post(`/order/request_confirm`, data).then((res) => {
                console.log("res>>>>", res)
                if (res.data.success) {
                    const oldprdcts = [...cndtionproducts];
                    oldprdcts.splice(index, 1);
                    setcndtionproducts(oldprdcts);
                    console.log("oldprdcts", oldprdcts)
                    handleSelect(so_number)
                    toast(res.data.msg, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }
            })
            console.log("data===>", data)

        }


    }

    const customerfilter = (e) => {
        const inputValue = e.target.value;
        const query = inputValue.toLowerCase();
        const filteredData = cndtionproducts.filter((data) =>
            data.users.user_name.toLowerCase().includes(query)
        );
        const remainingData = cndtionproducts.filter(
            (data) => !data.users.user_name.toLowerCase().includes(query)
        );

        setcndtionproducts([...filteredData, ...remainingData]);
    }
    useEffect(() => {
        const closeBoxes = (event) => {
            if (
                !searchBox.current?.contains(event.target)
            ) {
                setsearchBox(false)
            }

        };
        document.body.addEventListener("click", closeBoxes, true);
        setOpen(true);
        return () => document.body.removeEventListener("click", closeBoxes);
    }, []);
    useEffect(() => {
        searchInp.current?.focus()
    }, [searchBox])
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };
    const reutruningProd = (data, index) => {
        console.log("data===>", data)
        axiosPrivate.post(`/order/return_accept`, data).then((res) => {
            console.log(res)
            if (res.data.success) {
                const oldprdcts = [...cndtionproducts];
                oldprdcts.splice(index, 1);
                setcndtionproducts(oldprdcts);
                console.log(index)
                console.log(data)
                handleSelect(data.sales_list.so_number)
                toast(res.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        })

    }
    const handleSelect = (id) => {
        const filternoti = notification.filter((ele => (ele.verification_id == id && ele.read == "N")))
        console.log("filternoti>>>>>", filternoti)
        if (filternoti[0]) {
            const id = {
                id: filternoti[0]?.id
            }
            axiosPrivate.post(`/notification/admread_notification`, id).then((res) => {
                console.log("res>>>>", res)
                dispatch(trflseSetting())
            })
        }
    };
    useEffect(() => {
        axiosPrivate.post(`/notification/getadm_notification`).then((res) => {
            setnotification(res.data.admin_notification)
        })
    }, [])

    return (
        <>
            <ToastContainer />
            <Newtopbar_ />
            <Modal
                open={sliderOpen}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"

            >
                <Box sx={{ ...style, width: 400, backgroundColor: 'white', padding: "0px", height: "370px" }} >
                    <div className='p-3'>

                        <div style={{ height: "300px", width: "100%" }}>
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={30}
                                keyboard={{
                                    enabled: true,
                                }}

                                pagination={{
                                    clickable: true,
                                }}
                                navigation={true}
                                modules={[Keyboard, Pagination, Navigation]}
                                className="mySwiper"
                            >
                                <SwiperSlide>
                                    <img
                                        id="prfile_sdbr_imgTag"
                                        src={sliderDt.img1}
                                        alt=""
                                    />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img
                                        id="prfile_sdbr_imgTag"
                                        src={sliderDt.img2}
                                        alt=""
                                    />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img
                                        id="prfile_sdbr_imgTag"
                                        src={sliderDt.img3}
                                        alt=""
                                    />
                                </SwiperSlide>
                            </Swiper>
                        </div>
                        <div style={{ height: "7px" }}></div>
                        <div id='adm_srv_buttons'>
                            <button onClick={() => { setsliderOpen(false); setpopupreturn({ condition: true }) }} id='adm_srv_buttons1'>Back</button>
                        </div>
                    </div>

                </Box>
            </Modal>
            <div className='p-3' id='adm_srv_start'>
                <div id='adm_srv_cus_name'>
                    <div id='adm_srv_head'>
                        <p id='adm_srv_ptag'>Service requests & Returns</p>
                    </div>
                    <div>
                        <div style={{ height: "30px" }}></div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <div id='adm_srv_Box'>
                                <div id='adm_srv_Buttons'>
                                    <button style={{ boxShadow: btncdtion.service ? "rgba(0, 0, 0, 0.45) 0px 25px 20px -20px" : 'rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset' }} onClick={() => { checkingFn("service") }} id='adm_srv_Buttons1'>Service requests</button>
                                    <button style={{ boxShadow: btncdtion.return ? "rgba(0, 0, 0, 0.45) 0px 25px 20px -20px" : 'rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset' }} onClick={() => { checkingFn("return") }} id='adm_srv_Buttons2'>Returns</button>
                                </div>
                                <div id='adm_srv_contents' style={{ borderBottom: "1px solid black" }}>
                                    <div id='adm_srv_contents1'>
                                        <p id='adm_srv_contents_ptg'>Sl no</p>
                                    </div>
                                    <div id='adm_srv_contents2'>
                                        <div>
                                            <div style={{ display: "flex", height: "10px" }}>
                                                <SearchIcon onClick={() => { setsearchBox(true) }} fontSize='25px' style={{ cursor: "pointer" }} />
                                                <p id='adm_srv_contents_ptg'>Customer name</p>
                                            </div>
                                            {searchBox ?
                                                <div ref={searchCus} className='p-3' id='adm_srv_cus_fil'>
                                                    <p id='adm_srv_search_ptg'>Search customer</p>
                                                    <input ref={searchInp} onChange={customerfilter} onFocus={true} id='adm_srv_inp_styling' type="text" />
                                                </div>
                                                : ""}
                                        </div>
                                    </div>
                                    <div id='adm_srv_contents3'>
                                        <p id='adm_srv_contents_ptg'>Product</p>
                                    </div>
                                    <div id='adm_srv_contents4'>
                                        <p id='adm_srv_contents_ptg'>Image</p>
                                    </div>
                                    <div id='adm_srv_contents5'>
                                        <p id='adm_srv_contents_ptg'>Qty</p>
                                    </div>
                                    <div id='adm_srv_contents6'>
                                        <p id='adm_srv_contents_ptg'>Created date</p>
                                    </div>
                                    <div id='adm_srv_contents7'>
                                        <p id='adm_srv_contents_ptg'>Remarks</p>
                                    </div>
                                    <div id='adm_srv_contents8'>
                                        <p id='adm_srv_contents_ptg'>Purchase date</p>
                                    </div>
                                    <div id='adm_srv_contents9'>
                                        <p id='adm_srv_contents_ptg'>Response</p>
                                    </div>
                                </div>
                                <div id='adm_srv_content_row'>
                                    {cndtionproducts?.map((data, index) =>
                                        <>
                                            <div id='adm_srv_contents' key={data.id}>
                                                <div id='adm_srv_contents1'>
                                                    <p id='adm_srv_contents_ptg'>{index + 1}</p>
                                                </div>
                                                <div id='adm_srv_contents2'>
                                                    <p id='adm_srv_contents_ptg'>Alan</p>
                                                </div>
                                                <div id='adm_srv_contents3'>
                                                    <p id='adm_srv_contents_ptg'>{data.sales_list?.product_master?.product_name}</p>
                                                </div>
                                                <div id='adm_srv_contents4'>
                                                    <img style={{ cursor: "pointer" }} onClick={() => { setsliderOpen(true); setsliderDt({ img1: data.photos?.photo1, img2: data.photos?.photo2, img3: data.photos?.photo3 }) }} id='adm_srv_img' src={data.photos?.photo1} alt="" />
                                                </div>
                                                <div id='adm_srv_contents5'>
                                                    <p id='adm_srv_contents_ptg'>{data.product_qty}</p>
                                                </div>
                                                <div id='adm_srv_contents6'>
                                                    <p id='adm_srv_contents_ptg'>{moment(data?.created_date).format("DD/MM/YYYY")}</p>
                                                </div>
                                                <div id='adm_srv_contents7'>
                                                    <p id='adm_srv_contents_ptg'>{data.remarks}</p>
                                                </div>
                                                <div id='adm_srv_contents6'>
                                                    <p id='adm_srv_contents_ptg'>{moment(data.sales_list?.sales_order_new?.created_date).format("DD/MM/YYYY")}</p>
                                                </div>
                                                <div id='adm_srv_contents6'>
                                                    <div>
                                                        {btncdtion.return ?
                                                            popupreturn.condition && popupreturn.id == data.id ?
                                                                <div id='adm_srv_cont_btns'>
                                                                    <button onClick={() => { reutruningProd({ type: "inventory", id: data.id, refundable_amt: data.refundable_amt, sales_list_id: data.sales_list_id, sales_list: { product_id: data.sales_list.product_id, product_qty: data.product_qty, batch: data.sales_list.batch, so_number: data.sales_list.sales_order_new.so_number, customer_id: data.created_by } }, index) }} id='adm_srv_buttons4'>Inventory</button>
                                                                    <div style={{ width: "5px" }}></div>
                                                                    <button onClick={() => { reutruningProd({ type: "scrap_inventory", id: data.id, refundable_amt: data.refundable_amt, sales_list_id: data.sales_list_id, sales_list: { product_id: data.sales_list.product_id, product_qty: data.product_qty, batch: data.sales_list.batch, so_number: data.sales_list.sales_order_new.so_number, customer_id: data.created_by } }) }} id='adm_srv_buttons5'>Scrap</button>
                                                                </div>
                                                                :
                                                                <div style={{ display: "flex" }}>
                                                                    <button onClick={() => { admResponce("reject", data.id, index, data.created_by, data.sales_list.sales_order_new.so_number) }} id='adm_srv_buttons2'>Reject</button>
                                                                    <div style={{ width: "5px" }}></div>
                                                                    <button onClick={() => { setpopupreturn({ condition: true, id: data.id }) }} id='adm_srv_buttons3'>Accept</button>
                                                                </div>
                                                            :
                                                            <div style={{ display: "flex" }}>
                                                                <button onClick={() => { admResponce("reject", data.id, index, data.created_by, data.sales_list.sales_order_new.so_number) }} id='adm_srv_buttons2'>Reject</button>
                                                                <div style={{ width: "5px" }}></div>
                                                                <button onClick={() => { admResponce("accept", data.id, index, data.created_by, data.sales_list.sales_order_new.so_number) }} id='adm_srv_buttons3'>Accept</button>
                                                            </div>}
                                                        <div style={{ height: '3px' }}></div>

                                                    </div>

                                                </div>
                                            </div >
                                            <br />
                                        </>
                                    )}
                                </div>

                            </div>

                        </div>
                        <div style={{ height: "30px" }}></div>
                        <div id='adm_srv_buttons'>
                            <button onClick={() => { navigate(-1) }} id='adm_srv_buttons1'>Back</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

