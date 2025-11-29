import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaEllipsisV } from 'react-icons/fa';
import RowOptionsPortal from '../../../../components/admin components/RowOptionsPortal';
import PaymentDetailsOverlay from '../Expenses/PaymentDetailsOverlay';
import './AddPaymentIn.css';

const AddPaymentIn = ({ onCancel, onSave }) => {
    const navigate = useNavigate();
    const [rows, setRows] = useState([
        {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            soNo: '',
            party: '',
            totalAmount: '',
            payments: [],
            status: 'Due'
        }
    ]);

    const [activePaymentRowId, setActivePaymentRowId] = useState(null);
    const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
    const [activeOptionRowId, setActiveOptionRowId] = useState(null);
    const [menuCoords, setMenuCoords] = useState(null);

    const handleAddRow = () => {
        setRows([...rows, { id: Date.now(), date: new Date().toISOString().split('T')[0], soNo: '', party: '', totalAmount: '', payments: [], status: 'Due' }]);
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
                    const received = r.payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
                    const balance = total - received;
                    if (received >= total && total > 0) updated.status = 'Full Received';
                    else if (received > 0 && balance > 0) updated.status = 'Partially Received';
                    else updated.status = 'Due';
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
                const received = payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
                const balance = total - received;
                let status = 'Due';
                if (received >= total && total > 0) status = 'Full Received';
                else if (received > 0 && balance > 0) status = 'Partially Received';
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
                <div className="table-title">Add Payment In</div>
            </div>

            <div className="expense-form-content">
                <table className="expense-input-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>SO No</th>
                            <th>Party</th>
                            <th>Total Amount</th>
                            <th>Payment type</th>
                            <th>Received</th>
                            <th>Outstanding</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => {
                            const received = row.payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
                            const balance = (parseFloat(row.totalAmount) || 0) - received;
                            return (
                                <tr key={row.id}>
                                    <td>{idx + 1}</td>
                                    <td><input type="date" className="table-input date-input" value={row.date} onChange={(e) => handleInputChange(row.id, 'date', e.target.value)} /></td>
                                    <td><input className="table-input" value={row.soNo} onChange={(e) => handleInputChange(row.id, 'soNo', e.target.value)} /></td>
                                    <td><input className="table-input" value={row.party} onChange={(e) => handleInputChange(row.id, 'party', e.target.value)} /></td>
                                    <td><input type="number" className="table-input" value={row.totalAmount} onChange={(e) => handleInputChange(row.id, 'totalAmount', e.target.value)} /></td>
                                    <td>
                                        <div className="payment-type-summary">
                                            {row.payments.length > 0 ? row.payments.map(p => p.method).join(', ') : 'Pending'}
                                            <FaPlus className="plus-icon-green" onClick={() => openPaymentOverlay(row.id)} style={{ marginLeft: 8, cursor: 'pointer' }} />
                                        </div>
                                    </td>
                                    <td>₹{received.toLocaleString()}</td>
                                    <td>₹{balance.toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge ${row.status === 'Full Received' ? 'badge-paid' : row.status === 'Partially Received' ? 'badge-partial' : 'badge-unpaid'}`}>{row.status}</span>
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
                    try {
                        const existing = JSON.parse(localStorage.getItem('payment_in_additions') || '[]');
                        const toSave = rows.map(r => {
                            const payments = Array.isArray(r.payments) ? r.payments.map(p => ({ ...p, amount: Number(p.amount) })) : [];
                            const received = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
                            const totalAmount = Number(r.totalAmount) || 0;
                            const outstanding = totalAmount - received;
                            return {
                                id: r.id || Date.now(),
                                date: r.date,
                                soNo: r.soNo,
                                party: r.party,
                                received,
                                outstanding,
                                totalAmount,
                                paymentType: payments.map(x => x.method).join(', ') || 'Pending',
                                payments
                            };
                        });
                        const merged = [...existing, ...toSave];
                        localStorage.setItem('payment_in_additions', JSON.stringify(merged));
                        if (onSave) onSave(toSave);
                        navigate('/payment_in');
                    } catch (err) {
                        console.error('Failed to save payment in', err);
                        alert('Failed to save. See console for details.');
                    }
                }}>Create Payment In</button>
                <button className="cancel-form-btn" onClick={() => {
                    if (onCancel) onCancel();
                    navigate('/payment_in');
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

export default AddPaymentIn;
