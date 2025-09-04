import React from "react";
import "./customer_profile.css";
import Customer_Topbar from "../../../components/Customer_component/Customer_Topbar";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
export default function Customer_profile() {
  const [profile, setprofile] = useState({});
  const [profileEdit, setProfileEdit] = useState(false);
  const axiosPrivate=useAxiosPrivate()
  useEffect(() => {
 
    axiosPrivate
      .post(`/customer/customerprofile`)
      .then((res) => {
        console.log("response==========>", res.data.data);
        setprofile(res.data.data);
      });
  }, []);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setprofile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setProfileEdit(true);
  };

  const handleConfirm = () => {
    const data = {
      ...profile,
    };
    if (profileEdit) {
      axiosPrivate
        .post(`/customer/customerprofileedit`,data)
        .then((respp) => {
          console.log("respp", respp.data.message);
          if (respp.data.success) {
            toast.success(`${respp.data.message}`, {
              position: "top-right",
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

    setProfileEdit(false);
  };

  const handleEditChanges = (event) => {
    if (profileEdit) {
      const { name, value } = event.target;
      setprofile((prevProfile) => ({
        ...prevProfile,
        [name]: value,
      }));
    }
  };

  return (
    <>
      <ToastContainer />
      <Customer_Topbar />

      <div id="cr_prfl_scnd_sec">
        <div id="cr_prfl_fnt">
          <p id="cr_prfl_fnt1">Your Profile</p>
        </div>
        <div id="cr_prfl_inr_sec">
          <div id="cr_prfl_inr_sec2">
            <div id="cr_prfl_inr_sec_align">
              <div id="cr_prf_hei_adjst"></div>
              <div id="cr_prfl_inr_box">
                <div id="cr_prfl_inr_box2">
                  <div id="cr_prfl_inr_box3">
                    <div style={{ height: "20px" }}></div>
                    <form>
                      <div className="form-group row">
                        <div id="flx">
                          <label
                            id="cr_prfl_inr_fonts"
                            htmlFor="colFormLabelSm"
                            className="col-sm-4 col-form-label col-form-label-sm"
                          >
                            Trade Name :
                          </label>
                          <div className="col-sm-8">
                            <p id="cr_prfl_inr_fonts">{profile?.trade_name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <div id="flx">
                          <label
                            id="cr_prfl_inr_fonts"
                            htmlFor="colFormLabelSm"
                            className="col-sm-4 col-form-label col-form-label-sm"
                          >
                            GSTIN :
                          </label>
                          <div className="col-sm-8">
                            <p id="cr_prfl_inr_fonts">{profile?.gst_num}</p>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div id="flx">
                          <label
                            id="cr_prfl_inr_fonts"
                            htmlFor="colFormLabelSm"
                            className="col-sm-4 col-form-label col-form-label-sm"
                          >
                            E-mail :
                          </label>
                          <div className="col-sm-8">
                            <p id="cr_prfl_inr_fonts">{profile?.email}</p>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <br />
              </div>
              <br />
              <div id="cr_prfl_inr_box">
                <div id="cr_prfl_inr_box4">
                  <div id="cr_prfl_inr_box3">
                    <div style={{ height: "20px" }}></div>
                    <form>
                      <div className="form-group row">
                        <label
                          id="cr_prfl_inr_fonts"
                          htmlFor="colFormLabelSm"
                          className="col-sm-4 col-form-label col-form-label-sm"
                        >
                          Registered Name :
                        </label>
                        <div className="col-sm-8">
                          <input
                            type="text"
                            class="form-control"
                            style={{
                              border: profileEdit
                                ? "3px solid rgba(30, 169, 123, 0.637)"
                                : "",
                            }}
                            id="inputPassword"
                            name="user_name"
                            value={profile?.user_name}
                            onChange={handleEditChanges}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          id="cr_prfl_inr_fonts"
                          htmlFor="colFormLabelSm"
                          className="col-sm-4 col-form-label col-form-label-sm"
                        >
                          Mobile Number :
                        </label>
                        <div className="col-sm-8">
                          <input
                            style={{
                              border: profileEdit
                                ? "3px solid rgba(30, 169, 123, 0.637)"
                                : "",
                            }}
                            type="text"
                            class="form-control"
                            id="inputPassword"
                            name="mobile"
                            value={profile?.mobile}
                            onChange={handleEditChanges}
                          />
                        </div>
                      </div>
                      <br />

                      <div className="form-group row">
                        <label
                          id="cr_prfl_inr_fonts"
                          htmlFor="colFormLabelSm"
                          className="col-sm-4 col-form-label col-form-label-sm"
                        >
                          Product Type :
                        </label>

                        <div className="col-sm-8">
                          <div id="cstmr_radio_btn">
                            {!profileEdit ? (
                              <>
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions1"
                                    id="inlineRadio3"
                                    defaultValue="option1"
                                    checked={
                                      profile?.product_type?.prod1 === "bikes" ||
                                      profile?.product_type?.prod2 === "bikes" ||
                                      profile?.product_type?.prod3 === "bikes"
                                        ? "checked"
                                        : ""
                                    }

                                    // value="baby"
                                    // checked={selectedOption === 'baby' || prod2 === 'baby'}
                                    // onChange={handleRadioChange}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="inlineRadio3"
                                  >
                                    Bikes
                                  </label>
                                </div>
                                <div className="form-check form-check-inline">
                                  <input
                                    style={{
                                      border: profileEdit
                                        ? "1px solid #59ff00"
                                        : "",
                                    }}
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions2"
                                    id="inlineRadio3"
                                    defaultValue="option2"
                                    checked={
                                      profile?.product_type?.prod1 === "toys" ||
                                      profile?.product_type?.prod2 === "toys" ||
                                      profile?.product_type?.prod3 === "toys"
                                        ? "checked"
                                        : ""
                                    }
                                    // value="toys"
                                    // checked={selectedOption === 'toys' || prod1 === 'toys'}
                                    // onChange={handleRadioChange}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="inlineRadio2"
                                  >
                                    Toys
                                  </label>
                                </div>
                                <div className="form-check form-check-inline">
                                  <input
                                    style={{
                                      border: profileEdit
                                        ? "1px solid #59ff00"
                                        : "",
                                    }}
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions3"
                                    id="inlineRadio3"
                                    defaultValue="option3"
                                    checked={
                                      profile?.product_type?.prod1 === "baby" ||
                                      profile?.product_type?.prod2 === "baby" ||
                                      profile?.product_type?.prod3 === "baby"
                                        ? "checked"
                                        : ""
                                    }

                                    // value="baby"
                                    // checked={selectedOption === 'baby' || prod2 === 'baby'}
                                    // onChange={handleRadioChange}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="inlineRadio3"
                                  >
                                    Baby
                                  </label>
                                </div>
                              </>
                            ) : (
                              ""
                            )}
                            {profileEdit ? (
                              <>
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    id="inlineRadio3"
                                    defaultValue="option1"
                                    // value="baby"
                                    // checked={selectedOption === 'baby' || prod2 === 'baby'}
                                    // onChange={handleRadioChange}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="inlineRadio3"
                                  >
                                    Bikes
                                  </label>
                                </div>
                                <div className="form-check form-check-inline">
                                  <input
                                    style={{
                                      border: profileEdit
                                        ? "1px solid #59ff00"
                                        : "",
                                    }}
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    id="inlineRadio3"
                                    defaultValue="option2"
                                    // value="toys"
                                    // checked={selectedOption === 'toys' || prod1 === 'toys'}
                                    // onChange={handleRadioChange}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="inlineRadio2"
                                  >
                                    Toys
                                  </label>
                                </div>
                                <div className="form-check form-check-inline">
                                  <input
                                    style={{
                                      border: profileEdit
                                        ? "1px solid #59ff00"
                                        : "",
                                    }}
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    id="inlineRadio3"
                                    defaultValue="option3"

                                    // value="baby"
                                    // checked={selectedOption === 'baby' || prod2 === 'baby'}
                                    // onChange={handleRadioChange}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="inlineRadio3"
                                  >
                                    Baby
                                  </label>
                                </div>
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          id="cr_prfl_inr_fonts"
                          htmlFor="colFormLabelSm"
                          className="col-sm-4 col-form-label col-form-label-sm"
                        >
                          Website :
                        </label>
                        <div className="col-sm-8">
                          <input
                            style={{
                              border: profileEdit
                                ? "3px solid rgba(30, 169, 123, 0.637)"
                                : "",
                            }}
                            type="text"
                            class="form-control"
                            id="inputPassword"
                            name="website"
                            value={profile?.website}
                            onChange={handleEditChanges}
                          />{" "}
                        </div>
                      </div>

                      <div className="form-group row">
                        <label
                          id="cr_prfl_inr_fonts"
                          htmlFor="colFormLabelSm"
                          className="col-sm-4 col-form-label col-form-label-sm"
                        >
                          Landline :
                        </label>
                        <div className="col-sm-8">
                          <input
                            style={{
                              border: profileEdit
                                ? "3px solid rgba(30, 169, 123, 0.637)"
                                : "",
                            }}
                            type="text"
                            class="form-control"
                            id="inputPassword"
                            name="landline"
                            value={profile?.landline}
                            onChange={handleEditChanges}
                          />
                        </div>
                      </div>
                    </form>
                    <div style={{ height: "10px" }}></div>
                    <div id="cr_prfl_inr_btn_alihgn">
                      <button id="cr_prfl_inr_btns" onClick={handleEdit}>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
                <br />
              </div>
            </div>
            <div id="cr_prfl_inr_sec_align">
              <div style={{ height: "6rem" }}></div>
              <div id="cr_prfl_inr_box">
                <div id="cr_prfl_inr_box6">
                  <div id="cr_prfl_inr_box3">
                    <div style={{ height: "10px" }}></div>
                    <div>
                      <h4>Address</h4>
                    </div>
                    <div style={{ height: "20px" }}></div>
                    <form>
                      <div className="form-group row">
                        <div id="flx">
                          <label
                            id="cr_prfl_inr_fonts"
                            htmlFor="colFormLabelSm"
                            className="col-sm-4 col-form-label col-form-label-sm"
                          >
                            Building :
                          </label>
                          <div className="col-sm-8">
                            <p id="cr_prfl_inr_fonts">
                              {profile?.address?.building}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div id="flx">
                          <label
                            id="cr_prfl_inr_fonts"
                            htmlFor="colFormLabelSm"
                            className="col-sm-4 col-form-label col-form-label-sm"
                          >
                            Address :
                          </label>
                          <div className="col-sm-8">
                            <p id="cr_prfl_inr_fonts">
                              {profile?.address?.address}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div id="flx">
                          <label
                            id="cr_prfl_inr_fonts"
                            htmlFor="colFormLabelSm"
                            className="col-sm-4 col-form-label col-form-label-sm"
                          >
                            District :
                          </label>
                          <div className="col-sm-8">
                            <p id="cr_prfl_inr_fonts">
                              {profile?.address?.district}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div id="flx">
                          <label
                            id="cr_prfl_inr_fonts"
                            htmlFor="colFormLabelSm"
                            className="col-sm-4 col-form-label col-form-label-sm"
                          >
                            State :
                          </label>
                          <div className="col-sm-8">
                            <p
                              style={{ textAlign: "start" }}
                              id="cr_prfl_inr_fonts"
                            >
                              {profile?.address?.state}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div id="flx">
                          <label
                            id="cr_prfl_inr_fonts"
                            htmlFor="colFormLabelSm"
                            className="col-sm-4 col-form-label col-form-label-sm"
                          >
                            Pincode :
                          </label>
                          <div className="col-sm-8">
                            <p id="cr_prfl_inr_fonts">
                              {profile?.address?.pincode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <br />
              {/* <div id='cr_prfl_inr_box'>
                                <div id='cr_prfl_inr_box7'>
                                    <div id='cr_prfl_inr_box3'>
                                        <form>
                                            <div style={{ height: "10px" }}></div>
                                            <div>
                                                <h4>Banking Details</h4>
                                            </div>
                                            <div style={{ height: "20px" }}></div>
                                            <div className="form-group row">
                                                <label
                                                    style={{ textAlign: "start", fontSize: "1.1rem" }}
                                                    htmlFor="colFormLabelSm"
                                                    className="col-sm-4 col-form-label col-form-label-sm"
                                                >
                                                    Bank Ac No :
                                                </label>
                                                <div className="col-sm-8">
                                                    <input type="text" class="form-control" id="inputPassword" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label
                                                    style={{ textAlign: "start", fontSize: "1.1rem" }}
                                                    htmlFor="colFormLabelSm"
                                                    className="col-sm-4 col-form-label col-form-label-sm"
                                                >
                                                    IFSC Code :
                                                </label>
                                                <div className="col-sm-8">
                                                    <input type="text" class="form-control" id="inputPassword" />

                                                </div>
                                            </div>
                                        </form>
                                        <div style={{ height: "10px" }}></div>
                                        <div id='cr_prfl_inr_btn_alihgn'>
                                            <button id='cr_prfl_inr_btns'>Edit</button>

                                        </div>
                                    </div>
                                    </div>
                                </div> */}
              <div style={{ height: "30px" }}></div>
              <div id="cr_prfl_inr_btn2">
                <button class="cta" onClick={handleConfirm}>
                  <span>Confirm</span>
                  <svg viewBox="0 0 13 10" height="10px" width="15px">
                    <path d="M1,5 L11,5"></path>
                    <polyline points="8 1 12 5 8 9"></polyline>
                  </svg>
                </button>
                <div style={{ width: "50px" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
