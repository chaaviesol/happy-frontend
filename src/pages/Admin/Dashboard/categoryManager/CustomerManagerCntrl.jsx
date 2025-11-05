import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import useAuth from "../../../../hooks/useAuth";
export default function CustomerManagerCntrl() {

  const { auth } = useAuth({});
  const division = auth?.division;
console.log("vv auth division",division);

  const [categorydata, setCategoryData] = useState([]);
  const [SubCatValues, setSubCatValues] = useState([]);
  const [specsValues, setspecsValues] = useState([]);
  const [getspecValues, setgetspecValues] = useState([]);
  const [existcheckspec, setexistcheckspec] = useState(false);
  const [existchecksubcat, setexistchecksubcat] = useState(false);
  const [reloadstate, setreloadstate] = useState(false)
  const [dltdetail_state, setdltdetail_state] = useState([""]);
  const [subcatarraystring, setsubcatarraystring] = useState([]);
  const [useefcttempstate, setuseefcttempstate] = useState({
    drpdwn: true,
    category: false,
    spec: false,
  });
  const [specnewcat, setspecnewcat] = useState([]);
  const [Confirm_box, setConfirm_box] = useState(false);
  const [dltConfirm, setdltConfirm] = useState({
    spec: false,
    value: false,
    category: false,
    subcat: false,
    function: false,
  });
  const [categoryAddingTrueFalse, setcategoryAddingTrueFalse] = useState({
    categoryadding: false,
    sub_cat: false,
    spec: false,
    value: false,
    new_array: false,
  });
  const [tempStorging, settempStrging] = useState({
    sub_cat: "",
    spec: "",
    value: "",
  });
  const [Addsubcat, setAddsubcat] = useState({});
  const [Addnewspec, setAddnewspec] = useState({});
  const [addNewValue, setaddNewValue] = useState({});

  const [DivisionMaping, setDivisionMaping] = useState([
    "bikes",
    "toys",
    "baby",
    "accessories"
  ]);
  const [AddingsubCatNewCat, setAddingsubCatNewCat] = useState({});
  const [DltbxTR_FLSE, setDltbxTR_FLSE] = useState({
    dlt_icn: false,
    dlticn_sb_cat: false,
    dlticn_Spec: false,
    dlticn_Value: false,
  });
  const [xtrabx_TR_fls, setxtrabx_TR_fls] = useState({
    xtraBx: false,
    smlBx: false,
    smlBx2: false,
    smlBx3: false,
  });

  const [myArray, setMyArray] = useState([0]);
  const [myArray2, setMyArray2] = useState([0]);

  const [valuesdts, setvaluesdts] = useState({
    type: "",
    category: "",
    spec: "",
  });
  const [subcatTRUEFLSE, setsubcatTRUEFLSE] = useState({
    division: false,
    specs: false,
    subCat: false,
    values: false,
  });
  const [SubCatDt, setSubCatDt] = useState({
    type: "",
    category: "",
  });
  const [divisionstate, setdivisionstate] = useState({
    type: division||"",
  });
  const [requirestate, setrequirestate] = useState(false)
  const axiosPrivate=useAxiosPrivate()
  const spec = useRef(null)
  const subcat = useRef(null)
  const handleButtonClick = () => {
    if (subcat.current?.value) {
      const lastElement = myArray[myArray.length - 1];
      setMyArray((prevArray) => [...prevArray, lastElement + 1]);
    } else {
      toast.warning("Please input sub category", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    console.log("subcatarraystring=========>", AddingsubCatNewCat)
  };
  const handleButtonClick2 = () => {
    // console.log("hooo");
    if (spec.current?.value) {
      const lastElement2 = myArray2[myArray2.length - 1];
      setMyArray2((prevArray2) => [...prevArray2, lastElement2 + 1]);
    } else {
      toast.warning("Please input Spec", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  useEffect(() => {
    if (useefcttempstate.drpdwn) {
      axiosPrivate
        .post(`/category`, divisionstate)
        .then((result) => {
          console.log("cc category response",result);
          
          setCategoryData(result.data.data);
          setsubcatTRUEFLSE({ division: true });
          setdltConfirm({ ...dltConfirm, function: false });
        })
        .catch((error) => {
          console.log("category error==>",error);
        });
    }
  }, [divisionstate, reloadstate]);

  const categoryGet = (type) => {
    type = type;
    setdivisionstate({ type: type });
  };
  console.log("vv division state ===>",divisionstate);
  
  // console.log("reload===========>", reloadstate);
  useEffect(() => {
    if (useefcttempstate.category) {
      axiosPrivate
        .post(`/category/subspec`, SubCatDt)
        .then((result) => {
          setSubCatValues(result.data.subCategories);
          setspecsValues(result.data.specs);
          setdltConfirm({ ...dltConfirm, function: false });
          setsubcatTRUEFLSE({ subCat: true, division: true });
        });
    }
  }, [SubCatDt]);
  useEffect(() => {
    if (useefcttempstate.spec) {
      axiosPrivate
        .post(`/category/viewspec`, valuesdts)
        .then((result) => {
          setgetspecValues(result.data);
          setdltConfirm({ ...dltConfirm, function: false });
          setsubcatTRUEFLSE({ subCat: true, division: true, specs: true });
        });
    }
  }, [valuesdts]);

  function addingcategory(e, index) {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "category") {
      setrequirestate(false)
      if (cat.current?.value) {
        setcategoryAddingTrueFalse({ new_array: false });
        setAddingsubCatNewCat({
          ...AddingsubCatNewCat,
          type: divisionstate.type,
          category: value,
        });
      }
    } else if (name === "sub_categories") {
      setexistchecksubcat(false)
      let valueExists = false;
      for (const subCategory of Object.values(subcatarraystring)) {
        if (subCategory === value) {
          valueExists = true;
          break;
        }
      }
      if (valueExists) {
        // Value already exists in subcatarraystring, perform action here
        // console.log("Sub category value already exists:", value);
        setexistchecksubcat(true);
      } else {
        setsubcatarraystring({ ...subcatarraystring, [index]: value });
      }
    } else if (name === "spec") {
      setexistcheckspec(false)
      let valueExists = false;
      for (const specValue of Object.values(specnewcat)) {
        if (specValue === value) {
          valueExists = true;
          break;
        }
      }
      if (valueExists) {
        // console.log("Spec value already exists:", value);
        setexistcheckspec(true);
      } else {
        setspecnewcat({ ...specnewcat, [index]: value });
      }
    }
  }
  const onclickgoodt = () => {
    if (cat.current?.value) {
      setrequirestate(false)
      const inclddata = categorydata.includes(AddingsubCatNewCat.category);
      if (inclddata) {
        setcategoryAddingTrueFalse({ new_array: true });
      } else {
        const Newsubcat = Object.values(subcatarraystring);
        const Newspec = Object.values(specnewcat);
        setAddingsubCatNewCat({
          ...AddingsubCatNewCat,
          sub_categories: Newsubcat,
          spec: Newspec,
        });
        setcategoryAddingTrueFalse({ categoryadding: true });
      }
    } else {
      setrequirestate(true)
    }

  };

  const cat = useRef(null)

  useEffect(() => {
    if (categoryAddingTrueFalse.categoryadding == true) {
      if (!categoryAddingTrueFalse.new_array && !existcheckspec && !existchecksubcat) {
        setxtrabx_TR_fls({ xtraBx: true });
        axiosPrivate
          .post(`/category/addcategory`, AddingsubCatNewCat)
          .then((response) => {
            if (response.data.success) {
              toast.success(`${response.data.message}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              setexistcheckspec(false)
              setexistchecksubcat(false)
              setxtrabx_TR_fls({ xtraBx: false });
              setCategoryData((previous) => ([...previous, AddingsubCatNewCat.category]))
              if (reloadstate) {
                setreloadstate(false)
              } else {
                setreloadstate(true)
              }
            }
            setcategoryAddingTrueFalse({ categoryadding: false });
          });
      } else {

      }

    }
  }, [categoryAddingTrueFalse]);
  // console.log("subcat===>", subcatarraystring);
  // console.log("subcat===>", specnewcat);

  const AddSubCatfn = (e) => {
    const value = e.target.value;
    setcategoryAddingTrueFalse({ new_array: false });
    settempStrging({ sub_cat: value });
  };
  const subcatgodt = () => {
    if (tempStorging.sub_cat !== "") {
      const newArray = SubCatValues.includes(tempStorging.sub_cat);
      if (newArray) {
        // console.log("locked");
        setcategoryAddingTrueFalse({ new_array: true });
      } else {
        setxtrabx_TR_fls({ smlBx: false });
        setcategoryAddingTrueFalse({ new_array: false });
        setSubCatValues((prevData) => [...prevData, tempStorging.sub_cat]);
        setcategoryAddingTrueFalse({ new_array: false });
        setcategoryAddingTrueFalse({ sub_cat: true });
      }
    }
  };
  // console.log(existcheck);
  useEffect(() => {
    setAddsubcat({
      type: SubCatDt.type,
      category: SubCatDt.category,
      sub_categories: SubCatValues,
    });
  }, [SubCatValues]);
  useEffect(() => {
    if (categoryAddingTrueFalse.sub_cat == true) {
      axiosPrivate
        .post(`/category/addsubcat`, Addsubcat)
        .then((response) => {
          if (response.data.success) {
            toast.success(`${response.data.message}`, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
          setcategoryAddingTrueFalse({ sub_cat: false });
        });
    }
  }, [Addsubcat]);


  // console.log(categoryAddingTrueFalse.new_array);




  const addNewspecFN = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setcategoryAddingTrueFalse({ new_array: false });
    settempStrging({ spec: value });
  };

  const gonewspec = () => {
    // console.log(tempStorging.spec);
    if (tempStorging.spec !== "") {
      const newArray = specsValues.includes(tempStorging.spec);
      if (newArray) {
        setcategoryAddingTrueFalse({ new_array: true });
      } else {
        setxtrabx_TR_fls({ smlBx2: false });
        setspecsValues((prevData) => [...prevData, tempStorging.spec]);
        setcategoryAddingTrueFalse({ new_array: false });
        setcategoryAddingTrueFalse({ spec: true });
      }
    }
  };

  useEffect(() => {
    setAddnewspec({
      type: SubCatDt.type,
      category: SubCatDt.category,
      spec: specsValues,
    });
  }, [specsValues]);

  useEffect(() => {
    if (categoryAddingTrueFalse.spec == true) {
      axiosPrivate
        .post(`/category/addspec`, Addnewspec)
        .then((response) => {
          setcategoryAddingTrueFalse({ spec: false });
          if (response.data.success) {
            toast.success(`${response.data.message}`, {
              position: "top-center",
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
    }
  }, [Addnewspec]);

  const addNewValues = (event) => {
    const value = event.target.value;
    setcategoryAddingTrueFalse({ new_array: false });
    settempStrging({ value: value });
  };

  const govalue = () => {
    if (tempStorging.value !== "") {
      const newArray = getspecValues.includes(tempStorging.value);
      if (newArray) {
        // console.log("locked");
        setcategoryAddingTrueFalse({ new_array: true });
      } else {
        setxtrabx_TR_fls({ smlBx3: false });
        setgetspecValues((prevData) => [...prevData, tempStorging.value]);
        setcategoryAddingTrueFalse({ new_array: false });
        setcategoryAddingTrueFalse({ value: true });
      }
    }
  };
  useEffect(() => {
    setaddNewValue({
      type: SubCatDt.type,
      category: SubCatDt.category,
      spec: [{ [valuesdts.spec]: getspecValues }],
    });
  }, [getspecValues]);
  useEffect(() => {
    if (categoryAddingTrueFalse.value == true) {
      axiosPrivate
        .post(`/category/managespec`, addNewValue)
        .then((response) => {
          setcategoryAddingTrueFalse({ value: false });
          if (response.data.success) {
            toast.success(`${response.data.message}`, {
              position: "top-center",
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
    }
  }, [addNewValue]);

  const dltdata = () => {
    setAddnewspec({
      type: SubCatDt.type,
      category: SubCatDt.category,
      spec: specsValues,
    });
    setAddsubcat({
      type: SubCatDt.type,
      category: SubCatDt.category,
      sub_categories: SubCatValues,
    });
    setAddingsubCatNewCat({
      ...AddingsubCatNewCat,
      type: divisionstate.type,
      category: categorydata,
    });
    setaddNewValue({
      type: SubCatDt.type,
      category: SubCatDt.category,
      spec: [{ [valuesdts.spec]: getspecValues }],
    });
    setdltConfirm({ ...dltConfirm, function: true });
  };
  useEffect(() => {
    if (dltConfirm.function == true) {
      if (dltConfirm.category == true) {
        axiosPrivate
          .post(`/category/deletecate`, AddingsubCatNewCat)
          .then((response) => {
            if (response.data.success) {
              setdltConfirm({ category: false });
              toast.success(`${response.data.message}`, {
                position: "top-center",
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
        // console.log("AddingsubCatNewCat==>", AddingsubCatNewCat);
      }
      if (dltConfirm.subcat == true) {
        axiosPrivate
          .post(`/category/addsubcat`, Addsubcat)
          .then((response) => {
            if (response.data.success) {
              setdltConfirm({ subcat: false });
              toast.success("subcategory deleted successfully", {
                position: "top-center",
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
      }
      if (dltConfirm.spec == true) {
        axiosPrivate
          .post(`/category/deletespec`, Addnewspec)
          .then((response) => {
            if (response.data.success) {
              setdltConfirm({ spec: false });
              toast.success(`${response.data.message}`, {
                position: "top-center",
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
      }
      if (dltConfirm.value == true) {
        axiosPrivate
          .post(`/category/managespec`, addNewValue)
          .then((response) => {
            if (response.data.success) {
              setdltConfirm({ value: false });
              toast.success(`${response.data.message}`, {
                position: "top-center",
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
      }
    }
  }, [AddingsubCatNewCat, Addsubcat, Addnewspec, addNewValue]);
  useEffect(() => {
    if (Confirm_box) {
      toast.warning("please remember to save your changes!", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [Confirm_box])
  console.log("AddingsubCatNewCat=====>", AddingsubCatNewCat);
  useEffect(() => {
    if (DltbxTR_FLSE.dlt_icn || DltbxTR_FLSE.dlticn_Spec || DltbxTR_FLSE.dlticn_Value || DltbxTR_FLSE.dlticn_sb_cat) {
      setConfirm_box(false)
    }
  }, [DltbxTR_FLSE])
  console.log(dltdetail_state);
  return (
    <>
      <ToastContainer />
      <div id="cstmr_cntrl_alighn">
        <div id="cstmr_cntrl_alig_cntr">
          <div style={{ height: "2rem" }}></div>
          <div id="cstmr_cntrl_alig_ctgr_flx">
            <p id="cstmr_cntrl_alig_ctgr_p3">Division</p>
            <div style={{ width: "19px" }}></div>
            <div className="dropdown">
              <button
               style={{textTransform:"capitalize"}}
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {divisionstate.type == "" ? "Select" : divisionstate.type}
              </button>
              <div
                 style={{textTransform:"capitalize"}}
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {DivisionMaping.map((divisions, index) => (
                  <a
                    key={index}
                    onClick={() => {
                      categoryGet(divisions);
                      setuseefcttempstate({ drpdwn: true });
                    }}
                    style={{textTransform:"capitalize"}}
                    className="dropdown-item"
                    href="#"
                  >
                    {divisions}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ height: "2rem" }}></div>
          <div id="cstmralighns5">
            <div id="cstmr_cntrl_mn_prprty">
              <div className="form-container">
                <form className="form">
                  <p id="cstmr_cntrl_Ctgry_P">Category</p>
                  {subcatTRUEFLSE.division == true ? (
                    <>
                      <div className="container-input">
                        <input
                          type="text"
                          placeholder="Search"
                          name="text"
                          className="input"
                          onChange={(e) => {
                            const query = e.target.value.toLowerCase();
                            const filteredData = categorydata.filter((data) =>
                              data.toLowerCase().includes(query)
                            );
                            const remainingData = categorydata.filter(
                              (data) => !data.toLowerCase().includes(query)
                            );
                            setCategoryData([...filteredData, ...remainingData]);
                          }}
                        />
                      </div>
                      <div style={{ height: "5px" }}></div>
                      <div className="form-group">
                        <>
                          {categorydata.map((datas, index) => (
                            <>
                              <div
                                id="cstmr_cntrl_BX"
                                onClick={() => {
                                  setSubCatDt({
                                    type: divisionstate.type,
                                    category: datas,
                                  });
                                  setuseefcttempstate({ category: true });
                                }}
                                style={{
                                  boxShadow:
                                    SubCatDt.category == datas
                                      ? " rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px, rgba(0, 0, 0, 0.07) 0px 16px 16px"
                                      : "",
                                  backgroundColor:
                                    SubCatDt.category == datas
                                      ? "rgb(5, 77, 69)"
                                      : "",
                                  color:
                                    SubCatDt.category == datas ? "white" : "",
                                }}
                              >
                                <div style={{ width: "20px" }}></div>
                                <p
                                  id="cstmr_cntrl_BX_ptag_hvr"
                                  style={{
                                    fontSize: "16px",
                                    margin: "3px 00px 00px 00px",
                                    cursor: "pointer",
                                    textAlign:"left",
                                    color:
                                      SubCatDt.category == datas ? "white" : "",
                                  }}
                                >
                                  {datas}
                                </p>
                                <div
                                  onClick={() => {
                                    setDltbxTR_FLSE({ dlt_icn: true });
                                    // setConfirm_box(false);
                                    setdltdetail_state([
                                      ...dltdetail_state,
                                      {
                                        indexnum: index,
                                        type: divisionstate.type,
                                        category: datas,
                                      },
                                    ]);
                                  }}
                                  className="buttons"
                                >
                                  <div>
                                    <svg
                                      style={{ color: "red" }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-x-lg"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                    </svg>
                                  </div>
                                </div>
                              </div>

                              <div style={{ height: "0.3rem" }}></div>
                            </>
                          ))}
                        </>
                      </div>
                      <div id="cstmr_cntrl_bnAL">
                        {/* <div onClick={() => { }} className="Btn">
                                                <div className="sign"><svg xmlns="http://www.w3.org/2000/svg" style={{ color: "red" }} width="25" height="25" fill="currentColor" className="bi bi-check-all" viewBox="0 0 16 16">
                                                    <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z" />
                                                </svg></div>
                                                <div className="text">Add</div>
                                            </div>
                                            <div style={{ width: "10px" }}></div> */}
                        <div
                          onClick={() => {
                            setxtrabx_TR_fls({ xtraBx: true });
                          }}
                          className="Btn"
                        >
                          <div className="sign">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="25"
                              height="25"
                              fill="currentColor"
                              className="bi bi-plus-lg"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                              />
                            </svg>
                          </div>
                          <div className="text">Add</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ height: "5px" }}></div>
                      <p style={{ color: "black" }}>Select A Division</p>
                    </>
                  )}
                </form>
              </div>
              <div style={{ width: "20px" }}></div>
              <div className="form-container">
                <form className="form">
                  <p id="cstmr_cntrl_Ctgry_P">Sub Category</p>
                  <div style={{ height: "5px" }}></div>
                  {subcatTRUEFLSE.subCat == true ? (
                    <>
                      <div className="form-group">
                        {SubCatValues.map((Datas, index) => (
                          <>
                            <div id="cstmr_cntrl_BX">
                              <div style={{ width: "20px" }}></div>
                              <p
                                id="cstmr_cntrl_BX_ptag_hvr"
                                style={{
                                  fontSize: "16px",
                                  margin: "3px 00px 00px 00px",
                                  textAlign:"left",
                                }}
                              >
                                {Datas}
                              </p>
                              <div
                                onClick={() => {
                                  setDltbxTR_FLSE({ dlticn_sb_cat: true });
                                  // setConfirm_box(false);
                                  setdltdetail_state([
                                    ...dltdetail_state,
                                    {
                                      indexnum: index,
                                      type: SubCatDt.type,
                                      category: SubCatDt.category,
                                      subcat: Datas,
                                    },
                                  ]);
                                }}
                                className="buttons"
                              >
                                <div>
                                  <svg
                                    style={{ color: "red" }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-x-lg"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div style={{ height: "0.3rem" }}></div>
                          </>
                        ))}
                      </div>
                      <div id="cstmr_cntrl_bnAL">
                        <div
                          href="#"
                          onClick={() => {
                            setxtrabx_TR_fls({ smlBx: true });
                          }}
                          className="Btn"
                        >
                          <div className="sign">
                            <svg
                              width="25"
                              height="25"
                              fill="currentColor"
                              className="bi bi-plus-lg"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                              />
                            </svg>
                          </div>
                          <div className="text">Add</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={{ color: "black" }}>Select A Category</p>
                    </>
                  )}
                </form>
              </div>
              <div style={{ width: "20px" }}></div>
              {/* Separate cards for Specs and Values (previously grouped together) */}
              <div className="form-container">
                <form className="form">
                  <p id="cstmr_cntrl_Ctgry_P">Specs</p>

                  <div style={{ height: "5px" }}></div>
                  {subcatTRUEFLSE.subCat == true ? (
                    <>
                      <div className="form-group">
                        {specsValues.map((datas, index) => (
                          <React.Fragment key={`spec-${index}`}>
                            <div
                              id="cstmr_cntrl_BX"
                              onClick={() => {
                                setvaluesdts({
                                  type: divisionstate.type,
                                  category: SubCatDt.category,
                                  spec: datas,
                                });
                                setuseefcttempstate({ spec: true });
                              }}
                              style={{
                                boxShadow:
                                  valuesdts.spec == datas
                                    ? " rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px, rgba(0, 0, 0, 0.07) 0px 16px 16px"
                                    : "",
                                backgroundColor:
                                  valuesdts.spec == datas ? "rgb(5, 77, 69)" : "",
                                color: SubCatDt.category == datas ? "white" : "",
                              }}
                            >
                              <div style={{ width: "20px" }}></div>
                              <p
                                style={{
                                  fontSize: "16px",
                                  margin: "3px 00px 00px 00px",
                                  cursor: "pointer",
                                  color: valuesdts.spec == datas ? "white" : "",
                                }}
                              >
                                {datas}
                              </p>
                              <div
                                onClick={() => {
                                  setDltbxTR_FLSE({ dlticn_Spec: true });
                                  setdltdetail_state([
                                    ...dltdetail_state,
                                    {
                                      indexnum: index,
                                      type: valuesdts.type,
                                      category: valuesdts.category,
                                      spec: datas,
                                    },
                                  ]);
                                }}
                                className="buttons"
                              >
                                <div>
                                  <svg
                                    style={{ color: "red" }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-x-lg"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div style={{ height: "0.3rem" }}></div>
                          </React.Fragment>
                        ))}
                      </div>
                      <div id="cstmr_cntrl_bnAL">
                        <div
                          href="#"
                          onClick={() => {
                            setxtrabx_TR_fls({ smlBx2: true });
                          }}
                          className="Btn"
                        >
                          <div className="sign">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="25"
                              height="25"
                              fill="currentColor"
                              className="bi bi-plus-lg"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                              />
                            </svg>
                          </div>

                          <div className="text">Add</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={{ color: "black" }}>Select A Category</p>
                    </>
                  )}
                </form>
              </div>
              <div style={{ width: "20px" }}></div>
              <div className="form-container">
                <form className="form">
                  <p id="cstmr_cntrl_Ctgry_P">Values</p>

                  <div style={{ height: "5px" }}></div>
                  {subcatTRUEFLSE.specs == true ? (
                    <>
                      <div className="form-group">
                        {getspecValues.map((datas, index) => (
                          <React.Fragment key={`val-${index}`}>
                            <div id="cstmr_cntrl_BX" style={{ backgroundColor: "rgb(5, 77, 69)" }}>
                              <div style={{ width: "20px" }}></div>
                              <p
                                style={{
                                  color: "white",
                                  fontSize: "16px",
                                  margin: "3px 00px 00px 00px",
                                }}
                              >
                                {datas}
                              </p>
                              <div
                                onClick={() => {
                                  setDltbxTR_FLSE({ dlticn_Value: true });
                                  setdltdetail_state([
                                    ...dltdetail_state,
                                    {
                                      indexnum: index,
                                      type: valuesdts.type,
                                      category: valuesdts.category,
                                      spec: valuesdts.spec,
                                      specvalues: datas,
                                    },
                                  ]);
                                }}
                                className="buttons"
                              >
                                <div>
                                  <svg
                                    style={{ color: "red" }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-x-lg"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div style={{ height: "0.3rem" }}></div>
                          </React.Fragment>
                        ))}
                      </div>
                      <div id="cstmr_cntrl_bnAL">
                        <div style={{ width: "10px" }}></div>
                        <div
                          onClick={() => {
                            setxtrabx_TR_fls({ smlBx3: true });
                          }}
                          className="Btn"
                        >
                          <div className="sign">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="25"
                              height="25"
                              fill="currentColor"
                              className="bi bi-plus-lg"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                              />
                            </svg>
                          </div>
                          <div className="text">Add</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={{ color: "black" }}>Select A Spec</p>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>

          {xtrabx_TR_fls.xtraBx == true ? (
            <div className="login-box">
              <div style={{ textAlign: "end" }}>
                <svg
                  onClick={() => {
                    setxtrabx_TR_fls({ xtraBx: false });
                    setexistchecksubcat(false);
                    setexistcheckspec(false);
                    setcategoryAddingTrueFalse({ new_array: false });
                  }}
                  style={{ color: "red", cursor: "pointer" }}
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                </svg>
              </div>
              <form>
                <div className="user-box">
                  {categoryAddingTrueFalse.new_array ? (
                    <>
                      <div style={{ height: "0.5rem" }}></div>
                      <label style={{ fontSize: "0.6rem", color: "red" }}>
                        already in the table{" "}
                      </label>
                    </>
                  ) : (
                    ""
                  )}
                  {requirestate ? (
                    <>
                      <div style={{ height: "0.5rem" }}></div>
                      <label style={{ fontSize: "0.6rem", color: "red" }}>
                        require*{" "}
                      </label>
                    </>
                  ) : (
                    ""
                  )}
                  <div style={{ width: "44%" }}>
                    <input
                      onChange={addingcategory}
                      type="text"
                      name="category"
                      ref={cat}
                      required=""
                    />
                    <label style={{ fontWeight: "600", fontSize: "1rem" }}>
                      New Category
                    </label>
                  </div>
                </div>

                <div id="cstmr_cntrl_Ang_bx">
                  <div id="cstmr_cntrl_Ang_bx2">
                    <div className="user-box">
                      <>
                        {myArray.map((val, index) => (
                          <>
                            <div >
                              {index == 0 ?
                                <p style={{ textAlign: "start", fontSize: "0.7rem" }}>Sub Category</p>
                                : ""}
                              {existchecksubcat ? (
                                <>
                                  <div style={{ height: "0.5rem" }}></div>
                                  <label style={{ fontSize: "0.6rem", color: "red" }}>
                                    already in the table{" "}
                                  </label>
                                </>
                              ) : (
                                ""
                              )}
                              <div style={{ display: "flex" }}>
                                <input
                                  ref={subcat}
                                  onChange={(e) => { addingcategory(e, index + 1) }}
                                  type="text"
                                  name="sub_categories"
                                  required=""
                                />
                                {index == 0 ?
                                  <p
                                    onClick={handleButtonClick}
                                    style={{
                                      fontSize: "20px",
                                      margin: "15px 00px 00px 00px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    +
                                  </p> : ""}

                              </div>


                            </div>

                          </>
                        ))}
                      </>
                    </div>
                  </div>
                  <div style={{ width: "5%" }}></div>
                  <div id="cstmr_cntrl_Ang_bx2">
                    <div className="user-box">
                      <>
                        {myArray2.map((val, index) => (
                          <div>
                            {index == 0 ?
                              <p style={{ textAlign: "start", fontSize: "0.7rem" }}>Specs</p>
                              : ""}
                            {existcheckspec ? (
                              <>
                                <div style={{ height: "0.5rem" }}></div>
                                <label style={{ fontSize: "0.6rem", color: "red" }}>
                                  already in the table{" "}
                                </label>
                              </>
                            ) : (
                              ""
                            )}
                            <div style={{ display: "flex" }}>
                              <input
                                ref={spec}
                                onChange={(e) => { addingcategory(e, index + 1) }}
                                type="text"
                                name="spec"
                                required=""
                              />
                              {index == 0 ?
                                <p
                                  onClick={handleButtonClick2}
                                  style={{
                                    fontSize: "20px",
                                    margin: "15px 00px 00px 00px",
                                    cursor: "pointer",
                                  }}
                                >
                                  +
                                </p>
                                : ""}
                            </div>
                          </div>
                        ))}
                      </>
                    </div>
                  </div>
                </div>
                <center>
                  <a
                    onClick={() => {

                      onclickgoodt();
                      // setexistcheckspec(false);
                      // setexistchecksubcat(false);
                      // setcategoryAddingTrueFalse({ new_array: false })

                    }}
                    href="#"
                  >
                    Add
                    <span></span>
                  </a>
                </center>
              </form>
            </div>
          ) : (
            ""
          )}
          {xtrabx_TR_fls.smlBx == true ? (
            <div className="login-box2">
              <div style={{ textAlign: "end" }}>
                <svg
                  onClick={() => {
                    setxtrabx_TR_fls({ smlBx: false });
                    setcategoryAddingTrueFalse({ new_array: false });
                  }}
                  style={{ color: "red", cursor: "pointer" }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                </svg>
              </div>
              <form>
                <div className="user-box">
                  {categoryAddingTrueFalse.new_array ? (
                    <>
                      <div style={{ height: "0.5rem" }}></div>
                      <label style={{ fontSize: "0.6rem", color: "red" }}>
                        already in the table{" "}
                      </label>
                    </>
                  ) : (
                    ""
                  )}
                  <input
                    onChange={AddSubCatfn}
                    type="text"
                    name="sub_category"
                    required=""
                  />

                  <label>Add Sub category</label>
                </div>

                <center>
                  <a
                    onClick={() => {
                      subcatgodt();
                    }}
                    onKeyDown={() => {
                      subcatgodt();
                    }}
                    href="#"
                  >
                    Add
                    <span></span>
                  </a>
                </center>
              </form>
            </div>
          ) : (
            ""
          )}
          {xtrabx_TR_fls.smlBx2 == true ? (
            <div className="login-box2">
              <div style={{ textAlign: "end" }}>
                <svg
                  onClick={() => {
                    setxtrabx_TR_fls({ xtraBx: false });
                    setcategoryAddingTrueFalse({ new_array: false });
                  }}
                  style={{ color: "red", cursor: "pointer" }}
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                </svg>
              </div>
              <form>
                <div className="user-box">
                  {categoryAddingTrueFalse.new_array ? (
                    <>
                      <div style={{ height: "0.5rem" }}></div>
                      <label style={{ fontSize: "0.6rem", color: "red" }}>
                        already in the table{" "}
                      </label>
                    </>
                  ) : (
                    ""
                  )}
                  <input
                    onChange={addNewspecFN}
                    type="text"
                    name="spec"
                    required=""
                  />
                  <label>Add Spec</label>
                </div>
                <center>
                  <a
                    onClick={() => {
                      gonewspec();
                    }}
                    href="#"
                  >
                    Add
                    <span></span>
                  </a>
                </center>
              </form>
            </div>
          ) : (
            ""
          )}

          {xtrabx_TR_fls.smlBx3 == true ? (
            <div className="login-box2">
              <div style={{ textAlign: "end" }}>
                <svg
                  onClick={() => {
                    setxtrabx_TR_fls({ smlBx3: false });
                    setcategoryAddingTrueFalse({ new_array: false });
                  }}
                  style={{ color: "red", cursor: "pointer" }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                </svg>
              </div>
              <form>
                <div className="user-box">
                  {categoryAddingTrueFalse.new_array ? (
                    <>
                      <div style={{ height: "0.5rem" }}></div>
                      <label style={{ fontSize: "0.6rem", color: "red" }}>
                        already in the table{" "}
                      </label>
                    </>
                  ) : (
                    ""
                  )}
                  <input
                    type="text"
                    onChange={addNewValues}
                    name="value"
                    required=""
                  />
                  <label>Add Value</label>
                </div>
                <center>
                  <a
                    onClick={() => {
                      govalue();
                    }}
                    href="#"
                  >
                    Add
                    <span></span>
                  </a>
                </center>
              </form>
            </div>
          ) : (
            ""
          )}
          {DltbxTR_FLSE.dlt_icn == true ? (
            <>
              <div className="category_cards">
                <button
                  className="dismiss"
                  onClick={() => {
                    setDltbxTR_FLSE({ dlt_icn: false });
                    setConfirm_box(true)

                  }}
                  type="button"
                >
                  ×
                </button>
                <div className="header">
                  <div className="image">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      style={{ color: "red" }}
                      fill="currentColor"
                      className="bi bi-trash3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                    </svg>{" "}
                  </div>
                  <div className="content">
                    <p className="message">Are you sure to remove this item</p>
                  </div>
                  <div className="actions">
                    <button
                      className="history"
                      onClick={() => {
                        setcategoryAddingTrueFalse({ Confirm_box: true });
                        // console.log("trflseeeeeeee====>", dltdetail_state);
                        for (let i = 0; i < dltdetail_state.length; i++) {
                          // console.log(dltdetail_state[i].category, categorydata[i]);
                          const matchingCategory = categorydata.find(
                            (category) =>
                              category === dltdetail_state[i].category
                          );
                          if (matchingCategory) {
                            setConfirm_box(true);

                            setCategoryData(
                              (prevData) =>
                                prevData.filter(
                                  (category) => category !== matchingCategory
                                ),
                              setsubcatTRUEFLSE({
                                subCat: false,
                                specs: false,
                                division: true,
                              })
                            );
                          }
                        }
                        setDltbxTR_FLSE({ dlt_icn: false });
                        setdltConfirm({ ...dltConfirm, category: true });
                      }}
                      type="button"
                    >
                      Yes
                    </button>
                    <button
                      className="track"
                      onClick={() => {
                        setDltbxTR_FLSE({ dlt_icn: false });
                        setConfirm_box(true)
                      }}
                      type="button"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          {DltbxTR_FLSE.dlticn_sb_cat == true ? (
            <>
              <div className="category_cards">
                <button
                  className="dismiss"
                  onClick={() => {
                    setDltbxTR_FLSE({ dlt_icn: false });
                    setConfirm_box(true)

                  }}
                  type="button"
                >
                  ×
                </button>
                <div className="header">
                  <div className="image">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      style={{ color: "red" }}
                      fill="currentColor"
                      className="bi bi-trash3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                    </svg>{" "}
                  </div>
                  <div className="content">
                    <p className="message">Are you sure to remove this item</p>
                  </div>
                  <div className="actions">
                    <button
                      className="history"
                      onClick={() => {
                        // console.log("trflseeeeeeee====>", dltdetail_state);
                        for (let i = 0; i < dltdetail_state.length; i++) {
                          // console.log(dltdetail_state[i].subcat, categorydata[i]);
                          if (
                            dltdetail_state[i].subcat ===
                            SubCatValues[dltdetail_state[i].indexnum]
                          ) {
                            setConfirm_box(true);
                            setSubCatValues([
                              ...SubCatValues.slice(
                                0,
                                dltdetail_state[i].indexnum
                              ),
                              ...SubCatValues.slice(
                                dltdetail_state[i].indexnum + 1
                              ),
                            ]);
                          }
                        }
                        setDltbxTR_FLSE({ dlticn_sb_cat: false });
                        setdltConfirm({ ...dltConfirm, subcat: true });
                      }}
                      type="button"
                    >
                      Yes
                    </button>

                    <button
                      className="track"
                      onClick={() => {
                        setDltbxTR_FLSE({ dlticn_sb_cat: false });
                        setConfirm_box(true)

                      }}
                      type="button"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}

          {DltbxTR_FLSE.dlticn_Spec == true ? (
            <>
              <div className="category_cards">
                <button
                  className="dismiss"
                  onClick={() => {
                    setDltbxTR_FLSE({ dlt_icn: false });
                    setConfirm_box(true);

                  }}
                  type="button"
                >
                  ×
                </button>
                <div className="header">
                  <div className="image">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      style={{ color: "red" }}
                      fill="currentColor"
                      className="bi bi-trash3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                    </svg>
                  </div>
                  <div className="content">
                    <p className="message">Are you sure to remove this item</p>
                  </div>
                  <div className="actions">
                    <button
                      className="history"
                      onClick={() => {
                        setConfirm_box(true);

                        for (let i = 0; i < dltdetail_state.length; i++) {
                          console.log(dltdetail_state[i].spec, specsValues[i]);

                          if (
                            dltdetail_state[i].spec ===
                            specsValues[dltdetail_state[i].indexnum]
                          ) {
                            // setConfirm_box(true);

                            setspecsValues([
                              ...specsValues.slice(
                                0,
                                dltdetail_state[i].indexnum
                              ),
                              ...specsValues.slice(
                                dltdetail_state[i].indexnum + 1
                              ),
                            ]);
                            setsubcatTRUEFLSE({
                              specs: false,
                              subCat: true,
                              division: true,
                            });
                          }
                        }
                        setDltbxTR_FLSE({ dlticn_Spec: false });
                        setdltConfirm({ ...dltConfirm, spec: true });
                      }}
                      type="button"
                    >
                      Yes
                    </button>

                    <button
                      className="track"
                      onClick={() => {
                        setDltbxTR_FLSE({ dlticn_Spec: false });
                        setConfirm_box(true);

                      }}
                      type="button"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          {DltbxTR_FLSE.dlticn_Value == true ? (
            <>
              <div className="category_cards">
                <button
                  className="dismiss"
                  onClick={() => {
                    setDltbxTR_FLSE({ dlticn_Value: false });
                    setConfirm_box(true);

                  }}
                  type="button"
                >
                  ×
                </button>
                <div className="header">
                  <div className="image">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      style={{ color: "red" }}
                      fill="currentColor"
                      className="bi bi-trash3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                    </svg>
                  </div>
                  <div className="content">
                    <p className="message">Are you sure to remove this item</p>
                  </div>
                  <div className="actions">
                    <button
                      className="history"
                      onClick={() => {
                        console.log("trflseeeeeeee====>", dltdetail_state);
                        for (let i = 0; i < dltdetail_state.length; i++) {
                          console.log(dltdetail_state[i]);
                          if (
                            dltdetail_state[i].specvalues ===
                            getspecValues[dltdetail_state[i].indexnum]
                          ) {
                            setConfirm_box(true);
                            setgetspecValues([
                              ...getspecValues.slice(
                                0,
                                dltdetail_state[i].indexnum
                              ),
                              ...getspecValues.slice(
                                dltdetail_state[i].indexnum + 1
                              ),
                            ]);
                          }
                        }
                        setDltbxTR_FLSE({ dlticn_sb_cat: false });
                        setdltConfirm({ ...dltConfirm, value: true });
                      }}
                      type="button"
                    >
                      Yes
                    </button>
                    <button
                      className="track"
                      onClick={() => {
                        setDltbxTR_FLSE({ dlticn_Value: false });
                        setConfirm_box(true);

                      }}
                      type="button"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>

      {Confirm_box && dltdetail_state[1] ? (
        <>
          <div style={{ height: "50px" }}></div>

          <div id="csmtr_mngr_fnl_btn_align">
            <button
              onClick={() => {
                setConfirm_box(false);
                dltdata();
              }}
              id="csmtr_mngr_fnl_btn"
            >
              Save changes
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
