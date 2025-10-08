import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import CustomerProfileTab from "./Customer_profileview";
import "../../../Customer/Customer_profile/customer_profile.css";
import Sidebar from "../../../../components/admin components/Sidebar";
import Categorytopbar from "../../../../components/admin components/Categorytopbar";
import TransactionTab from "./TransactionTab";


export default function CustomerProfileWrapper() {
    const [activeTab, setActiveTab] = useState("profile");
    const [profileData, setProfileData] = useState({});
    const [prodTypesArray, setProdTypesArray] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();

    useEffect(() => {
        if (!location.state?.user_id) return;

        const data = { logged_id: location.state.user_id };
console.log("wr data",data);

        axiosPrivate.post(`/customer/customerprofile`, data)
            .then((res) => {
                const profData = res.data.data;
                setProfileData(profData);

                // Prepare prodTypesArray
                const prodArr = [];
                const prodTypes = profData.product_type || {};
                const types = ["bikes", "toys", "baby"];
                types.forEach((t) => {
                    if (
                        prodTypes.prod1 === t ||
                        prodTypes.prod2 === t ||
                        prodTypes.prod3 === t
                    ) {
                        prodArr.push(t);
                    }
                });
                setProdTypesArray(prodArr);
            })
            .catch((err) => {
                console.error("Error fetching customer profile:", err);
            });
    }, [location.state]);
console.log("profile data",profileData);

    return (
        <Sidebar>
            <Row>
                <Col lg={12}>
                    <Categorytopbar />
                    <Row className="p-1.5 mb-0">
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
                                Customer Details
                            </span>
                        </Col>
                    </Row>
                    <ToastContainer />
                    <div id="cr_prfl_scnd_sec">
                        {/* Tabs */}
                        <Row
                            className="tab-bar mt-2"
                            style={{ marginLeft: "2px", cursor: "pointer", fontSize: "16px" }}
                        >
                            {["profile", "transaction", "service", "feedback"].map((tab) => (
                                <Col
                                    key={tab}
                                    lg={3}
                                    variant="outline-dark"
                                    className={activeTab === tab ? "active" : ""}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        width: "150px",
                                        textAlign: "center",
                                        textTransform: "capitalize",
                                    }}
                                >
                                    {tab}
                                </Col>
                            ))}
                        </Row>

                        {/* Tab Content */}
                        <div id="cr_prfl_inr_sec">
                            {activeTab === "profile" && (
                                <CustomerProfileTab
                                    profileData={profileData}
                                    setProfileData={setProfileData}
                                    prodTypesArray={prodTypesArray}
                                    setProdTypesArray={setProdTypesArray}
                                />
                            )}

                            {activeTab === "transaction" && (
                                <TransactionTab
                                    userId={profileData?.id || location.state?.user_id}
                                    userType="CUS"
                                />
                            )}


                            {activeTab === "service" && (
                                <div style={{ padding: "2rem" }}>
                                    🧰 Service records will appear here.
                                </div>
                            )}

                            {activeTab === "feedback" && (
                                <div style={{ padding: "2rem" }}>
                                    💬 Customer feedback will appear here.
                                </div>
                            )}
                        </div>
                    </div>

                </Col>
            </Row>
        </Sidebar>
    );
}
