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

  if (loading) return <div style={{ padding: "2rem" }}>Loading transactions...</div>;
  if (!transactions.length) return <div style={{ padding: "2rem" }}>No transactions found.</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h4>Transaction History</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Date</th>
            <th>Total Amount</th>
            <th>Paid Amount</th>
            <th>Outstanding Amount</th>
            <th>Payment Details</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => {
            const paidAmount = txn.payments?.reduce((sum, p) => sum + (p.payment_amount || 0), 0);
            const outstanding = txn.total_amount - paidAmount;
            return (
              <tr key={index}>
                <td>{txn.order_number}</td>
                <td>{new Date(txn.order_date).toLocaleDateString()}</td>
                <td>{txn.total_amount}</td>
                <td>{paidAmount}</td>
                <td>{outstanding}</td>
                <td>
                  {txn.payments?.length ? (
                    <ul>
                      {txn.payments.map((p, i) => (
                        <li key={i}>
                          {p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "-"} : {p.payment_amount}
                        </li>
                      ))}
                    </ul>
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
