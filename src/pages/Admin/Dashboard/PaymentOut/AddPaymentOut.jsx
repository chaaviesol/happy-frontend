import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaEllipsisV } from 'react-icons/fa';
import RowOptionsPortal from '../../../../components/admin components/RowOptionsPortal';
import PaymentDetailsOverlay from '../Expenses/PaymentDetailsOverlay';
import './AddPaymentOut.css';

const AddPaymentOut = ({ onCancel, onSave }) => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([
        {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            poNo: '',
            party: '',
            totalAmount: '',
            payments: [],
            status: 'Unpaid'
        }
    ]);

    const [activePaymentRowId, setActivePaymentRowId] = useState(null);
    const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
    const [activeOptionRowId, setActiveOptionRowId] = useState(null);
    const [menuCoords, setMenuCoords] = useState(null);

    const handleAddRow = () => {
        setRows([...rows, { id: Date.now(), date: new Date().toISOString().split('T')[0], poNo: '', party: '', totalAmount: '', payments: [], status: 'Unpaid' }]);
    };

    const handleDeleteRow = (id) => {
        if (rows.length > 1) setRows(rows.filter(r => r.id !== id));
    };

    const handleDuplicateRow = (id) => {
        const idx = rows.findIndex(r => r.id === id);
        if (idx !== -1) {
            const rowToCopy = rows[idx];
            const newRow = { ...rowToCopy, id: Date.now() };
            const newRows = [...rows];
            newRows.splice(idx + 1, 0, newRow);
            setRows(newRows);
            setActiveOptionRowId(null);
            setMenuCoords(null);
        }
    };

    const handleInputChange = (id, field, value) => {
        setRows(rows.map(r => {
            if (r.id === id) {
                const updated = { ...r, [field]: value };
                if (field === 'totalAmount') {
                    const total = parseFloat(value) || 0;
                    const paid = r.payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
                    const balance = total - paid;
                    if (balance <= 0 && paid > 0) updated.status = 'Full Paid';
                    else if (paid > 0 && balance > 0) updated.status = 'Partially Paid';
                    else updated.status = 'Unpaid';
                }
                return updated;
            }
            return r;
        }));
    };

    const openPaymentOverlay = (id) => { setActivePaymentRowId(id); setShowPaymentOverlay(true); };

    const handlePaymentConfirm = (payments) => {
        setRows(rows.map(r => {
            if (r.id === activePaymentRowId) {
                const total = parseFloat(r.totalAmount) || 0;
                const paid = payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
                const balance = total - paid;
                let status = 'Unpaid';
                if (balance <= 0 && paid > 0) status = 'Full Paid';
                else if (paid > 0 && balance > 0) status = 'Partially Paid';
                return { ...r, payments, status };
            }
            return r;
        }));
        setShowPaymentOverlay(false); setActivePaymentRowId(null);
    };

    const calculateTotal = () => rows.reduce((s, r) => s + (parseFloat(r.totalAmount) || 0), 0);

    return (
        <div className="add-payment-container">
            <div className="page-header">
                <div className="table-title">Add Payment Out</div>
            </div>

            <div className="expense-form-content">
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
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => {
                            const paid = row.payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
                            const balance = (parseFloat(row.totalAmount) || 0) - paid;
                            return (
                                <tr key={row.id}>
                                    <td>{idx + 1}</td>
                                    <td><input type="date" className="table-input date-input" value={row.date} onChange={(e) => handleInputChange(row.id, 'date', e.target.value)} /></td>
                                    <td><input className="table-input" value={row.poNo} onChange={(e) => handleInputChange(row.id, 'poNo', e.target.value)} /></td>
                                    <td><input className="table-input" value={row.party} onChange={(e) => handleInputChange(row.id, 'party', e.target.value)} /></td>
                                    <td><input type="number" className="table-input" value={row.totalAmount} onChange={(e) => handleInputChange(row.id, 'totalAmount', e.target.value)} /></td>
                                    <td>
                                        <div className="payment-type-summary">
                                            {row.payments.length > 0 ? row.payments.map(p => p.method).join(', ') : 'Pending'}
                                            <FaPlus className="plus-icon-green" onClick={() => openPaymentOverlay(row.id)} style={{ marginLeft: 8, cursor: 'pointer' }} />
                                        </div>
                                    </td>
                                    <td>₹{paid.toLocaleString()}</td>
                                    <td>₹{balance.toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge ${row.status === 'Full Paid' ? 'badge-paid' : row.status === 'Partially Paid' ? 'badge-partial' : 'badge-unpaid'}`}>{row.status}</span>
                                    </td>
                                    <td>
                                        <FaEllipsisV className="row-options-icon" onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            if (activeOptionRowId === row.id) {
                                                setActiveOptionRowId(null);
                                                setMenuCoords(null);
                                            } else {
                                                setActiveOptionRowId(row.id);
                                                setMenuCoords(rect);
                                            }
                                        }} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <button className="add-new-row-btn" onClick={handleAddRow}><FaPlus /> Add New Row</button>

                <div className="total-summary"><span>Total</span><span className="total-amount-value">₹{calculateTotal().toLocaleString()}</span></div>
            </div>

            <div className="form-actions">
                <button className="create-expense-btn" onClick={() => {
                    // Prepare rows and persist to localStorage
                    try {
                        const existing = JSON.parse(localStorage.getItem('payment_out_additions') || '[]');
                        const toSave = rows.map(r => {
                            const payments = Array.isArray(r.payments) ? r.payments.map(p => ({ ...p, amount: Number(p.amount) })) : [];
                            const paid = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
                            const totalAmount = Number(r.totalAmount) || 0;
                            const outstanding = totalAmount - paid;
                            return {
                                id: r.id || Date.now(),
                                date: r.date,
                                poNo: r.poNo,
                                party: r.party,
                                paid,
                                outstanding,
                                totalAmount,
                                paymentType: payments.map(x => x.method).join(', ') || 'Pending',
                                payments
                            };
                        });
                        const merged = [...existing, ...toSave];
                        localStorage.setItem('payment_out_additions', JSON.stringify(merged));
                        // If parent provided onSave callback, also call it
                        if (onSave) onSave(toSave);
                        navigate('/payment_out');
                    } catch (err) {
                        console.error('Failed to save payment out', err);
                        alert('Failed to save. See console for details.');
                    }
                }}>Create Payment Out</button>
                <button className="cancel-form-btn" onClick={() => {
                    if (onCancel) onCancel();
                    navigate('/payment_out');
                }}>Cancel</button>
            </div>

            {activeOptionRowId && menuCoords && (
                <RowOptionsPortal coords={menuCoords}>
                    <div onClick={() => { handleDuplicateRow(activeOptionRowId); setActiveOptionRowId(null); setMenuCoords(null); }}>Duplicate</div>
                    <div onClick={() => { handleDeleteRow(activeOptionRowId); setActiveOptionRowId(null); setMenuCoords(null); }} className="delete">Delete</div>
                </RowOptionsPortal>
            )}

            <PaymentDetailsOverlay isOpen={showPaymentOverlay} onClose={() => setShowPaymentOverlay(false)} onConfirm={handlePaymentConfirm} initialPayments={rows.find(r => r.id === activePaymentRowId)?.payments} totalAmount={rows.find(r => r.id === activePaymentRowId)?.totalAmount} />
        </div>
    );
};

export default AddPaymentOut;
