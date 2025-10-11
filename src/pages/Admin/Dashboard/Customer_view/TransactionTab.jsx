import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import "react-toastify/dist/ReactToastify.css";

export default function TransactionTab({ userId, userType }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (!userId) return;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = { user_type: userType, user_id: userId };
        const res = await axiosPrivate.post("/user/transactionhistory", data);

        if (res.status === 200 && res.data.transactions) {
          setTransactions(res.data.transactions);
        } else {
          toast.error("Failed to fetch transactions");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, userType]);

  // ✅ format date as dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // ✅ format currency with ₹, commas, and 2 decimals
  const formatCurrency = (amount) => {
    if (amount == null || isNaN(amount)) return "₹0.00";
    return (
      // "₹" +
      Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  if (loading)
    return <div style={{ padding: "2rem" }}>Loading transactions...</div>;
  if (!transactions.length)
    return <div style={{ padding: "2rem" }}>No transactions found.</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h4 style={{ marginBottom: "1rem" }}>Transaction History</h4>
      <table className="table table-bordered" style={{ fontSize: "0.95rem" }}>
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Date</th>
            <th>Total Amount (₹)</th>
            <th>Paid Amount (₹)</th>
            <th>Outstanding Amount (₹)</th>
            <th>Payment Details</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => {
            const paidAmount = txn.payments?.reduce(
              (sum, p) => sum + (p.payment_amount || 0),
              0
            );
            const outstanding = txn.total_amount - paidAmount;
            return (
              <tr key={index}>
                <td>{txn.order_number}</td>
                <td>{formatDate(txn.order_date)}</td>
                <td>{formatCurrency(txn.total_amount)}</td>
                <td>{formatCurrency(paidAmount)}</td>

                {/* ✅ Highlight Outstanding */}
                <td
                  style={{
                    color: outstanding > 0 ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  {outstanding > 0
                    ? formatCurrency(outstanding)
                    : "0"}
                </td>

                <td>
                  {txn.payments?.length ? (
                    <div style={{ lineHeight: "1.6" }}>
                      {txn.payments.map((p, i) => (
                        <div key={i}>
                          {formatDate(p.payment_date)} :{" "}
                          {formatCurrency(p.payment_amount)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    "No payments"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}
