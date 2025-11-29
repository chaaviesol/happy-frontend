import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEllipsisV, FaChevronDown, FaPlus } from "react-icons/fa";
import "./PaymentIn.css";
import PaymentDetailsOverlay from "../Expenses/PaymentDetailsOverlay";
import RowOptionsPortal from "../../../../components/admin components/RowOptionsPortal";

export default function PaymentIn() {
    const navigate = useNavigate();
    // Mock Data (similar to PaymentOut but with SO no and Received)
    const initialPayments = [
        {
            id: 1,
            date: "11/05/2025",
            soNo: "SO589723",
            party: "AlphaWidget",
            received: 10000,
            outstanding: 2000,
            totalAmount: 12000,
            paymentType: "Cash",
            payments: [
                { id: 1001, method: 'Cash', amount: 5000, reference: 'INV1001', date: '2025-05-11' },
                { id: 1002, method: 'Bank', amount: 5000, reference: 'REF1001', date: '2025-05-11' }
            ]
        },
        {
            id: 2,
            date: "12/05/2025",
            soNo: "SO589724",
            party: "AlphaWidget",
            received: 2000,
            outstanding: 10000,
            totalAmount: 12000,
            paymentType: "Cheque",
            payments: [
                { id: 2001, method: 'Cheque', amount: 2000, reference: 'CHQ2001', date: '2025-05-12' }
            ]
        }
    ];

    // State
    const [dateRange, setDateRange] = useState("This Month");
    const [customDate, setCustomDate] = useState("05/06/2025 - 05/08/2025");
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
    const [startDate, setStartDate] = useState("2025-05-06");
    const [endDate, setEndDate] = useState("2025-05-08");
    const [searchQuery, setSearchQuery] = useState("");
    const [payments, setPayments] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('payment_in_additions') || '[]');
            const mapped = Array.isArray(saved) ? saved.map(s => {
                const paymentsArr = Array.isArray(s.payments) ? s.payments.map(p => ({ ...p, amount: Number(p.amount) })) : [];
                const received = paymentsArr.reduce((sum, x) => sum + (Number(x.amount) || 0), 0);
                const outstanding = (Number(s.totalAmount) || 0) - received;
                return {
                    id: s.id || Date.now(),
                    date: s.date || '',
                    soNo: s.soNo || '',
                    party: s.party || '',
                    received,
                    outstanding,
                    totalAmount: Number(s.totalAmount) || 0,
                    paymentType: paymentsArr.map(x => x.method).join(', ') || s.paymentType || 'Pending',
                    payments: paymentsArr
                };
            }) : [];
            return [...initialPayments, ...mapped];
        } catch (err) {
            console.error('Failed to parse saved payment ins', err);
            return initialPayments;
        }
    });
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
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                payment.party.toLowerCase().includes(query) ||
                payment.soNo.toLowerCase().includes(query) ||
                payment.paymentType.toLowerCase().includes(query) ||
                payment.totalAmount.toString().includes(query);

            if (!matchesSearch) return false;
        }
        return true;
    });

    const totalPayIn = filteredPayments.reduce((sum, payment) => sum + payment.totalAmount, 0);

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
        navigate('/payment_in_update', { state: { id } });
        setActiveRowMenu(null);
    };

    const handlePaymentUpdate = (paymentId, updatedPayments) => {
        setPayments((prevPayments) => {
            const updated = prevPayments.map(p => {
                if (p.id === paymentId) {
                    const received = updatedPayments.reduce((sum, x) => sum + (parseFloat(x.amount) || 0), 0);
                    const outstanding = (p.totalAmount || 0) - received;
                    return {
                        ...p,
                        payments: updatedPayments,
                        received,
                        outstanding,
                        paymentType: updatedPayments.map(x => x.method).join(', ') || 'Pending'
                    };
                }
                return p;
            });

            // Persist to localStorage if the updated item exists in saved additions
            try {
                const saved = JSON.parse(localStorage.getItem('payment_in_additions') || '[]');
                if (Array.isArray(saved) && saved.length > 0) {
                    const idx = saved.findIndex(s => s.id === paymentId);
                    if (idx !== -1) {
                        const p = updated.find(u => u.id === paymentId);
                        if (p) {
                            const toSave = {
                                id: p.id,
                                date: p.date,
                                soNo: p.soNo,
                                party: p.party,
                                totalAmount: p.totalAmount,
                                payments: p.payments
                            };
                            saved[idx] = toSave;
                            localStorage.setItem('payment_in_additions', JSON.stringify(saved));
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to update saved payment ins', err);
            }

            return updated;
        });
        setPaymentModal({ isOpen: false, paymentId: null, mode: 'view' });
    };

    const dateOptions = ["Today", "Yesterday", "This Month", "Last Month", "This Year", "Custom Range"];

    return (
        <div className="payment-in-container">
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

                {/* Total Pay In Amount Display */}
                <div className="total-expense-group">
                    <label className="filter-label">Total Pay In Amount</label>
                    <div className="total-expense-amount">₹ {totalPayIn.toLocaleString()}</div>
                </div>
            </div>

            {/* Header */}
            <div className="page-header">
                <div className="table-title">Payment In Table</div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button className="add-expense-main-btn" onClick={() => navigate('/payment_in_add')}> 
                        <FaPlus />&nbsp; Add Payment In
                    </button>
                    
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

            {/* Table */}
            <div className="custom-table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>SO no</th>
                            <th>Party</th>
                            <th>Received</th>
                            <th>Outstanding</th>
                            <th>Status</th>
                            <th>Total Amount</th>
                            <th>Payment Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPayments.map((payment) => (
                            <tr key={payment.id}>
                                <td>{payment.date}</td>
                                <td>{payment.soNo}</td>
                                <td>{payment.party}</td>
                                <td>₹{(payment.received || 0).toLocaleString()}</td>
                                <td>₹{(payment.outstanding || 0).toLocaleString()}</td>
                                <td>
                                    {(() => {
                                        const received = Number(payment.received || 0);
                                        const total = Number(payment.totalAmount || 0);
                                        if (received >= total && total > 0) {
                                            return <span className="status-badge badge-paid">Full Received</span>;
                                        }
                                        if (received > 0 && received < total) {
                                            return <span className="status-badge badge-partial">Partially Received</span>;
                                        }
                                        return <span className="status-badge badge-unpaid">Due</span>;
                                    })()}
                                </td>
                                <td>₹{payment.totalAmount.toLocaleString()}</td>
                                <td>
                                    <div className="payment-type">
                                        {payment.paymentType}
                                        <FaPlus
                                            className="plus-icon-green"
                                            onClick={() => setPaymentModal({ isOpen: true, paymentId: payment.id, mode: 'view' })}
                                        />
                                    </div>
                                </td>
                                <td>
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {activeRowMenu && menuCoords && (
                <RowOptionsPortal coords={menuCoords}>
                    <div onClick={() => { handleUpdatePayment(activeRowMenu); setActiveRowMenu(null); setMenuCoords(null); }}>Update</div>
                    <div onClick={() => { handleDeletePayment(activeRowMenu); setActiveRowMenu(null); setMenuCoords(null); }} className="delete">Delete</div>
                </RowOptionsPortal>
            )}

            <PaymentDetailsOverlay
                isOpen={paymentModal.isOpen}
                onClose={() => setPaymentModal({ isOpen: false, paymentId: null, mode: 'view' })}
                onConfirm={(updatedPayments) => handlePaymentUpdate(paymentModal.paymentId, updatedPayments)}
                initialPayments={payments.find(p => p.id === paymentModal.paymentId)?.payments}
                totalAmount={payments.find(p => p.id === paymentModal.paymentId)?.totalAmount}
                mode={paymentModal.mode}
                onEdit={() => setPaymentModal({ ...paymentModal, mode: 'edit' })}
            />

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
        </div>
    );
}
