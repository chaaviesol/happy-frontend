import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import PaymentDetailsOverlay from '../Expenses/PaymentDetailsOverlay';
import './UpdatePayments.css';

const UpdatePaymentOut = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const paymentId = location?.state?.id;

    const [paymentData, setPaymentData] = useState({
        id: null,
        date: '',
        poNo: '',
        party: '',
        totalAmount: '',
        payments: [],
        status: 'Unpaid'
    });

    const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('payment_out_additions') || '[]');
            const found = Array.isArray(saved) ? saved.find(s => s.id === paymentId) : null;
            if (found) {
                setPaymentData({
                    id: found.id,
                    date: found.date || '',
                    poNo: found.poNo || '',
                    party: found.party || '',
                    totalAmount: found.totalAmount || '',
                    payments: found.payments || [],
                    status: determineStatus(found.totalAmount, found.payments || [])
                });
                return;
            }
        } catch (err) {}

        if (location?.state?.item) {
            const item = location.state.item;
            setPaymentData({ ...item, status: determineStatus(item.totalAmount, item.payments || []) });
        }
    }, [paymentId, location]);

    const determineStatus = (total, payments) => {
        const t = Number(total) || 0;
        const paid = (payments || []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
        if (paid >= t && t > 0) return 'Full Paid';
        if (paid > 0 && paid < t) return 'Partially Paid';
        return 'Unpaid';
    };

    const handleInputChange = (field, value) => setPaymentData(prev => ({ ...prev, [field]: value }));

    const handlePaymentConfirm = (payments) => {
        const status = determineStatus(paymentData.totalAmount, payments);
        setPaymentData(prev => ({ ...prev, payments, status }));
        setShowPaymentOverlay(false);
    };

    const handleUpdate = () => {
        try {
            const saved = JSON.parse(localStorage.getItem('payment_out_additions') || '[]');
            if (Array.isArray(saved)) {
                const idx = saved.findIndex(s => s.id === paymentData.id);
                const toSave = {
                    id: paymentData.id || Date.now(),
                    date: paymentData.date,
                    poNo: paymentData.poNo,
                    party: paymentData.party,
                    totalAmount: paymentData.totalAmount,
                    payments: paymentData.payments
                };
                if (idx === -1) saved.push(toSave); else saved[idx] = toSave;
                localStorage.setItem('payment_out_additions', JSON.stringify(saved));
            }
        } catch (err) {
            console.error('Failed to persist payment out update', err);
        }

        navigate('/payment_out');
    };

    return (
        <div className="update-payment-container">
            <div className="page-header">
                <div className="table-title">Update Payment Out</div>
            </div>

            <div className="expense-input-table-container">
                <table className="expense-input-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>PO No</th>
                            <th>Party</th>
                            <th>Total Amount</th>
                            <th>Payment type</th>
                            <th>Paid</th>
                            <th>Outstanding</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>
                                <input type="date" className="table-input" value={paymentData.date} onChange={(e)=>handleInputChange('date', e.target.value)} />
                            </td>
                            <td>
                                <input type="text" className="table-input" value={paymentData.poNo} onChange={(e)=>handleInputChange('poNo', e.target.value)} />
                            </td>
                            <td>
                                <input type="text" className="table-input" value={paymentData.party} onChange={(e)=>handleInputChange('party', e.target.value)} />
                            </td>
                            <td>
                                <div className="amount-input-wrapper">
                                    <span>₹</span>
                                    <input type="number" className="table-input amount-input" value={paymentData.totalAmount} onChange={(e)=>handleInputChange('totalAmount', e.target.value)} />
                                </div>
                            </td>
                            <td>
                                <div className="payment-type-summary">
                                    {paymentData.payments.length > 0 ? paymentData.payments.map(p => p.method).join(', ') : 'Pending'}
                                    <FaPlus className="plus-icon-green" onClick={() => setShowPaymentOverlay(true)} />
                                </div>
                            </td>
                            <td>₹{(paymentData.payments || []).reduce((s,p)=>s+(Number(p.amount)||0),0).toLocaleString()}</td>
                            <td>₹{((Number(paymentData.totalAmount)||0) - (paymentData.payments || []).reduce((s,p)=>s+(Number(p.amount)||0),0)).toLocaleString()}</td>
                            <td>
                                <span className={`status-badge ${paymentData.status === 'Full Paid' ? 'badge-paid' : paymentData.status === 'Partially Paid' ? 'badge-partial' : 'badge-unpaid'}`}>
                                    {paymentData.status}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="form-actions">
                <button className="create-expense-btn" onClick={handleUpdate}>Update</button>
                <button className="cancel-form-btn" onClick={() => navigate('/payment_out')}>Cancel</button>
            </div>

            <PaymentDetailsOverlay
                isOpen={showPaymentOverlay}
                onClose={() => setShowPaymentOverlay(false)}
                onConfirm={handlePaymentConfirm}
                initialPayments={paymentData.payments}
                totalAmount={paymentData.totalAmount}
            />
        </div>
    );
};

export default UpdatePaymentOut;
