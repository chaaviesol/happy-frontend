import React, { useState, useEffect } from "react";
import "./paymentcomponent.css";

export default function PaymentTableComponent({ data, columnHeading, type }) {
  const [paymentHistory, setPaymentHistory] = useState(data);
  useEffect(() => {
    setPaymentHistory(data);
  }, [data, type]);
  const person = type === "so" ? "received_by" : "credited_to";
  // console.log("payment history =>>", paymentHistory);
  return (
    <>
      <table className="payment-table">
        <thead
          style={{
            zIndex: "999",
            fontSize: "13px",
            background: "#44403c",
            color: "white",
          }}
          className="table-head"
        >
          <tr>
            {columnHeading?.map((val) => (
              <th>{val}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paymentHistory?.paymentdetails?.map((value, index) => (
            <tr className="payment-table-row">
              <td>{index + 1}</td>
              <td>{value?.created_date}</td>
              <td>{value?.amount}</td>
              <td>{value?.mode}</td>
              <td>{value?.[person]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
