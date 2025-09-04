import { React, useContext, useEffect, useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import { MyContext } from "../../../../Contexts/Contexts";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import {
  Add,
  AttachFile,
  Category,
  CategoryRounded,
  KeyboardArrowDown,
} from "@mui/icons-material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
// import Button from '@mui/material/Button';

import "./Register.css";
import { prismaBaseApi } from "../../../../config";
import { Modal } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

export default function Prodlistapprove() {
  const { productlist, setproductlist } = useContext(MyContext);
  const [opened, setopened] = useState(false);
  const [inputData, setInputData] = useState("");
  const [supcode, setSupcode] = useState([]);
  const [style, setStyle] = useState("registercolor");
  console.log(productlist);
  const [loading, setloading] = useState(false);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [tempField, setTempField] = useState({ product_code: "" });
  const [isAccessTemp, setIsAccessTemp] = useState(false);
  const [isProdCodeUpdated, setIsProdCodeUpdated] = useState(false);
  const prodType = productlist?.product_type;
  const prodCode = productlist?.product_code;

  const navigate = useNavigate();
  const axiosPrivate=useAxiosPrivate()

  const submit = (id) => {
    setloading(true);

    const data = {
      product_id: productlist?.product_id,
      approvalflag: id,
      product_sub_type: isAccessTemp ? tempField?.product_sub_type || "" : "",
      prod_subtype2: isAccessTemp ? tempField?.prod_subtype2 || "" : "",
      product_code: isAccessTemp
        ? tempField?.product_code || prodCode
        : prodCode,
    };
    console.log(data);
    if (id === "Y") {
      axiosPrivate
        .post(`/product/productapprove`, data)
        .then((res) => {
          console.log("res");
          toast.success(`Product ${productlist?.product_name} approved`);
          // setloading(false)
          setTimeout(function () {
            navigate("/productworklist");
          }, 3000); // (3 seconds)
        });
      console.log(data);
    } else {
      axiosPrivate
        .post(`/product/productapprove`, data)
        .then((res) => {
          console.log("res");
          toast.error(res.data.message);
          setloading(false);
          setTimeout(function () {
            navigate("/productworklist");
          }, 3000); // (3 seconds)
        });
      console.log(data);
    }
  };

  // category and subcategory changes from modal..temporary
  const handleFieldChanges = async (event) => {
    try {
      setIsAccessTemp(true);
      const { name, value } = event.target;
      if (name === "product_sub_type") {
        const main = { type: productlist?.prodType, category: value };
        const response = await axiosPrivate.post(
          `/category/subspec`,
          main
        );
        const { data } = response;

        setSubcategory(data.subCategories);
      }

      setTempField((prev) => ({
        ...prev,
        [name]: value,
      }));
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleChangeProdcodeTemp = (event) => {
    const { name, value } = event.target;
    setIsAccessTemp(true);
    setIsProdCodeUpdated(true);

    setTempField((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log("tempField =>>>", tempField);
  const spec = productlist?.product_spec;
  // const specEntries = Object?.entries(spec);
  const specEntries = spec ? Object.entries(spec) : [];
  console.log(specEntries);

  const createspec = productlist?.spec;
  const createspecEntries = createspec ? Object.entries(createspec) : [];
  console.log(createspecEntries);
  const handleclosed = () => {
    setopened(false);
  };
  useEffect(() => {
    const Dropdown = () => {
      const main = productlist?.prodType;
      axiosPrivate.post(`/category`, main).then((res) => {
        console.log("res", res.data);
        setCategory(res.data);
      });
    };
    Dropdown();
  }, []);

  console.log("categories", category);

  return (
    <>
      <ToastContainer>
        position="top-right" autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
      </ToastContainer>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
          padding: "3rem",
        }}
      >
        <div
          style={{ width: "90%", height: "90%" }}
          className="p-3 prodcontainer "
          // onClick={handleDropdownToggle}
        >
          <div id="page-to-download border-red">
            <Row className="border border-gray border-2 p-3 ">
              <Col lg={6}>
                <div class="form-group row">
                  <label
                    for="sdgsdgs"
                    class="col-sm-4 col-form-label text-left"
                  >
                    Product Name
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form  prodcontainer inputstyle "
                      id={style}
                      name="name"
                      value={productlist?.product_name}
                    ></input>
                  </div>
                </div>

                <div class="form-group row">
                  <label
                    for="sdgsdgs"
                    class="col-sm-4 col-form-label text-left"
                  >
                    Brand Name
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form  prodcontainer inputstyle "
                      id={style}
                      name="name"
                      value={productlist?.brand?.brand_name}

                      // onClick={prodname}
                    ></input>
                  </div>
                </div>

                <div class="form-group row">
                  <label
                    for="sdgsdgs"
                    class="col-sm-4 col-form-label text-left"
                  >
                    Manufacturer_code
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form  prodcontainer inputstyle "
                      id={style}
                      name="name"
                      value={productlist?.manufacturer_code}
                    ></input>
                  </div>
                </div>

                <div class="form-group row">
                  <label
                    for="sdgsdgs"
                    class="col-sm-4 col-form-label text-left"
                  >
                    Division
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form  prodcontainer inputstyle "
                      id={style}
                      name="name"
                      value={productlist?.product_type}

                      // onClick={prodname}
                    ></input>
                  </div>
                </div>

                {/* <div class="form-group row">
                <label for="sdgsdgs" class="col-sm-4 col-form-label text-left">
                  Category
                </label>
                <div class="col-sm-8">
                  <select
                    name="product_sub_type"
                    id={style}
                    onChange={handleReadonly}
                    class="form-control register_form  prodcontainer inputstyle "
                  >
                    <option value=""></option>
                    {category?.map((value, index) => (
                      <option value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div class="form-group row">
                <label for="sdgsdgs" class="col-sm-4 col-form-label text-left">
                  Subcategory
                </label>
                <div class="col-sm-8">
                  <select
                    name="prod_subtype2"
                    id={style}
                    onChange={handleReadonly}
                    class="form-control register_form  prodcontainer inputstyle "
                  >
                    <option value=""></option>
                    {subcategory?.map((value, index) => (
                      <option value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div class="form-group row">
                <label for="sdgsdgs" class="col-sm-4 col-form-label text-left">
                  Product Code
                </label>
                <div class="col-sm-8">
                  <input
                    type="text"
                    class="form-control register_form  prodcontainer inputstyle "
                    id={style}
                    name="product_code"
                    onChange={handleChangeProdcode}
                    value={productlist?.product_code}
                  ></input>
                </div>
              </div> */}

                <div class="form-group row">
                  <label
                    for="sdgsdgs"
                    class="col-sm-4 col-form-label text-left"
                  >
                    Color
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form  prodcontainer inputstyle "
                      id={style}
                      name="name"
                      value={productlist?.color}
                    ></input>
                  </div>
                </div>

                <div class="form-group row">
                  <label
                    for="sdgsdgs"
                    class="col-sm-4 col-form-label text-left"
                  >
                    Product_spec
                  </label>
                </div>
                <div>
                  {specEntries &&
                    specEntries?.map(([key, value]) => (
                      <div class="form-group row">
                        <input
                          key={key}
                          for="sdgsdgs"
                          class="col-sm-4 col-form-label no-border inputstyle "
                          value={key}
                        ></input>
                        <div class="col-sm-8">
                          <input
                            type="text"
                            class="form-control register_form  prodcontainer inputstyle  "
                            id={style}
                            name={key}
                            value={value}
                          ></input>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="row">
                  <div className="col-lg-10"></div>
                </div>
              </Col>
              <Col lg={6}>
                <div>
                  <Row>
                    <Col className="border border-gray border-2" lg={4}>
                      <img
                        src={productlist.image1_link}
                        className="imgestyle"
                      />
                    </Col>
                    <Col className="border border-gray border-2" lg={4}>
                      <img
                        src={productlist.image2_link}
                        className="imgestyle"
                      />
                    </Col>
                    <Col className="border border-gray border-2" lg={4}>
                      <img
                        src={productlist.image3_link}
                        className="imgestyle"
                      />
                    </Col>
                    {/* </>
                  )} */}
                  </Row>
                </div>

                <div class="form-group row mt-3">
                  <label
                    for="sdgsdgs"
                    class="col-sm-4 col-form-label text-left"
                  >
                    Description
                  </label>
                  <div class="col-sm-8">
                    <textarea
                      type="text"
                      class="form-control register_form  prodcontainer inputstyle "
                      id={style}
                      name="product_desc"
                      value={productlist?.product_desc}
                    ></textarea>
                  </div>
                </div>

                <div class="form-group row mt-3">
                  <label
                    for="sdgsdgs"
                    class="col-sm-4 col-form-label text-left"
                  >
                    Supplier Name
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form  prodcontainer inputstyle "
                      id={style}
                      name="trade_name"
                      value={productlist?.users?.trade_name}
                    ></input>
                  </div>
                </div>

                <div class="form-group row mt-3">
                  <label
                    for="sdgsdgs"
                    class="col-sm-4 col-form-label text-left"
                  >
                    package
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form  prodcontainer inputstyle "
                      id={style}
                      name="product_desc"
                      value={productlist?.package}
                    ></input>
                  </div>
                </div>

                <div class="form-group row mt-3">
                  <label
                    for="sdgsdgs"
                    class="col-sm-4 col-form-label text-left"
                  >
                    No of Items/Package
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form  prodcontainer inputstyle  "
                      id={style}
                      name="product_desc"
                      value={productlist?.no_of_items}
                    ></input>
                  </div>
                </div>

                <div class="form-group row mt-3">
                  <label
                    for="sdgsdgs"
                    class="col-sm-4 col-form-label text-left"
                  >
                    Color Family
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form  prodcontainer color_family inputstyle "
                      id={style}
                      name="color_family"
                      value={productlist?.color_family}
                      style={{
                        backgroundColor: productlist?.color_family,
                        borderRadius: "25px",
                        marginRight: "65%",
                      }}
                    ></input>
                  </div>
                </div>

                <div class="form-group row mt-3">
                  <label
                    for="sdgsdgs"
                    class="col-sm-4 col-form-label text-left"
                  >
                    GST
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="number"
                      class="form-control register_form  prodcontainer inputstyle  "
                      id={style}
                      name="product_desc"
                      value={productlist?.gst_perc}
                    ></input>
                  </div>
                </div>

                <div class="form-group row mt-3">
                  <label
                    for="sdgsdgs"
                    class="col-sm-4 col-form-label text-left"
                  >
                    HSN
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      class="form-control register_form  prodcontainer inputstyle  "
                      id={style}
                      name="product_desc"
                      value={productlist?.hsn}
                    ></input>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Row className="mt-2">
            <Col lg={4}></Col>
            <div className="form-group row reg-submit d-flex justify-content-around">
              <Col lg={2}>
                <Button
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "25px",
                    width: "145px",
                  }}
                  // onClick={() => {
                  //   submit("Y");
                  // }}
                  onClick={() => {
                    setIsShowModal(true);
                    setIsAccessTemp(false);
                  }}
                >
                  Approve
                </Button>
              </Col>
              <Col lg={2}>
                <Button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "25px",
                    width: "145px",
                  }}
                  onClick={() => {
                    submit("N");
                  }}
                >
                  Reject
                </Button>
              </Col>
            </div>
            <Col lg={2} md={3} sm={6} xs={12}></Col>
          </Row>
        </div>
        <Modal open={isShowModal}>
          <div
            style={{
              width: "350px",
              // height: "250px",
              borderRadius: "10px",
              backgroundColor: "#fafaf9",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "10px",
              paddingTop: "20px",
            }}
          >
            <div class="form-group row">
              <label for="sdgsdgs" class="col-sm-4 col-form-label text-left">
                Category
              </label>
              <div class="col-sm-8">
                <select
                  name="product_sub_type"
                  id={style}
                  onChange={handleFieldChanges}
                  class="form-control register_form  prodcontainer inputstyle "
                >
                  <option value=""></option>
                  {category?.map((value, index) => (
                    <option value={value}>{value}</option>
                  ))}
                </select>
              </div>
            </div>
            <div class="form-group row">
              <label for="sdgsdgs" class="col-sm-4 col-form-label text-left">
                Subcategory
              </label>
              <div class="col-sm-8">
                <select
                  name="prod_subtype2"
                  id={style}
                  onChange={handleFieldChanges}
                  class="form-control register_form  prodcontainer inputstyle "
                >
                  <option value=""></option>
                  {subcategory?.map((value, index) => (
                    <option value={value}>{value}</option>
                  ))}
                </select>
              </div>
            </div>
            <div class="form-group row">
              <label for="sdgsdgs" class="col-sm-4 col-form-label text-left">
                Product Code
              </label>
              <div class="col-sm-8">
                <input
                  type="text"
                  class="form-control register_form  prodcontainer inputstyle "
                  id={style}
                  name="product_code"
                  onChange={handleChangeProdcodeTemp}
                  value={
                    isAccessTemp && isProdCodeUpdated
                      ? tempField?.product_code
                      : prodCode
                  }
                ></input>
              </div>
            </div>
            <div className="row">
              <div
                className="col"
                style={{
                  display: "flex",
                  gap: "2rem",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "20px",
                    fontSize: "15px",
                    width: "80px",
                  }}
                  onClick={() => {
                    submit("Y");
                  }}
                >
                  Confirm
                </Button>
                <Button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "20px",
                    border: "none",
                    fontSize: "15px",
                    width: "80px",
                    "&:hover": {
                      // Define hover styles
                      backgroundColor: "blue",
                      color: "black",
                    },
                  }}
                  onClick={() => {
                    setIsShowModal(false);
                    setIsAccessTemp(false);
                    setTempField({ product_code: "" });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
