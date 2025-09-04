import React, { useEffect, useState, useContext } from 'react'
import "../../components/Customer_component/Side_product_listing.css"
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { Swiper, SwiperSlide } from "swiper/react";
import AddIcon from '@mui/icons-material/Add';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { ToastContainer, toast } from "react-toastify";

// import required modules
import { Keyboard, Pagination, Autoplay } from "swiper";
import "./Supplier_view.css"
import { useNavigate } from 'react-router-dom';
import Supplier_Top from '../../components/Suppliercomponent/Supplier_Top';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
export default function Supplier_view() {
    const navigate = useNavigate()
    const [products, setproducts] = useState([])
    const axiosPrivate=useAxiosPrivate()
    useEffect(() => {
        const set = {
            trade_name: "sup84"
        }
        axiosPrivate.post(`/product/productlist`, set).then((res) => {
            console.log("res=>", res);
            setproducts(res.data)
        })
    }, [])

    return (
        <>
            <div className='p-4'>
                <Supplier_Top />
                <div style={{ height: "20px" }}></div>
                <div className='row' id='media_qry1' style={{ width: "100%", margin: "00px 50px 00px 00px" }}>
                    <>
                        {products.map(datas =>
                            <div onClick={() => { navigate("/Supplier_product_view", { state: { data: datas.product_name } }) }} className='col-sm-6'  >
                                <div style={{ height: "97%" }}>
                                    <div id='list_cardstyle2'>
                                        <div className='p-2' style={{ cursor: "pointer" }} id='list_cardstyle' >
                                            <div id='products_part' >
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
                                                            <SwiperSlide> <img id='products_list' src={`${datas.image1_link}`} className="img-fluid rounded-start" alt="..." /></SwiperSlide>
                                                            <SwiperSlide> <img id='products_list' src={`${datas.image2_link}`} className="img-fluid rounded-start" alt="..." /></SwiperSlide>
                                                            <SwiperSlide> <img id='products_list' src={`${datas.image3_link}`} className="img-fluid rounded-start" alt="..." /></SwiperSlide>
                                                        </Swiper>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ width: "10px" }}></div>
                                            <div id='products_part2'>
                                                <div id='media_qry5' >
                                                    <p id='products_brnd_font'></p>
                                                    <p id='products_dis_font' >Product :{datas.product_name} </p>
                                                    <p id='products_dis_font'>Trade name : {datas.trade_name.trade_name}</p>
                                                    <div id='products_dis_flxincrmnt'>
                                                        <div id='products_dis_flxincrmnt2'>
                                                            <div id='mediaqry_align8' >
                                                                <p id='products_dis_font' >Color :{datas.color} </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <br />
                                                    <br />
                                                    <div id='products_dis_btn_adjst'>
                                                        <div style={{ width: "20px" }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id='products_part3'>
                                                <div style={{ height: "1rem" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                            </div>
                        )}
                    </>
                    <div id='Sp_prdct_view_btnalign'>
                        <button onClick={() => { navigate("/supplier_adding_products") }} class="Sp_prdct_view_btn">
                            <span class="Sp_prdct_view_span">
                                <span>
                                    <AddIcon className='svg-icon' />
                                </span>
                            </span>
                            <span class="lable">Add Item</span>
                        </button>
                    </div>
                    {/* <button id="prfile_sidebar_dwnld_btn8" >
                        <div style={{ display: "flex" }}>
                            <CloseIcon
                                style={{ height: "20px", margin: "4px" }}
                            />
                            <div style={{ width: "5px" }}></div>
                            close
                        </div>
                    </button> */}
                </div>
            </div>
        </>
    )
}
