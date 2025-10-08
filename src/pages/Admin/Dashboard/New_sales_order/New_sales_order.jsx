import React, { useEffect, useRef } from "react";
import "./New_sales_order.css";
import AttachmentIcon from "@mui/icons-material/AttachFile";
import { useState } from "react";
import { Modal } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import OrderPage from "../../../Admin/Order_history/OrderPage";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { axiosPrivate } from "../../../../api/axios";
import useDivBoxCloser from "../../../../hooks/useDivBoxCloser";
import BarcodeListener from "../../../../components/Suppliercomponent/BarcodeListener";
export default function New_sales_order() {
  const location = useLocation();
  const [prdctflse, setprdctflse] = useState(false);
  const [TotalData, setTotalData] = useState({});
  const [products, setproducts] = useState([]);
  const [required, setrequired] = useState(false);
  const [cuslistflse, setcuslistflse] = useState(false);
  const [accessoriePop, setaccessoriePop] = useState({
    pop: false,
    ProIndex: "",
    name: "",
    id: "",
  });
  const [paymentData, setpaymentData] = useState();
  const [accessoriestrflse, setaccessoriestrflse] = useState(false);
  const [SelectType, setSelectType] = useState({
    "as is": false,
    fitted: false,
    boxed: false,
  });
  const [Accessoriesdatas, setAccessoriesdatas] = useState([]);
  const [userdata, setuserdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);

  const [manualDiscount, setManualDiscount] = useState(0); // store rupee discount
  const [isManualMode, setIsManualMode] = useState(false); // toggle between % and ₹ modes
// const [remarks, setRemarks] = useState("");


  const navigate = useNavigate();
  const cusflse = useRef(null);
  const closer = useRef(null);
  const acceryref = useRef(null);
  const acqtyeref = useRef(null);
  const acpriceref = useRef(null);
  const fittingChargeceref = useRef(null);
  const qtyRef = useRef(null);
  const priceRef = useRef(null);
  const searchinpt = useRef(null);
  const acselectref = useRef(null);
  const accesearchref = useRef(null);
  const prodListRef = useRef(null);
  const custListRef = useRef(null);
  const axioPrivate = useAxiosPrivate();
  const toastConfig = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
  useEffect(() => {
    axioPrivate
      .post(`/sales/viewcustomers`)
      .then((res) => {
        // console.log(res)
        setuserdata(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axioPrivate.get(`/sales/viewaccessories`).then((res) => {
      setAccessoriesdatas(res.data.data);
    });
  }, []);
  useEffect(() => {
    axioPrivate.post(`/sales/product_list`).then((res) => {
      console.log("res>>>>>", res);
      setproducts(res.data.data);
    });
  }, []);

  const inponchange = (e, index) => {
    const value = e.target.value;
    const name = e.target.name;
    let Updatedata = TotalData;
    Updatedata.products[index] = {
      ...Updatedata.products[index],
      [name]: value,
    };
    setTotalData({ ...TotalData, products: Updatedata });
    ProductCalculation(Updatedata);
    Calculations();
  };

  console.log("products>>>>", products);
  const product_Details = (id) => {
    const findProduct = products.find((prod) => prod.product_id == id);
    const CheckAlready = TotalData?.products?.find(
      (prod) => prod.product_id == id
    );
    if (!CheckAlready) {
      // if (findProduct) {
      //   setTotalData((previous) => ({
      //     ...previous,
      //     products: [...(previous.products || []), findProduct],
      //   }));
      //   setprdctflse(false);
      // } 

      if (findProduct) {
        const newData = {
          ...TotalData,
          products: [
            ...(TotalData.products || []),
            { ...findProduct, qty: 1, selecttype: "as is" },
          ],
        };

        setTotalData(newData);
        ProductCalculation(newData);
        setprdctflse(false);
      }

      else {
        // alert("Product warning")
      }
    } else {
      toast.info("The product already exists.", toastConfig);
    }
  };
  const inpcus = useRef(null);
  const godata = async (value) => {
    if (location?.state?.quoted) {
      ConfirmQuotation(value);
    } else if (location?.state?.solist) {
      ConfirmSolist(value);
    } else {
      ConfirmnewSales(value);
    }
  };

  const ConfirmnewSales = async (value) => {
    const validData = TotalData?.grandTotal || value?.draft;
    let data = {
      ...TotalData,
      //  remarks: remarks,
      so_status: value?.draft ? "draft" : "placed",
    };
    if (!validData) {
      toast.info("All fields are mandatory", toastConfig);
      return;
    }
    setLoading(true);
    try {
      const response = await axiosPrivate.post(`/sales/newsales`, data);
      if (response?.data?.success) {
        toast.success(response?.data?.message, toastConfig);
      }
    } catch (err) {
      toast.info(err.response?.data?.message, toastConfig);
    } finally {
      setLoading(false);
    }
  };
  const ConfirmSolist = (value) => { };
  const ConfirmQuotation = async (value) => {
    const validData = TotalData?.grandTotal || value?.draft;
    if (!validData) {
      toast.info("All fields are mandatory", toastConfig);
      return;
    }
    let data = {
      ...TotalData,
      so_status: value.draft ? "draft" : "placed",
      customer_id: TotalData?.user_id,
    };

    console.log("data>>>>", data)
    setLoading(true);
    try {
      const response = await axiosPrivate.post(
        `/sales/quoted_salesorder`,
        data
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message, toastConfig);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred";
      toast.info(errorMessage, toastConfig);
    } finally {
      setLoading(false);
    }
  };
  const accessorielistarray = (id) => {
    setTotalData((prevTotalData) => {
      let products = [...prevTotalData.products];
      const findAccessory = Accessoriesdatas.find((ele) => ele.prod_id === id);
      const alreadyAcces = TotalData?.products[
        accessoriePop?.ProIndex
      ]?.products_accessories?.find((ele) => ele.prod_id === id);
      if (!alreadyAcces) {
        let products_accessories = Array.isArray(
          products[accessoriePop.ProIndex].products_accessories
        )
          ? [
            ...products[accessoriePop.ProIndex].products_accessories,
            findAccessory,
          ]
          : [findAccessory];
        products[accessoriePop.ProIndex] = {
          ...products[accessoriePop.ProIndex],
          products_accessories: products_accessories,
        };
        return { ...prevTotalData, products: products };
      } else {
        return { ...prevTotalData, products: products };
      }
    });
  };

  const accessorieChanges = (e, id, index, acname) => {
    const name = e.target.name;
    const value = e.target.value;
    let products = TotalData.products;
    products[accessoriePop.ProIndex].products_accessories[index] = {
      ...products[accessoriePop.ProIndex].products_accessories[index],
      [name]: value,
    };
    setTotalData({ ...TotalData, products: products });
    Calculations();
  };

  const Calculations = async () => {
    try {
      let updatedProducts = TotalData?.products?.map((ele) => {
        let products_accessories = ele?.products_accessories?.map((acce) => {
          const price = acce?.price || acce?.sales_price;
          const qty = acce?.qty || acce?.order_qty;
          if (qty && price) {
            let ac_tl_Price = parseInt(qty) * parseInt(price);
            return { ...acce, ac_tl_Price: ac_tl_Price };
          } else {
            return { ...acce, ac_tl_Price: 0 };
          }
        });

        let price_accessory = 0;
        products_accessories?.forEach((acce) => {
          price_accessory += acce.ac_tl_Price || 0;
        });

        let finalData = 0;
        // console.log("SelectType>>>", SelectType)
        if (ele.selecttype === "as is" || ele.selecttype === "As is") {
          if (ele.selecttype === "boxed" || ele.selecttype === "Boxed") {
            finalData = 0;
          } else {
            finalData = price_accessory;
          }
        } else {
          finalData = price_accessory + (parseInt(ele.fitting_charge) || 0);
        }

        // Return updated product object with new data
        return {
          ...ele,
          price_accessory: finalData,
          products_accessories: products_accessories,
        };
      });

      // Update state with new products array
      if (
        JSON.stringify(updatedProducts) !== JSON.stringify(TotalData?.products)
      ) {
        let updatedTotalData = { ...TotalData, products: updatedProducts };
        setTotalData(updatedTotalData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    Calculations();
    // ProductCalculation()
  }, [TotalData]);

  const settingSelectTypes = (type) => {
    let TempProducts = TotalData;
    TempProducts.products[accessoriePop?.ProIndex] = {
      ...TempProducts?.products[accessoriePop?.ProIndex],
      selecttype: type,
    };
    // setTotalData({ ...TotalData, products: TempProducts })
    if (type === "as is") {
      setaccessoriePop({ ...accessoriePop, pop: false });
      ProductCalculation(TempProducts);
    } else {
      Calculations();
    }
  };

  // const UpdatingCoupons = (coupon) => {
  //   let tempProducts = TotalData;
  //   if (coupon?.type && coupon?.discount!== undefined) {
  //     if (!coupon.normalDiscount && !coupon.finalDiscount) {
  //       tempProducts.products[coupon?.index] = {
  //         ...tempProducts.products[coupon?.index],
  //         couponDiscount: {
  //           discountType: coupon?.type,
  //           discount: coupon?.discount,
  //           couponCode: coupon?.couponCode,
  //           normalDiscount: false,
  //         },
  //       };
  //     } else if (coupon.normalDiscount && !coupon.finalDiscount) {
  //       tempProducts.products[coupon?.index] = {
  //         ...tempProducts.products[coupon?.index],
  //         normalDiscount: { discount: coupon?.discount },
  //       };
  //     } else if (coupon.finalDiscount) {
  //       tempProducts = {
  //         ...tempProducts,
  //         discount: { discount: coupon?.discount },
  //       };
  //     }
  //   }
  //   ProductCalculation(tempProducts);
  //   setTotalData({ ...tempProducts });
  // };
const UpdatingCoupons = (coupon) => {
  // Deep clone to ensure React sees reference change
  let tempProducts = JSON.parse(JSON.stringify(TotalData));

  // 🧩 Ensure discount object always has proper structure
  if (!tempProducts.discount) {
    tempProducts.discount = { type: "Percentage", discount: 0 };
  }

  if (coupon?.type && coupon?.discount !== undefined) {
    const parsedDiscount = parseFloat(coupon.discount) || 0;

    if (!coupon.normalDiscount && !coupon.finalDiscount) {
      tempProducts.products[coupon?.index] = {
        ...tempProducts.products[coupon?.index],
        couponDiscount: {
          discountType: coupon?.type,
          discount: parsedDiscount,
          couponCode: coupon?.couponCode,
          normalDiscount: false,
        },
      };
    } else if (coupon.normalDiscount && !coupon.finalDiscount) {
      tempProducts.products[coupon?.index] = {
        ...tempProducts.products[coupon?.index],
        normalDiscount: { discount: parsedDiscount },
      };
    } else if (coupon.finalDiscount) {
      // ✅ Always keep a valid type — even if coupon.type is undefined
      tempProducts.discount = {
        type: coupon.type || tempProducts.discount.type || "Percentage",
        discount: parsedDiscount,
      };
    }
  } else {
    tempProducts.discount = { type: "Percentage", discount: 0 };
  }

  // Force recalculation and set new reference
  const recalculated = ProductCalculation(tempProducts, true);
  setTotalData({ ...recalculated });
};


//  const ProductCalculation = (Data, returnData = false) => {
//   try {
//     let tempProducts = { ...Data };
//     let grandTotal = 0;

//     tempProducts.products = tempProducts.products.map((pro) => {
//       const qty = parseFloat(pro.qty || 0);
//       const productPrice = parseFloat(pro.product_Price || 0);
//       const originalPrice = parseFloat(pro.original_price || 0);
//       const priceAccessory = parseFloat(pro.price_accessory || 0);
//       let total = 0;

//       if (pro.selecttype?.toLowerCase() === "as is") {
//         total = (productPrice || originalPrice) * qty;
//       } else {
//         total = (productPrice || originalPrice) * qty + priceAccessory * qty;
//       }

//       // Discounts
//       if (pro.couponDiscount?.discount) {
//         if (pro.couponDiscount.discountType === "Percentage") {
//           total -= (total * parseFloat(pro.couponDiscount.discount)) / 100;
//         } else if (pro.couponDiscount.discountType === "Amount") {
//           total -= parseFloat(pro.couponDiscount.discount) * qty;
//         }
//       }

//       if (pro.normalDiscount?.discount) {
//         total -= (total * parseFloat(pro.normalDiscount.discount)) / 100;
//       }

//       return {
//         ...pro,
//         total: parseFloat(total.toFixed(2)),
//         tl_amt: parseFloat(total.toFixed(2)),
//       };
//     });

//     tempProducts.products.forEach((p) => {
//       grandTotal += p.total || 0;
//     });

//     const { type, discount } = tempProducts.discount || {};
//     let finalAmount = grandTotal;

//     if (type === "Percentage" && discount > 0) {
//       finalAmount = grandTotal - (grandTotal * discount) / 100;
//     } else if (type === "Rupees" && discount > 0) {
//       finalAmount = grandTotal - discount;
//     }

//     if (finalAmount < 0) finalAmount = 0;

//     tempProducts = {
//       ...tempProducts,
//       grandTotal: parseFloat(grandTotal.toFixed(2)),
//       tl_amt: parseFloat(finalAmount.toFixed(2)),
//     };

//     if (returnData) return tempProducts; // ✅ Return for use in UpdatingCoupons
//     else setTotalData({ ...tempProducts });
//   } catch (error) {
//     console.error("Error in ProductCalculation:", error);
//   }
// };
const ProductCalculation = (Data, returnData = false) => {
  try {
    let tempProducts = { ...Data };
    let grandTotal = 0;

    // 🧮 Per-product totals
    tempProducts.products = tempProducts.products.map((pro) => {
      const qty = parseFloat(pro.qty || 0);
      const productPrice = parseFloat(pro.product_Price || 0);
      const originalPrice = parseFloat(pro.original_price || 0);
      const priceAccessory = parseFloat(pro.price_accessory || 0);
      let total = 0;

      if (pro.selecttype?.toLowerCase() === "as is") {
        total = (productPrice || originalPrice) * qty;
      } else {
        total = (productPrice || originalPrice) * qty + priceAccessory * qty;
      }

      // 🎟️ Product-level discounts
      if (pro.couponDiscount?.discount) {
        if (pro.couponDiscount.discountType === "Percentage") {
          total -= (total * parseFloat(pro.couponDiscount.discount)) / 100;
        } else if (pro.couponDiscount.discountType === "Amount") {
          total -= parseFloat(pro.couponDiscount.discount) * qty;
        }
      }

      if (pro.normalDiscount?.discount) {
        total -= (total * parseFloat(pro.normalDiscount.discount)) / 100;
      }

      return {
        ...pro,
        total: parseFloat(total.toFixed(2)),
        tl_amt: parseFloat(total.toFixed(2)),
      };
    });

    // 🧮 Grand total
    tempProducts.products.forEach((p) => {
      grandTotal += p.total || 0;
    });

    // 💰 Final discount (percentage or rupee)
    const { type } = tempProducts.discount || {};
    let discount = parseFloat(tempProducts.discount?.discount) || 0;
    let finalAmount = grandTotal;

    if (type === "Percentage" && discount > 0) {
      finalAmount = grandTotal - (grandTotal * discount) / 100;
    } else if (type === "Rupees" && discount > 0) {
      if (discount > grandTotal) discount = grandTotal;
      finalAmount = grandTotal - discount;
    }

    if (finalAmount < 0) finalAmount = 0;

    tempProducts = {
      ...tempProducts,
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      tl_amt: parseFloat(finalAmount.toFixed(2)),
    };

    if (returnData) {
      return tempProducts;
    } else {
      setTotalData({ ...tempProducts });
    }
  } catch (error) {
    console.error("Error in ProductCalculation:", error);
  }
};


  // console.log("TotalData>>>>>", TotalData)
  useEffect(() => {
    if (location?.state?.quoted) {
      setLoading(true);
      const Quoted_salesID = {
        sales_id: location?.state?.data,
      };
      axiosPrivate.post(`/sales/quoted_details`, Quoted_salesID).then((res) => {
        console.log("res>>>>", res?.data);
        setTotalData(res?.data[0]);
        if (res?.data[0]) {
          ProductCalculation(res?.data[0]);
          setLoading(false);
        }
      });
    }
  }, []);

  const accessorieconfirm = () => {
    ProductCalculation(TotalData);
  };
  const slicearray = (index) => {
    // Make a copy of the accessories array from TotalData
    let tempAccessories = [
      ...TotalData.products[accessoriePop.ProIndex].products_accessories,
    ];

    // Remove the element at the specified index
    tempAccessories.splice(index, 1);
    // Make a copy of the TotalData object
    let updatedTotalData = { ...TotalData };

    // Update the accessories array in the copied TotalData object
    updatedTotalData.products[accessoriePop.ProIndex].products_accessories =
      tempAccessories;

    // Update the state with the modified TotalData object
    setTotalData(updatedTotalData);
    Calculations();
  };
  const sliceProductArraay = async (e, id, index) => {
    try {
      let tempStore = { ...TotalData };
      tempStore?.products?.splice(index, 1);
      setTotalData(tempStore);
      ProductCalculation(tempStore);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseloading = () => {
    setLoading(false);
  };

  const closeOrder = () => {
    setLoading(true);
    const salesid = location.state.data;
    const data = {
      sales_id: salesid,
      so_status: "closed",
    };
    // console.log("data>>", data)
    axiosPrivate
      .post(`/sales/closed_salesorder`, data)
      .then((res) => {
        // console.log("res>>>>", res)
        if (res.data.success) {
          setLoading(false);
          toast.success(res?.data?.message, toastConfig);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.info(err?.response.data?.message, toastConfig);
      });
  };

  const arrangeType = async (index, id, name) => {
    try {
      if (TotalData.products[index].qty) {
        setaccessoriePop({
          pop: true,
          ProIndex: index,
          id: id,
          name: name,
        });
        if (TotalData.products[index].selecttype) {
          setSelectType({
            [TotalData.products[index].selecttype.toLowerCase()]: true,
          });
          if (TotalData.products[index].selecttype.toLowerCase() == "as is") {
            setSelectType({
              "as is": false,
              boxed: false,
              fitted: false,
            });
          }
        } else {
          setSelectType({
            "as is": false,
            boxed: false,
            fitted: false,
          });
        }
      } else {
        toast.info("Please input quantity", toastConfig);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const customerFilter = (e) => {
    const inputValue = e.target.value;
    const query = inputValue.toLowerCase();
    const filteredData = userdata.filter((data) =>
      data.user_name.toLowerCase().includes(query)
    );
    const remainingData = userdata.filter(
      (data) => !data.user_name.toLowerCase().includes(query)
    );
    setuserdata([...filteredData, ...remainingData]);
  };

  const getPaymentsData = (e) => {
    const { name, value } = e.target;
    let Data = paymentData;
    if (name === "total_amount") {
      if (value <= TotalData?.tl_amt) {
        Data = { ...Data, [name]: parseInt(value) };
      } else {
        toast.info(
          "You can only input an amount that is less than the final allowed amount",
          toastConfig
        );
      }
    } else {
      Data = { ...Data, [name]: value };
    }
    setpaymentData(Data);
    paymentCalculation(Data);
  };

  console.log("paymentData>>>>", paymentData);

  const paymentCalculation = (data) => {
    let TempData = data;
    let ispayment_completed = "";
    console.log(TempData);
    if (TotalData?.sales_id && TempData?.total_amount) {
      const FinalAmount = parseInt(TotalData.tl_amt);
      const PayedAmt = parseInt(TempData?.total_amount);
      const roundoff_disc = FinalAmount - PayedAmt;
      console.log("roundoff_disc>>>>", roundoff_disc);
      if (roundoff_disc <= 0) {
        ispayment_completed = "Y";
      } else {
        ispayment_completed = "N";
      }
      TempData = {
        ...TempData,
        sales_id: TotalData?.sales_id,
        roundoff_disc: roundoff_disc,
        ispayment_completed: ispayment_completed,
      };
    }
    setpaymentData(TempData);
  };

  console.log("TotalData>>>>", TotalData);

  const confirmPaymentData = async () => {
    const isBodyValid = paymentData?.total_amount && paymentData?.mode;
    if (!isBodyValid) {
      toast.info("Check payment amount or payment mode", toastConfig);
      return;
    }
    setLoading(true);
    try {
      const response = await axiosPrivate.post(
        `/payment/sodirect_payment`,
        paymentData
      );
      if (response.data.success) {
        toast.success("Payment successfull", toastConfig);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message, toastConfig);
    } finally {
      setLoading(false);
    }
  };
  const closeFunction = () => {
    setcuslistflse(false);
    setprdctflse(false);
  };
  useDivBoxCloser(
    [prodListRef, custListRef],
    [closeFunction]
  );
  console.log(products);

  // --- inside New_sales_order.jsx ---

  // 
  const handleScan = async (code) => {
    // ✅ Basic input validation
    // if (!code || code.trim().length < 5) { // adjust minimum length as needed
    //   alert("❌ Invalid barcode");
    //   return;
    // }
    console.log("aa Barcode Passed", code);

    try {
      // Send GET request to backend
      const res = await axiosPrivate.get(`/inventory/scanBarcode?barcode=${code}`);

      // Extract product from response
      const product = res.data.data;

      // Check if product exists in response
      if (!product || Object.keys(product).length === 0) {
        alert("❌ Product not found");
        return; // stop execution
      }

      // Update product list
      setTotalData((prev) => {
        const existingProducts = prev.products || [];
        const existingIndex = existingProducts.findIndex(
          (p) => p.product_id === product.product_id
        );

        let updatedProducts;

        if (existingIndex > -1) {
          // Product already exists → increment quantity
          const existing = existingProducts[existingIndex];
          const newQty = (existing.qty || 0) + 1;

          updatedProducts = [...existingProducts];
          updatedProducts[existingIndex] = {
            ...existing,
            qty: newQty,
            total: newQty * (existing.mrp || existing.selling_price || 0),
            selecttype: "as is",
          };
        } else {
          // New product → add with qty = 1
          updatedProducts = [
            ...existingProducts,
            {
              ...product,
              qty: 1,
              total: product.mrp || product.selling_price || 0,
            },
          ];
        }

        // Recalculate totals (grandTotal, discounts, etc.)
        const updatedData = { ...prev, products: updatedProducts };
        ProductCalculation(updatedData);

        return updatedData;
      });
    } catch (err) {
      // Handle backend errors
      if (err.response) {
        switch (err.response.status) {
          case 404:
            alert("❌ Product not found");
            break;
          case 401:
            alert("⚠️ Unauthorized – please log in again");
            break;
          default:
            alert(`⚠️ Error: ${err.response.data.error || "Something went wrong"}`);
        }
      } else {
        alert("⚠️ Network error – backend not reachable");
      }
      console.error("Scan error:", err);
    }
  };

  // as is show
  useEffect(() => {
    if (TotalData?.products?.length) {
      const normalized = TotalData.products.map((p) => ({
        ...p,
        selecttype: p.selecttype || "as is",
      }));
      setTotalData({ ...TotalData, products: normalized });
    }
  }, [TotalData?.products?.length]);






  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme?.zIndex?.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToastContainer />
      <div id="Cart_Cntrl_adjst">
        <div id="Cart_Cntrl_inner">
          <div id="Cart_Cntrl_heading">
            <p>
              {location.state?.quoted && !location.state?.solist
                ? "Quotation"
                : location.state?.solist && location.state?.quoted
                  ? "Sales order"
                  : "New sales order"}
            </p>
          </div>
          <div style={{ height: "1rem" }}></div>
          <div style={{ display: "flex" }}>
            <div id="New_sales_cus_name">
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <p style={{ textAlign: "start" }}>Customer</p>
                &nbsp;
                <div ref={custListRef} style={{ width: "400px" }}>
                  <input
                    onFocus={true}
                    autoComplete="off"
                    value={TotalData?.user_name}
                    onClick={() => {
                      setcuslistflse(true);

                    }}
                    onChange={customerFilter}
                    style={{ textAlign: "start", paddingLeft: "8px" }}
                    ref={inpcus}
                    type="text"
                    name="name"
                    id="New_sales_inp1"
                  />
                  {required ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: "0.7rem",
                        textAlign: "start",
                        position: "absolute"
                      }}
                    >
                      required *
                    </p>
                  ) : (
                    ""
                  )}
                  {cuslistflse && !location.state?.quoted ? (
                    <>
                      <div ref={cusflse} id="Cart_Cntrl_prdct_list2" >
                        <p
                          style={{
                            backgroundColor: "#b6e1e0",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            navigate("/register_new");
                          }}
                        >
                          Add new user
                        </p>
                        {userdata.map((data, index) => (
                          <>
                            <button
                              className="so_custname"
                              onClick={() => {
                                setTotalData({
                                  ...TotalData,
                                  user_name: data?.user_name,
                                  customer_id: data?.id,
                                });
                                setcuslistflse(false);
                                setprdctflse(false);
                                setrequired(false)
                              }}
                            >
                              {data.user_name}
                            </button>
                          </>
                        ))}
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div id="New_sales_attach_icn">
              <AttachmentIcon
                style={{ fontSize: "30px", margin: "-5px 00px" }}
              />
              <p>Add</p>
            </div>
          </div>
          <div style={{ height: "1rem" }}></div>
          <div id="Cart_Cntrl_main_Bx2">
            <div id="Cart_Cntrl_Bx_head">
              <div id="Cart_Cntrl_sprte_bx11">
                <p id="mediaqry_adjst_fnt">Sl No</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx22">
                <p id="mediaqry_adjst_fnt">Product</p>
              </div>

              {location.state?.solist ? (
                ""
              ) : (
                <div id="Cart_Cntrl_sprte_bx1818">
                  <p id="mediaqry_adjst_fnt">In stock</p>
                </div>
              )}
              <div id="Cart_Cntrl_sprte_bx33">
                <p id="mediaqry_adjst_fnt">Color</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx1515">
                <p id="mediaqry_adjst_fnt">packing</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx1414">
                <p id="mediaqry_adjst_fnt">Unit</p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                id="Cart_Cntrl_sprte_bx44"
              >
                <p id="mediaqry_adjst_fnt">Qty</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx55">
                <p id="mediaqry_adjst_fnt">MRP</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx66">
                <p id="mediaqry_adjst_fnt">Original price</p>
              </div>
              <div
                style={{ display: "flex", justifyContent: "center" }}
                id="Cart_Cntrl_sprte_bx99"
              >
                <p id="mediaqry_adjst_fnt">Sale type</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx1010">
                <p id="mediaqry_adjst_fnt">Accessories</p>
              </div>
              <div
                style={{ justifyContent: "center" }}
                id="Cart_Cntrl_sprte_bx77"
              >
                <p id="mediaqry_adjst_fnt">Product Price</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx88">
                <p id="mediaqry_adjst_fnt">Net Amt</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx1313">
                <p id="mediaqry_adjst_fnt">Coupon</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx1313">
                <p id="mediaqry_adjst_fnt">Disc</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx1212">
                <p id="mediaqry_adjst_fnt">Total</p>
              </div>
              <div id="Cart_Cntrl_sprte_bx1111">
                <p id="mediaqry_adjst_fnt"></p>
              </div>
            </div>
            <div
              style={{
                overflow: "scroll",
                overflowX: "scroll",
                height: "27rem",
              }}
            >
              {TotalData?.products ? (
                <>
                  {TotalData?.products?.map((detailed, ind) => (
                    <div
                      key={ind}
                      style={{
                        backgroundColor:
                          ind % 2 === 0 ? "rgb(231 228 247)" : "",
                        cursor: "pointer",
                      }}
                      id="Cart_Cntrl_datas"
                    >
                      <div
                        style={{ padding: "11px 00px" }}
                        id="Cart_Cntrl_sprte_bx11"
                      >
                        <p id="mediaqry_adjst_fnt">{ind + 1}</p>
                      </div>
                      <br />
                      <div
                        style={{ padding: "11px 00px" }}
                        id="Cart_Cntrl_sprte_bx22"
                      >
                        <p
                          style={{
                            textAlign: "start",
                          }}
                          id="mediaqry_adjst_fnt"
                        >
                          {`${detailed?.product_name}`}
                        </p>
                      </div>
                      {location.state?.solist ? (
                        ""
                      ) : (
                        <div
                          style={{ padding: "11px 00px" }}
                          id="Cart_Cntrl_sprte_bx1818"
                        >
                          <p
                            style={{ textAlign: "center" }}
                            id="mediaqry_adjst_fnt"
                          >
                            {detailed.total_quantity < detailed?.qty ? (
                              <CloseIcon style={{ color: "red" }} />
                            ) : (
                              <DoneIcon style={{ color: "green" }} />
                            )}
                          </p>
                        </div>
                      )}
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                        id="Cart_Cntrl_sprte_bx33"
                      >
                        <div
                          style={{
                            width: "25px",
                            height: "25px",
                            borderRadius: "5px",
                            backgroundColor: `${detailed.color_family}`,
                          }}
                        ></div>
                      </div>
                      <div
                        style={{ padding: "11px 00px" }}
                        id="Cart_Cntrl_sprte_bx1515"
                      >
                        <p
                          style={{ textAlign: "center" }}
                          id="mediaqry_adjst_fnt"
                        >
                          {detailed.package}
                        </p>
                      </div>
                      <div
                        style={{ padding: "11px 00px" }}
                        id="Cart_Cntrl_sprte_bx1414"
                      >
                        <p
                          style={{ textAlign: "center" }}
                          id="mediaqry_adjst_fnt"
                        >
                          {detailed.no_of_items}
                        </p>
                      </div>
                      {!location?.state?.solist ? (
                        <div id="Cart_Cntrl_sprte_bx44">
                          <input
                            onFocus={true}
                            id="Cart_Cntrl_inp_bx"
                            name="qty"
                            required
                            disabled={
                              location?.state?.quoted ||
                              (location?.state?.solist && "true")
                            }
                            value={detailed.qty}
                            onChange={(e) => {
                              inponchange(e, ind);
                            }}
                            min={1}
                            type="number"
                            ref={qtyRef}
                          />
                          {!detailed.qty ? (
                            <p
                              style={{
                                color: "red",
                                fontSize: "0.5rem",
                                height: "10px",
                                textAlign: "start",
                              }}
                            >
                              {" "}
                              required *
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          id="Cart_Cntrl_sprte_bx44"
                        >
                          <p id="mediaqry_adjst_fntDicsount">{detailed?.qty}</p>
                        </div>
                      )}

                      <div
                        style={{ padding: "11px 00px" }}
                        id="Cart_Cntrl_sprte_bx55"
                      >
                        <p id="mediaqry_adjst_fnt">{detailed.mrp}</p>
                      </div>
                      <div
                        style={{ padding: "11px 00px" }}
                        id="Cart_Cntrl_sprte_bx66"
                      >
                        <p id="mediaqry_adjst_fnt">
                          {detailed?.original_price
                            ? detailed?.original_price
                            : ""}
                        </p>
                      </div>
                      <div id="Cart_Cntrl_sprte_bx99">
                        <button
                          onClick={() => {
                            arrangeType(
                              ind,
                              detailed.product_id,
                              detailed.product_name
                            );
                          }}
                          id="Cart_Cntrl_btnselct"
                          style={{ margin: "5px 00px" }}
                          disabled={
                            location?.state?.solist || location?.state?.quoted
                              ? detailed?.selecttype?.toLowerCase() === "as is"
                              : "" && "true"
                          }
                        >
                          {detailed?.selecttype
                            ? detailed?.selecttype?.toLowerCase()
                            : "Select"}
                        </button>
                        {!detailed?.price_accessory > 0 ? (
                          detailed?.selecttype?.toLowerCase() === "boxed" ||
                            detailed?.selecttype?.toLowerCase() === "fitted" ? (
                            <p
                              style={{
                                color: "red",
                                fontSize: "0.5rem",
                                height: "10px",
                                textAlign: "center",
                              }}
                            >
                              {" "}
                              required *
                            </p>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                      </div>
                      <div
                        style={{ padding: "11px 00px" }}
                        id="Cart_Cntrl_sprte_bx1010"
                      >
                        <p id="mediaqry_adjst_fnt">
                          {detailed?.price_accessory
                            ? detailed?.price_accessory
                            : 0}
                        </p>
                      </div>
                      <div id="Cart_Cntrl_sprte_bx77">
                        {!location?.state?.solist ? (
                          <input
                            id="Cart_Cntrl_inp_bx"
                            name="product_Price"
                            style={{
                              marginTop: '6px'
                            }}
                            placeholder=""
                            disabled={location?.state?.solist && "true"}
                            value={
                              detailed?.product_Price ||
                                detailed?.product_Price === ""
                                ? detailed.product_Price
                                : detailed.original_price
                            }
                            onChange={(e) => {
                              inponchange(e, ind);
                            }}
                            type="number"
                            ref={priceRef}
                            min={1}
                          />
                        ) : (
                          <p
                            style={{ margin: "5px 00px" }}
                            id="mediaqry_adjst_fntDicsount"
                          >
                            {detailed?.product_Price ||
                              detailed?.product_Price === ""
                              ? detailed.product_Price
                              : detailed.original_price}
                          </p>
                        )}
                        {!detailed.selling_price &&
                          !detailed.original_price &&
                          !location.state?.solist ? (
                          <p
                            style={{
                              color: "red",
                              fontSize: "0.5rem",
                              height: "10px",
                              textAlign: "start",
                            }}
                          >
                            {" "}
                            required *
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      <div
                        style={{ padding: "11px 00px" }}
                        id="Cart_Cntrl_sprte_bx88"
                      >
                        <p id="mediaqry_adjst_fnt">
                          {detailed.tl_amt ? detailed.tl_amt : 0}
                        </p>
                      </div>
                      <div id="Cart_Cntrl_sprte_bx1313">
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <div style={{ width: "80%" }} className="dropdown">
                            {!location?.state?.solist ? (
                              <select
                                onChange={(e) => {
                                  UpdatingCoupons(JSON.parse(e.target.value));
                                }}
                                name="disc"
                                id="New_sales_order_drpdwn"
                                disabled={location?.state?.solist && "true"}
                              >
                                <option selected disabled value="">
                                  Select
                                </option>
                                {(detailed.selecttype &&
                                  detailed.product_Price) ||
                                  detailed.original_price ? (
                                  <>
                                    {detailed?.activeCampaigns?.map(
                                      (coupons, index) => (
                                        <option
                                          title={coupons?.name}
                                          value={JSON.stringify({
                                            type: coupons.discount_type,
                                            discount: coupons.discount,
                                            couponCode: coupons?.coupon_code,
                                            index: ind,
                                          })}
                                        >
                                          {coupons?.coupon_code}
                                        </option>
                                      )
                                    )}
                                  </>
                                ) : (
                                  ""
                                )}
                              </select>
                            ) : (
                              <p id="mediaqry_adjst_fntDicsount">
                                {detailed?.couponDiscount?.couponCode}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div id="Cart_Cntrl_sprte_bx1313">
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <div style={{ width: "80%" }} className="dropdown">
                            {!location?.state?.solist ? (
                              <select
                                onChange={(e) => {
                                  UpdatingCoupons(JSON.parse(e?.target?.value));
                                }}
                                name="discount"
                                id="New_sales_order_drpdwn"
                                disabled={location?.state?.solist && "true"}
                              >
                                <option
                                  value={JSON.stringify({
                                    normalDiscount: true,
                                    type: "Percentage",
                                    discount: 0,
                                    index: ind,
                                  })}
                                >
                                  0%
                                </option>
                                {(detailed?.selecttype &&
                                  detailed?.product_Price) ||
                                  detailed?.original_price ? (
                                  <>
                                    <option
                                      value={JSON.stringify({
                                        normalDiscount: true,
                                        type: "Percentage",
                                        discount: 5,
                                        index: ind,
                                      })}
                                    >
                                      5%
                                    </option>
                                    <option
                                      value={JSON.stringify({
                                        normalDiscount: true,
                                        type: "Percentage",
                                        discount: 10,
                                        index: ind,
                                      })}
                                    >
                                      10%
                                    </option>
                                    <option
                                      value={JSON.stringify({
                                        normalDiscount: true,
                                        type: "Percentage",
                                        discount: 15,
                                        index: ind,
                                      })}
                                    >
                                      15%
                                    </option>
                                  </>
                                ) : (
                                  ""
                                )}
                              </select>
                            ) : (
                              <p id="mediaqry_adjst_fntDicsount">
                                {detailed?.normalDiscount?.discount}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div id="Cart_Cntrl_sprte_bx1212">
                        <p id="mediaqry_adjst_fnt">
                          {detailed.total
                            ? parseFloat(detailed?.total).toFixed(2)
                            : 0}
                        </p>
                      </div>
                      <div id="Cart_Cntrl_sprte_bx1111">
                        {!location.state?.solist && !location.state?.quoted ? (
                          <p
                            onClick={(e) => {
                              sliceProductArraay(e, detailed.product_id, ind);
                            }}
                            style={{
                              color: "red",
                              cursor: "pointer",
                              borderRadius: "50%",
                              border: "1px solid red",
                              height: "22px",
                              width: "25px",
                              marginTop: '15px'
                            }}

                          >
                            -
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                ""
              )}
              <br />
              {!location?.state?.quoted || !location?.state?.solist ? (
                <div className="NewSalesAddProductBtn">
                  <div className="NewSalesAddProductBtnAligndiv">
                    <p id="mediaqry_adjst_fnt">+</p>
                    <button
                      onClick={() => {
                        if (TotalData?.user_name) {
                          setprdctflse(true);
                          setrequired(false);
                          setcuslistflse(false);
                        } else {
                          setprdctflse(false);
                          setrequired(true);
                          setcuslistflse(false);
                        }
                      }}
                      style={{
                        textAlign: "start",
                        borderBottom: "1px solid black",
                        cursor: "pointer",
                        fontSize: "0.7rem",
                        backgroundColor: "transparent",
                        border: "none",
                      }}
                    >
                      Add Product
                    </button>
                  </div>
                  {prdctflse ? (
                    <div className="NewSalesAddProductTable" ref={prodListRef}>
                      <table border={1}>
                        <div className="NewSalesAddProductTableAlign">
                          <input
                            style={{
                              fontSize: "0.7rem",
                              width: "100%",
                              height: "25px",
                            }}
                            onClick={() => {
                              setprdctflse(true);
                            }}
                            onChange={(e) => {
                              const query = e.target.value.toLowerCase();
                              const filteredData = products.filter((data) =>
                                data.product_name.toLowerCase().includes(query) || data.product_code.toLowerCase().includes(query)
                              );
                              const remainingData = products.filter(
                                (data) =>
                                  !data.product_name.toLowerCase().includes(query) &&
                                  !data.product_code.toLowerCase().includes(query)
                              );
                              setproducts([...filteredData, ...remainingData]);
                            }}

                            placeholder="Search"
                            ref={searchinpt}
                            id="newa_newsales_inp3"
                            type="text"
                            name=""
                          />

                        </div>
                        <tr>
                          <th>Product Name</th>
                          <th>Product Code</th>
                          <th>Product Colour</th>
                          <th>In Stock</th>
                        </tr>
                        {products.map((ele) => (
                          <tr
                            onClick={() => {
                              product_Details(ele.product_id);
                            }}
                            style={{ cursor: "pointer" }}
                            className="p-1"
                          >
                            <td style={{ textAlign: "left" }} className="p-2">
                              {ele.product_name}
                            </td>
                            <td
                              className="p-2"
                              style={{ textAlign: "left", paddingleft: "8px" }}
                            >
                              {ele.product_code}
                            </td>
                            <td className="p-2">
                              <div className="newa_newsalesAlignColorBox">
                                <div
                                  style={{
                                    width: "25px",
                                    height: "25px",
                                    backgroundColor: `${ele?.color_family}`,
                                  }}
                                ></div>
                              </div>
                            </td>
                            <td>{ele.total_quantity}</td>
                          </tr>
                        ))}
                      </table>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div style={{ height: "1rem" }}></div>

          <div style={{ width: "97%", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
  {/* ✅ Remarks textarea on left */}
<div style={{ flex: "0 0 300px", marginRight: "20px" }}>
  <p>Remarks</p>
  <textarea
    value={TotalData?.remarks || ""}  // ✅ shows value from TotalData
    onChange={(e) =>
      setTotalData({
        ...TotalData,
        remarks: e.target.value,       // ✅ updates TotalData dynamically
      })
    }
    placeholder="Enter remarks..."
    rows="3"
    style={{
      width: "100%",
      padding: "6px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      resize: "vertical",
      fontSize: "0.85rem",
    }}
  />
</div>

  {/* ✅ Grand total + discount section on right */}
  <div style={{ display: "flex" }}>

              <div>
                <p>Grand Total </p>
                <p className="new_sales_fontfamily">
                  ₹{" "}
                  {TotalData.grandTotal
                    ? parseFloat(TotalData.grandTotal).toFixed(2)
                    : ""}
                </p>
              </div>
              <div style={{ width: "50px" }}></div>
              {/* <div>
                <p>Discount </p>
                {!location?.state?.solist ? (
                  <select
                    onChange={(e) => {
                      UpdatingCoupons(JSON.parse(e.target.value));
                    }}
                    disabled={location?.state?.solist && "true"}
                    name="disc"
                    id="New_sales_order_drpdwn"
                    defaultValue=""
                  >
                    <option
                      value={JSON.stringify({
                        type: "Percentage",
                        discount: 0,
                        finalDiscount: true,
                      })}
                    >
                      0%
                    </option>
                    <option
                      value={JSON.stringify({
                        type: "Percentage",
                        discount: 5,
                        finalDiscount: true,
                      })}
                    >
                      5%
                    </option>
                    <option
                      value={JSON.stringify({
                        type: "Percentage",
                        discount: 10,
                        finalDiscount: true,
                      })}
                    >
                      10%
                    </option>
                    <option
                      value={JSON.stringify({
                        type: "Percentage",
                        discount: 15,
                        finalDiscount: true,
                      })}
                    >
                      15%
                    </option>
                  </select>
                ) : (
                  <p> {TotalData?.discount?.discount}% </p>
                )}
              </div> */}




              {/* <div style={{ width: "50px" }}></div>
              <div>
                <p>Final amount</p>
                <p className="new_sales_fontfamily">
                  ₹{" "}
                  {TotalData?.tl_amt
                    ? parseFloat(TotalData?.tl_amt).toFixed(2)
                    : ""}
                </p>
              </div>
            </div> */}
              {/* ===== Discount Section ===== */}
              <div style={{ display: "flex", gap: "20px" }}>
                {/* Discount Dropdown */}
                <div>
                  <p>Discount</p>
                  {!location?.state?.solist ? (
                    <select
                      id="New_sales_order_drpdwn"
                      value={
                        manualDiscount
                          ? JSON.stringify({
                            type: "Rupees",
                            discount: manualDiscount,
                            finalDiscount: true,
                          })
                          : JSON.stringify({
                            type: "Percentage",
                            discount: TotalData?.discount?.type === "Percentage"
                              ? TotalData?.discount?.discount || 0
                              : 0,
                            finalDiscount: true,
                          })
                      }
                      disabled={!!manualDiscount} // Disable dropdown if manual ₹ discount is active
                      onChange={(e) => {
                        const selected = JSON.parse(e.target.value);
                        setManualDiscount(""); // Reset rupee field
                        UpdatingCoupons(selected);
                      }}
                    >
                      <option
                        value={JSON.stringify({
                          type: "Percentage",
                          discount: 0,
                          finalDiscount: true,
                        })}
                      >
                        0%
                      </option>
                      <option
                        value={JSON.stringify({
                          type: "Percentage",
                          discount: 5,
                          finalDiscount: true,
                        })}
                      >
                        5%
                      </option>
                      <option
                        value={JSON.stringify({
                          type: "Percentage",
                          discount: 10,
                          finalDiscount: true,
                        })}
                      >
                        10%
                      </option>
                      <option
                        value={JSON.stringify({
                          type: "Percentage",
                          discount: 15,
                          finalDiscount: true,
                        })}
                      >
                        15%
                      </option>
                    </select>
                  ) : (
                    <p>
  {TotalData?.discount?.type === "Rupees"
    ? `₹${TotalData?.discount?.discount || 0}`
    : `${TotalData?.discount?.discount || 0}%`}
</p>

                  )}
                </div>

                {/* Manual Rupee Discount */}
                {!location?.state?.solist && (
                  <div>
                    <p>or Discount (₹)</p>
                    <input
                      type="number"
                      min="0"
                      placeholder="Enter ₹"
                      value={manualDiscount || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setManualDiscount(val);

                        let discountValue = parseFloat(val) || 0;

                        if (discountValue > 0) {
                          // Switch to rupee discount mode
                          UpdatingCoupons({
                            type: "Rupees",
                            discount: discountValue,
                            finalDiscount: true,
                          });
                        } else {
                          // Switch back to 0% mode cleanly
                          setManualDiscount("");
                          UpdatingCoupons({
                            type: "Percentage",
                            discount: 0,
                            finalDiscount: true,
                          });
                        }
                      }}

                    style={{
                      width: "100px",
                      padding: "4px 6px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
      />
                  </div>
                )}

                {/* Final Amount */}
                <div>
                  <p>Final Amount</p>
                  <p className="new_sales_fontfamily">
                    ₹{" "}
                    {TotalData?.tl_amt
                      ? parseFloat(TotalData?.tl_amt).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {location?.state?.solist && (
            <div className="newsalesAlignFinalAmount">
              <div className="newsalesAlignFinalAmButton">
                <p>Payment amount</p>
                <input
                  value={
                    paymentData?.total_amount ? paymentData?.total_amount : ""
                  }
                  onChange={getPaymentsData}
                  name="total_amount"
                  type="number"
                />
              </div>
              <div className="newsalesAlignFinalAmButton">
                <p>Payment mode</p>
                <select
                  value={paymentData?.mode}
                  onChange={getPaymentsData}
                  name="mode"
                  id=""
                >
                  <option selected disabled value="">
                    Select mode
                  </option>
                  <option value="BANK">Bank</option>
                  <option value="CASH">Cash</option>
                  <option value="UPI">Upi</option>
                </select>
              </div>
              <div className="newsalesAlignFinalAmButton">
                <div className="newsalesAlignFinalConfirmBtn">
                  <button
                    onClick={confirmPaymentData}
                    className="newsalesAlignFinalConfirm"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
          <div style={{ height: "3rem" }}></div>

          <div id="Cart_Cntrl_last_sec">
            <div id="Cart_Cntrl_last_button_align">
              <button
                onClick={() => {
                  navigate(-1);
                }}
                id="Cart_Cntrl_las_btns1"
              >
                <div
                  onClick={() => { }}
                  style={{ display: "flex", textAlign: "center" }}
                >
                  <div style={{ width: "5px" }}></div>
                  Back
                </div>
              </button>
              {(location.state?.quoted && location.state?.rejected) ||
                (location.state?.quoted && !location.state?.solist) ? (
                <>
                  <div style={{ width: "10px", height: "10px" }}></div>
                  <button
                    onClick={() => {
                      closeOrder();
                    }}
                    id="Cart_Cntrl_las_BackBTN"
                  >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div style={{ width: "5px" }}></div>
                      Close order
                    </div>
                  </button>
                </>
              ) : (
                ""
              )}
              {!location.state?.solist ? (
                <>
                  <div style={{ width: "10px", height: "10px" }}></div>
                  <button
                    onClick={() => {
                      godata({ draft: true });
                    }}
                    id="Cart_Cntrl_las_btns2"
                  >
                    <div style={{ display: "flex" }}>
                      <div style={{ width: "5px" }}></div>
                      Save as draft
                    </div>
                  </button>
                </>
              ) : (
                ""
              )}
              <div style={{ width: "10px", height: "10px" }}></div>
              {!location.state?.solist ? (
                <>
                  <button onClick={godata} id="Cart_Cntrl_las_btns3">
                    <div style={{ display: "flex" }}>
                      <div style={{ width: "5px" }}></div>
                      Confirm
                    </div>
                  </button>
                </>
              ) : (
                <>
                  {location.state?.solist ? (
                    <button
                      onClick={() => {
                        navigate("/downlaod_order", {
                          state: { data: location.state?.data },
                        });
                      }}
                      id="Cart_Cntrl_las_btns3"
                    >
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div style={{ width: "5px" }}></div>
                        Download
                      </div>
                    </button>
                  ) : (
                    ""
                  )}
                  <div style={{ width: "10px", height: "10px" }}></div>
                  {location.state?.so_status === "placed" ||
                    location.state?.so_status === "forfitting" ||
                    location.state?.so_status === "fitted" ||
                    location.state?.so_status === "forpacking" ||
                    location.state?.so_status === "packed" ||
                    location.state?.so_status === "dispatched" ? (
                    <button id="Cart_Cntrl_las_btns90">
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                        onClick={() => {
                          navigate("/sopayment", {
                            state: location.state?.data,
                          });
                        }}
                      >
                        <div style={{ width: "5px" }}></div>
                        Add payment
                      </div>
                    </button>
                  ) : (
                    ""
                  )}
                  <div style={{ width: "10px", height: "10px" }}></div>
                  {location.state?.so_status === "placed" ||
                    location.state?.so_status === "forfitting" ||
                    location.state?.so_status === "fitted" ||
                    location.state?.so_status === "forpacking" ||
                    location.state?.so_status === "packed" ||
                    location.state?.so_status === "dispatched" ? (
                    <button id="Cart_Cntrl_las_btns90">
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                        onClick={() => {
                          setIsShowModal(true);
                        }}
                      >
                        <div style={{ width: "5px" }}></div>
                        Status
                      </div>
                    </button>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          </div>

          {accessoriePop.pop ? (
            <div id="Cart_Cntrl_salesType_abslt_align">
              <div className="p-4" id="Cart_Cntrl_salesType_abslt">
                {SelectType["as is"] ||
                  SelectType.boxed ||
                  SelectType.fitted ? (
                  ""
                ) : (
                  <div id="New_sales_attach_pop_heigh">
                    <div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <button
                            ref={acselectref}
                            id="New_sales_attach_Ptag"
                            style={{
                              cursor: "pointer",
                              border: "1px solid black ",
                              borderRadius: "15px",
                              width: "150px",
                            }}
                            onClick={() => {
                              settingSelectTypes("as is");
                              setSelectType({ asis: true });
                              setaccessoriePop((pre) => ({
                                ...pre,
                                pop: false,
                              }));
                            }}
                          >
                            As Is
                          </button>
                          <div style={{ height: "10px" }}></div>
                          <button
                            id="New_sales_attach_Ptag"
                            style={{
                              cursor: "pointer",
                              border: "1px solid black ",
                              borderRadius: "15px",
                              width: "150px",
                            }}
                            onClick={() => {
                              settingSelectTypes("boxed");

                              setSelectType({ boxed: true });
                            }}
                          >
                            Boxed
                          </button>
                          <div style={{ height: "10px" }}></div>
                          <button
                            id="New_sales_attach_Ptag"
                            style={{
                              cursor: "pointer",
                              border: "1px solid black ",
                              borderRadius: "15px",
                              width: "150px",
                            }}
                            onClick={() => {
                              settingSelectTypes("fitted");
                              setSelectType({ fitted: true });
                            }}
                          >
                            Fitted
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {SelectType.boxed || SelectType.fitted ? (
                  <>
                    {/* {!location?.state?.solist && TotalData?.products[accessoriePop?.ProIndex]?.products_accessories?.length > 0 ? */}
                    <>
                      <div>
                        <h4>{accessoriePop.name}</h4>
                      </div>
                      <div id="New_sales_attach_pop_hei">
                        <div id="Cart_Cntrl_Bx_head">
                          <div id="Cart_Cntrl_sprte_bx111">
                            <p id="mediaqry_adjst_fnt2">Sl No</p>
                          </div>
                          <div id="Cart_Cntrl_sprte_bx222">
                            <p id="mediaqry_adjst_fnt2">Name</p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            id="Cart_Cntrl_sprte_bx333"
                          >
                            <p id="mediaqry_adjst_fnt2">Qty</p>
                          </div>
                          <div id="Cart_Cntrl_sprte_bx444">
                            <p id="mediaqry_adjst_fnt2">Mrp</p>
                          </div>
                          <div id="Cart_Cntrl_sprte_bx444">
                            <p id="mediaqry_adjst_fnt2">Price</p>
                          </div>
                          <div id="Cart_Cntrl_sprte_bx444">
                            <p id="mediaqry_adjst_fnt2">Tl amt</p>
                          </div>
                          <div id="Cart_Cntrl_sprte_bx444"></div>
                        </div>
                        <div
                          style={{
                            overflow: "scroll",
                            overflowX: "hidden",
                            height: "20rem",
                          }}
                        >
                          {TotalData?.products[accessoriePop?.ProIndex]
                            ?.products_accessories ? (
                            <>
                              {TotalData?.products[
                                accessoriePop?.ProIndex
                              ]?.products_accessories?.map((datas, index) => (
                                <div key={index} id="Cart_Cntrl_datas">
                                  <div
                                    style={{ padding: "11px 00px" }}
                                    id="Cart_Cntrl_sprte_bx111"
                                  >
                                    <p id="mediaqry_adjst_fnt2">{index + 1}</p>
                                  </div>
                                  <br />
                                  <div
                                    style={{ padding: "11px 00px" }}
                                    id="Cart_Cntrl_sprte_bx222"
                                  >
                                    <p
                                      style={{ textAlign: "start" }}
                                      id="mediaqry_adjst_fnt2"
                                    >
                                      {datas.product_name}
                                    </p>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                    id="Cart_Cntrl_sprte_bx333"
                                  >
                                    <div
                                      style={{
                                        height: "25px",
                                        borderRadius: "5px",
                                      }}
                                    >
                                      <input
                                        value={
                                          datas.qty
                                            ? datas.qty
                                            : datas?.order_qty
                                        }
                                        ref={acqtyeref}
                                        onChange={(e) => {
                                          accessorieChanges(
                                            e,
                                            datas.prod_id,
                                            index,
                                            datas.product_name
                                          );
                                        }}
                                        id="Cart_Cntrl_inp_bx"
                                        name="qty"
                                        type="number"
                                        min={1}
                                      />
                                    </div>
                                  </div>
                                  <div id="Cart_Cntrl_sprte_bx444">
                                    <p
                                      style={{
                                        fontSize: "0.7rem",
                                        margin: "5px 00px",
                                      }}
                                      id="mediaqry_adjst_fnt2"
                                    >
                                      {datas.mrp}
                                    </p>
                                  </div>
                                  <div id="Cart_Cntrl_sprte_bx444">
                                    <input
                                      value={
                                        datas.price
                                          ? datas.price
                                          : datas.sales_price
                                      }
                                      ref={acpriceref}
                                      onChange={(e) => {
                                        accessorieChanges(
                                          e,
                                          datas.prod_id,
                                          index,
                                          datas.product_name
                                        );
                                      }}
                                      id="Cart_Cntrl_inp_bx"
                                      name="price"
                                      type="number"
                                      min={1}
                                    />
                                  </div>
                                  <div id="Cart_Cntrl_sprte_bx444">
                                    <p
                                      style={{
                                        fontSize: "0.7rem",
                                        margin: "5px 00px",
                                      }}
                                    >
                                      {datas.ac_tl_Price}
                                    </p>
                                  </div>
                                  <div id="Cart_Cntrl_sprte_bx444">
                                    <p
                                      onClick={(e) => {
                                        slicearray(e, index);
                                      }}
                                      style={{
                                        cursor: "pointer",
                                        borderRadius: "50%",
                                        border: "1px solid red",
                                        height: "22px",
                                        width: "25px",
                                        color: "red",
                                      }}
                                    >
                                      -
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            ""
                          )}
                          <br />
                          <div id="Cart_Cntrl_datas">
                            {!location?.state?.quoted ||
                              !location?.state?.solist ? (
                              <div style={{ width: "13%" }} id="">
                                <p id="mediaqry_adjst_fnt2">+</p>
                              </div>
                            ) : (
                              ""
                            )}
                            <div style={{ width: "50%" }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                }}
                              >
                                {!location?.state?.quoted ||
                                  !location?.state?.solist ? (
                                  <button
                                    onClick={() => {
                                      setaccessoriestrflse(true);
                                    }}
                                    style={{
                                      textAlign: "start",
                                      borderBottom: "1px solid black",
                                      width: "50%",
                                      cursor: "pointer",
                                      backgroundColor: "transparent",
                                      border: "none",
                                    }}
                                    id="mediaqry_adjst_fnt2"
                                    disabled={location?.state?.solist}
                                  >
                                    Add Accessories
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                              {accessoriestrflse ? (
                                <>
                                  <div
                                    ref={acceryref}
                                    id="Cart_Cntrl_prdct_list"
                                  >
                                    <div
                                      style={{
                                        top: "0",
                                        position: "sticky",
                                        height: "45px",
                                        backgroundColor: "rgb(158 244 246)",
                                        borderBottom: "1px solid black",
                                      }}
                                    >
                                      <input
                                        ref={accesearchref}
                                        style={{
                                          height: "25px",
                                          fontSize: "0.7rem",
                                          width: "100%",
                                        }}
                                        onChange={(e) => {
                                          const query =
                                            e.target.value.toLowerCase();
                                          const filteredData =
                                            Accessoriesdatas.filter((data) =>
                                              data.product_name
                                                .toLowerCase()
                                                .includes(query)
                                            );
                                          const remainingData =
                                            Accessoriesdatas.filter(
                                              (data) =>
                                                !data.product_name
                                                  .toLowerCase()
                                                  .includes(query)
                                            );
                                          setAccessoriesdatas([
                                            ...filteredData,
                                            ...remainingData,
                                          ]);
                                        }}
                                        placeholder="Search"
                                        id="newa_newsales_inp3"
                                        type="text"
                                        name=""
                                      />
                                      <div id="newa_newsales_prodlist">
                                        <div id="newa_newsales_part2">
                                          <p id="new_sales_orer_ac_fnt">
                                            Accessory name
                                          </p>
                                        </div>
                                        <div id="newa_newsales_part3">
                                          <p id="new_sales_orer_ac_fnt">
                                            Color
                                          </p>
                                        </div>
                                        <div id="newa_newsales_part4">
                                          <p id="new_sales_orer_ac_fnt">
                                            In stock
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div style={{ height: "5px" }}></div>
                                    {Accessoriesdatas.map((data, index) => (
                                      <button
                                        key={index}
                                        style={{
                                          cursor: "pointer",
                                          border: "none",
                                          backgroundColor: "transparent",
                                        }}
                                        onClick={() => {
                                          accessorielistarray(data.prod_id);
                                          setaccessoriestrflse(false);
                                        }}
                                        id="newa_newsales_prodlist"
                                      >
                                        <div id="newa_newsales_part2">
                                          <p
                                            style={{
                                              cursor: "pointer",
                                              fontSize: "0.7rem",
                                              textAlign: "start",
                                              width: "90%",
                                            }}
                                          >
                                            {data.product_name}
                                          </p>
                                        </div>
                                        <div id="newa_newsales_part3">
                                          <div
                                            style={{
                                              width: "20px",
                                              height: "20px",
                                              backgroundColor: `${data.color_family}`,
                                            }}
                                          ></div>
                                        </div>
                                        <div id="newa_newsales_part4">
                                          <p id="new_sales_orer_ac_fnt1">
                                            {data.total_quantity}
                                          </p>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                ""
                              )}
                            </div>
                            <br />
                          </div>
                        </div>
                      </div>
                      <div id="new_sales_pop_fnl">
                        <div style={{ height: "30px" }}></div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "start",
                            width: "100%",
                          }}
                        >
                          {!SelectType.boxed ? (
                            <div style={{ textAlign: "start" }}>
                              <p>Fitting fee :</p>
                              <input
                                value={
                                  TotalData.products[accessoriePop?.ProIndex]
                                    ?.fitting_charge
                                }
                                ref={fittingChargeceref}
                                onChange={(e) => {
                                  inponchange(e, accessoriePop?.ProIndex);
                                }}
                                type="number"
                                name="fitting_charge"
                                id=""
                                min={1}
                              />
                              {TotalData?.products[accessoriePop?.ProIndex]
                                ?.fitting_charge ? (
                                ""
                              ) : (
                                <p style={{ color: "red", fontSize: "0.7rem" }}>
                                  required *
                                </p>
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                          <div style={{ marginLeft: "auto" }}>
                            <p>Final price</p>
                            <br />
                            <h6
                              className="new_sales_fontfamily"
                              style={{ margin: "-30px 00px" }}
                            >
                              ₹
                              {
                                TotalData?.products[accessoriePop?.ProIndex]
                                  ?.price_accessory
                              }
                            </h6>
                          </div>
                        </div>
                      </div>
                    </>
                    {/* :
                      <h5>No accessories have been added</h5>
                    } */}
                  </>
                ) : (
                  ""
                )}
                <br />
                <br />

                <div style={{ display: "flex", justifyContent: "center" }}>
                  {!location.state?.solist && !location.state?.quoted ? (
                    SelectType.fitted || SelectType.boxed ? (
                      <button
                        onClick={() => {
                          setSelectType({
                            boxed: false,
                            fitted: false,
                            asis: false,
                          });
                        }}
                        id="Cart_Cntrl_las_btns111"
                      >
                        Back
                      </button>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                  <div style={{ width: "10px" }}></div>
                  <button
                    onClick={() => {
                      setaccessoriePop({ pop: false });
                    }}
                    id="Cart_Cntrl_las_btns1"
                  >
                    close
                  </button>
                  <div style={{ width: "10px" }}></div>

                  {(!location?.state?.solist &&
                    SelectType.fitted &&
                    TotalData?.products[accessoriePop.ProIndex]
                      .fitting_charge &&
                    TotalData?.products[accessoriePop.ProIndex]
                      .price_accessory) ||
                    (SelectType.boxed &&
                      TotalData?.products[accessoriePop.ProIndex]
                        .price_accessory) ? (
                    <button
                      onClick={() => {
                        setaccessoriePop({ ...accessoriePop, pop: false });
                        accessorieconfirm();
                      }}
                      id="Cart_Cntrl_las_btns3"
                    >
                      Confirm
                    </button>
                  ) : (
                    ""
                  )}
                </div>
                <br />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <Modal
        open={isShowModal}
        onClose={() => {
          setIsShowModal(false);
        }}
      >
        <div className="newSalesOrder_modalContainer">
          <OrderPage sales_id={location?.state?.data} />
        </div>
      </Modal>
      <BarcodeListener onScan={handleScan} />
      {/* <input
        type="text"
        placeholder="Enter barcode manually"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleScan(e.target.value);
            e.target.value = ""; // clear input after scan
          }
        }}
      /> */}

    </>

  );
}
