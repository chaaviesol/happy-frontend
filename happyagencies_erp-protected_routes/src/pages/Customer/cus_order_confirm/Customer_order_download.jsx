import { Margin } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import "./Cus_orderConfirm.css";
import { useLocation, useNavigate } from "react-router-dom";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloseIcon from '@mui/icons-material/Close';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
import { prismaBaseApi } from '../../../config';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

export default function Customer_order_download() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const currentDate = month + "/" + date + "/" + year;
    const location = useLocation()
    const axiosPrivate=useAxiosPrivate()
    const navigate = useNavigate();
    const [print_data, setprint_data] = useState({})
    const [products, setproducts] = useState([])
    const downloadPDF = () => {
        const element = document.getElementById('cus_odr_dwld_datas');
        const opt = {
            margin: 10,
            filename: 'your_file_name.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            injectCSS: true,
        };

        html2pdf()
            .from(element)
            .set(opt)
            .save();
    };
    useEffect(() => {
        const data = {
            sales_id: location.state.data
        }
        axiosPrivate.post(`/sales/respond_details`, data).then((res) => {
            console.log("res==>", res);
            setprint_data(res.data)
            setproducts(res.data.products)
            const fakedata = res.data
            const data = fakedata.products.map(ele => {
                const subtotal = + ele.net_amount
                return subtotal
            })
            console.log(data)
        })
    }, [])
    console.log("print_data===>", print_data);

    return (
        <div id='cus_odr_dwld' >
            <div id='cus_odr_dwld_inner'>
                <div id='cus_odr_dwld_datas' className='p-3'>
                    <div id='cus_odr_dwld_alighn'>
                        <div>
                            <div>
                                <div style={{ width: "100%", display: "flex", justifyContent: 'center' }}>
                                    <img id='cus_odr_dwld_imgtag' src="./assets/logo.png" alt="" />

                                </div>
                                <p style={{ textAlign: "center" }} id='cus_odr_dwld_Ptag1'>Happy Group </p>
                            </div>

                            <p style={{ textAlign: "center" }} className='cus_odr_dwld_imgtagptag'>Puthiyapalam ,Thali Road.</p>
                            <p style={{ textAlign: "center" }} className='cus_odr_dwld_imgtagptag'>Kozhikode - 673002.</p>
                        </div>

                    </div>
                    <div style={{ height: "30px" }}></div>
                    <div style={{ display: "flex", width: "90%", justifyContent: "end" }}>
                        <p>{currentDate}</p>
                    </div>
                    <div id='cus_odr_dwld_align2'>
                        <div id='cus_odr_dwld_align3' >
                            <br />
                            <table id='cus_odr_dwld_table' border={"1px"}>
                                <tr>
                                    <td style={{ width: "60%" }} align='start'>
                                        <div style={{ height: "30px" }}></div>

                                        Customer Name :
                                        &nbsp; <span style={{ fontSize: "15px", fontWeight: "100" }}>{print_data.user_name}
                                        </span>
                                        <br />
                                        <div style={{ height: "30px" }}></div>

                                        address:
                                        &nbsp; <span style={{ fontSize: "15px", fontWeight: "100" }}> {print_data.address?.address},{print_data.address?.building},{print_data.address?.district},{print_data.address?.state},{print_data.address?.pincode}
                                        </span>
                                        <div style={{ height: "30px" }}></div>

                                    </td>
                                    <div style={{ height: "30px" }}></div>

                                    <td align='start'>Phone:&nbsp;<span style={{ fontSize: "15px", fontWeight: "100" }}> {print_data.mobile}</span>
                                        <div style={{ height: "30px" }}></div>
                                        Remarks:&nbsp;<span style={{ fontSize: "15px", fontWeight: "100" }}> {print_data.remarks}</span>
                                        <div style={{ height: "30px" }}></div>

                                    </td>

                                </tr>

                            </table>

                        </div>

                    </div>
                    <div style={{ height: "30px" }}></div>
                    <p style={{ textAlign: "start" }}>Thank you for the inquiry and we are pleased to quote as follows: </p>
                    <div style={{ height: "30px" }}></div>
                    <div id='cus_odr_dwld_align2'>

                        <div id='cus_odr_dwld_align3' >
                            <br />

                            <table id='cus_odr_dwld_table' border={"1px"}>
                                <tr>
                                    <th>Sl no</th>
                                    <th>Product</th>
                                    <th>Color</th>
                                    <th>Qty</th>
                                    <th>MRP</th>
                                    <th>Rate</th>
                                    <th>Accessory</th>
                                    <th>Discount</th>
                                    <th>Net Amt</th>
                                </tr>
                                {products?.map((prod, index) =>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{prod.product_name} ;&nbsp;
                                            <span style={{ fontWeight: "100", fontSize: "14px", }}>
                                                {prod?.product_accessory?.map((accessory, indexs) =>
                                                    <>
                                                        {accessory.product_name},&nbsp;
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td>{prod.color}</td>
                                        <td>{prod.order_qty}</td>
                                        <td>{prod.mrp}</td>
                                        <td>{prod.sales_price}</td>
                                        <td>{prod.sum}</td>
                                        <td>{prod.discount}%</td>
                                        <td>{prod.net_amount}</td>
                                    </tr>
                                )}

                            </table>

                        </div>

                    </div>
                    <div style={{ height: "30px" }}></div>
                    <p style={{ textAlign: "start" }}> Note: FREIGHT CHARGES EXTRA.  </p>
                    <div style={{ display: "flex", justifyContent: "end" }}>
                        <div style={{ width: "30%", height: "100px" }}>
                            <table id='cus_odr_dwld_table' border={"1px"}>
                                <tr>
                                    <td>Discount  </td>
                                    <td>{print_data.discount}% </td>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td>{print_data.total_amount} </td>
                                </tr>




                            </table>
                        </div>
                    </div>
                    <div>
                        <p style={{ textAlign: "start" }}>
                            We will be happy to supply any further information you may need and trust you will call on us to fill your order which
                            will receive our prompt and careful attention. </p>
                    </div>
                </div>
                <div style={{ height: "100px" }}></div>
                <div id='Cart_Cntrl_las_dwldBtns'>

                    <button onClick={() => { navigate(-1) }} id='Cart_Cntrl_las_btns1'>

                        <div onClick={() => { navigate('/pdfconvert') }} style={{ display: "flex" }}>
                            <CloseIcon style={{ fontSize: "23px", margin: "4px 00px 00px 00px " }} />
                            <div style={{ width: "5px" }}></div>
                            Close
                        </div>
                    </button>
                    <div style={{ width: "20px" }}></div>
                    <button id="Cart_Cntrl_las_btns5">
                        <div onClick={downloadPDF} style={{ display: "flex" }}>
                            <FileDownloadIcon style={{ fontSize: "21px", margin: "6px 00px 00px 00px " }} />
                            <div style={{ width: "5px" }}></div>
                            Download
                        </div>
                    </button>
                </div>
                <div style={{ height: "100px" }}></div>

            </div>

        </div>
    );
}