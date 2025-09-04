import {
  React,
  useContext,
  useState,
  useEffect,
  useRef,
  useReducer,
} from "react";
import Sidebar from "../../../../components/admin components/Sidebar";
import Products from "./Products";
import { Row, Col, Container, Form } from "react-bootstrap";
import { selectedTypeContext } from "../../../../Contexts/SelectedTypeContext";
import Topbar from "../../../../components/admin components/Topbar";
import useAuth from "../../../../hooks/useAuth";
import axios from "axios";
import {
  productDeatilsReducer,
  INITIAL_STATE,
} from "../../../../components/topBarReducer";
import Categorytopbar from "../../../../components/admin components/Categorytopbar";
import { prismaBaseApi } from "../../../../config";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
export default function AddproductsWrapper() {

  const [productType, setProductType] = useState("");
  const { auth } = useAuth();
  const axiosPrivate=useAxiosPrivate()
  const [state, dispatch] = useReducer(productDeatilsReducer, INITIAL_STATE);
  const [prodDatas, setProdDatas] = useState({});
  console.log({state})
  useEffect(() => {
    if (auth.userType === "ADM") {
      const handleBikeData = async () => {
        const division = auth?.division;
        setProductType(division);
        const data = {
          main_type: division,
        };
        await axiosPrivate
          .post(`/product/categories`, data)
          .then((apiData) => {
            console.log(apiData);
            console.log(division);
            dispatch({ type: "Type", payload: division });

            dispatch({ type: "CATEGORY_SPECS", payload: apiData.data });
          })
          .catch((error) => {
            console.log(error, ">>>error");
          });
        await axiosPrivate
          .post(`/user/viewsup`, data)
          .then((apiData) => {
            const { data: supplierList } = apiData;
            console.log(supplierList);
            let arr = [];
            for (let i = 0; i < supplierList.length; i++) {
              const supplier_name = supplierList[i].trade_name;
              if (supplier_name) {
                arr.push(supplier_name);
              }
            }

            dispatch({ type: "SUPPLIERS", payload: arr });
          })
          .catch((error) => {
            console.log(error);
          });
        const brandBody = {
          prod_type: division,
        };
        await axiosPrivate
          .post(`/product/viewBrands`, brandBody)
          .then((brandRes) => {
            console.log(brandRes.data)
            let arr = [];
            for (let i = 0; i < brandRes.data.length; i++) {
              const brand_names = brandRes.data[i]?.brand_name;
              if (brand_names) {
                arr.push(brand_names);
              }
            }

            dispatch({ type: "BRANDS", payload: arr });
          });
      };
      handleBikeData();
    }
  }, []);

  const handleApiData = async (data) => {
    if (data) {
      setProdDatas(data);
    }
  };
  return (
    <>
      <Sidebar type="product">
        <Row style={{ width: "100%" }}>
          {/* ------------------------------------------------------------------ */}
          {/* Right Side */}
          <Col
            lg={12}
            sm={12}
            md={12}
            className="products-addproducts-rightContainer"
          >
            <div
              className="products-addproducts"
              // style={{ paddingleft: "5rem" }}
            >
              {auth.userType === "SU" ? (
                <Topbar
                  handleApi={handleApiData}
                  productType={setProductType}
                  isActive={true}
                />
              ) : (
                <Categorytopbar />
              )}
              <Products prodData={auth.userType==="ADM" ?state: prodDatas} productType={productType} />
            </div>
          </Col>
        </Row>
      </Sidebar>
    </>
  );
}
