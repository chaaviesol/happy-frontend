import { React, useState, useEffect, useContext } from "react";
import {
  Alert,
  AlertTitle,
  IconButton,
  MenuItem,
  Modal,
  Select,
  TextField,
  formLabelClasses,
} from "@mui/material";
import { AttachFile, Cancel, KeyboardBackspace } from "@mui/icons-material";
import axios from "axios";
import { prismaBaseApi } from "../../../../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFileUpload from "../../../../hooks/useFileUpload";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

export default function Newproduct({ show, handleClose, supplier,closeWindow }) {
  const [categoryArr, setCategoryArr] = useState([]);
  const [subCategoryArr, setSubCategoryArr] = useState([]);
  const [brandArr, setBrandArr] = useState([]);
  const [showCategoryArr, setShowCategoryArr] = useState(false);
  const [showSubCategoryArr, setShowSubCategoryArr] = useState(false);
  const [showBrandArr, setShowBrandArr] = useState(false);
  const [form, setForm] = useState({
    type: "toys",
    user: "admin1",
    sup_name: "",
    category: "",
    name: "",
    subcategory: "",
    brand: "",
    min_stk:""
  });
  const {
    setSelectedFile,
    setUpload,
    setIndex,
    links,
    setFolder,
    selectedFile,
  } = useFileUpload();

  const labelStyle = {
    display: "block",
  };

  const lastLetterStyle = {
    color: "red", // Change this to the color you desire for the last letter
  };
  const label = (
    <span style={labelStyle}>
      Product Name <span style={lastLetterStyle}>*</span>
    </span>
  );
  const label2 = (
    <span style={labelStyle}>
      Supplier Name <span style={lastLetterStyle}>*</span>
    </span>
  );
  const label3 = (
    <span style={labelStyle}>
      Category <span style={lastLetterStyle}>*</span>
    </span>
  );
  const label4 = (
    <span style={labelStyle}>
      Subcategory <span style={lastLetterStyle}>*</span>
    </span>
  );
  const label5 = (
    <span style={labelStyle}>
      Brand <span style={lastLetterStyle}>*</span>
    </span>
  );
  const label6 = (
    <span style={labelStyle}>
      Minimum stock <span style={lastLetterStyle}>*</span>
    </span>
  );

  //if supplier selected from po page fetch categories
  useEffect(() => {
    if (supplier) {
      const fetchData = async () => {
        const data = {
          main_type: "toys",
        };
        const brandBody = {
          prod_type: "toys",
        };
        try {
          const response = await axiosPrivate.post(
            `/product/categories`,
            data
          );

          console.log(response.data);
          setCategoryArr(response.data);
        } catch (err) {
          console.log(err);
        }

        try {
          const brandsResponse = await axiosPrivate.post(
            `/product/viewBrands`,
            brandBody
          );
          console.log(brandsResponse);
          let brandArray = [];
          for (let i = 0; i < brandsResponse?.data.length; i++) {
            if (brandsResponse?.data[i].brand_name) {
              brandArray.push(brandsResponse?.data[i].brand_name);
            }
          }
          setBrandArr(brandArray);
          console.log("brandArray", brandArray);
        } catch (err) {
          console.log(err);
        }
      };

      fetchData();
    }
  }, [supplier]);
  //filter
  const handleNewProductChanges = (event) => {
    const { name, value } = event.target;
    const lowerCasedValue = value.toLowerCase();
    switch (name) {
      case "brand":
        const clonedBrandArr = brandArr;
        const filteredBrands = clonedBrandArr.filter(
          (ele) => ele && ele.toLowerCase().includes(lowerCasedValue)
        );
        const remainingBrands = clonedBrandArr.filter(
          (ele) => ele && !ele.toLowerCase().includes(lowerCasedValue)
        );
        setBrandArr([...filteredBrands, ...remainingBrands]);
        break;
      case "category":
        const clonedCategoryArr = categoryArr;
        const filteredCategories = clonedCategoryArr.filter(
          (ele) => ele && ele.toLowerCase().includes(lowerCasedValue)
        );
        const remainingCategories = clonedCategoryArr.filter(
          (ele) => ele && !ele.toLowerCase().includes(lowerCasedValue)
        );
        setCategoryArr([...filteredCategories, ...remainingCategories]);
        break;
      case "subcategory":
        const clonedSubCategoryArr = subCategoryArr;
        const filteredSubCategories = clonedSubCategoryArr.filter(
          (ele) => ele && ele.toLowerCase().includes(lowerCasedValue)
        );
        const remainingSubCategories = clonedSubCategoryArr.filter(
          (ele) => ele && !ele.toLowerCase().includes(lowerCasedValue)
        );
        setSubCategoryArr([
          ...filteredSubCategories,
          ...remainingSubCategories,
        ]);
        break;
    }
    setForm({
      ...form,
      sup_name: supplier,
      [name]: value,
    });
  };
  //close button and clean states
  const handleCloseWindow = () => {
    handleClose(false);
    //cleanup
    // setCategoryArr([]);
    // setSubCategoryArr([]);
    setShowCategoryArr(false);
    setShowSubCategoryArr(false);
    setForm({ type: "toys", user: "admin1" });
  };

  //select category then fetch subcategories based on that category
  const handleSelectCategory = async (value) => {
    const specD = {
      main_type: "toys",
      category: value,
    };
    setShowCategoryArr(false);
    setForm({
      ...form,
      category: value,
    });
    try {
      const response = await axiosPrivate.post(
        `/product/getspec`,
        specD
      );
      console.log(response);

      setSubCategoryArr(response.data[0].sub_categories);
    } catch (err) {
      console.log(err);
    }
  };
  const axiosPrivate=useAxiosPrivate()
  const handleSelectSubCategory = (value) => {
    setForm({
      ...form,
      subcategory: value,
    });
    setShowSubCategoryArr(false);
  };
  const handleSelectBrand = (value) => {
    setForm({
      ...form,
      brand: value,
    });
    setShowBrandArr(false);
  };
  const handleFormSubmit = async () => {
    if (
      form.sup_name === "" ||
      form.name === "" ||
      form.subcategory === "" ||
      form.brand === "" ||
      form.category === "" ||
      form.min_stk === ""
    ) {
      alert("all fields required");
    } else {
      const toastConfig = {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      };
      try {
        const clonedForm={...form}
        for (let i = 0; i < links.length; i++) {
          clonedForm[`image${i + 1}_link`] = links[i];
        }
        const response = await axiosPrivate.post(
          `/product/productmgmt`,
          form
        );
        console.log(response);
        if (response.status === 201) {
          toast.success("Product Added", toastConfig);
          setTimeout(()=>{

            closeWindow(false)
          },1600)

        }
      } catch (err) {
        toast.error("Something went wrong", toastConfig);
        console.log(err);
      }
    }
  };
  const handleCloseOpenedBoxes = () => {
    if (showCategoryArr || showSubCategoryArr || showBrandArr) {
      setShowCategoryArr(false);
      setShowSubCategoryArr(false);
      setShowBrandArr(false);
    }
  };
  const handleFileChange = (event) => {
    const fileList = event.target.files;
    const newFiles = Array.from(fileList);
    setSelectedFile(newFiles);
    setFolder(true);
    setUpload(true);
    setIndex(0);
  };
  console.log("new products data =>", form);
  console.log("subcategories =>", subCategoryArr);
  console.log("brands =>", brandArr);
  console.log(" image links =>", links);
  return (
    <>
      <Modal
        open={show}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          onClick={handleCloseOpenedBoxes}
          style={{
            border: "1px solid green",
            backgroundColor: "white",
            width: "31%",
            padding: "1rem",
            marginLeft: "35%",
            marginTop: "12%",
            borderRadius: "5%",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            New Product{" "}
            <IconButton
              style={{ position: "absolute", right: "10px", top: ".5rem" }}
            >
              <Cancel
                onClick={handleCloseWindow}
                style={{
                  backgroundColor: "#ef4444",
                  color: "#E1FFCF",
                  borderRadius: "20px",
                  cursor: "pointer",
                }}
              />
            </IconButton>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {" "}
              <div>
                <TextField
                  autoComplete="off"
                  label={label}
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleNewProductChanges}
                />
              </div>
              <div>
                <TextField
                  label={label2}
                  autoComplete="off"
                  type="text"
                  name="sup_name"
                  value={supplier}
                  // onChange={handleNewProductChanges}
                />
              </div>
              <div>
                <TextField
                  autoComplete="off"
                  label={label3}
                  style={{ width: "100%" }}
                  type="text"
                  name="category"
                  onClick={() => {
                    setShowCategoryArr(true);
                    setShowSubCategoryArr(false);
                    setShowBrandArr(false);
                  }}
                  value={form?.category}
                  onChange={handleNewProductChanges}
                  placeholder="Enter category..."
                />
                {showCategoryArr && (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        border: "1px solid gray",
                        height: "150px",
                        width: "44.97%",
                        borderRadius: "3px",
                        fontSize: "14px",
                        backgroundColor: "white",
                        zIndex: 99,
                        overflowY: "scroll",
                      }}
                      id="style-2"
                      className="product-parentId-dropdown  p-2"
                    >
                      {categoryArr?.map((value, index) => (
                        <div
                          // tabIndex="0"
                          key={index}
                          // onKeyDown={(e) => {
                          //   handleParent_id(e, index);
                          // }}
                          onClick={(e) => {
                            handleSelectCategory(value);
                          }}
                          className="product-parentId-dropdownMenu text-left"
                          style={{
                            borderBottom: "1px solid black",
                            padding: ".4rem",
                            fontSize: "14px",
                          }}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div>
                <TextField
                placeholder="sub category"
                  autoComplete="off"
                  label={label4}
                  type="text"
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleNewProductChanges}
                  onClick={() => {
                    setShowSubCategoryArr(true);
                    setShowCategoryArr(false);
                    setShowBrandArr(false);
                  }}
                />
                {showSubCategoryArr && (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        border: "1px solid gray",
                        width: "44.97%",
                        height: "120px",
                        borderRadius: "3px",

                        fontSize: "14px",
                        backgroundColor: "white",
                        zIndex: 99,
                        overflowY: "scroll",
                      }}
                      id="style-2"
                      className="  p-2"
                    >
                      {subCategoryArr?.map((value, index) => (
                        <div
                          // tabIndex="0"
                          key={index}
                          // onKeyDown={(e) => {
                          //   handleParent_id(e, index);
                          // }}
                          onClick={(e) => {
                            handleSelectSubCategory(value);
                          }}
                          className="product-parentId-dropdownMenu text-left"
                          style={{
                            borderBottom: "1px solid black",
                            padding: ".4rem",
                            fontSize: "14px",
                          }}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div>
              <TextField
                placeholder="Minimum stock"
                  autoComplete="off"
                  label={label6}
                  type="number"
                  inputProps={{ min: 0 }}
                  name="min_stk"
                 
                  onChange={handleNewProductChanges}
                 
                />
              </div>
              <div className="">
                <label
                  htmlFor="file-input"
                  style={{
                    // marginRight: "200px",
                    cursor: "pointer",
                    border: "1px solid gray",
                    padding:".2rem",
                    borderRadius: "5px",
                    fontSize: "12px",
                  }}
                >
                  <AttachFile />
                  Add images{" "}
                </label>
                <input
                  type="file"
                  id="file-input"
                  onChange={handleFileChange}
                  multiple
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                {/* {form.brand && <div style={{fontSize:"10px",position:"absolute"}}>{label4}</div>} */}
                <TextField
                  id="outlined-basic"
                  label={form.brand ? label5 : label5}
                  type="text"
                  name="brand"
                  value={form?.brand}
                  onClick={() => {
                    setShowBrandArr(true);
                  }}
                  onChange={handleNewProductChanges}
                />
                {showBrandArr && (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        border: "1px solid gray",
                        width: "44.97%",
                        height: "120px",
                        borderRadius: "3px",

                        fontSize: "14px",
                        backgroundColor: "white",
                        zIndex: 99,
                        overflowY: "scroll",
                      }}
                      id="style-2"
                      className="  p-2"
                    >
                      {brandArr?.map((value, index) => (
                        <div
                          // tabIndex="0"
                          key={index}
                          // onKeyDown={(e) => {
                          //   handleParent_id(e, index);
                          // }}
                          onClick={(e) => {
                            handleSelectBrand(value);
                          }}
                          className="product-parentId-dropdownMenu text-left"
                          style={{
                            borderBottom: "1px solid black",
                            padding: ".4rem",
                            fontSize: "14px",
                          }}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div>
                <Select
                  // label="package"
                  onChange={handleNewProductChanges}
                  name="package"
                  value={form?.package ?? 10}
                  sx={{ width: "100%", color: "black" }}
                >
                  <MenuItem disabled value={10}>
                    Select Package
                  </MenuItem>
                  <MenuItem value="Box">Box</MenuItem>
                  <MenuItem value="Carton">Carton</MenuItem>
                  <MenuItem value="sack">sack</MenuItem>
                  <MenuItem value="Bundle">Bundle</MenuItem>
                </Select>
              </div>
              <div>
                <TextField
                  id="outlined-basic"
                  name="manufacturer_code"
                  label="manufacturer_code"
                  // variant="outlined"
                />
              </div>
              <div>
                <TextField
                  id="outlined-basic"
                  type="number"
                  inputProps={{ min: 0 }}
                  label="units"
                  name="no_of_items"
                  onChange={handleNewProductChanges}
                />
              </div>
              <div>
                <TextField
                  id="outlined-basic"
                  label="color"
                  type="text"
                  name="color"
                  onChange={handleNewProductChanges}
                />
              </div>
            </div>
          </div>
          <div
            className="mt-3"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              style={{ width: "30%" }}
              type="button"
              className="btn btn-success"
              onClick={handleFormSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
