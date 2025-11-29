import React, { useState, useEffect } from 'react';
import { FaTrash, FaCalendarAlt, FaPlus, FaEdit } from 'react-icons/fa';
import './OperationalExpenses.css';

const PaymentDetailsOverlay = ({ isOpen, onClose, onConfirm, initialPayments, totalAmount, mode = 'edit', onEdit }) => {
    const [payments, setPayments] = useState(initialPayments || []);

    useEffect(() => {
        if (isOpen) {
            setPayments(initialPayments || []);
        }
    }, [isOpen, initialPayments]);

    const handleAddPayment = () => {
        setPayments([
            ...payments,
            {
                id: Date.now(),
                method: 'Cash',
                amount: '',
                reference: '', // Invoice No, Ref No, or UPI ID based on method
                date: new Date().toISOString().split('T')[0],
            },
        ]);
    };

    const handleDeletePayment = (id) => {
        setPayments(payments.filter((p) => p.id !== id));
    };

    const handlePaymentChange = (id, field, value) => {
        setPayments(
            payments.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
    };

    const calculateTotalPaid = () => {
        return payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    };

    const handleConfirm = () => {
        onConfirm(payments);
        onClose();
    };

    if (!isOpen) return null;

    if (mode === 'view') {
        return (
            <div className="overlay-backdrop">
                <div className="payment-overlay-container">
                    <div className="overlay-header">
                        <h3>Payment Details</h3>
                        <div className="overlay-line"></div>
                        <button className="edit-details-btn" onClick={onEdit}>Edit / Add Payment</button>
                    </div>

                    <div className="payment-rows-container">
                        {payments.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#666' }}>No payments recorded.</p>
                        ) : (
                            payments.map((payment) => (
                                <div key={payment.id} className="payment-row view-mode">
                                    <div className="payment-field-group">
                                        <label>Payment Method</label>
                                        <div className="view-value">{payment.method}</div>
                                    </div>

                                    <div className="payment-field-group">
                                        <label>Amount</label>
                                        <div className="view-value">₹{parseFloat(payment.amount || 0).toLocaleString()}</div>
                                    </div>

                                    <div className="payment-field-group">
                                        <label>
                                            {payment.method === 'Cash' ? 'Invoice No' : payment.method === 'Bank' ? 'Ref No' : 'UPI ID'}
                                        </label>
                                        <div className="view-value">{payment.reference || '-'}</div>
                                    </div>

                                    <div className="payment-field-group">
                                        <label>Payment Date</label>
                                        <div className="view-value">{payment.date}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="overlay-footer">
                        <button className="cancel-btn" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overlay-backdrop">
            <div className="payment-overlay-container">
                <div className="overlay-header">
                    <h3>Payment Details</h3>
                    <div className="overlay-line"></div>
                    {/* <button className="edit-details-btn">Edit Details</button> */}
                </div>

                <div className="payment-rows-container">
                    {payments.map((payment, index) => (
                        <div key={payment.id} className="payment-row">
                            <div className="payment-field-group">
                                <label>Payment Method</label>
                                <div className="custom-select-wrapper">
                                    <select
                                        value={payment.method}
                                        onChange={(e) => handlePaymentChange(payment.id, 'method', e.target.value)}
                                        className="custom-select"
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Bank">Bank</option>
                                        <option value="UPI">UPI</option>
                                    </select>
                                </div>
                            </div>

                            <div className="payment-field-group">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    value={payment.amount}
                                    onChange={(e) => handlePaymentChange(payment.id, 'amount', e.target.value)}
                                    placeholder="₹0"
                                    className="custom-input"
                                />
                            </div>

                            <div className="payment-field-group">
                                <label>
                                    {payment.method === 'Cash' ? 'Invoice No' : payment.method === 'Bank' ? 'Ref No' : 'UPI ID'}
                                </label>
                                <input
                                    type="text"
                                    value={payment.reference}
                                    onChange={(e) => handlePaymentChange(payment.id, 'reference', e.target.value)}
                                    placeholder={
                                        payment.method === 'Cash'
                                            ? 'INV12345'
                                            : payment.method === 'Bank'
                                                ? 'Ref12345'
                                                : 'user@upi'
                                    }
                                    className="custom-input"
                                />
                            </div>

                            <div className="payment-field-group">
                                <label>Payment Date</label>
                                <div className="date-input-wrapper">
                                    <input
                                        type="date"
                                        value={payment.date}
                                        onChange={(e) => handlePaymentChange(payment.id, 'date', e.target.value)}
                                        className="custom-input date-input"
                                    />
                                    {/* <FaCalendarAlt className="calendar-icon" /> */}
                                </div>
                            </div>

                            <div className="payment-action">
                                <FaTrash
                                    className="delete-icon"
                                    onClick={() => handleDeletePayment(payment.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button className="add-new-payment-btn" onClick={handleAddPayment}>
                    <FaPlus /> Add New Payment
                </button>

                <div className="overlay-footer">
                    <button className="confirm-btn" onClick={handleConfirm}>
                        Confirm
                    </button>
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailsOverlay;
