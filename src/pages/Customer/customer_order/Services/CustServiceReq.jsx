import { React, useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AttachFile } from "@mui/icons-material";
import { prismaBaseApi } from "../../../../config";
import useFileUpload from "../../../../hooks/useFileUpload";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

export default function CustServiceReq() {
  const [formData, setFormData] = useState({});
  const [isShowModal, setIsShowModal] = useState(false);
  const [typingIndex, setIndexToRemove] = useState();
  const [totalRefund, setTotalRefund] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPicName, setCurrentPicName] = useState();
  const axiosPrivate=useAxiosPrivate()
  const {
    selectedFile,
    setSelectedFile,
    setUpload,
    setIndex,
    index,
    links,
    setLinks,
  } = useFileUpload();
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();
  const fetchedSo = location?.state;
  const soNumber = fetchedSo?.so_number;
  const soProducts = fetchedSo?.products;
  const toastConfig = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  useEffect(() => {
    setFormData({
      ...formData,
      sales_list: soProducts,
    });
  }, [soProducts]);

  //handling return or service req && modal
  const handleRequest = (index) => {
    setIsShowModal(true);
    setIndexToRemove(index);
  };
  const handleFileChanges = (event) => {
    const fileList = event.target.files;
    const newFiles = Array.from(fileList);
    setCurrentPicName(newFiles[0].name);
    setSelectedFile([...selectedFile, ...newFiles]);
    setUpload(true);
    setIndex(index + 1);
  };
  useEffect(() => {
    if (links.length > 0) {
      console.log(typingIndex);
      const lastLink = links[links.length - 1];
      const clonedFormData = { ...formData };
      const sales_list = clonedFormData?.sales_list;
      const picData =
        sales_list && sales_list[typingIndex]
          ? sales_list[typingIndex].picture
          : null;

      let dta = {};
      if (picData) {
        const linkValues = Object.values(picData);
        console.log(linkValues);
        for (let i = 0; i < linkValues.length; i++) {
          const picName = `photo${i + 1}`;
          console.log(picName);
          dta[picName] = linkValues[i];
          if (i === linkValues.length - 1) {
            const picName = `photo${i + 2}`;
            dta[picName] = lastLink;
          }
        }
        console.log(dta);
        const picNames=sales_list[typingIndex].picNames || []
        if (!picNames.includes(currentPicName)) {
          picNames.push(currentPicName);
        }
        const upData = { ...sales_list[typingIndex], picture: dta,picNames };
        sales_list[typingIndex] = upData;
        setFormData((prev) => ({
          ...prev,
          sales_list: sales_list,
        }));
      } else {
        const picName = "photo1";
        const lastPic = {
          [picName]: lastLink,
        };
        const picNames=sales_list[typingIndex].picNames || []
        if (!picNames.includes(currentPicName)) {
          picNames.push(currentPicName);
        }
        const dta = { ...sales_list[typingIndex], picture: lastPic,picNames  };
        sales_list[typingIndex] = dta;
        setFormData((prev) => ({
          ...prev,
          sales_list: sales_list,
        }));
      }
      console.log(dta);
    }
  }, [links]);

  console.log(links);
  const handleGetRefundAmt = async (dta) => {
    const { return_qty, sales_list_id } = dta;
    console.log(dta);
    if (return_qty && sales_list_id) {
      const data = {
        qty: return_qty,
        sales_list_id,
      };
      console.log("Data to send:", data);

      try {
        const response = await axiosPrivate.post(
          `/order/refund`,
          data
        );
        console.log("Response =>", response);
        const refundAmt = parseInt(response?.data?.refund_amt);
        //Update UI
        updateFormData(refundAmt, dta);
      } catch (error) {
        console.log("error =>", error);
      }
    } else {
      const refundAmt = 0;
      updateFormData(refundAmt, dta);
    }
  };
  //Fn for updating refund amt,status,ref in state
  const updateFormData = (refundAmt, dta) => {
    const { return_qty, soNumber, name, value } = dta;
    const clonedFormData = { ...formData };
    const sales_list = [...clonedFormData?.sales_list];
    const currentItem = sales_list[typingIndex];
    let updatedItem = {
      ...currentItem,
      status: "requested",
      return_qty,
      [name]: value,
    };
    if (refundAmt) {
      updatedItem.refund_amt = refundAmt;
    }
    sales_list[typingIndex] = updatedItem;
    clonedFormData.sales_list = sales_list;
    console.log(clonedFormData);
    setFormData({
      ...clonedFormData,
      so_number: soNumber,
    });
  };

  //handle return changes
  const handleChanges = async (event) => {
    const { name, value } = event.target;

    const clonedFormData = { ...formData };
    const sales_list = [...clonedFormData?.sales_list];
    if (name === "return_qty") {
      const sales_list_id = sales_list[typingIndex].sales_list_id; //passing to refund fn
      const currentItem = sales_list[typingIndex];
      if (currentItem.qty < value || value === "") {
        if (currentItem.qty < value) {
          alert("Quantity cannot exceed the original quantity");
        }
        if (totalRefund) {
          setTotalRefund(totalRefund - currentItem.refund_amt);
        }
        event.target.value = "";
        const updatedItem = {
          ...currentItem,
          [name]: "",
          status: "request",
          refund_amt: 0,
        };
        sales_list[typingIndex] = updatedItem;
        setFormData((prevFormData) => ({
          ...prevFormData,
          sales_list: [...sales_list],
          so_number: soNumber,
        }));
      } else {
        const dta = {
          value,
          return_qty: value,
          sales_list_id,
          name,
          soNumber,
        };
        console.log(dta);
        if (fetchedSo.compType === "Return") {
          await handleGetRefundAmt(dta);
        } else if (fetchedSo.compType === "Sr") {
          let refundAmt = 0;
          updateFormData(refundAmt, dta);
        }
      }
    } else {
      const regex = /^[a-zA-Z0-9 ]*$/;
      if (!regex.test(value)) {
        event.target.value = value.replace(/[^a-zA-Z0-9 ]/g, "");
      } else {
        const updatedItem = {
          ...sales_list[typingIndex],
          [name]: value,
          status: "request",
        };
        sales_list[typingIndex] = updatedItem;
        clonedFormData.sales_list = sales_list;
        setFormData({
          ...clonedFormData,
          so_number: soNumber,
        });
      }
    }
  };
  const handleModalClose = () => {
    setLinks([]);
    setSelectedFile([]);
    setIndex(-1);
  };

  const handleConfirm = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      let clonedFormData = { ...formData };
      const sales_list = clonedFormData?.sales_list;
      const keysToKeep = [
        "remarks",
        "return_qty",
        "picture",
        "sales_list_id",
        "refund_amt",
      ];
      /* updatedArr for removing unneccessary key values */
      const updatedArr = sales_list.map((item) =>
        Object.fromEntries(
          Object.entries(item).filter(([key]) => keysToKeep.includes(key))
        )
      );
      const oldKey = "return_qty";
      const newKey = "qty";
      /* updatedArray: renaming return_qty key  as qty */
      let updatedArray = updatedArr
        .filter((item) => item[oldKey] !== undefined)
        .map((item) => {
          const newItem = { ...item };
          newItem[newKey] = newItem[oldKey];
          delete newItem[oldKey];
          return newItem;
        });
      clonedFormData.sales_list = updatedArray;
      clonedFormData.status = "request";

      const targetApi =
        fetchedSo.compType === "Return" ? "return_request" : "servicerequest";

      const response = await axiosPrivate.post(
        `/order/${targetApi}`,
        clonedFormData
      );
      await new Promise((resolve) => {
        toast.success(response.data.message, toastConfig);
        setTimeout(resolve, 1500);
      });

       navigate(-1);
    } catch (err) {
      toast.error("something went wrong", toastConfig);
      console.error("error => ", err);
    } finally {
      setLoading(false);
    }
  };

  // calculate total refund amount
  useEffect(() => {
    const calculateTotalRefund = () => {
      // alert("yh")
      const salesList = formData?.sales_list;
      const hasAnyRefund = salesList?.some((ele) => ele.refund_amt);
      if (hasAnyRefund) {
        let totalRefund = 0;
        for (let i = 0; i < formData.sales_list.length; i++) {
          let refund_amt = formData?.sales_list[i]?.refund_amt;
          // alert(typeof(refund_amt))
          if (refund_amt) {
            totalRefund += refund_amt;
          }
        }
        // alert(totalRefund)
        setTotalRefund(totalRefund);
      }
    };
    calculateTotalRefund();
  }, [formData]);

  console.log(formData);

  return (
    <div className={styles.mainContainer}>
      <div style={{ marginBottom: "2rem" }}>
        <span style={{ fontSize: "25px", fontWeight: 600, color: "#00243E" }}>
          {fetchedSo.compType === "Return"
            ? "Return requests"
            : "Service Request"}
        </span>
      </div>
      <div style={{ textAlign: "left" }}>
        <h6>Sales Number : {soNumber}</h6>
      </div>
      <div className={styles.table}>
        <div className={styles.tableHead}>
          <div>Product name</div>
          <div
            className={styles.qty}
            style={{
              background: "#9ca3af",
            }}
          >
            Quantity
          </div>
          <div
            className={styles.qty}
            style={{
              background: "#9ca3af",
            }}
          >
            Net Amount
          </div>
          <div
            className={styles.qty}
            style={{
              background: "#9ca3af",
            }}
          >
            Mfc code
          </div>
          <div style={{ width: "10%" }}>Request</div>
          {fetchedSo.compType === "Return" ? (
            <div style={{ width: "10%" }}>Refund Amt</div>
          ) : (
            ""
          )}
        </div>

        <div className={styles.tableData}>
          {formData.sales_list?.map((value, index) => (
            <div
              key={index}
              style={{ background: index % 2 === 0 ? "white" : "#f5f5f4" }}
              className={styles.tableRow}
            >
              <div> {value.prod_name} </div>
              <div className={styles.qty}>{value.qty}</div>
              <div className={styles.qty}>{value.net_amount}</div>
              <div className={styles.qty}>{value.manufacturer_code}</div>
              <div>
                <button
                  className={styles.serviceBtn}
                  onClick={() => handleRequest(index)}
                  variant="outlined"
                >
                  {fetchedSo.compType === "Return" ? "Return" : "Create request"}
                </button>{" "}
              </div>
              {fetchedSo.compType === "Return" ? (
                <div>{value?.refund_amt ?? 0}</div>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {fetchedSo.compType === "Return" ? (
          <span style={{ marginRight: "7%" }}>
            Total Refund : {totalRefund}{" "}
          </span>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          marginTop: "3rem",
          display: "flex",
          gap: "4rem",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          disabled={loading}
          onClick={handleConfirm}
          className={styles.confirmBtn}
        >
          Confirm
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
            // onClick={handleCloseloading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </button>
        <button
          className={styles.closeBtn}
          onClick={() => {
            navigate(-1);
          }}
        >
          Close
        </button>
      </div>
      <Modal
        open={isShowModal}
        onClose={() => {
          setIsShowModal(false);
          handleModalClose();
        }}
      >
        <div className={styles.modalContainer}>
          <div className={styles.modalrow}>
            <div style={{ width: "50%", display: "flex" }}>
              <label id={styles.labels} className="m-0 ml-3" htmlFor="">
                Quantity
              </label>
            </div>
            <div style={{ width: "50%", padding: "5px" }}>
              <input
                name="return_qty"
                min={0}
                onChange={handleChanges}
                value={formData?.sales_list?.[typingIndex]?.return_qty ?? ""}
                type="number"
              />
            </div>
          </div>
          <div className={styles.modalrow}>
            <div style={{ width: "50%", display: "flex" }}>
              <label id={styles.labels} className="m-0 ml-3" htmlFor="">
                Remarks
              </label>
            </div>
            <div style={{ width: "50%", padding: "5px" }}>
              <textarea
                style={{ height: "80px" }}
                name="remarks"
                value={formData?.sales_list?.[typingIndex]?.remarks ?? ""}
                onChange={handleChanges}
                type="text"
              />
            </div>
          </div>
          <div
            className={styles.modalrow}
            style={{ display: "flex", gap: "127px" }}
          >
            <div style={{ width: "15%", marginLeft: "18px" }}>
              <label
                id={styles.labels}
                title="Attach file"
                htmlFor="file-input"
                className="file-input-label"
              >
                <AttachFile />
                <input
                  type="file"
                  name="picture"
                  id="file-input"
                  onChange={handleFileChanges}
                  multiple
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <div
              style={{
                width: "50%",
                height: "100px",
              }}
            >
              <div
                className={`products-scrollbar ${styles.viewFile}`}
                id="style-2"
              >
                {formData?.sales_list?.[typingIndex]?.picNames &&
                  formData.sales_list[typingIndex].picNames.map((file, index) => (
                    <div
                      key={index}
                      style={{ paddingLeft: "10px" }}
                      className="row"
                    >
                      <span style={{ fontSize: "13px", padding: "2px" }}>
                        {index + 1} : {file}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className={styles.modalrow}>
            <div
              style={{
                width: "50%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {/* <button className={styles.submitButton}>Submit</button> */}
            </div>
            {/* <div
              style={{
                width: "50%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => {
                  setIsShowModal(false);
                  handleModalClose();
                }}
                className={styles.cancelButton}
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      </Modal>
      <ToastContainer>
        position="top-right" autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
      </ToastContainer>
    </div>
  );
}
