import React, { useState, useEffect } from 'react';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import PaymentDetailsOverlay from './PaymentDetailsOverlay';
import CustomDropdown from './CustomDropdown';
import { InputModal, DeleteConfirmationModal } from './ExpenseModals';
import './OperationalExpenses.css';

const UpdateExpenseForm = ({ onCancel, onUpdate, expense, categories, subCategories }) => {
    const [expenseData, setExpenseData] = useState({
        id: '',
        date: '',
        party: '',
        category: '',
        subCategory: '',
        totalAmount: '',
        payments: [],
        status: 'Unpaid'
    });

    const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);

    // Modal States for Dropdowns
    const [inputModal, setInputModal] = useState({ isOpen: false, type: '', item: '' });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: '', category: '' });

    useEffect(() => {
        if (expense) {
            setExpenseData({
                id: expense.id,
                date: expense.date,
                party: expense.party,
                category: expense.category,
                subCategory: expense.subCategory,
                totalAmount: expense.amount,
                payments: expense.payments || [],
                status: expense.status
            });
        }
    }, [expense]);

    const handleInputChange = (field, value) => {
        setExpenseData(prev => {
            const updated = { ...prev, [field]: value };

            if (field === 'category') {
                updated.subCategory = '';
            }

            if (field === 'totalAmount') {
                const total = parseFloat(value) || 0;
                const paid = prev.payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
                const balance = total - paid;

                if (balance <= 0 && paid > 0) updated.status = 'Full Paid';
                else if (paid > 0 && balance > 0) updated.status = 'Partially Paid';
                else updated.status = 'Unpaid';
            }

            return updated;
        });
    };

    const handlePaymentConfirm = (payments) => {
        const total = parseFloat(expenseData.totalAmount) || 0;
        const paid = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        const balance = total - paid;

        let status = 'Unpaid';
        if (balance <= 0 && paid > 0) status = 'Full Paid';
        else if (paid > 0 && balance > 0) status = 'Partially Paid';
        else if (paid === 0) status = 'Unpaid';

        setExpenseData(prev => ({ ...prev, payments, status }));
        setShowPaymentOverlay(false);
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

    const paidAmount = expenseData.payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const balance = (parseFloat(expenseData.totalAmount) || 0) - paidAmount;

    return (
        <div className="add-expense-container">
            <div className="page-header">
                <div className="table-title">
                    Update Expense
                </div>
            </div>

            <div className="expense-input-table-container">
                <table className="expense-input-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Category</th>
                            <th>Sub-Category</th>
                            <th>Party</th>
                            <th>Total Amount</th>
                            <th>Payment type</th>
                            <th>Paid</th>
                            <th>Balance</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td style={{ minWidth: '180px' }}>
                                <CustomDropdown
                                    options={categories}
                                    selected={expenseData.category}
                                    onSelect={(val) => handleInputChange('category', val)}
                                    placeholder="Select"
                                    searchPlaceholder="Search"
                                    onAddNew={() => setInputModal({ isOpen: true, type: 'createCategory' })}
                                    onRename={(item) => setInputModal({ isOpen: true, type: 'rename', item })}
                                    onDelete={(item) => setDeleteModal({ isOpen: true, item, category: 'Category' })}
                                    type="category"
                                />
                            </td>
                            <td style={{ minWidth: '180px' }}>
                                <CustomDropdown
                                    options={expenseData.category ? subCategories[expenseData.category] || [] : []}
                                    selected={expenseData.subCategory}
                                    onSelect={(val) => handleInputChange('subCategory', val)}
                                    placeholder="Select"
                                    searchPlaceholder="Search"
                                    onAddNew={() => setInputModal({ isOpen: true, type: 'createSubCategory' })}
                                    onRename={(item) => setInputModal({ isOpen: true, type: 'rename', item })}
                                    onDelete={(item) => setDeleteModal({ isOpen: true, item, category: 'Sub Category' })}
                                    disabled={!expenseData.category}
                                    type="subCategory"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Enter Party"
                                    className="table-input"
                                    value={expenseData.party}
                                    onChange={(e) => handleInputChange('party', e.target.value)}
                                />
                            </td>
                            <td>
                                <div className="amount-input-wrapper">
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="table-input amount-input"
                                        value={expenseData.totalAmount}
                                        onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="payment-type-summary">
                                    {expenseData.payments.length > 0
                                        ? expenseData.payments.map(p => p.method).join(', ')
                                        : 'Pending'
                                    }
                                    <FaPlus
                                        className="plus-icon-green"
                                        onClick={() => setShowPaymentOverlay(true)}
                                        style={{ marginLeft: '8px', fontSize: '14px' }}
                                    />
                                </div>
                            </td>
                            <td>₹{paidAmount.toLocaleString()}</td>
                            <td>₹{balance.toLocaleString()}</td>
                            <td>
                                <span className={`status-badge ${expenseData.status === 'Full Paid' ? 'badge-paid' :
                                    expenseData.status === 'Partially Paid' ? 'badge-partial' : 'badge-unpaid'
                                    }`}>
                                    {expenseData.status}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


            <div className="form-actions">
                <button className="create-expense-btn" onClick={() => onUpdate(expenseData)}>Update Expense</button>
                <button className="cancel-form-btn" onClick={onCancel}>Cancel</button>
            </div>

            <PaymentDetailsOverlay
                isOpen={showPaymentOverlay}
                onClose={() => setShowPaymentOverlay(false)}
                onConfirm={handlePaymentConfirm}
                initialPayments={expenseData.payments}
                totalAmount={expenseData.totalAmount}
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
        </div>
    );
};

export default UpdateExpenseForm;
