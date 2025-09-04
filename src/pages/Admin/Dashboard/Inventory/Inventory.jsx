import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import InventoryAg from "../../../../components/InventoryAg";
import Modal from "../../../../components/modal";

export default function Inventory() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    console.log("aa Selected Row", selectedRow);

  }, [selectedRow])


  return (
    <div>
      {/* <Sidebar type="inventory"> */}
      {/* // <div className="GoodsReceipt-container" style={{ fontFamily: "Poppins" }}> */}
      {/* //   <Row style={{ width: "100%" }}> */}
      {/* //     <Col sm={12} md={12} lg={12} xs={12}> */}
      {/* // </Col> */}
      {/* // </Row> */}
      {/* // </Sidebar> */}

      {/* <Topbar /> */}

      <Row className=" mb-1">
        <Col md={12} xs={12}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#00342E",
              borderRadius: "4px",
              color: "white",
            }}
          >
            Inventory
          </span>
        </Col>
      </Row>
      <Row className="p-4">
        <InventoryAg
          onOpenModal={(row) => {
            setSelectedRow(row);
            setIsModalOpen(true);
          }}
        />
      </Row>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedRow ? (
          <div
            style={{
              padding: "8px",
              // maxHeight: "80vh",
              // overflowY: "auto", // vertical scrollbar
              color: "rgb(0,52,46)", // font color
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "16px",
                color: "rgb(0,52,46)",
              }}
            >
              Product Details
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "16px",
              }}
            >
              {/* Product Name */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "4px", color: "rgb(0,52,46)" }}>
                  Product Name
                </label>
                <input
                  type="text"
                  value={selectedRow?.product_master?.product_name || ""}
                  readOnly
                  style={{ padding: "8px", borderRadius: "4px", border: "2px solid rgb(184,138,68)" }}
                />
              </div>

              {/* Brand */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "4px", color: "rgb(0,52,46)" }}>
                  Brand
                </label>
                <input
                  type="text"
                  value={selectedRow?.product_master?.brand?.brand_name || ""}
                  readOnly
                  style={{ padding: "8px", borderRadius: "4px", border: "2px solid rgb(184,138,68)" }}
                />
              </div>

              {/* Type */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "4px", color: "rgb(0,52,46)" }}>
                  Type
                </label>
                <input
                  type="text"
                  value={selectedRow?.product_master?.product_type || ""}
                  readOnly
                  style={{ padding: "8px", borderRadius: "4px", border: "2px solid rgb(184,138,68)" }}
                />
              </div>

              {/* Batch */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "4px", color: "rgb(0,52,46)" }}>
                  Batch
                </label>
                <input
                  type="text"
                  value={selectedRow?.batch_id || ""}
                  readOnly
                  style={{ padding: "8px", borderRadius: "4px", border: "2px solid rgb(184,138,68)" }}
                />
              </div>

              {/* Total Quantity */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "4px", color: "rgb(0,52,46)" }}>
                  Total Quantity
                </label>
                <input
                  type="text"
                  value={selectedRow?.total_quantity ?? ""}
                  readOnly
                  style={{ padding: "8px", borderRadius: "4px", border: "2px solid rgb(184,138,68)" }}
                />
              </div>

              {/* Blocked Quantity */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "4px", color: "rgb(0,52,46)" }}>
                  Blocked Quantity
                </label>
                <input
                  type="text"
                  value={selectedRow?.blocked_quantity ?? ""}
                  readOnly
                  style={{ padding: "8px", borderRadius: "4px", border: "2px solid rgb(184,138,68)" }}
                />
              </div>

              {/* Selling Price */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "4px", color: "rgb(0,52,46)" }}>
                  Selling Price
                </label>
                <input
                  type="text"
                  value={selectedRow?.mrp ?? ""}
                  readOnly
                  style={{ padding: "8px", borderRadius: "4px", border: "2px solid rgb(184,138,68)" }}
                />
              </div>

              {/* Status */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "4px", color: "rgb(0,52,46)" }}>
                  Status
                </label>
                <input
                  type="text"
                  value={selectedRow?.status || ""}
                  readOnly
                  style={{ padding: "8px", borderRadius: "4px", border: "2px solid rgb(184,138,68)" }}
                />
              </div>

              {/* Color */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "4px", color: "rgb(0,52,46)" }}>
                  Color
                </label>
                <input
                  type="text"
                  value={selectedRow?.product_master?.color || ""}
                  readOnly
                  style={{ padding: "8px", borderRadius: "4px", border: "2px solid rgb(184,138,68)" }}
                />
              </div>

              {/* Color Family */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "4px", color: "rgb(0,52,46)" }}>
                  Color Family
                </label>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: selectedRow?.product_master?.color_family || "#fff",
                    border: "2px solid rgb(184,138,68)",
                    borderRadius: "4px",
                  }}
                />
              </div>

              {/* Min Stock */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "4px", color: "rgb(0,52,46)" }}>
                  Min Stock
                </label>
                <input
                  type="text"
                  value={selectedRow?.product_master?.min_stk ?? ""}
                  readOnly
                  style={{ padding: "8px", borderRadius: "4px", border: "2px solid rgb(184,138,68)" }}
                />
              </div>

              {/* Product ID */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontWeight: "bold", marginBottom: "4px", color: "rgb(0,52,46)" }}>
                  Category
                </label>
                <input
                  type="text"
                  value={selectedRow?.product_master?.product_sub_type ?? ""}
                  readOnly
                  style={{ padding: "8px", borderRadius: "4px", border: "2px solid rgb(184,138,68)" }}
                />
              </div>


              <div  className=" proddetails_img_container" lg={4}>
                <img
                      src={selectedRow?.product_master?.image1_link}
                      id="prod_details_img1"
                      className="imgestyle"
                    />
              </div>
              <div  className="proddetails_img_container" lg={4}>
                <img
                      src={selectedRow?.product_master?.image2_link}
                      id="prod_details_img1"
                      className="imgestyle"
                    />
              </div>
              <div  className="proddetails_img_container" lg={4}>
                <img
                      src={selectedRow?.product_master?.image3_link}
                      id="prod_details_img1"
                      className="imgestyle"
                    />
              </div>

            </div>
          </div>
        ) : (
          <p>No row selected</p>
        )}
      </Modal>

    </div>
  );
}
