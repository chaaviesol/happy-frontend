import React, { useContext, useEffect } from "react";
import "./Cart.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import Customer_Topbar from "../../../components/Customer_component/Customer_Topbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { prismaBaseApi } from "../../../config";
import { Backdrop, CircularProgress } from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
export default function Cart_Cntrl() {
  const [cartdatas, setcartdatas] = useState([]);
  const [incrementbx, setincrementbx] = useState(false);
  const [setdata, setsetdata] = useState({});
  const [apicall, setapicall] = useState(false);
  const [open, setOpen] = React.useState(false);
  const { auth } = useAuth();
  const [products, setproducts] = useState([]);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    axiosPrivate
      .get(`/customer/getcart`)
      .then((res) => {
        setcartdatas(res.data.data);
        const data = res.data.data; // Assuming res.data.data is an array
        const filteredData = data.map((ele) => ({
          quantity: ele.quantity,
          product_id: ele.product_id,
        }));
        setproducts(filteredData);
        setOpen(false);
      });
  }, [apicall]);
  useEffect(() => {
    setOpen(true);
  }, []);
  const onchangeinp = (index, e) => {
    const name = e.target.name;
    let cloneCartData = [...cartdatas];
    cloneCartData[index] = { ...cloneCartData[index], [name]: e.target.value };
    setcartdatas(cloneCartData);
    let olddata = [...products];
    olddata[index] = { ...olddata[index], [name]: e.target.value };
    setproducts(olddata);
  };

  console.log("products===>", products);
  console.log("cartdatas===>", cartdatas);
  const notesonchange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const olddata = setdata.so_notes;
    setsetdata({
      ...setdata,
      so_notes: { ...olddata, [name]: value },
    });
  };
  const deltcart = (id) => {
    const data = {
      customer_id: auth.logged_id,
      prod_id: id,
    };
    let cart = [...cartdatas];
    const index = cart.findIndex((prod) => prod.product_id == id);
    cart.splice(index, 1);
    setcartdatas(cart);
    axiosPrivate.post(`/customer/removefromcart`, data).then((res) => {
      if (res.data.success) {
        setapicall(true);
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
    });
  };
  const sentdata = () => {
    setsetdata({
      ...setdata,
      customer_id: auth.logged_id,
      products: products,
      so_status: "requested_quote",
    });
  };
  console.log("setsetdata====>", setdata);
  useEffect(() => {
    if (setdata?.so_status == "requested_quote") {
      if (!products.find(ele => !ele?.select_type)) {
        axiosPrivate
          .post(`/sales/sendquotation`, setdata)
          .then((res) => {
            console.log(res);
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
              clearCartData()
              setTimeout(() => {
                navigate("/product_list");
              }, 1000);
            }
          });
      } else {
        toast.info(`please select types`, {
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
  }, [setdata]);

  const clearCartData = () => {
    const passingData = {
      customer_id: auth.logged_id,
      products: products
    }
    axiosPrivate.post(`/customer/removecartitems`, passingData).then((res) => {
      // alert(res?.data?.message)
    })
  }


  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToastContainer />
      <Customer_Topbar />
      <div id="Cart_Cntrl_adjst">
        <div id="Cart_Cntrl_inner">
          <div id="Cart_Cntrl_heading">
            <p id="Cart_Cntrl_font1">Request for Quotation</p>
          </div>
          <div style={{ height: "6rem" }}></div>
          <div id="Cart_Cntrl_main_Bx">
            <div id="Cart_Cntrl_Bx_head">
              <div id="Cart_Cntrl_sprte_bx31">
                <p id="mediaqry_adjst_fnt">Sl No</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx32">
                <p id="mediaqry_adjst_fnt">Product</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx3333">
                <p id="mediaqry_adjst_fnt">color</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx38">
                <p id="mediaqry_adjst_fnt">Select type</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx34">
                <p id="mediaqry_adjst_fnt">Qty</p>
              </div>

              <div id="Cart_Cntrl_sprte_bx37"></div>
            </div>
            {/* table inner datas  */}
            <div id="cart_cntrl_overflw">
              <br />
              {cartdatas.map((data, index) => (
                <div key={index} style={{ cursor: "pointer" }} id="Cart_Cntrl_datas">
                  <div
                    id="Cart_Cntrl_sprte_bx31"
                    onClick={() => {
                      navigate("/product_detailed", {
                        state: { data: data.product_name, id: data.product_id },
                      });
                    }}
                  >
                    <p id="mediaqry_adjst_fnt">{index + 1} </p>
                  </div>
                  <br />
                  <div
                    id="Cart_Cntrl_sprte_bx32"
                    onClick={() => {
                      navigate("/product_detailed", {
                        state: { data: data.product_name, id: data.product_id },
                      });
                    }}
                  >
                    <p id="mediaqry_adjst_fnt">{data.product_name} </p>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "center" }}
                    id="Cart_Cntrl_sprte_bx3333"
                    onClick={() => {
                      navigate("/product_detailed", {
                        state: { data: data.product_name },
                      });
                    }}
                  >
                    <div
                      style={{
                        height: "20px",
                        width: "20px",
                        backgroundColor: `${data.color_family}`,
                      }}
                    ></div>
                  </div>
                  <div id="Cart_Cntrl_sprte_bx38">
                    <select
                      onChange={(e) => onchangeinp(index, e)}
                      name="select_type"
                      id="Cart_Cntrl_sprte_select"
                    >
                      <option value=""></option>
                      <option value="As is">As is</option>
                      <option value="Boxed">Boxed</option>
                      <option value="Fitted">Fitted</option>
                    </select>
                  </div>
                  <div id="Cart_Cntrl_sprte_bx34">
                    <input
                      id="Cart_Cntrl_inp_bxs"
                      min={1}
                      name="quantity"
                      value={data.quantity}
                      onChange={(e) => onchangeinp(index, e)}
                      type="number"
                    />
                  </div>
                  <div
                    onClick={() => {
                      deltcart(data.product_id);
                    }}
                    id="Cart_Cntrl_sprte_bx37"
                  >
                    <DeleteIcon
                      style={{ cursor: "pointer", fontSize: "20px" }}
                      className="Cart_Cntrl_dlt_icn"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: "2rem" }}></div>
          <div id="Cart_Cntrl_last_bx_alighn">
            <div style={{ width: "20px" }}></div>
            <p id="Cart_Cntrl_ptag3">Note</p>
            <div style={{ width: "100px" }}></div>

            <div>
              <div id="mediaqry10">
                <p id="Cart_Cntrl_ptag3" style={{ width: "20px" }}>
                  1.
                </p>
                <div style={{ width: "10px" }}></div>
                <input
                  onChange={notesonchange}
                  name="note1"
                  id="Cart_Cntrl_last_bx_inp"
                  type="text"
                />
              </div>

              <div id="mediaqry10">
                <p id="Cart_Cntrl_ptag3" style={{ width: "20px" }}>
                  2.
                </p>
                <div style={{ width: "10px" }}></div>
                <input
                  onChange={notesonchange}
                  name="note2"
                  id="Cart_Cntrl_last_bx_inp"
                  type="text"
                />
                <div style={{ width: "10px" }}></div>
                {!incrementbx ? (
                  <p
                    onClick={() => {
                      setincrementbx(true);
                    }}
                    style={{ fontSize: "20px", cursor: "pointer" }}
                  >
                    +
                  </p>
                ) : (
                  ""
                )}
              </div>
              {incrementbx ? (
                <div id="mediaqry10">
                  <p id="Cart_Cntrl_ptag3" style={{ width: "20px" }}>
                    3.
                  </p>
                  <div style={{ width: "10px" }}></div>
                  <input
                    onChange={notesonchange}
                    name="note3"
                    id="Cart_Cntrl_last_bx_inp"
                    type="text"
                  />
                  <div style={{ width: "10px" }}></div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div style={{ height: "2rem" }}></div>
          <div id="Cart_Cntrl_last_sec1">
            <button
              onClick={() => {
                navigate(-1);
              }}
              id="Cart_Cntrl_las_btn1"
            >
              Close
            </button>
            <div style={{ width: "10px", height: "10px" }}></div>
            <button id="Cart_Cntrl_las_btn2">Save as draft</button>
            <div style={{ width: "10px", height: "10px" }}></div>
            <button onClick={sentdata} id="Cart_Cntrl_las_btn3">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
