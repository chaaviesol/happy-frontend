import { React, useContext, useEffect, useState, useRef } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import { MyContext } from "../../../../Contexts/Contexts";
import html2pdf from "html2pdf.js";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./Register.css";
import { Modal } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import ColorBoxComponent from "../../../../components/FormComponents/ColorBoxComponent";
import FileInputComponent from "../../../../components/FormComponents/FileInputComponent";
import "./Prodlist.css";
import useDivBoxCloser from "../../../../hooks/useDivBoxCloser";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import ImageModal from "../ProdAndWorkList/ProductImageViewModal/Index";
export default function Proddetails() {
  const { prodlistData, setprodlistData } = useContext(MyContext);
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

  const [state, setState] = useState(false);
  const [item, setItem] = useState(false);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [style, setStyle] = useState("registercolor");
  const [isOpen, setIsOpen] = useState(false);
  const [opened, setopened] = useState(false);
  const [filterSubcat, setSubfilterSubcat] = useState();
  const [filterSubcat1, setSubfilterSubcat1] = useState();
  const [supplier, setSupplier] = useState();
  const [supplierfilter, setsupplierfilter] = useState([]);
  const [brand, setBrand] = useState([]);
  const [brandfilter, Setbrandfilter] = useState([]);
  const [loading, setloading] = useState(false);
  const [isColorBoxOnTop, setIsColorBoxOnTop] = useState(true);
  const [newProdData, setNewProdData] = useState({
    brand: prodlistData?.brand?.brand_name,
    brand_name: prodlistData?.brand_name,
    brand_code: prodlistData?.brand?.brand_code,
    color: prodlistData?.color,
    category: prodlistData?.product_sub_type,
    color_family: prodlistData?.color_family,
    desc: prodlistData?.product_desc,
    gst_perc: prodlistData?.gst_perc,
    hsn: prodlistData?.hsn,
    image1_link: prodlistData.image1_link,
    image2_link: prodlistData.image2_link,
    image3_link: prodlistData.image3_link,
    measure: prodlistData?.unit_of_measure,
    manufacturer_code: prodlistData?.manufacturer_code,
    name: prodlistData?.product_name,
    package: prodlistData?.package,
    spec: prodlistData.product_spec,
    subcategory: prodlistData?.prod_subtype2,
    sup_name: prodlistData?.users?.trade_name,
    type: prodlistData?.product_type,
    units: prodlistData?.no_of_items,
    user: prodlistData?.users?.trade_name,
    min_stk: prodlistData?.min_stk,
  });

  const [images, setImages] = useState({ image1: "", image2: "", image3: "" });
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [viewingImage, setViewingImage] = useState(); //modal view

  const category_ref = useRef(null);
  const subcategory_ref = useRef(null);
  const suppliers_ref = useRef(null);
  const divToPrintRef = useRef();

  useEffect(() => {
    if (prodlistData.product_type) {
      const data = { main: prodlistData.product_type };
      if (prodlistData.product_type === "bikes") {
        axiosPrivate.post(`/category/categorymasterview`, data).then((res) => {
          console.log(res.data);
          //  setCategory
          console.log(res.data.category);
          setCategory(res.data.category);
          // setSubcategory(res.data.sub_category);
        });
      }
      if (prodlistData.product_type === "toys")
        axiosPrivate.post(`/category/categorymasterview`, data).then((res) => {
          console.log(res);
          setCategory(res.data.category);
        });

      if (prodlistData.product_type === "baby") {
        console.log("hiii");
        axiosPrivate.post(`/category/categorymasterview`, data).then((res) => {
          console.log(res);
          setCategory(res.data.category);
        });
      }
    }

    console.log("hii");
  }, [prodlistData.product_type]);

  useEffect(() => {
    const fetchData = async () => {
      const brandBody = { prod_type: prodlistData?.product_type };

      try {
        const response = await axiosPrivate.post(
          `/product/viewBrands`,
          brandBody
        );
        const brandname = response.data?.map((item) => item.brand_name);
        console.log("brand", brandname);
        setBrand(brandname);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [prodlistData?.product_type]);

  useEffect(() => {
    const fetchData = async () => {
      const brandBody = { prod_type: newProdData?.type };

      try {
        const response = await axiosPrivate.post(
          `/product/viewBrands`,
          brandBody
        );
        const brandname = response.data?.map((item) => item.brand_name);
        console.log("brand", brandname);
        setBrand(brandname);
        console.log("new", brand);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [newProdData?.type]);

  useEffect(() => {
    console.log("brand", brand);
  }, [brand]);

  useEffect(() => {
    const fetchData = async () => {
      const data = { main_type: prodlistData?.product_type };
      console.log("data", data);

      try {
        const response = await axiosPrivate.post(`/user/viewsup`, data);
        console.log("responseviewsup", response);
        const tradeNames = response.data?.map((item) => item.trade_name);
        console.log("trade", tradeNames);
        setSupplier(tradeNames);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [prodlistData?.product_type]);

  useEffect(() => {
    const fetchData = async () => {
      const data = { main_type: newProdData?.type };
      console.log("data", data);

      try {
        const response = await axiosPrivate.post(`/user/viewsup`, data);
        const tradeNames = response.data?.map((item) => item.trade_name);
        console.log("trade", tradeNames);
        setSupplier(tradeNames);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [newProdData?.type]);

  //supplier
  useEffect(() => {
    const filterdata1 = supplier?.filter((details) => {
      return details
        ?.toLowerCase()
        .includes(prodlistData?.trade_name?.toLowerCase());
    });
    console.log("filterdata1===", filterdata1);
    if (prodlistData?.trade_name?.length >= 0) {
      setsupplierfilter(filterdata1);
    } else {
      console.log("hii");
      setsupplierfilter([]);
    }
  }, []);

  useEffect(() => {
    const filterdata1 = supplier?.filter((details) => {
      return details
        ?.toLowerCase()
        .includes(newProdData?.sup_name?.toLowerCase());
    });
    console.log("filterdata1", filterdata1);
    if (newProdData?.sup_name?.length >= 0) {
      setsupplierfilter(filterdata1);
    } else {
      setsupplierfilter([]);
    }
  }, [newProdData?.sup_name]);

  //.......................

  //brand filter//...........
  useEffect(() => {
    const filterdata1 = brand?.filter((details) => {
      return details
        ?.toLowerCase()
        .includes(prodlistData?.brand_name?.toLowerCase());
    });
    console.log(filterdata1);
    Setbrandfilter(filterdata1);
  }, []);

  //category
  useEffect(() => {
    const filterdata = category.filter((details) => {
      return details
        ?.toLowerCase()
        .includes(prodlistData?.product_sub_type.toLowerCase());
    });
    console.log(filterdata);
    if (prodlistData?.product_sub_type >= 0) {
      setSubfilterSubcat(filterdata);
    } else {
      setSubfilterSubcat([]);
    }
  }, [prodlistData?.product_sub_type]);

  useEffect(() => {
    const filterdata = category?.filter((details) => {
      return details
        ?.toLowerCase()
        .includes(newProdData.category?.toLowerCase());
    });
    console.log(filterdata);
    if (newProdData?.category >= 0) {
      setSubfilterSubcat(filterdata);
    } else {
      setSubfilterSubcat([]);
    }
  }, [newProdData?.category]);
  console.log("updated prodlist", prodlistData);

  //......................
  //subcategory
  useEffect(() => {
    if (subcategory) {
      console.log(subcategory);

      const filterdata1 = subcategory?.filter((details) => {
        return details
          ?.toLowerCase()
          .includes(prodlistData?.prod_subtype2.toLowerCase());
      });
      console.log("filterdata1", filterdata1);

      if (prodlistData?.prod_subtype2 >= 0) {
        setSubfilterSubcat1(filterdata1);
      } else {
        setSubfilterSubcat1([]);
      }
    }
  }, [prodlistData?.prod_subtype2]);

  useEffect(() => {
    const filterdata1 = subcategory?.filter((details) => {
      return details
        ?.toLowerCase()
        .includes(newProdData?.subcategory?.toLowerCase());
    });
    console.log("filterdata1", filterdata1);

    if (newProdData?.subcategory >= 0) {
      setSubfilterSubcat1(filterdata1);
    } else {
      setSubfilterSubcat1([]);
    }
  }, [newProdData?.subcategory]);

  //..........................

  // ---------------------------

  const handlePrint = useReactToPrint({
    content: () => divToPrintRef.current,
  });

  const spec = prodlistData?.product_spec;
  const specEntries = spec ? Object.entries(spec) : [];
  console.log(specEntries);

  const createspec = newProdData?.spec;
  const createspecEntries = createspec ? Object.entries(createspec) : [];
  console.log(createspecEntries);

  const handleDownload = () => {
    const element = document.getElementById("page-to-download");
    html2pdf(element);
  };
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("/prodlist");
  };
  const handleEdit = (action) => {
    console.log("variant");
    if (action === "variant") {
      setItem(false);
      console.log("item", item);
      console.log(prodlistData);
    } else {
      setItem(true);
      setStyle("registercolor1");
    }
    setState(true);
  };
  console.log("item>>", item);
  const handleColorFamily = (color) => {
    const Colorkey = "color_family";
    setprodlistData({ ...prodlistData, [Colorkey]: color });
  };
  const handleVariantColor = (color) => {
    const Colorkey = "color_family";
    setNewProdData({ ...newProdData, [Colorkey]: color });
  };

  const handleProductdetails = (event, index) => {
    const name = event.target.name;
    const value = event.target.value;
    setprodlistData({ ...prodlistData, [name]: value });
  };

  const CategoryClick = () => {
    setSubfilterSubcat(category);
    setSubfilterSubcat1([]);
  };

  const SubcatClick = async () => {
    setSubfilterSubcat([]);
    try {
      const data = {
        main_type: prodlistData?.product_type,
        category: prodlistData?.product_sub_type,
      };
      const response = await axiosPrivate.post(`/product/getspec`, data);
      const dta = response.data[0].sub_categories;
      setSubfilterSubcat1(dta);
    } catch (err) {
      console.log(err);
    }
  };

  const supplierClick = () => {
    setsupplierfilter(supplier);
  };

  const suppeditClick = () => {
    setsupplierfilter(supplier);
  };

  const categoryClick = () => {
    setSubfilterSubcat(category);
    setSubfilterSubcat1([]);
  };
  const SubcatnewClick = async () => {
    try {
      const data = {
        main_type: prodlistData?.product_type,
        category: prodlistData?.product_sub_type,
      };
      const response = await axiosPrivate.post(`/product/getspec`, data);
      const dta = response.data[0].sub_categories;
      setSubfilterSubcat1(dta);
    } catch (err) {
      console.log(err);
    }
  };
  const brandClick = () => {
    Setbrandfilter(brand);
  };

  const brandeditclick = () => {
    console.log("brandedit");
    Setbrandfilter(brand);
  };

  const handleCreateVariant = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setNewProdData({ ...newProdData, [name]: value });
    console.log(newProdData);
  };

  //category
  const searched = (name) => {
    console.log("hiiiii");
    setprodlistData(name);
    setprodlistData({ ...prodlistData, product_sub_type: name });
    setSubfilterSubcat([]);
  };
  const searchcategory = (name) => {
    // alert("hola")
    setNewProdData({ ...newProdData, category: name });
    setSubfilterSubcat([]);
  };
  //.........................

  const search = (name) => {
    console.log(name);

    setprodlistData({ ...prodlistData, prod_subtype2: name });

    setSubfilterSubcat1([]);
    // setSubfilterSubcat1([]);
  };
  //supplier search click edit prod
  const suppliersearched = (name) => {
    setprodlistData({ ...prodlistData, trade_name: name });
    setsupplierfilter([]);
  };
  //..........//
  //supplier search click create////sup_name
  const suppliersearch = (name) => {
    setNewProdData({ ...newProdData, trade_name: name });
    setsupplierfilter([]);
  };

  //..............//
  //brand edit//
  const brandsearched = (name) => {
    Setbrandfilter([]);
    setprodlistData({ ...prodlistData, brand_name: name });
  };

  //..................//
  //new prod//
  const searchsubcat = (name) => {
    setNewProdData({ ...newProdData, subcategory: name });
    setSubfilterSubcat1([]);
  };
  //..............//

  const handleProductspec = (event, index) => {
    const name = event.target.name;
    const value = event.target.value;
    setprodlistData((prevData) => {
      const updatedProductSpec = {
        ...prevData.product_spec,
        [name]: value,
      };

      return {
        ...prevData,
        product_spec: updatedProductSpec,
      };
    });
    console.log(prodlistData);
  };

  const handleCreatespec = (event, index) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log("createvalue", value);
    console.log("createname", name);
    setNewProdData((prevData) => {
      const updatedProductSpec = {
        ...prevData.spec,
        [name]: value,
      };

      return {
        ...prevData,
        spec: updatedProductSpec,
      };
    });
    console.log(newProdData);
  };

  const handleDiscard = () => {
    setState(false);
    setStyle("registercolor");
  };

  const create = async () => {
    setloading(true);
    const clonedNewProdData = { ...newProdData };
    clonedNewProdData.no_of_items = clonedNewProdData.units;
    clonedNewProdData.product_code = prodlistData.product_code;
    delete clonedNewProdData.units;

    const formData = new FormData();
    const imageFiles = Object.values(images);
    imageFiles.forEach((image, index) => {
      formData.append("image", image);
    });
    formData.append("data", JSON.stringify(clonedNewProdData));
    try {
      const response = await axiosPrivate.post(
        `/product/productmgmt`,
        formData
      );
      console.log({ response });
      if (response.status === 201) {
        toast.success(response.data);
        setTimeout(function () {
          navigate("/prodlist");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.error, toastConfig);
    } finally {
      setloading(false);
    }
  };

  const save = () => {
    setIsColorBoxOnTop(false);
    setopened(true);
  };
  const handleclosed = () => {
    setopened(false);
  };

  const confirmSave = async () => {
    setloading(true);
    try {
      setopened(false);
      console.log({ prodlistData });
      const formData = new FormData();
      const imageFiles = Object.values(images);
      imageFiles.forEach((image, index) => {
        formData.append("image", image);
      });
      formData.append("data", JSON.stringify(prodlistData));
      console.log("last updated form>>", formData);
      const response = await axiosPrivate.post(
        `/product/productmgmt`,
        formData
      );
      console.log(response);
      if (response.status === 201) {
        toast.success("success", response.data);
        setTimeout(function () {
          navigate("/prodlist");
        }, 3000);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };
  // update images
  const handleFileChanges = (e, i) => {
    console.log(e, i);
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setImages({ ...images, [`image${i}`]: selectedFile });
    const reader = new FileReader();
    reader.onload = (e) => {
      setprodlistData({
        ...prodlistData,
        [`image${i}_link`]: e.target.result,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const divBoxCloseFn = () => {
    setSubfilterSubcat("");
    setSubfilterSubcat1("");
    setsupplierfilter([]);
  };
  //open image showing modal
  const handleClickImage = (index) => {
    setIsColorBoxOnTop(false);
    setImageModalOpen(true);

    setViewingImage(prodlistData[`image${index}_link`]);
  };
  useDivBoxCloser(
    [category_ref, subcategory_ref, suppliers_ref],
    [divBoxCloseFn]
  );
  console.log("updatedProdData", prodlistData);
  console.log("setViewingImage", viewingImage);

  return (
    <>
      <div
        className="container p-3 prodcontainer"
        onClick={handleDropdownToggle}
      >
        <div ref={divToPrintRef} id="page-to-download">
          <Row className="border border-gray">
            <Col md={5} lg={5}>
              <Row className="po-Container-Rows">
                <Col
                  style={{ padding: "0", margin: "0" }}
                  className=""
                  md={3}
                  lg={2}
                >
                  <Image
                    className="po-logo ml-3"
                    src="assets/poLogo.png"
                  ></Image>
                </Col>
                <Col md={8} lg={8}>
                  <Row className="row mt-3 ml-3">
                    <Col>
                      {" "}
                      <span className="po-happyTxt ">
                        <b>Happy Agencies</b>{" "}
                      </span>{" "}
                    </Col>
                  </Row>
                  <Row className="ml-3">
                    <Col>
                      <span className="po-placeTxt"> Calicut</span>{" "}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col className="" md={7} lg={7}>
              <span className="po-purchaseOrder">PRODUCT DETAILS</span>
            </Col>
          </Row>

          <Row className="border border-gray border-2 p-3 ">
            <Col lg={6}>
              {state === false ? (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Product Name
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer inputstyle "
                        id={style}
                        name="name"
                        value={prodlistData?.product_name}
                      ></input>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Product Name
                    </label>
                    <div className="col-sm-8">
                      {item === false ? (
                        <>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer"
                            id={style}
                            name="name"
                            value={newProdData.name}
                            onChange={(event, index) =>
                              handleCreateVariant(event, index)
                            }
                            // onClick={prodname}
                          ></input>
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer"
                            id={style}
                            name="product_name"
                            value={prodlistData?.product_name}
                            onChange={(event, index) =>
                              handleProductdetails(event, index)
                            }
                            // onClick={prodname}
                          ></input>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {state === false ? (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Brand Name
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer inputstyle "
                        id={style}
                        name="name"
                        value={prodlistData?.brand?.brand_name}

                        // onClick={prodname}
                      ></input>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Brand Name
                    </label>
                    <div className="col-sm-8">
                      {item === false ? (
                        <>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            onClick={brandClick}
                            name="brand"
                            value={newProdData.brand}
                            onChange={(event, index) =>
                              handleCreateVariant(event, index)
                            }
                          ></input>
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            onClick={brandeditclick}
                            name="brand_name"
                            value={prodlistData?.brand_name}
                            onChange={(event, index) =>
                              handleProductdetails(event, index)
                            }
                          ></input>

                          {brandfilter?.length > 0 && (
                            <div
                              className="log-supp-dropdown-scrollbar1"
                              id="style-2"
                            >
                              {brandfilter?.map((item, index) => (
                                <div
                                  className="dropdown_map"
                                  style={{ fontSize: "12px" }}
                                  onClick={() => {
                                    brandsearched(item);
                                  }}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {state === false ? (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Manufacturer_code
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer inputstyle "
                        id={style}
                        name="name"
                        value={prodlistData?.manufacturer_code}
                      ></input>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Manufacturer_code
                    </label>
                    <div className="col-sm-8">
                      {item === false ? (
                        <>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            name="manufacturer_code"
                            value={newProdData.manufacturer_code}
                            onChange={(event, index) =>
                              handleCreateVariant(event, index)
                            }
                          ></input>
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            name="manufacturer_code"
                            value={prodlistData?.manufacturer_code}
                            onChange={(event, index) =>
                              handleProductdetails(event, index)
                            }
                          ></input>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {state === false ? (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Division
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer inputstyle "
                        id={style}
                        name="name"
                        value={prodlistData?.product_type}

                        // onClick={prodname}
                      ></input>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Category
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer inputstyle "
                        id={style}
                        name="name"
                        value={prodlistData?.product_sub_type}

                        // onClick={prodname}
                      ></input>
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Subcategory
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer inputstyle "
                        id={style}
                        name="name"
                        value={prodlistData?.prod_subtype2}
                      ></input>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {item === false ? (
                    <>
                      <div className="form-group row">
                        <label
                          for="sdgsdgs"
                          className="col-sm-4 col-form-label text-left"
                        >
                          Division
                        </label>
                        <div className="col-sm-8">
                          <select
                            value={newProdData?.type}
                            name="type"
                            onChange={(event, index) =>
                              handleCreateVariant(event, index)
                            }
                            className="form-control register_form  prodcontainer "
                            id={style}
                          >
                            <option value="" disabled selected>
                              Select Category
                            </option>
                            <option value="bikes">Bikes</option>
                            <option value="toys">Toys</option>
                            <option value="baby">Baby</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          for="sdgsdgs"
                          className="col-sm-4 col-form-label text-left"
                        >
                          Category
                        </label>

                        <div className="col-sm-8" ref={category_ref}>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            onClick={categoryClick}
                            name="category"
                            value={newProdData?.category}
                            onChange={(event, index) =>
                              handleCreateVariant(event, index)
                            }
                          ></input>
                          {filterSubcat?.length > 0 && (
                            <div
                              className="log-supp-dropdown-scrollbar1"
                              id="style-2"
                            >
                              {filterSubcat?.map((item, index) => (
                                <div
                                  className="dropdown_map"
                                  style={{ fontSize: "12px" }}
                                  onClick={() => searchcategory(item)}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-group row">
                        <label
                          for="sdgsdgs"
                          className="col-sm-4 col-form-label text-left"
                        >
                          Subcategory
                        </label>

                        <div className="col-sm-8" ref={subcategory_ref}>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            onClick={SubcatnewClick}
                            name="subcategory"
                            value={newProdData?.subcategory}
                            onChange={(event, index) =>
                              handleCreateVariant(event, index)
                            }
                          ></input>
                          {filterSubcat1?.length > 0 && (
                            <div
                              className="log-supp-dropdown-scrollbar1"
                              id="style-2"
                            >
                              {filterSubcat1?.map((item, index) => (
                                <div
                                  className="dropdown_map"
                                  style={{ fontSize: "12px" }}
                                  onClick={() => {
                                    searchsubcat(item);
                                  }}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group row">
                        <label
                          for="sdgsdgs"
                          className="col-sm-4 col-form-label text-left"
                        >
                          Division
                        </label>
                        <div className="col-sm-8">
                          <select
                            value={prodlistData?.product_type}
                            name="product_type"
                            onChange={(event, index) =>
                              handleProductdetails(event, index)
                            }
                            className="form-control register_form  prodcontainer "
                            id={style}
                          >
                            <option value="" disabled selected>
                              Select Category
                            </option>
                            <option value="bikes">Bikes</option>
                            <option value="toys">Toys</option>
                            <option value="baby">Baby</option>
                          </select>
                        </div>
                      </div>

                      {/* //...............// */}

                      <div className="form-group row">
                        <label
                          for="sdgsdgs"
                          className="col-sm-4 col-form-label text-left"
                        >
                          Category
                        </label>
                        <div className="col-sm-8" ref={category_ref}>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            onClick={CategoryClick}
                            name="product_sub_type"
                            value={prodlistData?.product_sub_type}
                            onChange={(event, index) =>
                              handleProductdetails(event, index)
                            }
                          ></input>
                          {filterSubcat?.length > 0 && (
                            <div
                              className="log-supp-dropdown-scrollbar1"
                              id="style-2"
                            >
                              {filterSubcat?.map((item, index) => (
                                <div
                                  className="dropdown_map"
                                  style={{ fontSize: "12px" }}
                                  onClick={() => {
                                    searched(item);
                                  }}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* //............// */}

                      <div className="form-group row">
                        <label
                          for="sdgsdgs"
                          className="col-sm-4 col-form-label text-left"
                        >
                          Subcategory
                        </label>
                        <div className="col-sm-8" ref={subcategory_ref}>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            onClick={SubcatClick}
                            name="prod_subtype2"
                            value={prodlistData?.prod_subtype2}
                            onChange={(event, index) =>
                              handleProductdetails(event, index)
                            }
                          ></input>
                          {filterSubcat1.length > 0 && (
                            <div
                              className="log-supp-dropdown-scrollbar1"
                              id="style-2"
                            >
                              {filterSubcat1.map((item, index) => (
                                <div
                                  className="dropdown_map"
                                  style={{ fontSize: "12px" }}
                                  onClick={() => {
                                    search(item);
                                  }}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* //..........// */}
                    </>
                  )}
                </>
              )}

              {/* //.........// */}

              {state === false ? (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Product Code
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer inputstyle "
                        id={style}
                        name="name"
                        value={prodlistData?.product_code}
                      ></input>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Product Code
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer "
                        id={style}
                        name="product_code"
                        value={prodlistData?.product_code}
                        onChange={(event, index) =>
                          handleProductdetails(event, index)
                        }
                      ></input>
                    </div>
                  </div>
                </>
              )}

              {/* //.........// */}

              {state === false ? (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Color
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer inputstyle "
                        id={style}
                        name="name"
                        value={prodlistData?.color}
                      ></input>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Color
                    </label>
                    <div className="col-sm-8">
                      {item === false ? (
                        <>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            name="color"
                            value={newProdData?.color}
                            onChange={(event, index) =>
                              handleCreateVariant(event, index)
                            }
                          ></input>
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            name="color"
                            value={prodlistData?.color}
                            onChange={(event, index) =>
                              handleProductdetails(event, index)
                            }
                          ></input>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {state === false ? (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Product_spec
                    </label>
                  </div>
                  <div>
                    {specEntries &&
                      specEntries?.map(([key, value]) => (
                        <div className="form-group row">
                          <input
                            key={key}
                            for="sdgsdgs"
                            className="col-sm-4 col-form-label no-border inputstyle "
                            value={key}
                          ></input>
                          <div className="col-sm-8">
                            <input
                              type="text"
                              className="form-control register_form  prodcontainer inputstyle  "
                              id={style}
                              name={key}
                              value={value}
                            ></input>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Product_spec
                    </label>
                  </div>
                  {item === false ? (
                    <>
                      <div>
                        {createspecEntries &&
                          createspecEntries?.map(([key, value]) => (
                            <div className="form-group row">
                              <input
                                key={key}
                                for="sdgsdgs"
                                className="col-sm-4 col-form-label no-border"
                                value={key}
                              ></input>
                              <div className="col-sm-8">
                                <input
                                  type="text"
                                  className="form-control register_form  prodcontainer "
                                  id={style}
                                  name={key}
                                  value={value}
                                  onChange={(event, index) =>
                                    handleCreatespec(event, index)
                                  }
                                ></input>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  ) : (
                    <div>
                      {specEntries &&
                        specEntries?.map(([key, value]) => (
                          <div className="form-group row">
                            <input
                              key={key}
                              for="sdgsdgs"
                              className="col-sm-4 col-form-label no-border"
                              value={key}
                            ></input>
                            <div className="col-sm-8">
                              <input
                                type="text"
                                className="form-control register_form  prodcontainer "
                                id={style}
                                name={key}
                                value={value}
                                onChange={(event, index) =>
                                  handleProductspec(event, index)
                                }
                              ></input>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}

              <div className="row">
                <div className="col-lg-10"></div>
              </div>
            </Col>
            <Col lg={6}>
              <div>
                <Row>
                  <Col
                    onClick={() => handleClickImage(1)}
                    className="border border-gray border-2 proddetails_img_container"
                    lg={4}
                  >
                    <img
                      src={prodlistData.image1_link}
                      id="prod_details_img1"
                      className="imgestyle"
                    />
                  </Col>
                  <Col
                    onClick={() => handleClickImage(2)}
                    className="border border-gray border-2 proddetails_img_container"
                    lg={4}
                  >
                    <img
                      src={prodlistData.image2_link}
                      id="prod_details_img1"
                      className="imgestyle"
                    />
                  </Col>
                  <Col
                    onClick={() => handleClickImage(3)}
                    className="border border-gray border-2  proddetails_img_container"
                    lg={4}
                  >
                    <img
                      src={prodlistData.image3_link}
                      id="prod_details_img1"
                      className="imgestyle"
                    />
                  </Col>
                  {/* </>
                  )} */}
                </Row>
              </div>
              {state === false ? (
                <>
                  <div className="form-group row mt-3">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Description
                    </label>
                    <div className="col-sm-8">
                      <textarea
                        type="text"
                        className="form-control register_form  prodcontainer inputstyle "
                        id={style}
                        name="product_desc"
                        value={prodlistData?.product_desc}
                      ></textarea>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group row mt-3">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Description
                    </label>
                    <div className="col-sm-8">
                      {item === false ? (
                        <>
                          <textarea
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            name="desc"
                            value={newProdData.desc}
                            onChange={(event, index) =>
                              handleCreateVariant(event, index)
                            }
                          ></textarea>
                        </>
                      ) : (
                        <>
                          <textarea
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            name="product_desc"
                            value={prodlistData?.product_desc}
                            onChange={(event, index) =>
                              handleProductdetails(event, index)
                            }
                          ></textarea>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {state === false ? (
                <>
                  <div className="form-group row mt-3">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Supplier Name
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer inputstyle "
                        id={style}
                        name="trade_name"
                        value={prodlistData?.users?.trade_name}
                      ></input>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group row mt-3">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Supplier Name
                    </label>
                    <div className="col-sm-8">
                      {item === false ? (
                        <>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            onClick={supplierClick}
                            name="sup_name"
                            value={newProdData.sup_name}
                            onChange={(event, index) =>
                              handleCreateVariant(event, index)
                            }
                          ></input>
                          {supplierfilter?.length > 0 && (
                            <div
                              className="log-supp-dropdown-scrollbar1"
                              id="style-2"
                            >
                              {supplierfilter?.map((item, index) => (
                                <div
                                  className="dropdown_map"
                                  style={{ fontSize: "12px" }}
                                  onClick={() => {
                                    suppliersearch(item);
                                  }}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            onClick={suppeditClick}
                            name="trade_name"
                            value={prodlistData?.trade_name}
                            onChange={(event, index) =>
                              handleProductdetails(event, index)
                            }
                          ></input>
                          {supplierfilter?.length > 0 && (
                            <div
                              ref={suppliers_ref}
                              className="log-supp-dropdown-scrollbar1"
                              id="style-2"
                            >
                              {supplierfilter?.map((item, index) => (
                                <div
                                  className="dropdown_map"
                                  style={{ fontSize: "12px" }}
                                  onClick={() => {
                                    suppliersearched(item);
                                  }}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {state === false ? (
                <>
                  <div className="form-group row mt-3">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      package
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer inputstyle "
                        id={style}
                        name="product_desc"
                        value={prodlistData?.package}
                      ></input>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      package
                    </label>
                    <div className="col-sm-8">
                      {item === false ? (
                        <>
                          <select
                            onChange={(event, index) =>
                              handleCreateVariant(event, index)
                            }
                            name="package"
                            value={newProdData.package}
                            className="form-control register_form  prodcontainer "
                            id={style}
                          >
                            <option defaultValue="" disabled selected>
                              Select package
                            </option>
                            <option value="Box">Box</option>
                            <option value="Carton">Carton</option>
                            <option value="sack">sack</option>
                            <option value="Bundle">Bundle</option>
                          </select>
                        </>
                      ) : (
                        <>
                          <select
                            onChange={(event, index) =>
                              handleProductdetails(event, index)
                            }
                            name="package"
                            value={prodlistData?.package}
                            className="form-control register_form  prodcontainer "
                            id={style}
                          >
                            <option defaultValue="" disabled selected>
                              Select package
                            </option>
                            <option value="Box">Box</option>
                            <option value="Carton">Carton</option>
                            <option value="sack">sack</option>
                            <option value="Bundle">Bundle</option>
                          </select>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              {state === false ? (
                <>
                  <div className="form-group row mt-3">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      No of Items/Package
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer inputstyle  "
                        id={style}
                        name="product_desc"
                        value={prodlistData?.no_of_items}
                      ></input>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      No of Items/Package
                    </label>
                    <div className="col-sm-8">
                      {item === false ? (
                        <>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer"
                            id={style}
                            name="units"
                            value={newProdData.units}
                            onChange={(event, index) =>
                              handleCreateVariant(event, index)
                            }
                          ></input>
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer"
                            id={style}
                            name="no_of_items"
                            value={prodlistData?.no_of_items}
                            onChange={(event, index) =>
                              handleProductdetails(event, index)
                            }
                          ></input>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
              {state === false ? (
                <>
                  <div className="form-group row mt-3">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Minimum Stock
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer inputstyle  "
                        id={style}
                        name="product_desc"
                        value={prodlistData?.min_stk}
                      ></input>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Minimum Stock
                    </label>
                    <div className="col-sm-8">
                      {item === false ? (
                        <>
                          <input
                            type="number"
                            min={0}
                            className="form-control register_form  prodcontainer"
                            id={style}
                            name="min_stk"
                            value={newProdData.min_stk}
                            onChange={(event, index) =>
                              handleCreateVariant(event, index)
                            }
                          ></input>
                        </>
                      ) : (
                        <>
                          <input
                            type="number"
                            className="form-control register_form  prodcontainer"
                            id={style}
                            min={0}
                            name="min_stk"
                            value={prodlistData?.min_stk}
                            onChange={(event, index) =>
                              handleProductdetails(event, index)
                            }
                          ></input>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {state === false ? (
                <>
                  <div className="form-group row mt-3">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Color Family
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer color_family inputstyle "
                        id={style}
                        name="color_family"
                        value={prodlistData?.color_family}
                        style={{
                          backgroundColor: prodlistData?.color_family,
                          borderRadius: "25px",
                          marginRight: "65%",
                        }}
                      ></input>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group row mt-3">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      Color Family
                    </label>
                    <div className="col-sm-8 ">
                      {item === false ? (
                        <div
                          onClick={() => {
                            setIsColorBoxOnTop(true);
                          }}
                          style={{
                            width: "200px",
                            position: "absolute",
                            zIndex: !loading ? "99999" : 0,
                          }}
                        >
                          <ColorBoxComponent setColor={handleVariantColor} />
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setIsColorBoxOnTop(true);
                          }}
                          style={{
                            width: "200px",
                            position: "absolute",
                            zIndex: isColorBoxOnTop ? "99999" : "",
                          }}
                        >
                          <ColorBoxComponent setColor={handleColorFamily} />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {state === false ? (
                <>
                  <div className="form-group row mt-3">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      GST
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="number"
                        min={0}
                        className="form-control register_form  prodcontainer inputstyle  "
                        id={style}
                        name="product_desc"
                        value={prodlistData?.gst_perc}
                      ></input>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      GST
                    </label>
                    <div className="col-sm-8">
                      {item === false ? (
                        <>
                          <input
                            type="number"
                            min={0}
                            className="form-control register_form  prodcontainer "
                            id={style}
                            name="gst_perc"
                            value={newProdData.gst_perc}
                            onChange={(event, index) =>
                              handleCreateVariant(event, index)
                            }
                          ></input>
                        </>
                      ) : (
                        <>
                          <input
                            type="number"
                            min={0}
                            className="form-control register_form  prodcontainer "
                            id={style}
                            name="gst_perc"
                            value={prodlistData?.gst_perc}
                            onChange={(event, index) =>
                              handleProductdetails(event, index)
                            }
                          ></input>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {state === false ? (
                <>
                  <div className="form-group row mt-3">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      HSN
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control register_form  prodcontainer inputstyle  "
                        id={style}
                        name="product_desc"
                        value={prodlistData?.hsn}
                      ></input>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group row">
                    <label
                      for="sdgsdgs"
                      className="col-sm-4 col-form-label text-left"
                    >
                      HSN
                    </label>
                    <div className="col-sm-8">
                      {item === false ? (
                        <>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer "
                            id={style}
                            name="hsn"
                            value={newProdData.hsn}
                            onChange={(event, index) =>
                              handleCreateVariant(event, index)
                            }
                          ></input>
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            className="form-control register_form  prodcontainer  "
                            id={style}
                            name="hsn"
                            value={prodlistData?.hsn}
                            onChange={(event, index) =>
                              handleProductdetails(event, index)
                            }
                          ></input>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </Col>
          </Row>
        </div>
        {state === false ? (
          <>
            <Row className="mt-2">
              <Col lg={2}></Col>
              <Col lg={2} md={3} sm={6} xs={12}>
                <Button
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "25px",
                    width: "100%",
                  }}
                  onClick={() => {
                    handleEdit("variant");
                  }}
                >
                  Create Variant
                </Button>
              </Col>
              <Col lg={2} md={3} sm={6} xs={12}>
                <Button
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    borderRadius: "25px",
                    // width: "145px",
                    width: "100%",
                  }}
                  onClick={() => {
                    handleEdit("edit");
                  }}
                >
                  Edit
                </Button>
              </Col>
              <Col lg={2} md={3} sm={6} xs={12}>
                <Button
                  variant="white"
                  className="custom-button"
                  onClick={handlePrint}
                  style={{
                    backgroundColor: "gray",
                    color: "white",
                    borderRadius: "25px",
                    // width: "145px",
                    width: "100%",
                  }}
                >
                  Download
                </Button>
                {/* }           */}

                {/* </div> */}
              </Col>
              <Col lg={2} md={3} sm={6} xs={12}>
                <Button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "25px",
                    // width: "145px",
                    width: "100%",
                  }}
                  onClick={handleClose}
                >
                  Close
                </Button>
              </Col>
              <Col lg={2} md={0}></Col>
            </Row>
          </>
        ) : (
          <>
            <Row className="mt-2">
              <Col lg={4}></Col>
              {item === false ? (
                <Col lg={2}>
                  <Button
                    disabled={loading}
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      borderRadius: "25px",
                      width: "145px",
                    }}
                    onClick={create}
                  >
                    Create
                  </Button>
                </Col>
              ) : (
                <Col lg={2}>
                  <Button
                    onClick={save}
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      borderRadius: "25px",
                      width: "145px",
                    }}
                  >
                    Save
                  </Button>
                </Col>
              )}

              <Col lg={2}>
                <Button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "25px",
                    width: "145px",
                  }}
                  onClick={handleDiscard}
                >
                  Discard
                </Button>
              </Col>
              <Col
                lg={4}
                style={{ display: "flex", alignItems: "center", gap: "30px" }}
              >
                <FileInputComponent
                  index="1"
                  onChange={handleFileChanges}
                  text="Img 1"
                />
                <FileInputComponent
                  index="2"
                  onChange={handleFileChanges}
                  text="Img 2"
                />
                <FileInputComponent
                  index="3"
                  onChange={handleFileChanges}
                  text="Img 3"
                />
              </Col>
            </Row>
          </>
        )}
      </div>

      <Modal
        open={opened}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={{
            backgroundColor: "white",
            width: "30%",
            padding: "20px",
            marginLeft: "40%",
            marginTop: "15%",
            borderRadius: "10px",
          }}
        >
          <Row>
            <Col lg={2}></Col>
            <Col lg={8}>
              <h5>Do you want to Save?</h5>
              <Row className="mt-3">
                <Col lg={6}>
                  <Button
                    style={{
                      backgroundColor: "green",
                      borderRadius: "25px",
                      width: "130px",
                    }}
                    id="buttonwidth"
                    onClick={confirmSave}
                  >
                    {" "}
                    Yes{" "}
                  </Button>
                </Col>
                <Col lg={6}>
                  <Button
                    style={{
                      backgroundColor: "red",
                      borderRadius: "25px",
                      width: "130px",
                    }}
                    id="buttonwidth"
                    onClick={handleclosed}
                  >
                    No
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col lg={2}></Col>
          </Row>
        </div>
      </Modal>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToastContainer>
        position="top-right" autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
      </ToastContainer>
      <ImageModal
        show={isImageModalOpen}
        setShow={setImageModalOpen}
        image={viewingImage}
      />
    </>
  );
}
