import React, { useEffect } from 'react'
import "./Supplier_view.css"
import { useState } from 'react';
import Supplier_Top from '../../components/Suppliercomponent/Supplier_Top';
import ColorBoxComponent from '../../components/FormComponents/ColorBoxComponent';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { prismaBaseApi } from '../../config';
import useFileUpload from '../../hooks/useFileUpload';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
export default function Add_supplier_product() {
    const [prod_datas, setprod_datas] = useState({})
    console.log("prod_datas",prod_datas)
    const [brands, setbrands] = useState([])
    const axiosPrivate = useAxiosPrivate()
    const { selectedFile, setSelectedFile, setUpload, setIndex, index, links } =
        useFileUpload();
    const { auth } = useAuth()
    const pictureonchange = (e) => {
        const fileList = e.target.files;
        const newFiles = Array.from(fileList);
        if (links.length < 3) {
            setSelectedFile([...selectedFile, ...newFiles]);
            setUpload(true);
            setIndex(index + 1);
        } else {
            alert("Maximum of 3 files can be selected ! ");
        }
    }

    const onchangeadding_prod = (e) => {
        const name = e.target.name
        const value = e.target.value
        setprod_datas({ ...prod_datas, [name]: value})
    }
    console.log("prod_datas===>", prod_datas)
    const handleSetColor = (color) => {
        setprod_datas({ ...prod_datas, color_family: color, })
    }
    useEffect(() => {
        axiosPrivate.post(`/product/viewBrands`).then((res) => {
            console.log("responce===>", res);
            setbrands(res.data)
        })
        setprod_datas({ ...prod_datas, image1_link: links[0], image2_link: links[1], image3_link: links[2] })
    }, [links])
    const Navigate=useNavigate()
    const sentData = () => {
        axiosPrivate.post(`/product/productadd`, prod_datas).then((res) => {
            console.log("responce===>", res);
            toast.success(res.data);
            setprod_datas('')
            // Navigate('/supplier_view')
            
        })
    }
    return (
        <>
        <ToastContainer>
        position="top-right" autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
      </ToastContainer>
            <div className='p-4'>
                <Supplier_Top />
                <div style={{ height: "50px" }}></div>
                <div id='Add_sup_prod_align'>
                    <div id='Add_sup_prod_border'>
                        <div id='Add_sup_prod_align1'>
                            <div id='Add_sup_prod_media' >
                                <div>
                                    <p style={{ textAlign: "start", height: "9px" }}>Product name</p>
                                    <div style={{ display: "flex", justifyContent: "start" }}>
                                        <input onChange={onchangeadding_prod} name='name' type="text" className="Add_sup_prod_input" required=""></input>
                                    </div>
                                </div>
                                <br />
                                <div>
                                    <p style={{ textAlign: "start", height: "9px" }}>Product type</p>
                                    <div style={{ display: "flex", justifyContent: "start" }}>
                                        <div style={{ width: "100%" }} class="dropdown">
                                            <select
                                                onChange={onchangeadding_prod}
                                                name="Product_type"
                                                id="Package"
                                                className="form-control products-form__form-control Add_sup_prod_ColorSel"
                                                defaultValue=""
                                            >
                                                <option value=""></option>
                                                <option value="bikes">Bikes</option>
                                                <option value="toys">Toys</option>
                                                <option value="baby">Baby</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div>
                                    <p style={{ textAlign: "start", height: "9px" }}>Manufacture Code</p>
                                    <div style={{ display: "flex", justifyContent: "start" }}>
                                        <input onChange={onchangeadding_prod} type="text" name='mfgcode' className="Add_sup_prod_input" required=""></input>
                                    </div>
                                </div>
                                <br />
                                <div>
                                    <p style={{ textAlign: "start", height: "9px" }}>Brand name</p>
                                    <div style={{ display: "flex", justifyContent: "start" }}>
                                        <div style={{ width: "100%" }} class="dropdown">
                                            <select
                                                onChange={onchangeadding_prod}
                                                name="brand"
                                                id="Package"
                                                className="form-control products-form__form-control Add_sup_prod_ColorSel"
                                                defaultValue=""
                                            >
                                                <option value=""></option>
                                                {brands.map(brnd =>
                                                    <>
                                                        <option value={brnd.brand_name}>{brnd.brand_name}</option>
                                                    </>
                                                )}


                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <br />
                                <div>
                                    <p style={{ textAlign: "start", height: "9px" }}>Package</p>
                                    <div style={{ display: "flex", justifyContent: "start" }}>
                                        <div style={{ width: "100%" }} class="dropdown">
                                            <select
                                                onChange={onchangeadding_prod}
                                                name="package"
                                                id="Package"
                                                className="form-control products-form__form-control Add_sup_prod_ColorSel"
                                                defaultValue=""
                                            >
                                                <option value=""></option>
                                                <option value="Box">Box</option>
                                                <option value="Carton">Carton</option>
                                                <option value="Sack">Sack</option>
                                                <option value="Bundle">Bundle</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div>
                                    <p style={{ textAlign: "start", height: "9px" }}>Unit</p>
                                    <div style={{ display: "flex", justifyContent: "start" }}>
                                        <input onChange={onchangeadding_prod} type="number" min={0} name='no_of_items' className="Add_sup_prod_input" required=""></input>
                                    </div>
                                </div>
                                <br />
                                <div>
                                    <p style={{ textAlign: "start", height: "9px" }}>Measure</p>
                                    <div style={{ display: "flex", justifyContent: "start" }}>
                                        <input onChange={onchangeadding_prod} type="text" name='measure' className="Add_sup_prod_input" required=""></input>
                                    </div>
                                </div>
                                <br />
                                <div>
                                    <p style={{ textAlign: "start", height: "9px" }}>Color Name</p>
                                    <div style={{ display: "flex", justifyContent: "start" }}>
                                        <input onChange={onchangeadding_prod} type="text" name='color' className="Add_sup_prod_input" required=""></input>
                                    </div>
                                </div>
                                <br />
                                <div>
                                    <p style={{ textAlign: "start", height: "9px" }}>Color</p>
                                    <div style={{ display: "flex", justifyContent: "start" }}>
                                        <div style={{ cursor: "pointer" }} className='Add_sup_prod_ColorSel'>
                                            <ColorBoxComponent setColor={handleSetColor} />
                                        </div>

                                    </div>
                                </div>
                                <br />
                            </div>
                        </div>
                        <div id='Add_sup_prod_align2'>
                            <div id='Add_sup_prod_media'>
                                <div>
                                    <p style={{ textAlign: "start", height: "9px" }}>Min Stk</p>
                                    <div style={{ display: "flex", justifyContent: "start" }}>
                                        <input onChange={onchangeadding_prod} type="number" min={1} name='min_stk' className="Add_sup_prod_input" required=""></input>
                                    </div>
                                </div>
                                <br />
                                <div>
                                    <p style={{ textAlign: "start", height: "9px" }}>Description</p>
                                    <div style={{ display: "flex", justifyContent: "start" }}>
                                        <textarea onChange={onchangeadding_prod} type="text" name='product_desc' className="Add_sup_prod_input" required=""></textarea>
                                    </div>
                                </div>
                                <br />
                                <div>
                                    <p style={{ textAlign: "start", height: "9px" }}>Picture</p>
                                    <div style={{ display: "flex", justifyContent: "start" }}>
                                        <input onChange={pictureonchange} type="file" name='picture' className="Add_sup_prod_input hey" required=""></input>
                                    </div>
                                </div>
                                <br />
                                <div id='Add_sup_prod_pic_align'>
                                    <div id='Add_sup_prod_pic_box1'>
                                        <img style={{ height: "100%", width: "100%", objectFit: "cover" }} src={`${links[0]}`} alt="" />
                                    </div>
                                    <div id='Add_sup_prod_pic_box1'>
                                        <img style={{ height: "100%", width: "100%", objectFit: "cover" }} src={`${links[1]}`} alt="" />
                                    </div>
                                    <div id='Add_sup_prod_pic_box1'>
                                        <img style={{ height: "100%", width: "100%", objectFit: "cover" }} src={`${links[2]}`} alt="" />
                                    </div>
                                </div>
                                <div style={{ height: "90px" }}></div>
                                <button onClick={sentData} id='Add_sup_prod_pic_Cnfm_btn'>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

