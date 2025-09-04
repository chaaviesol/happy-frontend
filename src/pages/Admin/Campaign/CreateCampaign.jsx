import React, { useEffect, useState, useRef } from "react";
import styles from "./createcampaign.module.css";
import Sidebar from "../../../components/admin components/Sidebar";
import { IconButton } from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import TextFieldOut from "../../../components/FormComponents/InputBox/TextField";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export const CreateCampaign = () => {
  const [form, setForm] = useState({
    status: "upcoming",
  });
  const [prodData, setProdData] = useState([]);
  const [filteredProdData, setFilteredProdData] = useState([]);
  const [isAllProdsSelected, setIsAllProdsSelected] = useState(false);
  const [isAllFProdsSelected, setIsAllFProdsSelected] = useState(false);
  const [showNoProds, setShowNoProds] = useState(false);
  const [loading, setLoading] = useState(false);
  const campaignName_Ref = useRef(null);
  const coupon_Ref = useRef(null);
  const product_sub_type_Ref = useRef("");
  const prod_subtype2_Ref = useRef("");
  const product_name_Ref = useRef("");
  const axiosPrivate = useAxiosPrivate();
  const toastConfig = {
    position: "top-center",
    autoClose: 1700,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const getAllProducts = async () => {
    try {
      const campaign = { campaign: true };
      setLoading(true);
      const response = await axiosPrivate.post(
        `/product/productlist`,
        campaign
      );
      if (response.data) {
        setProdData(response.data);
      }
    } catch (err) {
      console.error("Error fetching product list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleSelectSingleProd = (product_id) => {
    // fn for
    const updateProductData = (prevProdData) => {
      return prevProdData.map((ele) =>
        ele.product_id === product_id
          ? { ...ele, checked: !ele.checked }
          : { ...ele }
      );
    };
    setProdData((prevProdData) => {
      const updatedProdData = updateProductData(prevProdData);
      if (filteredProdData.length === 0) {
        handleChangeAllProductsState(updatedProdData);
      }
      return updatedProdData;
    });
    if (filteredProdData.length != 0) {
      setFilteredProdData((prevProdData) => {
        const updatedProdData = updateProductData(prevProdData);
        handleChangeAllProductsState(updatedProdData);
        return updatedProdData;
      });
    }
  };

  const handleAllSelection = () => {
    if (showNoProds) {
      return;
    }
    if (filteredProdData.length != 0) {
      const updatedProdData = filteredProdData.map((ele) => {
        return {
          ...ele,
          checked: !isAllFProdsSelected,
        };
      });
      setFilteredProdData(updatedProdData);
      handleChangeAllProductsState(updatedProdData);
      console.log({ updatedProdData });
      handleOrgStateChanges(updatedProdData);
    } else {
      // alert("all");
      const updatedProdData = prodData.map((ele) => {
        return {
          ...ele,
          checked: !isAllProdsSelected,
        };
      });
      setProdData(updatedProdData);
      handleChangeAllProductsState(updatedProdData);
    }
  };
  const handleOrgStateChanges = (updatedData) => {
    setProdData((prevProdData) => {
      const updatedProdData = prevProdData.map((ele) => {
        const shouldUpdate = updatedData.some(
          (item) => item.product_id === ele.product_id
        );

        return shouldUpdate
          ? { ...ele, checked: !isAllFProdsSelected }
          : { ...ele };
      });
      return updatedProdData;
    });
  };

  const handleChangeAllProductsState = (updatedProdData) => {
    if (filteredProdData.length != 0) {
      const allProdCheckStatus = updatedProdData.every((ele) => ele.checked);
      // alert(allProdCheckStatus);
      setIsAllProdsSelected(allProdCheckStatus);
      setIsAllFProdsSelected(allProdCheckStatus);
    } else {
      const allProdCheckStatus = updatedProdData.every((ele) => ele.checked);
      setIsAllProdsSelected(allProdCheckStatus);
    }
  };

  const handleConfirmForm = async () => {
    const selectedProducts = prodData.filter((ele) => ele.checked);
    if (!selectedProducts || selectedProducts.length < 1) {
      alert("Select A Product");
      return;
    }
    const requiredFields = ["discount", "start_date", "end_date"];
    const name = campaignName_Ref?.current?.value;
    const coupon_code = coupon_Ref?.current?.value;
    if (requiredFields.some((field) => !form[field]) || !name || !coupon_code) {
      alert("All fields required");
    } else {
      if (
        form.discount_type === "Percentage" &&
        parseInt(form.discount) > 100
      ) {
        alert("Discount percentage exceeds 100%");
        return;
      }
      try {
        setLoading(true);
        const checkedProdIds = selectedProducts.map((ele) => ele.product_id);
        const data = {
          ...form,
          name,
          coupon_code,
          created_by: 116,
          image:
            "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Frepublic-day-sale&psig=AOvVaw1lYXOiejDNKL35H7WWGL_e&ust=1705038794143000&source=images&cd=vfe&ved=0CBMQjRxqFwoTCMCH09PS1IMDFQAAAAAdAAAAABAE",
          product_id: checkedProdIds,
        };

        console.log({ data });
        const response = await axiosPrivate.post(
          `/campaign/createcampaign`,
          data
        );

        if (response.status === 200) {
          handleSuccess();
          console.log({ response });
        }
      } catch (err) {
        toast.error("Something went wrong", toastConfig);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFormChanges = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]:
        name === "discount" && form.discount_type ? parseInt(value, 10) : value,
    }));
  };

  const handleFilterProducts = (event) => {
    setShowNoProds(false);
    const categoryFilterValue = getLowerCasedVal(product_sub_type_Ref);
    const subCategoryFilterValue = getLowerCasedVal(prod_subtype2_Ref);
    const prodNameFilterValue = getLowerCasedVal(product_name_Ref);
    if (
      !categoryFilterValue &&
      !subCategoryFilterValue &&
      !prodNameFilterValue
    ) {
      setFilteredProdData([]);
      handleChangeAllProductsState(prodData);
    } else {
      const filteredData = filterData(
        categoryFilterValue,
        subCategoryFilterValue,
        prodNameFilterValue
      );
      if (filteredData.length === 0) {
        setShowNoProds(true);
        setFilteredProdData([]);
        setIsAllFProdsSelected(false);
        setIsAllProdsSelected(false);
      } else {
        setFilteredProdData(filteredData);
        handleChangeAllProductsState(filteredData);
      }
      // console.log({ filteredData });
      // console.log(subCategoryFilterValue);
      // console.log(prodNameFilterValue);
    }
  };
  const getLowerCasedVal = (ref) => ref?.current?.value.toLowerCase();
  const filterData = (categoryFilter, subCategoryFilter, prodNameFilter) => {
    let currProdData = [...prodData];
    console.log({ currProdData });
    return currProdData.filter((product) => {
      const categoryMatch =
        !categoryFilter ||
        (product.product_sub_type &&
          product.product_sub_type.toLowerCase().includes(categoryFilter));
      const subcategoryMatch =
        !subCategoryFilter ||
        (product.prod_subtype2 &&
          product.prod_subtype2.toLowerCase().includes(subCategoryFilter));
      const prodNameMatch =
        !prodNameFilter ||
        (product.product_name &&
          product.product_name.toLowerCase().includes(prodNameFilter)) ||
        (product.product_code &&
          product.product_code.toLowerCase().includes(prodNameFilter));
      return categoryMatch && subcategoryMatch && prodNameMatch;
    });
  };
  const handleDate = (date, name) => {
    const originalDate = new Date(date);
    const convertedDateString = `${originalDate.getFullYear()}-${(
      originalDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${originalDate
      .getDate()
      .toString()
      .padStart(2, "0")}T00:00:00.000Z`;

    setForm({
      ...form,
      [name]: convertedDateString,
    });
  };

  const handleSuccess = () => {
    toast.success("Campaign created ", toastConfig);
    setFilteredProdData([]);
    setIsAllProdsSelected(false);
    setIsAllFProdsSelected(false);
    setShowNoProds(false);
    setForm({ status: "upcoming" });
    getAllProducts();
    campaignName_Ref.current.value = "";
    coupon_Ref.current.value = "";
  };

  console.log({ form });
  // console.log({ prodData });
  // console.log({ filteredProdData });
  return (
    <Sidebar type="createCampaign">
      <div className={styles.container}>
        <div className={styles.upperSection}>
          <div className={styles.heading}>
            <span>Create Campaign</span>
          </div>
          <div className={styles.details}>
            <div className={styles.first}>
              <TextFieldOut
                name="name"
                refData={campaignName_Ref}
                label="Name"
              />
            </div>
            <div className={styles.sec}>
              <TextFieldOut
                label="Coupon code"
                name="coupon_code"
                refData={coupon_Ref}
              />
            </div>
            <div className={styles.third}>
              <div className={styles.discountMain}>
                <div className={styles.discountContainer}>
                  <select
                    value={form?.discount_type || ""}
                    name="discount_type"
                    className={styles.selectB}
                    onChange={handleFormChanges}
                  >
                    <option value="" disabled hidden>
                      Discount type
                    </option>
                    <option value="Amount">Amount</option>
                    <option value="Percentage">Percentage</option>
                  </select>

                  <input
                    onChange={handleFormChanges}
                    type="number"
                    min={1}
                    name="discount"
                    value={form.discount || ""}
                    placeholder="Discount"
                    className={styles.discountInputBox}
                  />
                </div>
              </div>
            </div>
            <div className={styles.third}>
              <DatePicker
                minDate={new Date()}
                className={styles.inputBox}
                selected={form?.start_date ? new Date(form.start_date) : null}
                onChange={(date) => handleDate(date, "start_date")}
                name="start_date"
                dateFormat="dd/MM/yyyy"
                placeholderText="Starting date"
              />
            </div>
            <div className={styles.third}>
              <DatePicker
                minDate={
                  form?.start_date ? new Date(form.start_date) : new Date()
                }
                className={styles.inputBox}
                selected={form?.end_date ? new Date(form.end_date) : null}
                onChange={(date) => handleDate(date, "end_date")}
                dateFormat="dd/MM/yyyy"
                placeholderText="Ending date"
              />
            </div>
          </div>
        </div>
        <div className={styles.tableSection}>
          <div className={styles.table}>
            <div className={styles.tabHeading}>
              <div className={styles.slno}>sl No</div>
              <div className={styles.check}>
                <IconButton
                  onClick={handleAllSelection}
                  style={{ height: "40px" }}
                >
                  <i
                    style={{
                      cursor: "pointer",
                      color: isAllProdsSelected ? "#3772ff" : "black",
                      opacity: isAllProdsSelected ? 1 : 0.2,
                    }}
                    className="ri-checkbox-circle-line  "
                  ></i>
                </IconButton>
              </div>
              <div className={styles.category}>
                <span>Categories</span>
                <div>
                  <input
                    ref={product_sub_type_Ref}
                    name="product_sub_type"
                    onChange={handleFilterProducts}
                    type="text"
                    placeholder="Search"
                    className={styles.inputBox}
                  />
                </div>
              </div>
              <div className={styles.subcategories}>
                <span>Subcategories</span>
                <div>
                  <input
                    type="text"
                    ref={prod_subtype2_Ref}
                    name="prod_subtype2"
                    onChange={handleFilterProducts}
                    placeholder="Search"
                    className={styles.inputBox}
                  />
                </div>
              </div>
              <div className={styles.product}>
                <span>Product</span>
                <div>
                  <input
                    type="text"
                    name="product_name"
                    ref={product_name_Ref}
                    onChange={handleFilterProducts}
                    placeholder="Search"
                    className={styles.inputBox}
                  />
                </div>
              </div>
              <div className={styles.color}>Color</div>
              <div className={styles.stock}>stock</div>
            </div>
            <div className={styles.tabData}>
              {showNoProds ? (
                <p
                  style={{
                    fontSize: "20px",
                    height: "80%",
                    paddingTop: "2rem",
                  }}
                >
                  No products found !!
                </p>
              ) : (
                (filteredProdData.length != 0
                  ? filteredProdData
                  : prodData
                ).map((ele, index) => (
                  <div key={index} className={styles.Row}>
                    <div className={styles.tabSl}>{index + 1}</div>
                    <div className={styles.tabCheck}>
                      <IconButton
                        onClick={() =>
                          handleSelectSingleProd(ele.product_id, ele?.checked)
                        }
                        style={{ height: "40px" }}
                      >
                        <i
                          style={{
                            color: ele?.checked ? "#3772ff" : "black",
                            cursor: "pointer",
                            opacity: ele?.checked ? 1 : 0.2,
                          }}
                          className="ri-checkbox-circle-line"
                        ></i>
                      </IconButton>
                    </div>
                    <div className={styles.tabCat}>{ele?.product_sub_type}</div>
                    <div className={styles.tabSubcat}>{ele?.prod_subtype2}</div>
                    <div className={styles.TabProd}>{ele?.product_name}</div>
                    <div className={styles.tabColor}>
                      <div
                        className={styles.colorBox}
                        style={{ backgroundColor: ele?.color_family }}
                      ></div>
                    </div>
                    <div className={styles.tabStock}>150</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className={styles.btnSection}>
          <div className={styles.btnContainer}>
            <button
              onClick={() => window.location.reload()}
              className={styles.discard}
            >
              Discard
            </button>
            {/* <button className={styles.draft}>Draft</button> */}
            <button
              disabled={loading}
              type="button"
              onClick={handleConfirmForm}
              className={styles.apply}
            >
              Apply
            </button>
          </div>
        </div>
        <ToastContainer />
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={loading}
          // onClick={handleCloseloading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </Sidebar>
  );
};
