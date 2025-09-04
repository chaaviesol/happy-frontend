import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./paymentcomponent.css";
import axios from "axios";
import { Modal } from "@mui/material";
import { prismaBaseApi } from "../../../config";
import PaymentTableComponent from "./PaymentTableComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function SoPayment() {
  const location = useLocation();
  const passedSalesId = { so: location.state };
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState({});
  const columnHeadings = [
    "Payment ID",
    "Date",
    "Amount",
    "Mode",
    "Received By",
  ];
  const [formData, setFormData] = useState({
    // sales_id: passedSalesId.so,
    sales_id: passedSalesId.so,
    logged_id: auth.logged_id,
    credited_to: "",
    date: new Date().toISOString().split("T")[0],
  });
  const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
  const navigate = useNavigate();
  const fetchPaymentHistory = async () => {
    setLoading(true)
    try {
      const data = {
        sales_id: passedSalesId.so,
      };
      console.log(data);
      const response = await axiosPrivate.post(
        `/payment/so_paymentdetails `,
        data
      );
      const { so_number, total_amount, balance, paymentdetails } =
        response.data;
      const updatedPaymentDetails = paymentdetails.map((ele) => {
        let rawDate = ele.created_date;
        const formattedDate = new Date(rawDate).toLocaleDateString();
        return {
          ...ele,
          created_date: formattedDate,
        };
      });
      setPaymentHistory({
        so_number,
        total_amount,
        balance,
        paymentdetails: updatedPaymentDetails,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const handleOpenModal = () => {
    if (!paymentHistory.balance) {
      alert("Payment completed");
    } else {
      setIsShowModal(true);
    }
  };
  const handleFormChanges = (event) => {
    const { name, value } = event.target;
    if (name === "tl_amt") {
      if (value > paymentHistory.balance) {
        alert("cannot exceed outstanding amount");
        setFormData((prev) => ({
          ...prev,
          [name]: prev[name],
        }));
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChanges = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, date: value });
  };

  //  Payment function
  const handleTriggerPayment = async () => {
    // console.log(formData);
    const data = { ...formData, credited_to: "Admin 1" };
    try {
      const response = await axiosPrivate.post(`/payment/so_payment`, data);
      if (response.status === 200) {
        toast.success("Success", toastOptions);
      }
      fetchPaymentHistory();
      setFormData({
        sales_id: passedSalesId.so,
        logged_id: auth.logged_id,
        credited_to: "",
      });
    } catch (err) {
      console.error(err);
    }
  };
  console.log("payment history => ", paymentHistory);
  console.log("form data => ", formData);
  return (
    <div id="payment-main-container">
      <div style={{ top: "50px", position: "absolute" }}>
        <span style={{ fontSize: "20px", fontWeight: 500 }}>
          Payment History
        </span>
      </div>
      <div style={{ height: "10px" }}></div>
      <div style={{ width: "86%", padding: ".5rem" }}>
        <div id="payment-section">
          <div className="payment-po-details">
            <div>
              {" "}
              <span>So Number: {paymentHistory?.so_number}</span>
            </div>
            <div>
              {" "}
              <span>So Amount: {paymentHistory?.total_amount}</span>{" "}
            </div>
            <div>
              {" "}
              <span>O/S Amount: {paymentHistory?.balance}</span>{" "}
            </div>
          </div>
          <div className="payment-table-container">
            <PaymentTableComponent
              data={paymentHistory}
              columnHeading={columnHeadings}
              type="so"
            />
          </div>

          <div
            className="payment-btn-div"
            style={{ display: "flex", justifyContent: "center", gap: "5rem" }}
          >
            <button onClick={handleOpenModal}>Add new payment</button>
            <button
              onClick={() => {
                navigate(-1);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      <Modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        open={isShowModal}
      >
        <div className="payment-modal-div">
          <div className="form-group row">
            <label for="sdgsdgs" className="col-sm-4 col-form-label text-left">
              Date
            </label>
            <div className="col-sm-8">
              <input
                onChange={handleDateChanges}
                style={{ borderRadius: "6px" }}
                name="date"
                type="date"
                value={formData?.date}
                className="form-control register_form  prodcontainer inputstyle  "
              />
            </div>
          </div>
          <div className="form-group row">
            <label for="sdgsdgs" className="col-sm-4 col-form-label text-left">
              Amount
            </label>
            <div className="col-sm-8">
              <input
                name="tl_amt"
                style={{ borderRadius: "6px" }}
                type="number"
                min={0}
                value={formData.tl_amt ?? ""}
                onChange={handleFormChanges}
                className="form-control register_form  prodcontainer inputstyle  "
              />
            </div>
          </div>
          <div className="form-group row">
            <label for="sdgsdgs" className="col-sm-4 col-form-label text-left">
              Mode
            </label>
            <div className="col-sm-8">
              <select
                onChange={handleFormChanges}
                name="mode"
                id="mode"
                style={{ background: "white" }}
                className="form-control products-form__form-control"
                value={formData?.mode || ""}
              >
                <option value=""></option>
                <option value="Bank">Bank</option>
                <option value="Cash">Cash</option>
                <option value="Upi">Upi</option>
              </select>
            </div>
          </div>
          {/* <div className="form-group row">
            <label for="sdgsdgs" className="col-sm-4 col-form-label text-left">
              To
            </label>
            <div className="col-sm-8">
              <input
                style={{ borderRadius: "6px" }}
                type="text"
                value={formData?.credited_to || ""}
                name="credited_to"
                onChange={handleFormChanges}
                className="form-control register_form  prodcontainer inputstyle  "
              />
            </div>
          </div> */}
          <div className="payment-modal-btns">
            <button type="button" onClick={handleTriggerPayment}>
              Confirm
            </button>
            <button
              type="button"
              onClick={() => {
                setIsShowModal(false);
                setFormData({
                  sales_id: 76,
                  logged_id: auth.logged_id,
                  credited_to: 42,
                });
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
      <ToastContainer>
        position="top-right" autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
      </ToastContainer>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
