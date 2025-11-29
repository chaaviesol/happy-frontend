import React, { useState } from 'react';
import { FaPlus, FaTrash, FaArrowLeft, FaEllipsisV } from 'react-icons/fa';
import PaymentDetailsOverlay from './PaymentDetailsOverlay';
import CustomDropdown from './CustomDropdown';
import { InputModal, DeleteConfirmationModal } from './ExpenseModals';
import './OperationalExpenses.css';

const AddExpenseForm = ({ onCancel, onSave, categories, subCategories }) => {
    const [expenseRows, setExpenseRows] = useState([
        {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            party: '',
            category: '',
            subCategory: '',
            totalAmount: '',
            payments: [],
            status: 'Unpaid'
        }
    ]);

    const [activePaymentRowId, setActivePaymentRowId] = useState(null);
    const [activeOptionRowId, setActiveOptionRowId] = useState(null);
    const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);

    // Modal States for Dropdowns
    const [inputModal, setInputModal] = useState({ isOpen: false, type: '', item: '' });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: '', category: '' });

    const handleAddRow = () => {
        setExpenseRows([
            ...expenseRows,
            {
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                party: '',
                category: '',
                subCategory: '',
                totalAmount: '',
                payments: [],
                status: 'Unpaid'
            }
        ]);
    };

    const handleDeleteRow = (id) => {
        if (expenseRows.length > 1) {
            setExpenseRows(expenseRows.filter(row => row.id !== id));
        }
    };

    const handleDuplicateRow = (row) => {
        const newRow = {
            ...row,
            id: Date.now(),
            payments: [...row.payments] // Deep copy payments if needed
        };
        setExpenseRows([...expenseRows, newRow]);
        setActiveOptionRowId(null);
    };

    const handleInputChange = (id, field, value) => {
        setExpenseRows(expenseRows.map(row => {
            if (row.id === id) {
                const updatedRow = { ...row, [field]: value };

                // Reset subCategory if category changes
                if (field === 'category') {
                    updatedRow.subCategory = '';
                }

                // Recalculate status if amount changes
                if (field === 'totalAmount') {
                    const total = parseFloat(value) || 0;
                    const paid = row.payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
                    const balance = total - paid;

                    if (balance <= 0 && paid > 0) updatedRow.status = 'Full Paid';
                    else if (paid > 0 && balance > 0) updatedRow.status = 'Partially Paid';
                    else updatedRow.status = 'Unpaid';
                }

                return updatedRow;
            }
            return row;
        }));
    };

    const openPaymentOverlay = (id) => {
        setActivePaymentRowId(id);
        setShowPaymentOverlay(true);
    };

    const handlePaymentConfirm = (payments) => {
        setExpenseRows(expenseRows.map(row => {
            if (row.id === activePaymentRowId) {
                const total = parseFloat(row.totalAmount) || 0;
                const paid = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
                const balance = total - paid;

                let status = 'Unpaid';
                if (balance <= 0 && paid > 0) status = 'Full Paid';
                else if (paid > 0 && balance > 0) status = 'Partially Paid';
                else if (paid === 0) status = 'Unpaid'; // Or 'Nil' if preferred

                return { ...row, payments, status };
            }
            return row;
        }));
        setShowPaymentOverlay(false);
        setActivePaymentRowId(null);
    };

    const calculateTotalExpense = () => {
        return expenseRows.reduce((sum, row) => sum + (parseFloat(row.totalAmount) || 0), 0);
    };

    // Modal Handlers (Mock logic)
    const handleCreateCategory = (name) => {
        alert(`Created Category: ${name}`);
        setInputModal({ ...inputModal, isOpen: false });
    };

    const handleCreateSubCategory = (name) => {
        alert(`Created Sub Category: ${name}`);
        setInputModal({ ...inputModal, isOpen: false });
    };

    const handleRename = (newName) => {
        alert(`Renamed ${inputModal.item} to ${newName}`);
        setInputModal({ ...inputModal, isOpen: false });
    };

    const handleDelete = () => {
        alert(`Deleted ${deleteModal.item}`);
        setDeleteModal({ ...deleteModal, isOpen: false });
    };

    return (
        <div className="add-expense-container">
            <div className="page-header">
                <div className="table-title">
                    Add Expense
                </div>
            </div>

            <div className="expense-form-content">
                <table className="expense-input-table">
                    <thead>
                        <tr>
                            <th style={{ width: '100px' }}>Date</th>
                            <th style={{ minWidth: '180px' }}>Category</th>
                            <th style={{ minWidth: '180px' }}>Sub Category</th>
                            <th style={{ minWidth: '180px' }}>Party</th>
                            <th>Total Amount</th>
                            <th>Paid</th>
                            <th>Balance</th>
                            <th>Status</th>
                            <th>Payment Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenseRows.map((row) => {
                            const paidAmount = row.payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
                            const balance = (parseFloat(row.totalAmount) || 0) - paidAmount;


                            return (
                                <tr key={row.id}>
                                    <td style={{ width: '100px' }}>
                                        <input
                                            type="date"
                                            className="table-input date-input"
                                            value={row.date}
                                            onChange={(e) => handleInputChange(row.id, 'date', e.target.value)} />
                                    </td>
                                    <td>
                                        <CustomDropdown
                                            options={categories}
                                            selected={row.category}
                                            onSelect={(val) => handleInputChange(row.id, 'category', val)}
                                            placeholder="Select"
                                            searchPlaceholder="Search"
                                            onAddNew={() => setInputModal({ isOpen: true, type: 'createCategory' })}
                                            onRename={(item) => setInputModal({ isOpen: true, type: 'rename', item })}
                                            onDelete={(item) => setDeleteModal({ isOpen: true, item, category: 'Category' })}
                                            type="category"
                                        />
                                    </td>
                                    <td>
                                        <CustomDropdown
                                            options={row.category ? subCategories[row.category] || [] : []}
                                            selected={row.subCategory}
                                            onSelect={(val) => handleInputChange(row.id, 'subCategory', val)}
                                            placeholder="Select"
                                            searchPlaceholder="Search"
                                            onAddNew={() => setInputModal({ isOpen: true, type: 'createSubCategory' })}
                                            onRename={(item) => setInputModal({ isOpen: true, type: 'rename', item })}
                                            onDelete={(item) => setDeleteModal({ isOpen: true, item, category: 'Sub Category' })}
                                            disabled={!row.category}
                                            type="subCategory"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Enter Party"
                                            className="table-input"
                                            value={row.party}
                                            onChange={(e) => handleInputChange(row.id, 'party', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            placeholder="₹0"
                                            className="table-input"
                                            value={row.totalAmount}
                                            onChange={(e) => handleInputChange(row.id, 'totalAmount', e.target.value)}
                                        />
                                    </td>

                                    <td>₹{paidAmount.toLocaleString()}</td>
                                    <td>₹{balance.toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge ${row.status === 'Full Paid' ? 'badge-paid' :
                                            row.status === 'Partially Paid' ? 'badge-partial' : 'badge-unpaid'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="payment-type-summary">
                                            {row.payments.length > 0
                                                ? row.payments.map(p => p.method).join(', ')
                                                : 'Pending'
                                            }
                                            <FaPlus
                                                className="plus-icon-green"
                                                onClick={() => openPaymentOverlay(row.id)}
                                                style={{ marginLeft: '8px', cursor: 'pointer' }}
                                            />
                                        </div>
                                    </td>
                                    <td style={{ position: 'relative' }}>
                                        <FaEllipsisV
                                            className="row-options-icon"
                                            onClick={() => setActiveOptionRowId(activeOptionRowId === row.id ? null : row.id)}
                                        />
                                        {activeOptionRowId === row.id && (
                                            <div className="row-options-menu">
                                                <div onClick={() => handleDuplicateRow(row)}>Duplicate</div>
                                                <div onClick={() => handleDeleteRow(row.id)} className="delete">Delete</div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <button className="add-new-row-btn" onClick={handleAddRow}>
                    <FaPlus /> Add New Row
                </button>

                <div className="total-summary">
                    <span>Total</span>
                    <span className="total-amount-value">₹{calculateTotalExpense().toLocaleString()}</span>
                </div>
            </div>

            <div className="form-actions">
                <button className="create-expense-btn" onClick={() => onSave(expenseRows)}>Create Expense</button>
                <button className="cancel-form-btn" onClick={onCancel}>Cancel</button>
            </div>

            <PaymentDetailsOverlay
                isOpen={showPaymentOverlay}
                onClose={() => setShowPaymentOverlay(false)}
                onConfirm={handlePaymentConfirm}
                initialPayments={expenseRows.find(r => r.id === activePaymentRowId)?.payments}
                totalAmount={expenseRows.find(r => r.id === activePaymentRowId)?.totalAmount}
            />

            {/* Modals */}
            <InputModal
                isOpen={inputModal.isOpen}
                onClose={() => setInputModal({ ...inputModal, isOpen: false })}
                onConfirm={
                    inputModal.type === 'createCategory' ? handleCreateCategory :
                        inputModal.type === 'createSubCategory' ? handleCreateSubCategory :
                            handleRename
                }
                title={
                    inputModal.type === 'createCategory' ? 'Create Category' :
                        inputModal.type === 'createSubCategory' ? 'Enter Sub Category Name' :
                            `Rename ${inputModal.item}`
                }
                placeholder={inputModal.type === 'rename' ? '' : 'Enter Name'}
                initialValue={inputModal.type === 'rename' ? inputModal.item : ''}
                confirmText={inputModal.type.includes('create') ? 'Create' : 'Confirm'}
            />

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={handleDelete}
                itemName={deleteModal.item}
                categoryName={deleteModal.category}
            />
        </div >
    );
};

export default AddExpenseForm;
