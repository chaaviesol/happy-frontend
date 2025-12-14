import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEllipsisV, FaChevronDown, FaPlus } from "react-icons/fa";
import "./PaymentOut.css";
import PaymentDetailsOverlay from "../Expenses/PaymentDetailsOverlay";
import RowOptionsPortal from "../../../../components/admin components/RowOptionsPortal";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import PaymentComponent from "../../../../components/admin components/payment/PaymentComponent";
import CustomModal from "../../../../components/CustomModal";
import Loader from "../../../../components/Loader";

export default function PaymentOut() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const [poList, setpoList] = useState([])

    //fetch all purchase orders
    const fetchData = async () => {
        try {
            setLoading(true);
            const requestBody = {
                division: "",
                //   isHidden: isHidden ? true : false,
                isHidden: false,
            };
            const response = await axiosPrivate.post(
                `/purchase/polist`,
                requestBody
            );
            console.log("initial po list", response.data);

            setpoList(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchData();

    }, []);

    useEffect(() => {
        if (!poList.length) return;

        const formatted = poList.map(po => {
            const paymentsArr = Array.isArray(po.po_payment)
                ? po.po_payment.map(p => ({
                    id: p.id,
                    method: p.mode,
                    amount: Number(p.amount),
                    reference: p.payment_id,
                    date: p.created_date?.split("T")[0]
                }))
                : [];

            const paid = paymentsArr.reduce((s, x) => s + Number(x.amount || 0), 0);

            return {
                id: po.purchase_id,
                date: po.created_date?.split("T")[0] || "",
                poNo: po.po_number,
                party: po.users?.trade_name || "",
                paid,
                outstanding: Number(po.total_amount || 0) - paid,
                totalAmount: Number(po.total_amount || 0),
                paymentType:
                    paymentsArr.map(x => x.method).join(", ") || "Pending",
                payments: paymentsArr
            };
        });

        setPayments(prev => {
            // merge server POs + local added items
            // const saved = JSON.parse(localStorage.getItem("payment_out_additions") || "[]");
            return [...formatted];
        });

    }, [poList]);



    // State
    const [dateRange, setDateRange] = useState("All");
    const [customDate, setCustomDate] = useState("05/06/2025 - 05/08/2025");
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
    const [startDate, setStartDate] = useState("2025-05-06");
    const [endDate, setEndDate] = useState("2025-05-08");
    const [searchQuery, setSearchQuery] = useState("");
    const [payments, setPayments] = useState([]);

    const [activeRowMenu, setActiveRowMenu] = useState(null);
    const [menuCoords, setMenuCoords] = useState(null);
    const [paymentModal, setPaymentModal] = useState({ isOpen: false, paymentId: null, mode: 'view' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Refs for click outside
    const dateDropdownRef = useRef(null);
    const customDateRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
                setShowDateDropdown(false);
            }
            if (customDateRef.current && !customDateRef.current.contains(event.target)) {
                setShowCustomDatePicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Filter Logic
    const filteredPayments = payments.filter((payment) => {
        // DATE FILTER
        if (dateRange !== "All" && startDate && endDate) {
            const payDate = new Date(payment.date);
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Ignore if invalid
            if (isNaN(payDate.getTime())) return false;

            // If outside the date range → remove it
            if (payDate < start || payDate > end) {
                return false;
            }
        }

        // SEARCH FILTER

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                payment.party.toLowerCase().includes(query) ||
                payment.poNo.toLowerCase().includes(query) ||
                payment.paymentType.toLowerCase().includes(query) ||
                payment.totalAmount.toString().includes(query);

            if (!matchesSearch) return false;
        }
        return true;
    });

    const totalPayOut = filteredPayments.reduce((sum, payment) => sum + payment.totalAmount, 0);

    // Pagination
    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPayments = filteredPayments.slice(startIndex, endIndex);

    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDateForDisplay = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    };

    const handleDateRangeSelect = (range) => {
        setDateRange(range);
        setShowDateDropdown(false);

        // NEW: Handle the All option
        if (range === "All") {
            setStartDate("");
            setEndDate("");
            setCustomDate("All");
            return;
        }

        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (range) {
            case "Today":
                break;
            case "Yesterday":
                start.setDate(today.getDate() - 1);
                end.setDate(today.getDate() - 1);
                break;
            case "This Month":
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case "Last Month":
                start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                end = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            case "This Year":
                start = new Date(today.getFullYear(), 0, 1);
                break;
            case "Custom Range":
                return;
            default:
                return;
        }

        const startStr = formatDateForInput(start);
        const endStr = formatDateForInput(end);
        setStartDate(startStr);
        setEndDate(endStr);
        setCustomDate(`${formatDateForDisplay(start)} - ${formatDateForDisplay(end)}`);
    };

    const handleCustomDateChange = (type, value) => {
        setDateRange("Custom Range");
        if (type === 'start') {
            setStartDate(value);
            setCustomDate(`${value.split('-').reverse().join('/')} - ${endDate.split('-').reverse().join('/')}`);
        } else {
            setEndDate(value);
            setCustomDate(`${startDate.split('-').reverse().join('/')} - ${value.split('-').reverse().join('/')}`);
        }
    };

    const handleDeletePayment = (id) => {
        if (window.confirm("Are you sure you want to delete this payment?")) {
            setPayments(payments.filter(p => p.id !== id));
        }
        setActiveRowMenu(null);
    };

    const handleUpdatePayment = (id) => {
        // navigate to update page and pass id in state
        navigate('/payment_out_update', { state: { id } });
        setActiveRowMenu(null);
    };

    const handlePaymentUpdate = (paymentId, updatedPayments) => {
        setPayments((prevPayments) => {
            const updated = prevPayments.map(p => {
                if (p.id === paymentId) {
                    const paid = updatedPayments.reduce((sum, x) => sum + (parseFloat(x.amount) || 0), 0);
                    const outstanding = (p.totalAmount || 0) - paid;
                    return {
                        ...p,
                        payments: updatedPayments,
                        paid,
                        outstanding,
                        paymentType: updatedPayments.map(x => x.method).join(', ') || 'Pending'
                    };
                }
                return p;
            });

            // Also persist to localStorage if the updated item exists in saved additions
            try {
                const saved = JSON.parse(localStorage.getItem('payment_out_additions') || '[]');
                if (Array.isArray(saved) && saved.length > 0) {
                    const idx = saved.findIndex(s => s.id === paymentId);
                    if (idx !== -1) {
                        // Build saved item format
                        const p = updated.find(u => u.id === paymentId);
                        if (p) {
                            const toSave = {
                                id: p.id,
                                date: p.date,
                                poNo: p.poNo,
                                party: p.party,
                                totalAmount: p.totalAmount,
                                payments: p.payments
                            };
                            saved[idx] = toSave;
                            localStorage.setItem('payment_out_additions', JSON.stringify(saved));
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to update saved payment outs', err);
            }

            return updated;
        });
        setPaymentModal({ isOpen: false, paymentId: null, mode: 'view' });
    };

    const dateOptions = ["All", "Today", "Yesterday", "This Month", "Last Month", "This Year", "Custom Range"];

    return (
        <div className="payment-out-container">
            {/* Filter Section */}
            <div className="filter-section">
                {/* Date Filter */}
                <div className="filter-group date-group" ref={dateDropdownRef}>
                    <label className="filter-label">Date</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <div
                            className="filter-input-wrapper"
                            style={{ minWidth: "140px" }}
                            onClick={() => setShowDateDropdown(!showDateDropdown)}
                        >
                            <span>{dateRange}</span>
                            <FaChevronDown className="dropdown-arrow" />
                        </div>
                        {showDateDropdown && (
                            <div className="custom-dropdown-menu" style={{ width: "160px" }}>
                                {dateOptions.map((option) => (
                                    <div
                                        key={option}
                                        className="dropdown-item-custom"
                                        onClick={() => handleDateRangeSelect(option)}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div
                            className="filter-input-wrapper"
                            style={{ flex: "0 1 auto", minWidth: "220px", position: "relative" }}
                            onClick={() => setShowCustomDatePicker(!showCustomDatePicker)}
                            ref={customDateRef}
                        >
                            <span>{customDate}</span>
                            {showCustomDatePicker && (
                                <div
                                    className="custom-dropdown-menu"
                                    style={{
                                        width: "250px",
                                        padding: "15px",
                                        cursor: "default"
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                            <label style={{ fontSize: "0.85rem", color: "#666" }}>From</label>
                                            <input
                                                type="date"
                                                className="table-input"
                                                value={startDate}
                                                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                                                style={{ padding: "8px" }}
                                            />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                            <label style={{ fontSize: "0.85rem", color: "#666" }}>To</label>
                                            <input
                                                type="date"
                                                className="table-input"
                                                value={endDate}
                                                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                                                style={{ padding: "8px" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Total Pay Out Amount Display */}
                <div className="total-expense-group">
                    <label className="filter-label">Total Pay Out Amount</label>
                    <div className="total-expense-amount">₹ {totalPayOut.toLocaleString()}</div>
                </div>
            </div>

            {/* Header */}
            <div className="page-header">
                <div className="table-title">Payment Out Table</div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* <button className="add-expense-main-btn" onClick={() => navigate('/payment_out_add')}>
                        <FaPlus />&nbsp; Add Payment Out
                    </button> */}

                </div>
            </div>

            <div className="action-bar">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            
            <div>
            {loading ? (
                <Loader message="Fetching Payments Out..." />
            ) : (
                <div >
                    {/* Table */}
                    <div className="custom-table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>PO no</th>
                                    <th>Party</th>
                                    <th>Paid</th>
                                    <th>Outstanding</th>
                                    <th>Status</th>
                                    <th>Total Amount</th>
                                    <th>Payment</th>
                                    {/* <th>Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {currentPayments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td>{payment.date}</td>
                                        <td>{payment.poNo}</td>
                                        <td>{payment.party}</td>
                                        <td>₹{(payment.paid || 0).toLocaleString()}</td>
                                        <td>₹{(payment.outstanding || 0).toLocaleString()}</td>
                                        <td>
                                            {(() => {
                                                const paid = Number(payment.paid || 0);
                                                const total = Number(payment.totalAmount || 0);
                                                if (paid >= total && total > 0) {
                                                    return <span className="status-badge badge-paid">Full Paid</span>;
                                                }
                                                if (paid > 0 && paid < total) {
                                                    return <span className="status-badge badge-partial">Partially Paid</span>;
                                                }
                                                return <span className="status-badge badge-unpaid">Unpaid</span>;
                                            })()}
                                        </td>
                                        <td>₹{payment.totalAmount.toLocaleString()}</td>
                                        <td>
                                            <div className="payment-type">
                                                {payment.paymentType}
                                                <FaPlus
                                                    className="plus-icon-green"
                                                    onClick={() =>
                                                        setPaymentModal({
                                                            isOpen: true,
                                                            paymentId: payment.id,
                                                            data: payment,   // <-- store the selected row
                                                        })
                                                    }
                                                />
                                            </div>
                                        </td>
                                        {/* <td>
                                    <FaEllipsisV
                                        className="more-options"
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            if (activeRowMenu === payment.id) {
                                                setActiveRowMenu(null);
                                                setMenuCoords(null);
                                            } else {
                                                setMenuCoords(rect);
                                                setActiveRowMenu(payment.id);
                                            }
                                        }}
                                    />
                                </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* {activeRowMenu && menuCoords && (
                <RowOptionsPortal coords={menuCoords}>
                    <div onClick={() => { handleUpdatePayment(activeRowMenu); setActiveRowMenu(null); setMenuCoords(null); }}>Update</div>
                    <div onClick={() => { handleDeletePayment(activeRowMenu); setActiveRowMenu(null); setMenuCoords(null); }} className="delete">Delete</div>
                </RowOptionsPortal>
            )} */}

                    <CustomModal
                        open={paymentModal.isOpen}
                        onClose={() => setPaymentModal({ isOpen: false, paymentId: null })}
                    >
                        {paymentModal.data && (
                            <PaymentComponent
                                poData={{
                                    purchase_id: paymentModal.data.id,
                                    po_number: paymentModal.data.poNo,
                                    total_amount: paymentModal.data.totalAmount,
                                    balance_amt: paymentModal.data.outstanding,
                                    paymentdetails: paymentModal.data.payments
                                }}
                                onClose={() => {
                                    setPaymentModal({ isOpen: false })
                                    fetchData();
                                }}
                                isModal={true}
                            />
                        )}
                    </CustomModal>

                    {/* <PaymentDetailsOverlay
                isOpen={paymentModal.isOpen}
                onClose={() => setPaymentModal({ isOpen: false, paymentId: null, mode: 'view' })}
                onConfirm={(updatedPayments) => handlePaymentUpdate(paymentModal.paymentId, updatedPayments)}
                initialPayments={payments.find(p => p.id === paymentModal.paymentId)?.payments}
                totalAmount={payments.find(p => p.id === paymentModal.paymentId)?.totalAmount}
                mode={paymentModal.mode}
                onEdit={() => setPaymentModal({ ...paymentModal, mode: 'edit' })}
            /> */}

                    {/* Pagination */}
                    <div className="pagination-container">
                        <button
                            className="pagination-arrow"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className="pagination-arrow"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>


                </div>)}
            </div>

        </div>
    );
}
