import { React, useContext, useEffect, useState } from "react";
import { Add, Addchart,  } from "@mui/icons-material";
import "./purchaseorders.css";
import { Row,  Col,  } from "react-bootstrap";
import classNames from "classnames";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import Ag from "../../../../components/admin components/Ag";
import InputComponent from "../../../../components/FormComponents/InputBox/InputComponent";
import { MyContext } from "../../../../Contexts/Contexts";
import { Link } from "react-router-dom";
import Newtopbar_ from "../../../../components/admin components/Newtopbar_";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import * as PoSlice from "../../../../Redux/slices/PoSlices";

const flexCenter = classNames(
  "d-flex",
  "align-items-center",
  "justify-content-center"
);
export default function PoSo() {
  const dispatch = useDispatch();
  const { setDraftData,isHidden } = useContext(MyContext);
  const [suppliers, setSuppliers] = useState([]);
  const [filterSup, setFilterSup] = useState({});
  const [selectedSupplier, setSelectedSupplier] = useState();
  console.log("selectedSupplier",filterSup);
  const [showSuppliers, setShowSuppliers] = useState(false);
  const axiosPrivate=useAxiosPrivate()
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const division = localStorage.getItem("division")
        const response = await axiosPrivate.post(
          `/logistics/suppliersandlogistics`, division
        );
        const data = response.data.suppliers;
        data.sort();
        setSuppliers(data);
        console.log(suppliers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSuppliers();
  }, []);

  //handle supplier input changes
  const handleChange = (event) => {
    setSelectedSupplier(null);
    const { value } = event.target;
    const supData = [...suppliers];
    if (value === "") {
      let suppliersClone = [...suppliers];
      suppliersClone.sort();
      setSuppliers(suppliersClone);
    } else {
      const filteredArr = supData.filter(
        (ele) => ele && ele.toLowerCase().includes(value.toLowerCase())
      );
      const remainingArr = supData.filter(
        (ele) => ele && !ele.toLowerCase().includes(value.toLowerCase())
      );
      setSuppliers([...filteredArr, ...remainingArr]);
    }
  };

  //Selecting Supplier
  const handleSupplier = (e, index) => {
    if (e.keyCode === 13 || e.type === "click") {
      const supplierName = suppliers[index];
      const supplierData = { trade_name: supplierName};
      setFilterSup(supplierData);
      setSelectedSupplier(supplierName);
      setShowSuppliers(false);
    }
  };

  const handleCloseBox = () => {
    if (showSuppliers) {
      setShowSuppliers(false);
    }
  };
  return (
    // <Sidebar>
    <>

      <div className="poso-container">
        <Row style={{ width: "100%" }}>
          <Col lg={12} md={12}>
            <div onClick={handleCloseBox}>
              <Newtopbar_ isActive={false} />

              <Row className="p-1 mb-3">
                <Col>
                  <span
                    style={{
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#00342E",
                      borderRadius: "4px",
                    }}
                  >
                    Purchase Orders
                  </span>
                </Col>
              </Row>
              <Row className="mb-1">
                <Col lg={8} md={9} sm={9}>
                  <Row className="p-1.5 mb-5 mt-2 align-items-center">
                    <Col lg={2} md={4} sm={6}>
                      <label className="align_Center m-0" htmlFor="">
                        Supplier
                      </label>
                    </Col>
                    <Col
                      style={{ position: "relative" }}
                      className=""
                      lg={3}
                      md={4}
                      sm={6}
                    >
                      <InputComponent
                        placeholder={"Select Supplier"}
                        handleInputChange={handleChange}
                        value={selectedSupplier}
                        onClick={() => {
                          if (suppliers.length > 0) {
                            setShowSuppliers(true);
                          }
                        }}
                      />

                      {showSuppliers && (
                        <div
                          id="style-2"
                          className=" border-grey pOrder-suppliers-dropdown"
                        >
                          {suppliers?.map((value, index) => (
                            value &&
                            <div
                              tabIndex="0"
                              key={index}
                              onKeyDown={(e) => {
                                handleSupplier(e, index);
                              }}
                              onClick={(e) => {
                                handleSupplier(e, index);
                              }}
                              className="pOrder-suppliers-dropdownMenu"
                              style={{
                                borderBottom: "1px solid black",
                                padding: ".4rem",
                              }}
                            >
                              {value}
                            </div>
                          ))}
                        </div>
                      )}
                    </Col>
                    <Col lg={6} />
                  </Row>
                </Col>
                <Col lg={4} sm={3} md={3}>
                  <Link style={{ textDecoration: "none" }} to="/purchase">
                    <ButtonComponent
                      border="1px solid #0785D2"
                      color="#0785D2"
                      background="white"
                    >
                      <Col style={{ gap: "5px" }} className={flexCenter}>
                        <span onClick={() =>{ setDraftData(null);dispatch(PoSlice.RESET_STATE())}}>
                          Create New Po
                        </span>
                        <Addchart />
                      </Col>
                    </ButtonComponent>
                  </Link>
                </Col>
              </Row>

              <Row className="p-1.5">
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div className={flexCenter}>
                    <Ag filterSup={filterSup} />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
    // </Sidebar>
  );
}
