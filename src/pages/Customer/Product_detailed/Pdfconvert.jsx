import React, { useEffect, useState } from "react";
// Import Swiper React components
import CloseIcon from '@mui/icons-material/Close';
// Import Swiper styles
import "./profile.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import html2pdf from 'html2pdf.js';
import { prismaBaseApi } from "../../../config";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
export default function Pdfconvert() {
    const [productspec, setproductspec] = useState([])
    const [Product_res, setproduct_res] = useState({});
    const location = useLocation();
    const passedData = location.state.data;
    console.log(passedData);
    const passingData = {
        type: "detail",
        prod_name: passedData,
    };
    const navigate = useNavigate()
    const axiosPrivate=useAxiosPrivate()
    useEffect(() => {
        if (passedData) {
            axiosPrivate
                .post(`/product/proddetails`, passingData)
                .then((res) => {
                    setproduct_res(res.data);
                    const spec = Object.entries(res.data.product_spec)
                    setproductspec(spec)
                    console.log("result====>", productspec);
                });
        }
    }, []);
    console.log("passing data===>", productspec);
    const downloadPDF = () => {
        const element = document.getElementById('pdf-content');
        const opt = {
            margin: 10,
            filename: 'your_file_name.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        html2pdf()
            .from(element)
            .set(opt)
            .save();
    };
    return (
        <>
            <div id="pdf_contents">
                <div style={{ width: "600px" }} >
                    <div style={{ height: "30px" }}></div>
                    <div id="pdf-content">
                        <div id="prfile_sidebar_brand_alighn_scnd2">
                            <p id="prfile_brand_fnt2">{Product_res.brand_name}</p>
                        </div>
                        <div style={{ height: "30px" }}></div>
                        <div id="pdf_cnvrt_alighn">
                            <img id="pdf_cnvrt_img" src={`${Product_res.image1_link}`} alt="" />
                            <img id="pdf_cnvrt_img" src={`${Product_res.image2_link}`} alt="" />
                            <img id="pdf_cnvrt_img" src={`${Product_res.image3_link}`} alt="" />
                        </div>
                        <div style={{ height: "30px" }}></div>
                        <div id="prfile_sidebar_section_dtl_text_flx">
                            <p id="prfile_sidebar_section_ptag">
                                Product Name :&nbsp;
                                <span id="prfile_sidebar_font">
                                    {" "}
                                    {Product_res.product_desc}
                                </span>
                            </p>
                            <div style={{ width: "150px" }}>
                                <p id="prfile_sidebar_section_ptag2"> Category:</p>
                            </div>
                        </div>
                        <div id="prfile_sidebar_section_dtl_text_flx">
                            <p id="prfile_sidebar_section_ptag">
                                Product Description :&nbsp;
                                <span id="prfile_sidebar_font">
                                    {Product_res.product_name}
                                </span>{" "}
                            </p>
                        </div>
                        <div id="prfile_sidebar_section_dtl_text_flx">
                            <div style={{ display: "flex" }}>
                                <p id="prfile_sidebar_section_ptag">
                                    Color Family :&nbsp;
                                </p>
                                <div
                                    id="prfile_sidebar_Clr_bx"
                                    style={{
                                        backgroundColor: `${Product_res.color_family}`,
                                    }}
                                ></div>
                            </div>
                            <p id="prfile_sidebar_section_ptag2">
                                Color Name :{" "}
                                <span id="prfile_sidebar_font">
                                    {Product_res.color}
                                </span>
                            </p>
                        </div>
                        <div id="prfile_sidebar_section_dtl_text_flx">
                            <p id="prfile_sidebar_section_ptag">
                                Sub Type :&nbsp;{" "}
                                <span id="prfile_sidebar_font">
                                    {Product_res.product_type}
                                </span>
                            </p>
                            <p id="prfile_sidebar_section_ptag2">
                                Sub Type Two :&nbsp;{" "}
                                <span id="prfile_sidebar_font">
                                    {Product_res.product_sub_type}
                                </span>
                            </p>
                        </div>
                        <div id="prfile_sidebar_section_dtl_text_flx" style={{ display: "flex" }}>
                            <p id="prfile_sidebar_section_ptag">
                                Package :&nbsp;{" "}
                                <span id="prfile_sidebar_font">
                                    {Product_res.package}{" "}
                                </span>
                            </p>
                            <p id="prfile_sidebar_section_ptag2">
                                Number Of Items :&nbsp;
                                <span id="prfile_sidebar_font">
                                    {Product_res.no_of_items}
                                </span>
                            </p>
                        </div>
                        <div id="prfile_sidebar_section_dtl_text_flx">
                            <p id="prfile_sidebar_section_ptag">
                                Unit Of Measure :&nbsp;
                                <span id="prfile_sidebar_font">
                                    {Product_res.unit_of_measure}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p id="prfile_sidebar_section_ptag" style={{ textAlign: "start" }}>specs :</p>
                            <div style={{ width: "20px" }}></div>
                            <div className="row" style={{ display: "flex" }}>
                                {productspec.map(([key, value]) =>
                                    <div className="col-sm-3" >
                                        <div style={{ width: "20px" }}></div>
                                        <div id="prfile_sidebar_section_dtl_text_flx" style={{ display: "flex" }} key={key}>
                                            <p id="prfile_sidebar_font">
                                                {key}:&nbsp;
                                                <span id="prfile_sidebar_font">
                                                    {value}
                                                </span>
                                            </p>
                                        </div>
                                        <div style={{ width: "20px" }}></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={{ height: "50px" }}></div>
                    <div style={{ display: "flex", justifyContent: "center" }}>

                        <button onClick={() => { downloadPDF() }} id="prfile_sidebar_dwnld_btn1" >
                            <FileDownloadIcon
                                style={{ fontSize: "25px" }}
                            />
                            <p className="prfile_sidebar_dwnld_PTG">Download</p>
                        </button>

                        <div style={{ width: "10px" }}></div>
                        <button onClick={() => { navigate(-1) }} id="prfile_sidebar_dwnld_btn4" >
                            <CloseIcon
                                style={{ fontSize: "25px" }}
                            />
                            <p className="prfile_sidebar_dwnld_PTG">Close</p>
                        </button>

                    </div>

                    <div style={{ height: "50px" }}></div>
                </div>
            </div>
        </>
    )
}

