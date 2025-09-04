import React, { useEffect, useRef, useState, useContext } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import FavoriteIcon from "@mui/icons-material/Favorite";
// Import Swiper styles
import DoneIcon from "@mui/icons-material/Done";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useLocation, useNavigate } from "react-router-dom";
import "./profile.css";
import { Keyboard, Pagination, Autoplay, Navigation } from "swiper";
import Customer_Topbar from "../../../components/Customer_component/Customer_Topbar";
import { prismaBaseApi } from "../../../config";
import { useDispatch } from "react-redux";
import { trflseSetting } from "../../../Redux/SliceRedux";
import { Backdrop, CircularProgress } from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export default function () {
  const [Product_res, setproduct_res] = useState({});
  const [carttrflstate, setcarttrflstate] = useState(false);
  const [qtystate, setqtystate] = useState(1);
  const [parent_Data, setparent_Data] = useState([]);
  const [product_temp, setproduct_temp] = useState("");
  const [open, setOpen] = React.useState(false);
  const [swiperRef, setSwiperRef] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const passedData = product_temp ? product_temp : location.state.id;

  const passingData = {
    type: "detail",
    product_id: passedData,
  };
  const axiosPrivate=useAxiosPrivate()
  const dispatch = useDispatch();
  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (passedData) {
      axiosPrivate
        .post(`/product/proddetails`, passingData)
        .then((res) => {
          setproduct_res(res.data);
          console.log("result====>", res);
          if (res.data) {
            setOpen(false);
          }
        });
      const data = {
        product_id: location.state?.id,
      };

      axiosPrivate.post(`/product/varient`, data).then((res) => {
        console.log("res==>", res);
        setparent_Data(res.data?.data);
      });
    }
  }, [product_temp]);
  console.log("location.state==>", location.state?.id);
  const addToCart = (id) => {
    console.log(id);
    const data = {
      customer_id: auth.logged_id,
      prod_id: id,
      quantity: qtystate,
    };

    axiosPrivate.post(`/customer/addtocart`, data).then((res) => {
      console.log(res);
      if (res.data.success) {
        setcarttrflstate(false);
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
    });
  };
  const wislistcall = (id) => {
    console.log(id);
    const wishdata = {
      customer_id: auth.logged_id,
      prod_id: id,
    };
    axiosPrivate.post(`/customer/wishlist`, wishdata).then((res) => {
      console.log("res====>", res.data);
      if (res.data.success) {
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
    });
  };
  const breakpoints = {
    320: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
  };
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [Product_res]);
  return (
    <>
      <ToastContainer />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div id="prfl_alighn">
        <div className="p-4" id="prfl_sidebar_central_sec">
          <Customer_Topbar />
          <div style={{ height: "60px" }}></div>
          <div id="profile_section_start">
            <div className="p-2" id="profile_section_alignment">
              <div id="profile_section_align">
                <div id="profile_section_first">
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
                    <SwiperSlide>
                      <img
                        id="prfile_sdbr_imgTag"
                        src={Product_res.image1_link}
                        alt=""
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img
                        id="prfile_sdbr_imgTag"
                        src={Product_res.image2_link}
                        alt=""
                      />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img
                        id="prfile_sdbr_imgTag"
                        src={Product_res.image3_link}
                        alt=""
                      />
                    </SwiperSlide>
                  </Swiper>
                </div>
                <div className="p-4" id="profile_section_second">
                  <div id="profile_stion_inner">
                    <p style={{ fontSize: "20px" }}>
                      {Product_res?.brand?.brand_name}
                    </p>
                    <div style={{ width: "100%", display: "flex" }}>
                      <p style={{ textAlign: "start", fontSize: "0.8rem" }}>
                        <span style={{ fontWeight: "600" }}>Product name </span>{" "}
                        : {Product_res?.product_name}
                      </p>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <p style={{ textAlign: "start", fontSize: "0.8rem" }}>
                        <span style={{ fontWeight: "600" }}>Description</span> :{" "}
                        {Product_res?.dis}
                      </p>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <p style={{ textAlign: "start", fontSize: "0.8rem" }}>
                        <span style={{ fontWeight: "600" }}>No of items </span>{" "}
                        : {Product_res?.no_of_items}
                      </p>
                      <p
                        style={{
                          textAlign: "start",
                          fontSize: "0.8rem",
                          marginLeft: "auto",
                        }}
                      >
                        <span style={{ fontWeight: "600" }}>Category </span> :{" "}
                        {Product_res?.product_type}
                      </p>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <div style={{ display: "flex" }}>
                        <p style={{ textAlign: "start", fontSize: "0.8rem" }}>
                          <span style={{ fontWeight: "600" }}>
                            Color family{" "}
                          </span>{" "}
                          :
                        </p>
                        &nbsp;
                        <div
                          style={{
                            backgroundColor: `${Product_res.color_family}`,
                            width: "20px",
                            height: "20px",
                            borderRadius: "5px",
                          }}
                        ></div>
                      </div>
                      <p
                        style={{
                          textAlign: "start",
                          fontSize: "0.8rem",
                          marginLeft: "auto",
                        }}
                      >
                        <span style={{ fontWeight: "600" }}>Color name </span> :{" "}
                        {Product_res?.color}
                      </p>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <p style={{ textAlign: "start", fontSize: "0.8rem" }}>
                        <span style={{ fontWeight: "600" }}>Sub type </span> :{" "}
                        {Product_res?.product_sub_type}
                      </p>
                      <p
                        style={{
                          textAlign: "start",
                          fontSize: "0.8rem",
                          marginLeft: "auto",
                        }}
                      >
                        <span style={{ fontWeight: "600" }}>sub type two </span>{" "}
                        : {Product_res?.prod_subtype2}
                      </p>
                    </div>
                    <div style={{ width: "100%", display: "flex" }}>
                      <p style={{ textAlign: "start", fontSize: "0.8rem" }}>
                        <span style={{ fontWeight: "600" }}>
                          Units of measure{" "}
                        </span>{" "}
                        : {Product_res?.unit_of_measure}
                      </p>
                      <p
                        style={{
                          textAlign: "start",
                          fontSize: "0.8rem",
                          marginLeft: "auto",
                        }}
                      >
                        <span style={{ fontWeight: "600" }}>Package </span> :{" "}
                        {Product_res?.package}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div>
                <div id="prfile_sidebar_last_sec">
                  <button id="prfile_sidebar_dwnld_btn">
                    <div
                      onClick={() => {
                        navigate("/pdfconvert", {
                          state: {
                            data: Product_res.product_name,
                            id: Product_res.product_id,
                          },
                        });
                      }}
                      style={{ display: "flex" }}
                    >
                      <FileDownloadIcon
                        style={{ height: "20px", margin: "4px" }}
                      />
                      <div style={{ width: "5px" }}></div>
                      Download
                    </div>
                  </button>
                  <div style={{ width: "20px", height: "20px" }}></div>
                  <button
                    onClick={() => {
                      wislistcall(Product_res.product_id);
                    }}
                    id="prfile_sidebar_dwnld_btn2"
                  >
                    <div style={{ display: "flex" }}>
                      <FavoriteIcon
                        o
                        style={{ height: "20px", margin: "4px" }}
                      />
                      <div style={{ width: "5px" }}></div>
                      Add wishlist
                    </div>
                  </button>
                  <div style={{ width: "20px", height: "20px" }}></div>
                  <button
                    onClick={() => {
                      if (carttrflstate) {
                        setcarttrflstate(false);
                      } else {
                        setcarttrflstate(true);
                      }
                    }}
                    id="prfile_sidebar_dwnld_btn3"
                  >
                    <div style={{ display: "flex" }}>
                      <ShoppingCartCheckoutIcon
                        style={{ height: "20px", margin: "4px" }}
                      />
                      <div style={{ width: "5px" }}></div>
                      Add cart
                    </div>
                  </button>
                  <div style={{ width: "20px", height: "20px" }}></div>
                  {carttrflstate ? (
                    <>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div id="prfile_sidebar_inmt_align">
                          <button
                            id="products_dis_btn_size2"
                            onClick={() => {
                              if (qtystate > 1) {
                                setqtystate(qtystate - 1);
                              }
                            }}
                          >
                            -
                          </button>
                          <p id="products_dis_btn_size2">{qtystate}</p>
                          <button
                            id="products_dis_btn_size2"
                            onClick={() => {
                              setqtystate(qtystate + 1);
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div style={{ width: "20px" }}></div>
                        <div
                          onClick={() => {
                            addToCart(Product_res.product_id);
                          }}
                        >
                          <DoneIcon
                            style={{
                              fontSize: "35px",
                              color: "green",
                              margin: "-30px 00px",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>

          {parent_Data ? (
            <>
              <div style={{ height: "100px" }}></div>
              <div className="profile_sub_listing p-4">
                <p className="profile_sub_listing_colors">
                  {" "}
                  <span style={{ color: "#00342e" }}>M</span>ore colors
                </p>
                <div style={{ height: "100px" }}></div>

                <Swiper
                  onSwiper={setSwiperRef}
                  modules={[Navigation]}
                  slidesPerView={3}
                  spaceBetween={30}
                  navigation={true}
                  pagination={{
                    type: "fraction",
                  }}
                  breakpoints={breakpoints}
                  className="mySwiper"
                >
                  {parent_Data?.map((data) => (
                    <SwiperSlide
                      key={data}
                      onClick={() => {
                        setproduct_temp(data.product_id);
                      }}
                    >
                      <div className="profile_sub_listing_slider">
                        <div style={{ width: "100%", height: "150px" }}>
                          <img
                            src={data.image1_link}
                            className="profile_sub_listing_img"
                            alt=""
                          />
                        </div>
                        <div>
                          <div>
                            <p style={{ textAlign: "center" }}>
                              {data.brand.brand_name}
                            </p>
                          </div>
                          <br />
                          <p
                            className="profile_sub_listing_names"
                            style={{ textAlign: "start" }}
                          >
                            {" "}
                            Product name:{" "}
                            <span className="profile_sub_listing_SP">
                              {" "}
                              {data.product_name}
                            </span>
                          </p>
                          <div
                            style={{
                              display: "flex",
                              height: "40px",
                              alignItems: "center",
                            }}
                          >
                            <p style={{ height: "10px" }}>Color: </p>
                            &nbsp;
                            <div
                              style={{
                                backgroundColor: data.color_family,
                                width: "20px",
                                height: "20px",
                                borderRadius: "5px",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div style={{ height: "100px" }}></div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}
