import {
  AddCircleOutline,
  ArrowCircleLeftRounded,
  AttachFile,
  Close,
  Delete,
} from "@mui/icons-material";
import Select from "react-select";
import { Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Modal } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import {
  React,
  useContext,
  useState,
  useEffect,
  useRef,
  useReducer,
} from "react";
import "./Products.css";
import InputComponent from "../../../../components/FormComponents/InputBox/InputComponent";
import ColorBoxComponent from "../../../../components/FormComponents/ColorBoxComponent";
import { selectedTypeContext } from "../../../../Contexts/SelectedTypeContext";
import {
  INITIAL_STATE,
  closeProductInputsReducer,
  ACTIONS,
} from "./Reducers/closeReducer";
import useHiddenPages from "../../../../hooks/useHiddenPages";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import CloseBtnComp from "../../../../components/CloseBtnComp";
import CustomerManagerCntrl from "../categoryManager/CustomerManagerCntrl";
import CustomModal from "../../../../components/CustomModal";

export default function Products({ prodData, productType }) {
  const [state, dispatch] = useReducer(
    closeProductInputsReducer,
    INITIAL_STATE
  );
  const navigate = useNavigate();
  const { setSelectedType } = useContext(selectedTypeContext);
  const [product, setProduct] = useState({});
  const [productSpecs, setProductSpecs] = useState([]);
  const [open, setOpen] = useState(false);
  const [categoryopen, setcategoryOpen] = useState(false);
  const [success, setSuccess] = useState(null);
  const [specs, setSpecs] = useState([]);
  const [specsData, setSpecsData] = useState({});
  const [filterParentId, setfilterParentId] = useState([]);
  const [brandModal, setBrandModal] = useState(false);
  const [newBrand, setNewBrand] = useState({});
  const [brandNames, setBrandNames] = useState([]);
  const [checkValid, setCheckValid] = useState(false);
  const [runAddBrand, setRunAddBrand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTagProdClicked, setIsTagProdClicked] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const [aaProductList, setAaProductList] = useState([]);
  const [openSource, setOpenSource] = useState(null);

  const [form, setForm] = useState({
    sup_name: "",
    category: "",
    name: "",
    subcategory: "",
    brand: "",
    product_code: "",
    assign_code: "",
  });
  const supplierInputRef = useRef(null);
  const categoryInputRef = useRef(null);
  const subCategoryInputRef = useRef(null);
  const parendIdInputRef = useRef(null);
  const ctrlPressed = useHiddenPages();
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
  const axiosPrivate = useAxiosPrivate();
  // console.log("Product state Derived from topbar prop >>>>>>>>>", product);
  // console.log("STATE from Reducer>>>>>>>>>", state);
  console.log(">>>>UPDATING Form state", form);



  //  Adding Brand Function
  const handleAddBrand = async (event) => {
    event.preventDefault();
    if (!state.selectedSupplier) {
      return alert("select  supplier to add a brand");
    }
    if (
      newBrand.brandcode.length > 0 &&
      newBrand.name.length > 0 &&
      state.selectedSupplier
    ) {
      setNewBrand({
        ...newBrand,
        prod_type: productType,
        user: "admin1",
        supplier_id: state.selectedSupplier,
      });
      setRunAddBrand(true);
    }
  };


  useEffect(() => {
    if (newBrand?.prod_type && runAddBrand) {
      const fetchData = async () => {
        console.log("new brand", newBrand);
        try {
          const response = await axiosPrivate.post(`/product/brand`, newBrand);
          console.log(">>brand", response);

          if (response.status === 201) {
            toast.success(response.data, {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });

            setTimeout(() => {
              handleBrandClose();
              const brandBody = {
                prod_type: productType,
              };
              try {
                axiosPrivate
                  .post(`/product/viewBrands`, brandBody)
                  .then((res) => {
                    let values = [];
                    res.data.forEach(function (val) {
                      if (val.brand_name) {
                        values.push(val.brand_name);
                      }
                    });
                    setBrandNames(values);
                    setNewBrand({});
                  });
              } catch (err) {
                console.log(err);
              }
            }, 500);
          }
          setRunAddBrand(false);
        } catch (err) {
          if (err?.response?.status === 409) {
            toast.warning(err?.response?.data, {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
          setRunAddBrand(false);
          console.log(err);
        }
      };
      fetchData();
    }
  }, [newBrand]);

  //handle brand modal
  const handleBrandOpen = () => setBrandModal(true);
  const handleBrandClose = () => setBrandModal(false);

  //   Api calling for ProductData
  console.log("proddata---", prodData);
  useEffect(() => {
    console.log(prodData);
    if (prodData) {
      const handleApiData = async () => {
        const data = prodData;
        if (data) {
          setForm({ ...form, type: data.type, user: "admin1" });

          const specTypes = data?.category_specs;
          // ?.[0]?.category_specs?.category;
          // const subCate = data?.category_specs?.[0]?.category_specs?.sub_categories;

          setBrandNames(data?.brands);

          setProduct({
            ...product,
            supplierName: data.suppliers,
            category: specTypes,
            // subCategory: subCate,
          });

          let arr3 = [];
          for (
            let i = 0;
            i < data?.category_specs?.[0]?.category_specs?.spec.length;
            i++
          ) {
            const specs = data.category_specs[0].category_specs.spec[i];

            arr3.push(specs);

            setProductSpecs([{ ...productSpecs, ...arr3 }]);
          }
        }
      };
      handleApiData();
    }
  }, [prodData]);

  console.log("-------", productSpecs);

  // Form Data handling
  const formData = async (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setForm({ ...form, [name]: value });

    if (name === "parent_id") {
      setIsTagProdClicked(false);
    }
  };
  useEffect(() => {
    // alert("po")
    const query = form.parent_id;
    const supplier = state.selectedSupplier;
    if (!supplier || !query) {
      setfilterParentId([]);
    }
    if (!isTagProdClicked) {
      const handleSearch = setTimeout(() => {
        const fetchData = async () => {
          const payload = {
            query,
            supplier,
          };
          let ProdDataArr = [];
          try {
            const response = await axiosPrivate.post(
              `product/productlist`,
              payload
            );
            const prodDatas = response.data;
            for (let i = 0; i < prodDatas.length; i++) {
              const prodName = prodDatas[i].product_name;
              ProdDataArr.push(prodName);
              if (ProdDataArr.length === prodDatas.length) {
                setfilterParentId(ProdDataArr);
              }
            }
          } catch (err) {
            console.error(err);
          }
        };
        if (form.parent_id) {
          fetchData();
        }
      }, 600);
      return () => clearTimeout(handleSearch);
    }
  }, [form.parent_id]);

  // parentProductname in tag parent product
  const handleParent_id = async (e, index) => {
    setIsTagProdClicked(true);
    if (e.keyCode === 13 || e.type === "click") {
      setfilterParentId([]);
      const clicked_prod = filterParentId[index]; //from array
      const product_name = clicked_prod;
      setForm({ ...form, parent_id: product_name });

      try {
        const response = await axiosPrivate.post(`/product/tagparent`, {
          product_name: product_name,
        });
        console.log("parent prod details =>", response.data);
        const fetchedProduct = response.data;
        let clonedForm = { ...form };
        clonedForm = {
          ...clonedForm,
          category: fetchedProduct.product_sub_type,
          subcategory: fetchedProduct.prod_subtype2,
          brand: fetchedProduct.brand_name,
          hsn: fetchedProduct.hsn,
          package: fetchedProduct.package,
          parent_id: product_name,
        };
        setForm(clonedForm);
        const payload = {
          main_type: productType,
          category: fetchedProduct.product_sub_type,
        };
        try {
          const res = await axiosPrivate.post(`/product/getspec`, payload);
          let arr3 = [];
          for (let i = 0; i < res.data[0]?.spec.length; i++) {
            const specs = res.data[0].spec[i];
            console.log("specs", specs);
            arr3.push(specs);
          }
          setProductSpecs([arr3]);
        } catch (err) {
          setProductSpecs([]);
          console.error(err);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  //setting color box
  const handleSetColor = (color) => {
    setForm({ ...form, color_family: color });
  };

  //product Id modal
  const handleOpen = (event) => {
    event.preventDefault();
    setOpen(true);
  };

  console.log(checkValid);
  const handleClose = () => setOpen(false);
  // Handling specs data
  const handleSpecData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    const newSpecsData = {
      ...specsData,
      spec: { ...specsData.spec, [name]: value },
    };
    setSpecsData(newSpecsData);
  };

  /*  selecting subcategory,suppliers,cate via click  */
  const handleClickSelectCat = (name, type, event) => {
    if (event.keyCode === 13 || event.type === "click") {
      const specD = {
        main_type: productType,
        category: name,
      };
      setCheckValid(true);
      dispatch({ type: "CLEAR" });

      ////////////////newadded//////////
      axiosPrivate.post(`/product/getspec`, specD).then((res) => {
        console.log("getspec", res);
        setProduct({
          ...product,

          subCategory: res.data[0].sub_categories,
        });

        let arr3 = [];
        for (let i = 0; i < res.data[0]?.spec.length; i++) {
          const specs = res.data[0].spec[i];
          console.log("specs", specs);

          arr3.push(specs);

          setProductSpecs([{ ...productSpecs, ...arr3 }]);
        }
        console.log("arr3", arr3);
      });
      let formClone;
      let dispatchType;

      switch (type) {
        case "supplier":
          formClone = { ...form, sup_name: name, };
          dispatchType = "CLICK_SUPPLIER";
          break;

        case "category":
          formClone = { ...form, category: name };
          dispatchType = "CLICK_CATEGORY";
          break;

        case "subCategory":
          formClone = { ...form, subcategory: name };
          dispatchType = "CLICK_SUBCATEGORY";
          break;

        default:
          console.log("ELSE>>>>>>>");
          break;
      }
      setForm(formClone);
      dispatch({ type: dispatchType, payload: name });
    } else if (event.keyCode === 9) {
      let lastElement;
      let lastFilteredElement;
      switch (type) {
        case "subCategory":
          lastElement = product.subCategory[product.subCategory.length - 1];
          lastFilteredElement = state.filteredSubCategory
            ? state.filteredSubCategory[state.filteredSubCategory.length - 1]
            : null;

          if (lastFilteredElement === name || lastElement === name) {
            dispatch({ type: "CLEAR" });
          }
          break;

        case "supplier":
          lastElement = product.supplierName[product.supplierName.length - 1];
          lastFilteredElement = state.filteredSupplier
            ? state.filteredSupplier[state.filteredSupplier.length - 1]
            : null;

          if (lastFilteredElement === name || lastElement === name) {
            dispatch({ type: "CLEAR" });
          }
          break;
      }
    }
  };

  ////////////loading////

  // const handleCloseloading = () => {
  //   setLoading(false);
  // };

  /*  open cat,subC,sup div boxes */
  const handleClickShowOptionBox = (type) => {
    dispatch({ type: type });
  };
  /*  filter subcategory,category,suppliers from productState   */
  const handleChangeOptionFilter = (event, filter) => {
    const value = event.target.value;
    const name = event.target.name;
    setForm({ ...form, [name]: value });
    let type;
    let showType;
    let clearActionType;
    let typingActionType;
    switch (filter) {
      case "FILTER_SUPPLIER":
        showType = "SHOW_SUPPLIER";
        clearActionType = "CLEAR_SUPPLIER";
        typingActionType = "TYPING_SUPPLIER";
        type = "supplierName";

        break;
      case "FILTER_CATEGORY":
        showType = "SHOW_CATEGORY";
        clearActionType = "CLEAR_CATEGORY";
        typingActionType = "TYPING_CATEGORY";
        type = "category";
        break;
      case "FILTER_SUBCATEGORY":
        clearActionType = "CLEAR_SUBCATEGORY";
        typingActionType = "TYPING_SUBCATEGORY";
        type = "subCategory";
        break;
      default:
        console.log("default case");
    }
    dispatch({ type: clearActionType });

    dispatch({ type: showType });
    dispatch({ type: typingActionType, payload: value });

    //filtering value from the Product state
    const lowercasedValue = value.toLowerCase();
    const filterData = product[type]?.filter((Info) => {
      return Info?.toLowerCase().includes(lowercasedValue);
    });

    dispatch({ type: filter, payload: filterData });
  };

  //add inputs specs
  const addSpec = () => {
    const hasBlankSpec = specs.some((val) => val.key === "");
    if (hasBlankSpec) {
      alert("Specs cannot be blank");
    }
    if (specs.length <= 5 && !hasBlankSpec) {
      const newSpec = { key: "", value: "" };
      setSpecs((prevSpecs) => [...prevSpecs, newSpec]);
    }
  };
  //handle extra specs Input
  const handleInputChange = (event, index) => {
    const name = event.target.name;
    const value = event.target.value;
    const inputData = [...specs];
    inputData[index][name] = value; //By using inputData[index][name], the code accesses the property of the object with the given name. It then sets the value of this property to the new value. This updates the specific property of the specific object in the inputData array.
    setSpecs(inputData);
  };

  //remove specFrom state
  const handleSpecRemove = (index) => {
    const mySpecs = { ...specs };
    const specsToDlt = mySpecs[index].key;
    const myState = { ...form };
    const { [specsToDlt]: deletedKey, ...rest } = myState;
    setForm(rest);
  };

  const removeSpec = (index) => {
    const deleteSpec = [...specs];
    deleteSpec.splice(index, 1);
    setSpecs(deleteSpec);
  };
  // upload attachment
  const handleFileSelect = (event) => {
    const fileList = event.target.files;
    const newFiles = Array.from(fileList);
    if (selectedFile.length < 3) {
      setSelectedFile([...selectedFile, ...newFiles]);
    } else {
      alert("Only 3 files can be selected!");
    }
  };
  console.log(" for upload>>>", selectedFile);
  //deleting key from state when text cleared from the input box
  const handleInputBlur = (event) => {
    if (event.target.value === "") {
      const updatedFormData = { ...form };
      delete updatedFormData[event.target.name];
      setForm(updatedFormData);
    }
  };







  // Final State for the Api-------------------------------------------------
  const handleFinalForm = async (event) => {
    event.preventDefault();
    if (
      form.sup_name === "" ||
      form.name === "" ||
      form.subcategory === "" ||
      form.brand === "" ||
      form.category === "" ||
      form.min_stk === "" ||
      !form.min_stk ||
      !form.no_of_items ||
      form.no_of_items === ""
    ) {

      alert("Please fill in all  required fields");
      return;
    }

    const specsDatas = { ...specs };
    console.log(specsDatas);
    const specReadyForState = Object.entries(specsDatas).map(([key, value]) => [
      value.key,
      value.value,
    ]);

    const obj = specReadyForState.reduce((acc, curr) => {
      acc[curr[0]] = curr[1];
      return acc;
    }, {});

    //merging the added specs to spec state
    console.log(obj);
    if (Object.keys(obj).length > 0) {
      let specSelected = await { ...specsData.spec, ...obj };
      console.log("mergedSpecs", specSelected);

      for (const key in specSelected) {
        if (key === "" || specSelected[key] === "") {
          delete specSelected[key];
        }
      }
      setForm({ ...form, spec: specSelected });

      console.log(">>======>Form", form);
    } else {
      setForm({ ...form, spec: specsData.spec });
    }
    console.log("not added>>>><<<<<<<<<", form);
    setSuccess(true);
  };
  //if success is true trigger this function for submit form
  useEffect(() => {
    if (success) {
      setLoading(true)
      const fetchData = async () => {
        const formData = new FormData();
        selectedFile.forEach((image, index) => {
          formData.append("image", image);
        });
        formData.append("data", JSON.stringify(form));
        console.log("last updated form>>", formData);
        try {
          const response = await axiosPrivate.post(
            `/product/productmgmt`,
            formData
          );
          console.log("response from api", response.status);

          if (response.status === 201) {
            toast.success("Product Added Succesfully", toastConfig);
            setSuccess(null);
            setSelectedType(null);
            setTimeout(() => {
              navigate("/prodlist");
            }, 2000);
          }
        } catch (err) {
          setSuccess(null);
          if (err.response.status === 409) {
            toast.error("product code already used!", toastConfig);
          } else {
            toast.error("something went wrong", toastConfig);
          }
          console.log(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [success]);
  //close boxes using ref
  useEffect(() => {
    const closeBoxes = (event) => {
      if (
        !supplierInputRef.current?.contains(event.target) &&
        !categoryInputRef.current?.contains(event.target) &&
        !subCategoryInputRef.current?.contains(event.target) &&
        !parendIdInputRef.current?.contains(event.target)
      ) {
        dispatch({ type: ACTIONS.CLEAR });
        setfilterParentId([]);
      }
    };
    document.body.addEventListener("click", closeBoxes, true);

    return () => document.body.removeEventListener("click", closeBoxes);
  }, []);
  console.log({ state });


  const productlistfetchapi = async () => {
    try {
      const response = await axiosPrivate.post(`/product/productlist`);
      console.log("aa product list", response.data);
      setAaProductList(response.data); // ✅ store product list
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  useEffect(() => {
    productlistfetchapi()
  }, [])

  // 🔹 Fetch and apply parent product details when a parent is selected
  const fetchAndSetParentProduct = async (selectedProductName, selectedProductId) => {
    try {
      // 1️⃣ Fetch full parent product details
      const response = await axiosPrivate.post(`/product/proddetails`, {
        type: "detail",
        prod_name: selectedProductName,
        product_id: selectedProductId,
      });

      const parentProd = response.data;
      console.log("Parent Product Details:", parentProd);

      if (!parentProd) return;

      // 2️⃣ Prepare mapped form fields (fill everything possible)
      const updatedForm = {
        ...form,
        parent_id: parentProd.product_id || "",
        name: form.name || "",
        category: parentProd.product_sub_type || "",
        subcategory: parentProd.prod_subtype2 || "",
        brand: parentProd.brand?.brand_name || "",
        product_code: form.product_code || "",
        assign_code: form.assign_code || "", // keep existing assign_code
        hsn: parentProd.hsn || "",
        gst_perc: parentProd.gst_perc || "",
        manufacturer_code: parentProd.manufacturer_code || "",
        package: parentProd.package || "",
        color: parentProd.color || "",
        color_family: parentProd.color_family || "",
        unit_of_measure: parentProd.unit_of_measure || "",
        min_stk: parentProd.min_stk ? parentProd.min_stk : "",
        no_of_items: parentProd.no_of_items ? parentProd.no_of_items : "",
        desc: parentProd.product_desc || "",
        sup_name: parentProd.users?.trade_name || form.sup_name || "",
        type: parentProd.product_type || prodData.type || "",
        user: "admin1",
      };

      setForm(updatedForm);

      // 3️⃣ Fetch specs for this category (if available)
      if (parentProd.product_sub_type) {
        const payload = {
          main_type: prodData.type,
          category: parentProd.product_sub_type,
        };

        try {
          const res = await axiosPrivate.post(`/product/getspec`, payload);
          const specsArr = res.data[0]?.spec || [];
          setProductSpecs([specsArr]);
        } catch (err) {
          console.error("Error loading specs:", err);
          setProductSpecs([]);
        }
      }

      // 4️⃣ Optional — preload product_spec (if your UI supports it)
      if (parentProd.product_spec && Object.keys(parentProd.product_spec).length > 0) {
        setSpecsData({ spec: parentProd.product_spec });
      }
    } catch (error) {
      console.error("Error fetching parent product details:", error);
    }
  };

  const reloadCategoriesAndSubCategories = async () => {
    try {
      const payload = { main_type: productType };
      const res = await axiosPrivate.post(`/product/categories`, payload);

      if (Array.isArray(res.data) && res.data.length > 0) {
        const categoryList = res.data;

        // ✅ Always refresh categories
        setProduct((prev) => ({
          ...prev,
          category: categoryList,
        }));
        dispatch({ type: "CATEGORY_SPECS", payload: categoryList });

        console.log("✅ Categories reloaded:", categoryList);

        // ✅ If the modal came from subcategory
        if (openSource === "subcategory" && form.category) {
          console.log("🔁 Reloading subcategories for:", form.category);

          const specPayload = {
            main_type: productType,
            category: form.category,
          };

          const subRes = await axiosPrivate.post(`/product/getspec`, specPayload);

          const subList =
            subRes.data?.[0]?.sub_categories || subRes.data?.sub_categories || [];

          setProduct((prev) => ({
            ...prev,
            subCategory: subList,
          }));

          console.log("✅ Subcategories reloaded:", subList);
        }
      }
    } catch (err) {
      console.error("❌ Error reloading category/subcategory:", err);
    } finally {
      // Reset the modal source
      setOpenSource(null);
    }
  };


  // brand filter

  useEffect(() => {
    const fetchBrand=async()=>{
      try {
        
        const brandBody = {
          prod_type: productType,
          supplier_id: state?.selectedSupplier
        };
        await axiosPrivate.post(`/product/viewBrands`, brandBody)
                  .then((res) => {
                    console.log("vv view brand res",res);
                    let values = [];
                    res.data.forEach(function (val) {
                      if (val.brand_name) {
                        values.push(val.brand_name);
                      }
                    });
                    setBrandNames(values);
                    setNewBrand({});
                  });
      } catch (error) {
        console.log("Fetch brand failed",error);
        
      }
    }
    fetchBrand()
  }, [form.sup_name])




  return (
    // <Sidebar type="product">
    <div className="Products">
      <Row style={{ width: "100%" }}>
        {/* ------------------------------------------------------------------ */}
        {/* Right Side */}
        <Col
          lg={12}
          sm={12}
          md={12}
          className="products-addproducts-rightContainer"
        >
          <div className="products-addproducts">
            {/* <Row className="mb-4">
              <Col sm={12}>
                <span className="products-headline">Add New Product</span>
              </Col>
            </Row> */}

            {/* Form */}
            <Form>
              {/* form------------------------------------------------------------ */}

              <Row>
                <Col sm={6}>
                  <div className="form-group row">
                    <label
                      htmlFor="Supplier"
                      className="col-sm-5 col-form-label"
                    >
                      Supplier <b style={{ color: "red" }}>*</b>
                    </label>
                    <div className="col-sm-7" ref={supplierInputRef}>
                      <InputComponent
                        name="sup_name"
                        placeholder="Select a supplier"
                        value={
                          state?.selectedSupplier ||
                          form?.sup_name ||
                          state?.typingSupplier ||
                          ""
                        }
                        handleInputChange={(event) =>
                          handleChangeOptionFilter(event, "FILTER_SUPPLIER")
                        }
                        onFocus={() =>
                          handleClickShowOptionBox("SHOW_SUPPLIER")
                        }
                      // onBlur={() => handleCheckvalidData("sup_name")}
                      />

                      {state?.suppliers && (
                        <div
                          tabIndex={0}
                          className="log-supp-dropdown-scrollbar p-2"
                          id="style-2"
                          style={{ width: "13rem", borderRadius: "12px" }}
                        >
                          {state?.filteredSupplier?.length > 0
                            ? state?.filteredSupplier?.map((item, index) => (
                              <div
                                tabIndex={0}
                                key={index}
                                className="dropdown_map dropbar"
                                style={{
                                  fontSize: "14px",
                                  textAlign: "left",
                                }}
                                onKeyDown={(event) => {
                                  handleClickSelectCat(
                                    item,
                                    "supplier",
                                    event
                                  );
                                }}
                                onClick={(event) => {
                                  handleClickSelectCat(
                                    item,
                                    "supplier",
                                    event
                                  );
                                }}
                              >
                                {item}
                              </div>
                            ))
                            : product?.supplierName?.map((item, index) => (
                              <div
                                tabIndex={0}
                                key={index}
                                className="dropdown_map dropbar"
                                style={{
                                  fontSize: "14px",
                                  textAlign: "left",
                                }}
                                onKeyDown={(event) => {
                                  handleClickSelectCat(
                                    item,
                                    "supplier",
                                    event
                                  );
                                }}
                                onClick={(event) => {
                                  handleClickSelectCat(
                                    item,
                                    "supplier",
                                    event
                                  );
                                }}
                              >
                                {item}
                              </div>
                            ))}
                          <div
                            className="dropdown_map"
                            style={{ fontSize: "14px", textAlign: "left" }}
                            onClick={() =>
                              navigate("/register_new", { state: "sup" })
                            }
                          >
                            New Supplier
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="Product Name"
                      className="col-sm-5 col-form-label"
                    >
                      Product Name <b style={{ color: "red" }}>*</b>
                    </label>
                    <div className="col-sm-7">
                      <InputComponent
                        isRequired
                        handleInputChange={formData}
                        name="name"
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="manufacturer_code"
                      className="col-sm-5 col-form-label"
                    >
                      Manufacturer Code
                    </label>
                    <div className="col-sm-7">
                      <InputComponent
                        handleInputChange={formData}
                        name="manufacturer_code"
                      />
                    </div>
                  </div>


                  <div className="form-group row">
                    <label
                      htmlFor="tagParentProduct"
                      className="col-sm-5 col-form-label"
                    >
                      Tag Parent Product
                    </label>

                    <div className="col-sm-7" ref={parendIdInputRef}>
                      <div className="react-select-wrapper">
                        <Select
                          id="tagParentProduct"
                          name="parent_id"
                          placeholder="Select parent product"
                          isSearchable
                          isClearable
                          value={
                            form.parent_id
                              ? (() => {
                                const matched = aaProductList?.find(
                                  (p) => p.product_id === form.parent_id
                                );
                                return matched
                                  ? { value: matched.product_id, label: matched.product_name }
                                  : null;
                              })()
                              : null
                          }
                          options={
                            aaProductList
                              ?.filter(
                                (p) =>
                                  p?.users?.trade_name === form.sup_name &&
                                  p?.product_type === prodData?.type
                              )
                              ?.map((p) => ({
                                value: p.product_name,
                                label: p.product_name,
                                product_id: p.product_id,
                              })) || []
                          }
                          onChange={(selected) => {
                            if (selected) {
                              fetchAndSetParentProduct(selected.value, selected.product_id);
                            } else {
                              setForm({ ...form, parent_id: "" });
                            }
                          }}
                          classNamePrefix="custom-select"
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              borderRadius: "12px",
                              border: state.isFocused ? "1.5px solid #00342E" : "1px solid #ced4da",
                              boxShadow: "none",
                              fontSize: "13px",
                              minHeight: "35px",
                              backgroundColor: "white",
                              textAlign: "left",
                            }),
                            menu: (base) => ({
                              ...base,
                              marginTop: "0px",
                              borderRadius: "12px",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              zIndex: 9999,
                            }),
                            option: (base, state) => ({
                              ...base,
                              backgroundColor: state.isFocused ? "#00342E" : "#fff",
                              color: state.isFocused ? "#fff" : "#000",
                              fontSize: "14px",
                              textAlign: "left",
                              borderBottom: "1px solid #eee",
                              cursor: "pointer",
                            }),
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="category"
                      className="col-sm-5 col-form-label"
                    >
                      category <b style={{ color: "red" }}>*</b>
                    </label>
                    <div className="col-sm-7" ref={categoryInputRef}>
                      <input
                        type="text"
                        autoComplete="off"
                        name="category"
                        className="form-control purchase-form__form-control "
                        id="purchase-form__form-control"
                        placeholder="Select a category"
                        value={
                          state?.selectedCategory ||
                          form?.category ||
                          state?.typingCategory ||
                          ""
                        }
                        onChange={(event) =>
                          handleChangeOptionFilter(event, "FILTER_CATEGORY")
                        }
                        onFocus={() =>
                          handleClickShowOptionBox("SHOW_CATEGORY")
                        }
                      // onBlur={() => handleCheckvalidData("category")}
                      />
                      {state?.category === true && (
                        <div
                          tabIndex={0}
                          className="log-supp-dropdown-scrollbar p-2"
                          id="style-2"
                          style={{ width: "13rem", borderRadius: "12px" }}
                        >
                          {state?.filteredCategory?.length > 0
                            ? state?.filteredCategory?.map((item, index) => (
                              <div
                                tabIndex={0}
                                // tabIndex="0"
                                key={index}
                                className="dropdown_map dropbar"
                                style={{
                                  fontSize: "14px",
                                  textAlign: "left",
                                }}
                                onKeyDown={(event) => {
                                  handleClickSelectCat(
                                    item,
                                    "category",
                                    event
                                  );
                                }}
                                onClick={(event) => {
                                  handleClickSelectCat(
                                    item,
                                    "category",
                                    event
                                  );
                                }}
                              >
                                {item}
                              </div>
                            ))
                            : product?.category?.map((item, index) => (
                              <div
                                tabIndex={0}
                                // tabIndex="0"
                                key={index}
                                className="dropdown_map dropbar"
                                style={{
                                  fontSize: "14px",
                                  textAlign: "left",
                                }}
                                onKeyDown={(event) => {
                                  handleClickSelectCat(
                                    item,
                                    "category",
                                    event
                                  );
                                }}
                                onClick={(event) => {
                                  handleClickSelectCat(
                                    item,
                                    "category",
                                    event
                                  );
                                }}
                              >
                                {item}
                              </div>
                            ))}

                          <div
                            className="dropdown_map"
                            style={{ fontSize: "14px", textAlign: "left" }}
                            onClick={() => {
                              setcategoryOpen(true)
                              setOpenSource("category");
                            }}
                          >
                            New category
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="category"
                      className="col-sm-5 col-form-label"
                    >
                      Sub Category <b style={{ color: "red" }}>*</b>
                    </label>
                    <div className="col-sm-7" ref={subCategoryInputRef}>
                      <input
                        type="text"
                        autoComplete="off"
                        name="subcategory"
                        className="form-control purchase-form__form-control "
                        id="purchase-form__form-control"
                        placeholder="Select a Subcategory"
                        value={
                          state?.selectedSubCategory ||
                          form?.subcategory ||
                          state?.typingSubCategory ||
                          ""
                        }
                        onChange={(event) =>
                          handleChangeOptionFilter(event, "FILTER_SUBCATEGORY")
                        }
                        onFocus={() =>
                          handleClickShowOptionBox("SHOW_SUBCATEGORY")
                        }
                      // onBlur={() => handleCheckvalidData("subcategory")}
                      />
                      {state?.subCategory === true && (
                        <div
                          tabIndex={0}
                          className="log-supp-dropdown-scrollbar p-2"
                          id="style-2"
                          style={{ width: "13rem", borderRadius: "12px" }}
                        >
                          {state?.filteredSubCategory?.length > 0
                            ? state?.filteredSubCategory.map((item, index) => (
                              <div
                                tabIndex={0}
                                // tabIndex="0"
                                key={index}
                                className="dropdown_map dropbar"
                                style={{
                                  fontSize: "14px",
                                  textAlign: "left",
                                }}
                                onKeyDown={(event) => {
                                  handleClickSelectCat(
                                    item,
                                    "subCategory",
                                    event
                                  );
                                }}
                                onClick={(event) => {
                                  handleClickSelectCat(
                                    item,
                                    "subCategory",
                                    event
                                  );
                                }}
                              >
                                {item}
                              </div>
                            ))
                            : product?.subCategory?.map((item, index) => (
                              <div
                                // tabIndex="0"
                                tabIndex={0}
                                key={index}
                                className="dropdown_map dropbar"
                                style={{
                                  fontSize: "14px",
                                  textAlign: "left",
                                }}
                                onKeyDown={(event) => {
                                  handleClickSelectCat(
                                    item,
                                    "subCategory",
                                    event
                                  );
                                }}
                                onClick={(event) => {
                                  handleClickSelectCat(
                                    item,
                                    "subCategory",
                                    event
                                  );
                                }}
                              >
                                {item}
                              </div>
                            ))}

                          <div
                            className="dropdown_map"
                            style={{ fontSize: "14px", textAlign: "left" }}
                            onClick={() => {
                              setOpenSource("subcategory");
                              setcategoryOpen(true);
                            }}
                          >
                            New category
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
<div className="form-group row">
  <label htmlFor="Brand" className="col-sm-5 col-form-label">
    Brand <b style={{ color: "red" }}>*</b>
  </label>
  <div className="col-sm-5">
    <select
      required
      onChange={formData}
      name="brand"
      id="tradeNumber"
      className="form-control products-form__form-control"
      value={form.brand}
    >
      <option value="">Select Brand</option>

      {brandNames?.length > 0 ? (
        brandNames.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))
      ) : (
        <option value="" disabled>
          No brands for current supplier
        </option>
      )}
    </select>
  </div>
  <div className="col-sm-2 flex-center">
    <AddCircleOutline
      onClick={handleBrandOpen}
      style={{ cursor: "pointer" }}
    />
  </div>
</div>

                  <div className="form-group row">
                    <label
                      htmlFor="Assign Product Code"
                      className="col-sm-5 col-form-label"
                    >
                      Assign Product Code
                    </label>
                    <div className="col-sm-5">
                      <InputComponent
                        handleInputChange={formData}
                        name="product_code"
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="Assign Code"
                      className="col-sm-5 col-form-label"
                    >
                      Assign Code
                    </label>
                    <div className="col-sm-5">
                      <InputComponent
                        handleInputChange={formData}
                        name="assign_code"
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="HSN Code"
                      className="col-sm-5 col-form-label"
                    >
                      HSN Code
                    </label>
                    <div className="col-sm-5">
                      <InputComponent
                        handleInputChange={formData}
                        name="hsn"
                        value={form.hsn}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="Package"
                      className="col-sm-5 col-form-label"
                    >
                      Package
                    </label>
                    <div className="col-sm-5">
                      <select
                        onChange={formData}
                        name="package"
                        id="Package"
                        className="form-control products-form__form-control"
                        value={form.package}
                      >
                        <option value=""></option>
                        <option value="Box">Box</option>
                        <option value="Carton">Carton</option>
                        <option value="Sack">Sack</option>
                        <option value="Bundle">Bundle</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label htmlFor="Units" className="col-sm-5 col-form-label">
                      Units <b style={{ color: "red" }}>*</b>
                    </label>
                    <div className="col-sm-5">
                      <InputComponent
                        min={1}
                        handleInputChange={formData}
                        name="no_of_items"
                        type="number"
                        value={form.no_of_items}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="Minimum stock"
                      className="col-sm-5 col-form-label"
                    >
                      Minimum Stock <b style={{ color: "red" }}>*</b>
                    </label>
                    <div className="col-sm-5">
                      <InputComponent
                        handleInputChange={formData}
                        name="min_stk"
                        min={1}
                        type="number"
                        value={form.min_stk}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label htmlFor="gst" className="col-sm-5 col-form-label">
                      GST
                    </label>
                    <div className="col-sm-5">
                      <InputComponent
                        handleInputChange={formData}
                        name="gst_perc"
                        type="number"
                        value={form.gst_perc}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="unit_of_measure"
                      className="col-sm-5 col-form-label"
                    >
                      Measure
                    </label>
                    <div className="col-sm-5">
                      <InputComponent
                        handleInputChange={formData}
                        name="unit_of_measure"
                        value={form.unit_of_measure}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      htmlFor="colorname"
                      className="col-sm-5 col-form-label"
                    >
                      Color Name
                    </label>
                    <div className="col-sm-5">
                      <InputComponent
                        handleInputChange={formData}
                        name="color"
                        value={form.color}
                      />
                    </div>
                  </div>
                  {/* Color box>>>>>>> >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
                  <div className="row form-group">
                    <label
                      htmlFor="color_family"
                      className="col-sm-5 col-form-label"
                    >
                      Color
                    </label>
                    <div className="col-sm-5">
                      <ColorBoxComponent setColor={handleSetColor} />
                    </div>
                  </div>
                </Col>

                {/* Form right Side---------------------------------------------------------- */}
                <Col className="col-sm-6  products-form-right ">
                  <div className="row form-group">
                    <div className="col-sm-5 flex-center">
                      <label
                        title="Attach file"
                        htmlFor="file-input"
                        className="file-input-label  "
                      >
                        <AttachFile /> Add
                        <input
                          type="file"
                          id="file-input"
                          onChange={handleFileSelect}
                          multiple
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                    <div
                      style={{ borderRadius: "5px" }}
                      className="products-scrollbar col-sm-5"
                      id="style-2"
                    >
                      <div className="products-force-overflow text-left">
                        {selectedFile &&
                          selectedFile?.map((file, index) => (
                            <div
                              key={index}
                              style={{ paddingLeft: "10px" }}
                              className="row"
                            >
                              <span
                                style={{ fontSize: "13px", padding: "2px" }}
                              >
                                {index + 1} -: {file?.name}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="form-group row product-description ">
                    <div className="col-sm-9">
                      <input
                        onChange={formData}
                        name="desc"
                        type="text"
                        className="form-control products-form__form-control"
                        id="products-form__form-control-Description"
                        placeholder="Description"
                      />
                    </div>
                  </div>
                  {/* Specification Box-------------------------------------------------------- */}
                  <div
                    style={{ alignItems: "center", textAlign: "center" }}
                    className="products-specs-head row"
                  >
                    <label
                      htmlFor="specifications"
                      style={{
                        alignItems: "center",
                        fontSize: "1rem",
                        borderRadius: "5px",
                        color: "white",
                        backgroundColor: "#00342E",
                        padding: ".3rem",
                        width: "70%",
                        textAlign: "center",
                      }}
                    >
                      Specifications
                    </label>
                  </div>

                  <div className="products-specs-container-container ">
                    <div
                      style={{ width: "75%", padding: "1rem" }}
                      className="form-group row products-specs-container border-red"
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          flexDirection: "column",
                        }}
                        className="col-sm-12 products-specs-left"
                      >
                        {productSpecs?.map((obj, index) => (
                          <div key={index}>
                            {Object.keys(obj).map((key, innerIndex) => (
                              <div
                                className="form-group row mb-2"
                                key={innerIndex}
                              >
                                <div
                                  style={{ padding: "0" }}
                                  className="col-sm-6"
                                >
                                  <label
                                    htmlFor="specs"
                                    className=" col-sm-12 col-md-12 col-sm-12 col-form-label "
                                  >
                                    {Object.keys(obj[key])[0]}
                                  </label>
                                </div>
                                <div
                                  style={{ padding: "0" }}
                                  className="col-sm-6"
                                >
                                  <>
                                    <select
                                      onChange={handleSpecData}
                                      style={{ border: "none" }}
                                      name={Object.keys(obj[key])[0]}
                                      id="Package"
                                      className="form-control products-specs__form-control"
                                    >
                                      <option></option>
                                      {obj[key][Object.keys(obj[key])[0]].map(
                                        (value, valueIndex) => (
                                          <option
                                            key={valueIndex}
                                            value={value}
                                          >
                                            {value}
                                          </option>
                                        )
                                      )}
                                    </select>
                                  </>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}

                        <>
                          {specs.map((data, index) => (
                            <div key={index} className="form-group row">
                              <div
                                style={{ padding: "0" }}
                                className="col-sm-6"
                              >
                                <input
                                  value={data.key}
                                  onChange={(event) =>
                                    handleInputChange(event, index)
                                  }
                                  style={{
                                    width: "100%",
                                    border: "none",
                                    fontSize: "13px",
                                  }}
                                  name="key"
                                  type="text"
                                  className="form-control products-specs__form-control col-sm-11"
                                  id="tag Parent prod"
                                />
                              </div>
                              <div className="col-sm-6">
                                <div className="row">
                                  <input
                                    value={data.value}
                                    onChange={(event) =>
                                      handleInputChange(event, index)
                                    }
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      fontSize: "13px",
                                    }}
                                    name="value"
                                    type="text"
                                    className="form-control products-specs__form-control col-sm-12"
                                    id="tag Parent prod"
                                  />
                                  <div
                                    title="Delete This Spec"
                                    style={{
                                      position: "absolute",
                                      right: "0",
                                      height: "100%",
                                    }}
                                    className="flex-center"
                                  >
                                    <Delete
                                      onClick={() => {
                                        removeSpec(index);
                                        handleSpecRemove(index);
                                      }}
                                      className="products_deleteBtn"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>

                        <div className="form-group row">
                          <div className="col-md-2" title="Add New Spec">
                            {specs.length < 6 ? (
                              <AddCircleOutline
                                style={{
                                  cursor: "pointer",
                                  color: "#01244C",
                                }}
                                onClick={addSpec}
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Specs Box End------------------------------------------------------------------------ */}
                </Col>
              </Row>

              {/* Save Close Button ---------------------------------------------------------------------- */}
              <Row
                style={{
                  gap: "1rem",
                  padding: "1rem",
                }}
                className="product-saveBtn flex-center"
              >
                <div>
                  <button
                    type="button"
                    className="products-form-cancelBtn"
                    onClick={() => navigate("/prodlist")}
                  >
                    Cancel
                  </button>
                </div>

                <button
                  onClick={handleOpen}
                  type="button"
                  className="products-form-saveBtn"
                >
                  Save
                </button>

                {/* modal>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.. */}

                <Modal
                  open={open}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <div
                    style={{ width: "250px", height: "180px" }}
                    className="productPage-modal container"
                  >
                    <Row>
                      <Col lg={6} className="flex-center" />
                      <Col lg={6} className="text-right">
                        <div title="Back">
                          <CloseBtnComp handleClose={handleClose} />
                          {/* <Close
                            onClick={handleClose}
                            style={{
                              color: "orange",
                              cursor: "pointer",
                              fontSize: "2.7rem",
                            }}
                           /> */}
                        </div>
                      </Col>
                    </Row>
                    <Row className="text-center">
                      <Col>
                        <span>
                          <strong>Confirmation</strong>{" "}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-center">
                        <button
                          disabled={loading}
                          onClick={handleFinalForm}
                          className="products-form-saveBtn"
                        >
                          Confirm
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
                        </button>
                      </Col>
                    </Row>
                  </div>
                </Modal>
                <Modal
                  open={brandModal}
                  onClose={handleBrandClose} // still needed for Esc key
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  BackdropProps={{ onClick: (e) => e.stopPropagation() }} // prevent click outside
                >
                  <div
                    style={{
                      width: "250px",
                      height: "180px",
                      position: "absolute",     // center modal
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)", // center both vertically and horizontally
                      background: "#fff",
                      padding: "20px",
                      borderRadius: "15px",
                      // boxShadow: "0 0 12px rgba(0,123,255,0.4)", // optional blue glow
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className="productPage-modal container flex-center"
                  >
                    {/* Back / Close button */}
                    <button
                      onClick={handleBrandClose}
                      style={{
                        position: "absolute",
                        top: "-30px",
                        right: "-30px",
                        zIndex: 10,
                        background: "#0785D2",      // blue background
                        border: "2px solid white",  // white border
                        borderRadius: "50%",        // circular button
                        width: "32px",
                        height: "32px",
                        fontSize: "18px",
                        fontWeight: 900,
                        color: "#fff",              // white X
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      &#x2715; {/* cross (X) symbol for closing */}
                    </button>

                    <Row>
                      <Col className="text-center">
                        <input
                          onChange={(event) =>
                            setNewBrand({ ...newBrand, name: event.target.value })
                          }
                          type="text"
                          className="form-control products-specs__form-control col-sm-12 mb-2"
                          placeholder="add new brand"
                        />
                        <input
                          onChange={(event) =>
                            setNewBrand({ ...newBrand, brandcode: event.target.value })
                          }
                          type="text"
                          maxLength={4}
                          className="form-control products-specs__form-control col-sm-12 mb-3"
                          placeholder="brand code"
                        />
                        <button onClick={handleAddBrand} className="products-form-saveBtn">
                          Add
                        </button>
                      </Col>
                    </Row>
                  </div>
                </Modal>

                {/* <Modal
                  open={brandModal}
                  onClose={handleBrandClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <div
                    style={{ width: "250px", height: "180px" }}
                    className="productPage-modal container flex-center"
                  >
                    <Row>
                      <Col className="text-center">
                        <input
                          onChange={(event) =>
                            setNewBrand({
                              ...newBrand,
                              name: event.target.value,
                            })
                          }
                          type="text"
                          className="form-control products-specs__form-control col-sm-12 mb-2"
                          placeholder="add new brand"
                        />
                        <input
                          onChange={(event) =>
                            setNewBrand({
                              ...newBrand,
                              brandcode: event.target.value,
                            })
                          }
                          type="text"
                          maxLength={4}
                          className="form-control products-specs__form-control col-sm-12 mb-3"
                          placeholder="brand code"
                        />
                        <button
                          onClick={handleAddBrand}
                          className="products-form-saveBtn"
                        >
                          Add
                        </button>
                      </Col>
                    </Row>
                  </div>
                </Modal> */}

                {/* Add category modal */}


              </Row>
            </Form>
            <ToastContainer>
              position="top-right" autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
            </ToastContainer>
          </div>
        </Col>
      </Row>
      <CustomModal
        open={categoryopen}
        onClose={() => {
          setcategoryOpen(false);
          reloadCategoriesAndSubCategories(); // 🔁 reload after close
        }}
      >
        <CustomerManagerCntrl />
      </CustomModal>

    </div>
    // </Sidebar>
  );
}
