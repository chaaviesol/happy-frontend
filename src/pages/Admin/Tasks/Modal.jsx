import React, { useState } from "react";
import styles from "./styles.module.css";
import { Button, Modal, styled } from "@mui/material";
import TableComp from "../../../components/table/TableComp";

export default function Index({
  isShowModal,
  close,
  confirm,
  showSoData,
  salesData,
}) {
  const [accessoryDetails, setAccessoryDetails] = useState([]);
  const getRowData = (rowData) => {
    if (rowData.access) {
      console.log(rowData);//if row data have accessories
      setAccessoryDetails(rowData.access);
    }
  };

  const CancelButton = styled(Button)(({ theme }) => ({
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    width: "5rem",
    padding: "6px 12px",
    lineHeight: 1.5,
    color: theme.palette.getContrastText("#78716c"),
    backgroundColor: "#78716c",
    "&:hover": {
      backgroundColor: "#484644",
    },
  }));
  const ConfirmButton = styled(Button)(({ theme }) => ({
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    width: "5rem",
    padding: "6px 12px",
    lineHeight: 1.5,
    color: theme.palette.getContrastText("#78716c"),
    backgroundColor: "#4CAF50",
    "&:hover": {
      backgroundColor: "#2c822e",
    },
  }));
  const handleConfirm = () => {
    confirm();
  };
  const handleCancel = () => {
    close();
  };
  const handleCloseAccess = () => {
    setAccessoryDetails([]);
  };
  const blankFn=()=>{
    
  }
  if (!showSoData) {
    return (
      <>
        <Modal open={isShowModal} onClose={handleCancel}>
          <div className={styles.modalContainer}>
            <div>
              <span>Task Completed?</span>
            </div>
            <div>
              <ConfirmButton onClick={handleConfirm}>Confirm</ConfirmButton>{" "}
              <CancelButton onClick={handleCancel}>Cancel</CancelButton>{" "}
            </div>
          </div>
        </Modal>
      </>
    );
  }
  return (
    <>
      <Modal open={true} onClose={handleCancel}>
        <div className={styles.modalContainer2}>
          <div className={styles.dataPart}>
            <div>
              <span>Sales order details</span>
            </div>
            <div>
              <span style={{ fontSize: "18px", fontWeight: 400 }}>
                So Number : {salesData?.soNumber}
              </span>
            </div>
            <div className={styles.tableContainer}>
              <TableComp
                tableHeading={salesData?.tableHeadings}
                tableColumns={salesData?.columnHeadings}
                tableData={salesData?.tableProdData}
                getRowData={getRowData}
              />
            </div>
          </div>
          {accessoryDetails.length > 0 && (
            <Modal open={true} onClose={handleCloseAccess}>
              {/* {accessoryDetails} */}
              <div className={styles.modalContainer3}>
                <div>
                  <span>Accessory details</span>{" "}
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingTop: "1px",
                    }}
                  >
                    <div style={{ flex: 1 }}>Sl No:</div>
                    <div style={{ flex: 4 }}>Product name</div>
                    <div style={{ flex: 4 }}>Qty</div>
                    <div style={{ flex: 4 }}>Color</div>
                  </div>
                  <div className={styles.tableDataContainer}>
                    {accessoryDetails &&
                      accessoryDetails.map((value, index) => (
                        <div
                          key={index}
                          style={{ display: "flex", flexDirection: "row",height:"40px",alignItems:"center" }}
                        >
                          <div style={{ flex: 1 }}>{index + 1}</div>
                          <div style={{ flex: 4 }}>{value?.product_name}</div>
                          <div style={{ flex: 4 }}>{value?.order_qty}</div>
                          <div style={{ flex: 4 }}>
                            {
                              value
                                ?.product_master_sales_list_accessories_product_idToproduct_master
                                .color
                            }
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                {/* <button onClick={handleCloseAccess}>Close</button> */}
              </div>
            </Modal>
          )}
          <div>
            <ConfirmButton onClick={handleConfirm}>Confirm</ConfirmButton>{" "}
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>{" "}
          </div>
        </div>
      </Modal>
    </>
  );
}
