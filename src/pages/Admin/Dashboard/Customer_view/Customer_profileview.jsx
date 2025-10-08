import React, { useState } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import "./customer_profile_layout.css";

export default function CustomerProfileTab({
  profileData,
  setProfileData,
  prodTypesArray,
  setProdTypesArray,
}) {
  const [profileEdit, setProfileEdit] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  if (!profileData || Object.keys(profileData).length === 0) {
    return <div style={{ padding: "2rem" }}>Loading Profile..</div>;
  }

  const handleEdit = () => setProfileEdit(true);

  const handleConfirm = () => {
    let newProdTypeObj = {};
    for (let i = 0; i < prodTypesArray.length; i++) {
      newProdTypeObj[`prod${i + 1}`] = prodTypesArray[i];
    }

    const data = {
      ...profileData,
      product_type: newProdTypeObj,
    };

    axiosPrivate
      .post(`/customer/customerprofileedit`, data)
      .then((respp) => {
        if (respp.data.success) {
          toast.success(respp.data.message, { position: "top-right" });
          setProfileEdit(false);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleEditChanges = (event) => {
    if (!profileEdit) return;
    const { name, value } = event.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProdTypeChanges = (productType) => {
    const clonedProductsArray = [...prodTypesArray];
    const isIncluded = prodTypesArray.includes(productType);

    if (!isIncluded) {
      clonedProductsArray.push(productType);
    } else {
      const indexOfProdType = clonedProductsArray.indexOf(productType);
      clonedProductsArray.splice(indexOfProdType, 1);
    }
    setProdTypesArray(clonedProductsArray);
  };

  return (
    <div id="cp_tab_container">
      <div id="cp_tab_inner">
        <div id="cp_tab_flex">
          {/* Left Column */}
          <div className="cp_left_column">
            {/* Top Profile Info */}
            <div className="cp_box cp_box_top">
              <form>
                <div className="cp_form_row">
                  <label className="cp_label">Trade Name :</label>
                  <p className="cp_text">{profileData?.trade_name}</p>
                </div>
                <div className="cp_form_row">
                  <label className="cp_label">GSTIN :</label>
                  <p className="cp_text">{profileData?.gst_num}</p>
                </div>
                <div className="cp_form_row">
                  <label className="cp_label">E-mail :</label>
                  <p className="cp_text">{profileData?.email}</p>
                </div>
              </form>
            </div>

            {/* Editable Profile Info */}
            <div className="cp_box cp_box_bottom">
              <form>
                <div className="cp_form_row">
                  <label className="cp_label">Registered Name :</label>
                  <input
                    type="text"
                    className="cp_input"
                    name="user_name"
                    value={profileData?.user_name}
                    onChange={handleEditChanges}
                    disabled={!profileEdit}
                  />
                </div>

                <div className="cp_form_row">
                  <label className="cp_label">Mobile Number :</label>
                  <input
                    type="number"
                    className="cp_input"
                    name="mobile"
                    value={profileData?.mobile}
                    onChange={handleEditChanges}
                    disabled={!profileEdit}
                  />
                </div>

                <div className="cp_form_row">
                  <label className="cp_label">Product Type :</label>
                  <div className="cp_checkbox_group">
                    {["bikes", "toys", "baby"].map((type) => (
                      <div className="cp_checkbox" key={type}>
                        <input
                          type="checkbox"
                          onChange={() => handleProdTypeChanges(type)}
                          checked={prodTypesArray.includes(type)}
                          disabled={!profileEdit}
                        />
                        <label>{type}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cp_form_row">
                  <label className="cp_label">Website :</label>
                  <input
                    type="text"
                    className="cp_input"
                    name="website"
                    value={profileData?.website}
                    onChange={handleEditChanges}
                    disabled={!profileEdit}
                  />
                </div>

                <div className="cp_form_row">
                  <label className="cp_label">Landline :</label>
                  <input
                    type="number"
                    className="cp_input"
                    name="landline"
                    value={profileData?.landline}
                    onChange={handleEditChanges}
                    disabled={!profileEdit}
                  />
                </div>
              </form>

              <div className="cp_button_row">
                <button className="cp_btn_edit" onClick={handleEdit}>
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="cp_right_column">
            <div className="cp_box cp_box_address">
              <h4>Address</h4>
              <form>
                <div className="cp_form_row">
                  <label className="cp_label">Building :</label>
                  <p className="cp_text">{profileData?.address?.building}</p>
                </div>
                <div className="cp_form_row">
                  <label className="cp_label">Address :</label>
                  <p className="cp_text">{profileData?.address?.address}</p>
                </div>
                <div className="cp_form_row">
                  <label className="cp_label">District :</label>
                  <p className="cp_text">{profileData?.address?.district}</p>
                </div>
                <div className="cp_form_row">
                  <label className="cp_label">State :</label>
                  <p className="cp_text">{profileData?.address?.state}</p>
                </div>
                <div className="cp_form_row">
                  <label className="cp_label">Pincode :</label>
                  <p className="cp_text">{profileData?.address?.pincode}</p>
                </div>
              </form>

              <div className="cp_button_row cp_confirm_row">
                <button className="cp_btn_confirm" onClick={handleConfirm}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
