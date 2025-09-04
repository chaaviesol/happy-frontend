import React from "react";
import "./Supplier_view.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Keyboard, Pagination, Autoplay } from "swiper";
import { useEffect } from "react";
import axios from "axios";
import { baseApi, prismaBaseApi } from "../../config";
import { useState } from "react";
import Supplier_Top from "../../components/Suppliercomponent/Supplier_Top";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
export default function Supplier_product_view() {
  const [Product_res, setproduct_res] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const passedData = location.state.data;
  console.log(passedData);
  const axiosPrivate=useAxiosPrivate()
  const passingData = {
    type: "detail",
    prod_name: passedData,
  };
  useEffect(() => {
    if (passedData) {
      axiosPrivate
        .post(`/product/proddetails`, passingData)
        .then((res) => {
          setproduct_res(res.data);
          console.log("result====>", res);
        });
    }
  }, []);
  return (
    <>
      <Supplier_Top />

      <div style={{ display: "flex", alignItems: "center", height: "90vh" }}>
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
                      <span style={{ fontWeight: "600" }}>Product name </span> :{" "}
                      {Product_res?.product_name}
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
                      <span style={{ fontWeight: "600" }}>No of items </span> :{" "}
                      {Product_res?.no_of_items}
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
                        <span style={{ fontWeight: "600" }}>Color family </span>{" "}
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
                      <span style={{ fontWeight: "600" }}>sub type two </span> :{" "}
                      {Product_res?.prod_subtype2}
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
          </div>
        </div>
      </div>
    </>
  );
}
