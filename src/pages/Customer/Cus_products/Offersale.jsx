import React, { useEffect, useState, useContext, Suspense } from "react";
import axios from "axios";
import { prismaBaseApi } from "../../../config";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { ToastContainer, toast } from "react-toastify";
// import required modules
import { Keyboard, Pagination, Autoplay } from "swiper";
import ShimmerCmpnt from "../../../components/Customer_component/ShimmerCmpnt";
import { useNavigate } from "react-router-dom";
import Customer_Topbar from "../../../components/Customer_component/Customer_Topbar";
import { includes } from "lodash";
import {
    CDropdown,
    CDropdownDivider,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
} from "@coreui/react";
import { useDispatch } from "react-redux";
import { trflseSetting } from "../../../Redux/SliceRedux";
// import OfferBanner from "../../../components/Customer_component/OfferBanner";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
export default function Offersale({ campaignId }) {
    // console.log("user", user);
    const [wishlisttrue, setwishlisttrue] = useState({
        id: "",
        trueflse: false,
    });
    console.log(campaignId)
    const [wishlist, setwishlist] = useState([]);
    const [qtystate, setqtystate] = useState(1);

    const [trfls, settrfls] = useState(false);
    const [wishlistedid, setwishlistedid] = useState([]);
    const [Product_type, setProduct_type] = useState([]);
    const [TempSoringList, setTempSoringList] = useState([]);

    const [Product_category, setProduct_category] = useState([]);
    const [Product_subcategory, setProduct_subcategory] = useState([]);
    const [storingAll, setstoringAll] = useState({
        main_type: "",
        category: "",
        sub_category: "",
    });

    const [isHovered, setIsHovered] = useState({
        wishlist: false,
        cart: false,
        prdct_id: "",
    });
    const axiosPrivate = useAxiosPrivate()
    const [product_listing_dt, setproduct_listing_dt] = useState([]);
    const [cartClicking, setcartClick] = useState({
        cartUpdate: false,
        product_id: "",
    });
    const dispatch = useDispatch();
    useEffect(() => {

        axiosPrivate.post(`campaign/singlecampaign`, { campaign_id: campaignId }).then((res) => {
            // console.log("res====>", res.data);
            console.log(res)
            setproduct_listing_dt(res.data.data);
            setTempSoringList(res.data.data);
            if (res.data.data) {
                settrfls(true);
            }
        });
    }, [wishlisttrue]);
    // console.log(trfls);
    const navigate = useNavigate();
    const hovered = (event, id) => {
        // console.log(event);//
        // console.log(id);
        if (event == "wishlist") {
            setIsHovered({ wishlist: true, cart: false, prdct_id: id });
        } else if (event == "cart") {
            setIsHovered({ cart: true, wishlist: false, prdct_id: id });
        }
    };
    const leave = (event) => {
        // console.log(event);
        if (event == "wishlist") {
            setIsHovered({ wishlist: false, cart: false });
        } else if (event == "cart") {
            setIsHovered({ cart: false, wishlist: false });
        }
    };

    const clck = (get, id) => {
        if (get == "cart") {
            cartClicking.cartUpdate == false
                ? setcartClick({ cartUpdate: true, product_id: id })
                : setcartClick({ cartUpdate: false, product_id: id });
        }
    };
    const tempfn = async (id) => {
        if (wishlisttrue.trueflse) {
            setwishlisttrue({ trueflse: false });
        } else {
            setwishlisttrue({ trueflse: true });
        }

        if (wishlistedid.includes(id)) {
            const index = wishlistedid.indexOf(id);
            const updatedWishlist = [
                ...wishlistedid.slice(0, index),
                ...wishlistedid.slice(index + 1),
            ];
            // console.log(updatedWishlist);
            setwishlistedid(updatedWishlist);
            return wislistdelete(id);
        } else {
            setwishlistedid((previous) => [...previous, id]);
            return wislistcall(id);
        }
    };


    const wislistcall = (id) => {
        const wishdata = {
            prod_id: id,
        };
        axiosPrivate.post(`/customer/wishlist`, wishdata).then((res) => {
            dispatch(trflseSetting());
        });
    };
    useEffect(() => {
        axiosPrivate
            .get(`/customer/getwishlist`)
            .then((res) => {
                setwishlist(res.data.data);
            });
    }, []);
    useEffect(() => {
        // console.log("hiiiiiiiiiiiiiiiii");
        for (let i = 0; i < product_listing_dt.length; i++) {
            for (let j = 0; j < wishlist.length; j++) {
                if (
                    product_listing_dt[i].product_id === wishlist[j].product_id &&
                    !wishlistedid.includes(wishlist[j].product_id)
                ) {
                    // console.log(product_listing_dt[i].product_id);
                    setwishlistedid((prevWishlistedIds) => [
                        ...prevWishlistedIds,
                        product_listing_dt[i].product_id,
                    ]);
                    break;
                }
            }
        }
    }, [wishlist]);
    const wislistdelete = (id) => {
        const removedata = {
            prod_id: id,
        };
        axiosPrivate
            .post(`/customer/removewishlist`, removedata)
            .then((res) => {
                // console.log("responseremovee==========>", res);
                dispatch(trflseSetting());
                if (wishlisttrue.trueflse) {
                    setwishlisttrue({ trueflse: false });
                } else {
                    setwishlisttrue({ trueflse: true });
                }
            });
    };
    // console.log(wishlistedid);
    const addtocart = (id) => {
        const data = {
            prod_id: id,
            quantity: qtystate,
        };
        axiosPrivate
            .post(`/customer/addtocart`, data)
            .then((res) => {
                // console.log(res);
                if (res.data.success) {
                    setqtystate(1);
                    setcartClick({ cartUpdate: false });
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
                    dispatch(trflseSetting());
                }
            })
            .catch((error) => {
                console.log("error====>", error.response.data);
                toast.warning(`${error.response.data.message}`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });
    };

    useEffect(() => {

        axiosPrivate.post(`/product/typelist`).then((res) => {
            setProduct_type(res.data);
            const prodTypes = res.data;
            // console.log(prodTypes);
            if (prodTypes.length > 1) {
            } else {
                // console.log(res.data[0]);
                setstoringAll({ ...storingAll, main_type: res.data[0] });
                // console.log("storingAll>>>", res);
                return Product_category_dt(res.data[0]);
            }
            setProduct_type(res.data);
        });
    }, []);
    const type_filter = (type) => {
        // console.log("type>>>>>", type);
        setstoringAll({ ...storingAll, main_type: type });
        const tempfilter = TempSoringList.filter(
            (filter) => filter.product_type == type
        );
        setproduct_listing_dt(tempfilter);
        return Product_category_dt(type);
    };
    // console.log("TempSoringList>>>", TempSoringList);
    const Product_category_dt = (type) => {
        // console.log(Product_type.length);
        // console.log("storingAll.main_type====>", type);
        const data = {
            type: type,
        };
        axiosPrivate.post(`/category`, data).then((res) => {
            // console.log("res==>", res);
            setProduct_category(res.data);
        });
    };
    // console.log("Product_category===>", Product_category);
    const category_filter = (categorys) => {
        // console.log("categorys>>>", categorys);
        const category = categorys;
        setstoringAll({ ...storingAll, category: category });
        const tempfilter = TempSoringList.filter(
            (filter) =>
                filter.product_sub_type == categorys &&
                filter.product_type == storingAll.main_type
        );
        setproduct_listing_dt(tempfilter);
        if (tempfilter) {
            return subspecCalling(categorys);
        }
    };
    const Sub_category_filter = (sub_categorys) => {
        const sub_category = sub_categorys;
        setstoringAll({ ...storingAll, sub_category: sub_category });
        const tempfilter = TempSoringList.filter(
            (filter) =>
                filter.prod_subtype2 == sub_category &&
                filter.product_sub_type == storingAll.category &&
                filter.product_type == storingAll.main_type
        );
        setproduct_listing_dt(tempfilter);
    };
    // console.log("product_listing_dt>>>>>", product_listing_dt);
    const subspecCalling = (categorys) => {
        const data = {
            main_type: storingAll.main_type,
            category: categorys,
        };
        if (product_listing_dt.length > 0) {
            // console.log("data=>>>>>", data);
            axiosPrivate.post(`/category/subspec`, data).then((res) => {
                // console.log("res>>>", res);
                setProduct_subcategory(res.data.subCategories);
            });
        }
    };
    // console.log(storingAll);

    return (
        <>
            <div className="p-4">
                <ToastContainer />
                <Customer_Topbar />
                {/* <div
                    style={{
                        // border: "1px solid #e7e5e4",
                        height: "380px",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ width: "100%", height: "350px" }}>
                        <OfferBanner clickedId={campaignId} />
                    </div>
                </div> */}
                {trfls == false ? (
                    <ShimmerCmpnt />
                ) : (
                    <>
                        <div id="list_type_top_sec" style={{ marginTop: "1rem" }}>
                            <div id="list_type_top_seccond">
                                {Product_type.length > 1 ? (
                                    <div>
                                        <CDropdown
                                            id="list_type_top_drop"
                                            style={{
                                                height: "30px",
                                                backgroundColor: "transparent",
                                                border: "1px solid black",
                                            }}
                                            variant="btn-group"
                                        >
                                            <CDropdownToggle
                                                id="list_type_styling"
                                                color="black"
                                                size="sm"
                                            >
                                                {storingAll.main_type ? storingAll.main_type : "Type"}
                                            </CDropdownToggle>
                                            <CDropdownMenu>
                                                {Product_type.map((types) => (
                                                    <CDropdownItem
                                                        key={types}
                                                        onClick={() => {
                                                            type_filter(types);
                                                        }}
                                                        href="#"
                                                    >
                                                        {types}
                                                    </CDropdownItem>
                                                ))}
                                            </CDropdownMenu>
                                        </CDropdown>
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div style={{ width: "10px", height: "10px" }}></div>
                                <div>
                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <div class="dropdown-menu" id="product_listing_sec_drop">
                                                {Product_category.map((category, index) => (
                                                    <a
                                                        class="dropdown-item"
                                                        key={category}
                                                        onClick={() => {
                                                            category_filter(category);
                                                        }}
                                                        href="#"
                                                    >
                                                        {category}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                        <input
                                            autoComplete="off"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                            type="text"
                                            class="form-control form-control-prod_list"
                                            aria-label="Text input with dropdown button"
                                            style={{ height: "30px" }}
                                            value={storingAll?.category}
                                            id="list_type_styling"
                                            onChange={(e) => {
                                                setstoringAll({
                                                    ...storingAll,
                                                    category: e.target.value,
                                                });
                                                const query = e.target.value.toLowerCase();
                                                const filteredData = Product_category.filter((data) =>
                                                    data.toLowerCase().includes(query)
                                                );
                                                const remainingData = Product_category.filter(
                                                    (data) => !data.toLowerCase().includes(query)
                                                );
                                                setProduct_category([
                                                    ...filteredData,
                                                    ...remainingData,
                                                ]);
                                            }}
                                            placeholder={"Category"}
                                        />
                                    </div>
                                </div>
                                <div style={{ width: "10px", height: "10px" }}></div>
                                <div>
                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <div class="dropdown-menu" id="product_listing_sec_drop">
                                                {Product_subcategory.map((sub_category) => (
                                                    <>
                                                        <a
                                                            class="dropdown-item"
                                                            key={sub_category}
                                                            onClick={() => {
                                                                Sub_category_filter(sub_category);
                                                            }}
                                                            href="#"
                                                        >
                                                            {sub_category}
                                                        </a>
                                                    </>
                                                ))}
                                            </div>
                                        </div>
                                        <input
                                            autoComplete="off"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                            type="text"
                                            class="form-control form-control-prod_list"
                                            aria-label="Text input with dropdown button"
                                            style={{ height: "30px" }}
                                            value={storingAll?.sub_category}
                                            onChange={(e) => {
                                                setstoringAll({
                                                    ...storingAll,
                                                    sub_category: e.target.value,
                                                });
                                                const query = e.target.value.toLowerCase();
                                                const filteredData = Product_subcategory.filter(
                                                    (data) => data.toLowerCase().includes(query)
                                                );
                                                const remainingData = Product_subcategory.filter(
                                                    (data) => !data.toLowerCase().includes(query)
                                                );
                                                setProduct_subcategory([
                                                    ...filteredData,
                                                    ...remainingData,
                                                ]);
                                            }}
                                            placeholder="Sub category"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ height: "10px" }}></div>
                        <div
                            className="row"
                            id="media_qry1"
                            style={{ width: "100%", margin: "00px 50px 00px 00px" }}
                        >
                            {product_listing_dt.map((dts, ind) => (
                                <div key={ind} className="col-sm-6">
                                    <div style={{ height: "97%" }}>
                                        <div id="list_cardstyle2">
                                            <div
                                                className="p-2"
                                                style={{ cursor: "pointer" }}
                                                id="list_cardstyle"
                                            >
                                                <div id="products_part">
                                                    <div style={{ height: "5%" }}></div>
                                                    <div id="products_part4">
                                                        <div
                                                            id="products_part2"
                                                            onClick={() => {
                                                                navigate("/product_detailed", {
                                                                    state: {
                                                                        data: dts.product_name,
                                                                        id: dts.product_id,
                                                                    },
                                                                });
                                                            }}
                                                        >
                                                            {/* <Suspense fallback={<div>Loading...</div>}> */}
                                                            <Swiper
                                                                slidesPerView={1}
                                                                spaceBetween={30}
                                                                keyboard={{
                                                                    enabled: true,
                                                                }}
                                                                // autoplay={{
                                                                //   delay: 2500,
                                                                //   disableOnInteraction: false,
                                                                // }}
                                                                pagination={{
                                                                    clickable: true,
                                                                }}
                                                                modules={[Keyboard, Pagination, Autoplay]}
                                                                className="mySwiper"
                                                            >
                                                                <SwiperSlide>
                                                                    <img
                                                                        id="products_list"
                                                                        src={`${dts.image1_link}`}
                                                                        className="img-fluid rounded-start"
                                                                        alt="..."
                                                                    />
                                                                </SwiperSlide>
                                                                <SwiperSlide>
                                                                    <img
                                                                        id="products_list"
                                                                        src={`${dts.image2_link}`}
                                                                        className="img-fluid rounded-start"
                                                                        alt="..."
                                                                    />
                                                                </SwiperSlide>
                                                                <SwiperSlide>
                                                                    <img
                                                                        id="products_list"
                                                                        src={`${dts.image3_link}`}
                                                                        className="img-fluid rounded-start"
                                                                        alt="..."
                                                                    />
                                                                </SwiperSlide>
                                                            </Swiper>
                                                            {/* </Suspense> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "10px" }}></div>
                                                <div id="products_part2">
                                                    <div
                                                        id="media_qry5"
                                                        onClick={() => {
                                                            if (cartClicking.cartUpdate === false) {
                                                                navigate("/product_detailed", {
                                                                    state: {
                                                                        data: dts.product_name,
                                                                        id: dts.product_id,
                                                                    },
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <p id="products_brnd_font">{dts?.brand_name}</p>
                                                        <p id="products_dis_font">
                                                            Product : {dts?.product_name}
                                                        </p>
                                                        <p id="products_dis_font">
                                                            Trade name : {dts?.trade_name}
                                                        </p>
                                                        <div
                                                            id="products_dis_font_ali"
                                                            style={{
                                                                display: "flex",
                                                                height: "25px",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <p
                                                                id="products_dis_font"
                                                                style={{ textAlign: "start", height: "10px" }}
                                                            >
                                                                <span>Color family </span> :
                                                            </p>
                                                            &nbsp;
                                                            <div
                                                                style={{
                                                                    backgroundColor: `${dts.color_family}`,
                                                                    width: "20px",
                                                                    height: "20px",
                                                                    borderRadius: "5px",
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <br />
                                                        <div id="products_dis_flxincrmnt">
                                                            <div id="products_dis_flxincrmnt2">
                                                                <div id="mediaqry_align8">
                                                                    <p id="products_dis_font">
                                                                        Color : {dts?.color}
                                                                    </p>
                                                                </div>
                                                                {/* <div className="products_disBoxSet">as</div> */}

                                                                {cartClicking.cartUpdate == true &&
                                                                    cartClicking.product_id == dts.product_id ? (
                                                                    <div id="mediaqry_align8">
                                                                        <div id="products_dis_media_Q_align_qty">
                                                                            <div id="products_dis_media_Q">
                                                                                <button
                                                                                    id="products_dis_btn_size"
                                                                                    onClick={() => {
                                                                                        if (qtystate > 1) {
                                                                                            setqtystate(qtystate - 1);
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    -
                                                                                </button>
                                                                                <p id="products_dis_btn_size2">
                                                                                    {qtystate}
                                                                                </p>
                                                                                <button
                                                                                    id="products_dis_btn_size"
                                                                                    onClick={() => {
                                                                                        setqtystate(qtystate + 1);
                                                                                    }}
                                                                                >
                                                                                    +
                                                                                </button>
                                                                            </div>
                                                                            <div style={{ width: "20px" }}></div>
                                                                            <div
                                                                                onClick={() => {
                                                                                    addtocart(dts.product_id);
                                                                                }}
                                                                            >
                                                                                <DoneIcon
                                                                                    style={{
                                                                                        fontSize: "35px",
                                                                                        color: "green",
                                                                                        margin: "-30px 00px",
                                                                                        cursor: "pointer",
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </div>
                                                        </div>

                                                        <br />
                                                        <br />
                                                        <div id="products_dis_btn_adjst">
                                                            <div style={{ width: "20px" }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="products_part3">
                                                    <div style={{ height: "1rem" }}></div>
                                                    <div
                                                        onClick={() => {
                                                            tempfn(dts.product_id);
                                                        }}
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            onMouseEnter={() => {
                                                                hovered("wishlist", dts.product_id);
                                                            }}
                                                            onMouseLeave={() => {
                                                                leave("wishlist");
                                                            }}
                                                            style={{
                                                                color: wishlistedid.includes(dts.product_id)
                                                                    ? "red"
                                                                    : isHovered.wishlist == true &&
                                                                        isHovered.prdct_id == dts.product_id
                                                                        ? "red"
                                                                        : "#cbc8c8",
                                                                cursor: "pointer",
                                                            }}
                                                            width="25"
                                                            height="25"
                                                            fill="currentColor"
                                                            class="bi bi-heart-fill"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path
                                                                fill-rule="evenodd"
                                                                d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                                                            />
                                                        </svg>
                                                        {isHovered.wishlist == true &&
                                                            isHovered.prdct_id == dts.product_id &&
                                                            !wishlistedid.includes(dts.product_id) ? (
                                                            <div id="products_wish_list_hover">
                                                                <p>Add To wishlist</p>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                    <br />
                                                    <ShoppingCartCheckoutIcon
                                                        onClick={() => {
                                                            clck("cart", dts.product_id);
                                                            setqtystate(1);
                                                        }}
                                                        onMouseEnter={() => {
                                                            hovered("cart", dts.product_id);
                                                        }}
                                                        onMouseLeave={() => {
                                                            leave("cart");
                                                        }}
                                                        style={{
                                                            color: "blue",
                                                            cursor: "pointer",
                                                            height: "30px",
                                                            width: "30px",
                                                        }}
                                                    />
                                                    {isHovered.cart == true &&
                                                        isHovered.prdct_id == dts.product_id ? (
                                                        <div id="products_wish_list_hover1">
                                                            <p>Add To Cart</p>
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                    <br />
                                                    <br />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                </div>
                            ))}
                            <button id="prfile_sidebar_dwnld_btn8">
                                <div
                                    onClick={() => {
                                        navigate(-1);
                                    }}
                                    style={{ display: "flex" }}
                                >
                                    <CloseIcon style={{ height: "20px", margin: "4px" }} />
                                    <div style={{ width: "5px" }}></div>
                                    close
                                </div>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
