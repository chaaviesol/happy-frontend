import React, { useContext, useEffect, useState } from 'react'
import Customer_Topbar from '../../../components/Customer_component/Customer_Topbar'
import "./Wishlist.css"
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Swiper, SwiperSlide } from "swiper/react";
import DoneIcon from '@mui/icons-material/Done';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { Keyboard, Pagination, Autoplay } from "swiper";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
import { prismaBaseApi } from '../../../config';
import { useDispatch } from 'react-redux';
import { trflseSetting } from '../../../Redux/SliceRedux';
import { Backdrop, CircularProgress } from '@mui/material';
import useAuth from '../../../hooks/useAuth';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
export default function Wishlist_Cntrl() {
    const [wishlist, setwishlist] = useState([])
    const [qtystate, setqtystate] = useState(1)
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate()
    const [trfls, settrfls] = useState(false)
    const [isHovered, setIsHovered] = useState({
        wishlist: false,
        cart: false,
        prdct_id: ""
    });
    const [cartClicking, setcartClick] = useState({
        cartUpdate: false,
        product_id: ''
    })
    const dispatch = useDispatch()
    const axiosPrivate = useAxiosPrivate()
    const { auth } = useAuth()

    useEffect(() => {
        axiosPrivate.get(`/customer/getwishlist`).then((res) => {
            console.log("response==========>", res.data.data);
            setwishlist(res.data.data)
            if (res.data.data) {
                setOpen(false);
            }

        })
        setOpen(true);
    }, [])
    console.log("Item to be removed:", wishlist);

    const deletewishlist = (id) => {
        const removedata = {
            customer_id: auth.logged_id,
            prod_id: id
        }
        axiosPrivate.post(`/customer/removewishlist`, removedata).then((res) => {
            console.log("response==========>", res);
            dispatch(trflseSetting())
            if (res.data.success) {
                setcartClick({ cartUpdate: false })
                toast.success(`${res.data.message}`, {
                    position: "top-right",
                    autoClose: 3000,
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
    const hovered = (event, id) => {
        console.log(event);
        console.log(id);
        if (event == "wishlist") {
            setIsHovered({ wishlist: true, cart: false, prdct_id: id })
        }
        else if (event == "cart") {
            setIsHovered({ cart: true, wishlist: false, prdct_id: id })
        }
    }
    const leave = (event) => {
        console.log(event);
        if (event == "wishlist") {
            setIsHovered({ wishlist: false, cart: false })
        }
        else if (event == "cart") {
            setIsHovered({ cart: false, wishlist: false })
        }
    }

    const clck = (get, id) => {
        if (get == "cart") {
            cartClicking.cartUpdate == false ? setcartClick({ cartUpdate: true, product_id: id }) : setcartClick({ cartUpdate: false, product_id: id })
        }
    }

    const handleRemoveFromWishlist = (productId) => {
        setwishlist((prevWishlist) =>
            prevWishlist.filter((item) => item.product_id !== productId)
        );
        return deletewishlist(productId)
    };

    const addtocart = (id) => {
        if (qtystate > 0) {
            const data = {
                prod_id: id,
                quantity: qtystate,
            };
            axiosPrivate
                .post(`/customer/addtocart`, data)
                .then((res) => {
                    // console.log(res);
                    if (res.data.success) {
                        setqtystate(1);
                        setcartClick({ cartUpdate: false });
                        toast.success(`${res.data.message}`, {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                        dispatch(trflseSetting());
                    }
                })
                .catch((error) => {
                    console.log("error====>", error.response.data);
                    toast.warning(`${error.response.data.message}`, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                });
        } else {
            toast.warning(`Input quantity`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };
    const addQuantityFn = (e) => {
        const { value } = e?.target
        if (value <= 1200) {
            setqtystate(value)
        } else {
            toast.warning("Please ensure the input quantity is less than 1200", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <ToastContainer />
            <Customer_Topbar />
            <div id='wishlist_align'>
                <div id='wishlist_alighn2'>
                    <div style={{ height: "20px" }}></div>
                    <div id='wishlist_h1'>
                        <p style={{ color: "white", fontSize: "18px" }}>Wishlist</p>
                    </div>
                    <div style={{ height: "40px" }}></div>
                    <div className='row'>
                        {wishlist.map(data =>
                            <>

                                <div className='col-sm-6'  >
                                    <div style={{ height: "16rem" }}>
                                        <div id='list_cardstyle2'>
                                            <div className='p-2' id='list_cardstyle5' style={{ cursor: "pointer" }} >
                                                <div id='products_part' onClick={() => { navigate('/product_detailed', { state: { data: data.product_name, id: data.product_id } }) }}>
                                                    <div style={{ height: "7%" }}></div>
                                                    <div id='products_part4'>
                                                        <div id='products_part2'>
                                                            <Swiper
                                                                slidesPerView={1}
                                                                spaceBetween={30}
                                                                keyboard={{
                                                                    enabled: true,
                                                                }}
                                                                autoplay={{
                                                                    delay: 2500,
                                                                    disableOnInteraction: false,
                                                                }}
                                                                pagination={{
                                                                    clickable: true,
                                                                }}
                                                                modules={[Keyboard, Pagination, Autoplay]}
                                                                className="mySwiper"
                                                            >
                                                                <SwiperSlide><img id='products_list' src={`${data.image1_link}`} className="img-fluid rounded-start" alt="..." /></SwiperSlide>
                                                                <SwiperSlide><img id='products_list' src={`${data.image2_link}`} className="img-fluid rounded-start" alt="..." /></SwiperSlide>
                                                                <SwiperSlide><img id='products_list' src={`${data.image3_link}`} className="img-fluid rounded-start" alt="..." /></SwiperSlide>
                                                            </Swiper>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "10px" }}></div>
                                                <div id='products_part2' onClick={() => {
                                                    if (cartClicking.cartUpdate === false) {
                                                        navigate('/product_detailed', { state: { data: data.product_name, id: data.product_id } });
                                                    }
                                                }}>
                                                    <div id='media_qry5'>
                                                        <p id='products_brnd_font'>{data.brand_name}</p>
                                                        <p id='products_dis_font'>Product :{data.product_name}</p>
                                                        <p id='products_dis_font'>Trade name : {data.trade_name}</p>

                                                        <div id='products_dis_flxincrmnt'>
                                                            <div id='products_dis_flxincrmnt2'>
                                                                <div id='mediaqry_align8' >
                                                                    <p id='products_dis_font' >Color : {data.color}</p>
                                                                </div>
                                                                {cartClicking.cartUpdate == true && cartClicking.product_id == data.product_id ?
                                                                    <div id='mediaqry_align8'>
                                                                        <div id='products_dis_media_Q_align_qty'>
                                                                            <div id='products_dis_media_Q'>
                                                                                <input value={qtystate} onChange={addQuantityFn} placeholder="Input quantity" type="number" />
                                                                            </div>
                                                                            <div style={{ width: "20px" }}></div>
                                                                            <div onClick={() => { addtocart(data.product_id) }}>
                                                                                <DoneIcon style={{ fontSize: "35px", color: "green", margin: "-30px 00px", cursor: "pointer" }} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    : ""}
                                                            </div>


                                                        </div>

                                                        <div id='products_dis_btn_adjst'>
                                                            <div style={{ width: "20px" }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id='products_dis_btn_itemsflx'>
                                                    <div onClick={() => {
                                                        handleRemoveFromWishlist(data.product_id);
                                                    }}>
                                                        <FavoriteIcon style={{ color: "red", fontSize: "30px", cursor: "pointer" }} />
                                                    </div>
                                                    <div style={{ height: "20px" }}></div>
                                                    <div style={{ height: "20px" }}></div>
                                                    <ShoppingCartCheckoutIcon onClick={() => { clck("cart", data.product_id) }} onMouseEnter={() => { hovered("cart", data.product_id) }} onMouseLeave={() => { leave("cart") }} style={{ color: "blue", cursor: "pointer", height: "30px", width: "30px" }} />
                                                    {isHovered.cart == true && isHovered.prdct_id == data.product_id ?
                                                        <div id='products_wish_list_hover1'>
                                                            <p >Add To Cart</p>
                                                        </div>
                                                        : ""}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </>
                        )}

                    </div>
                    <button id="prfile_sidebar_dwnld_btn5" >
                        <div onClick={() => { navigate(-1) }} style={{ display: "flex" }}>
                            <CloseIcon
                                style={{ height: "20px", margin: "4px" }}
                            />
                            <div style={{ width: "5px" }}></div>
                            close
                        </div>
                    </button>
                </div>


            </div>

        </>
    )
}