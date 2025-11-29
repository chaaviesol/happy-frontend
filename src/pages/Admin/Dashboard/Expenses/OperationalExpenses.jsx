import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaSearch, FaEllipsisV, FaChevronDown } from "react-icons/fa";
import AddExpenseForm from "./AddExpenseForm";
import UpdateExpenseForm from "./UpdateExpenseForm";
import CustomDropdown from "./CustomDropdown";
import { InputModal, DeleteConfirmationModal } from "./ExpenseModals";
import PaymentDetailsOverlay from "./PaymentDetailsOverlay";
import "./OperationalExpenses.css";

export default function OperationalExpenses() {
  // Mock Data
  const categories = [
    "Stationary",
    "Raw Materials",
    "Manufacturing",
    "Logistics & Distribution",
    "Sales & Marketing",
    "General & Administrative",
  ];

  const subCategories = {
    Stationary: ["Pencil", "Paper", "Pen", "Rubber", "Book", "Stapler"],
    "Raw Materials": ["Steel", "Plastic", "Wood"],
    Manufacturing: ["Labor", "Electricity", "Maintenance"],
    "Logistics & Distribution": ["Fuel", "Vehicle Maintenance", "Driver Salary"],
    "Sales & Marketing": ["Ads", "Events", "Promotions"],
    "General & Administrative": ["Rent", "Utilities", "Internet"],
  };

  const initialExpenses = [
    {
      id: 1,
      date: "2025-05-11",
      party: "AlphaWidget",
      category: "Stationary",
      subCategory: "Pencil",
      amount: 12000,
      paid: 10000,
      balance: 2000,
      status: "Partially Paid",
      paymentType: "Cash, Bank, UPI",
      payments: [
        { id: 101, method: 'Cash', amount: 5000, reference: 'INV001', date: '2025-05-11' },
        { id: 102, method: 'Bank', amount: 5000, reference: 'REF001', date: '2025-05-11' }
      ]
    },
    {
      id: 2,
      date: "2025-05-12",
      party: "KB Ltd",
      category: "Stationary",
      subCategory: "Paper",
      amount: 12000,
      paid: 12000,
      balance: 0,
      status: "Full Paid",
      paymentType: "Cash, Bank, UPI",
      payments: [
        { id: 201, method: 'Cash', amount: 12000, reference: 'INV002', date: '2025-05-12' }
      ]
    },
    {
      id: 3,
      date: "2025-05-13",
      party: "Gamma Corp",
      category: "Raw Materials",
      subCategory: "Steel",
      amount: 50000,
      paid: 0,
      balance: 50000,
      status: "Unpaid",
      paymentType: "Pending",
      payments: []
    },
  ];

  // State
  const [viewMode, setViewMode] = useState('list'); // 'list', 'add', 'update'
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [dateRange, setDateRange] = useState("This Month");
  const [customDate, setCustomDate] = useState("05/06/2025 - 05/08/2025");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("2025-05-06");
  const [endDate, setEndDate] = useState("2025-05-08");
  const [searchQuery, setSearchQuery] = useState("");
  const [expenses, setExpenses] = useState(initialExpenses);
  const [activeRowMenu, setActiveRowMenu] = useState(null);

  // Modal States
  const [inputModal, setInputModal] = useState({ isOpen: false, type: '', item: '' }); // type: 'createCategory', 'createSubCategory', 'rename'
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: '', category: '' });
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, expenseId: null, mode: 'view' });

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
  const filteredExpenses = expenses.filter((exp) => {
    if (selectedCategory && exp.category !== selectedCategory) return false;
    if (selectedSubCategory && exp.subCategory !== selectedSubCategory) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        exp.party.toLowerCase().includes(query) ||
        exp.category.toLowerCase().includes(query) ||
        exp.subCategory.toLowerCase().includes(query) ||
        exp.status.toLowerCase().includes(query) ||
        exp.paymentType.toLowerCase().includes(query) ||
        exp.amount.toString().includes(query);

      if (!matchesSearch) return false;
    }

    return true;
  });

  const totalExpense = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getTableTitle = () => {
    if (selectedSubCategory) return `${selectedSubCategory} Table`;
    if (selectedCategory) return `${selectedCategory} Table`;
    return "All Expenses Table";
  };

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
        // start and end are today
        break;
      case "Yesterday":
        start.setDate(today.getDate() - 1);
        end.setDate(today.getDate() - 1);
        break;
      case "This Month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        // end is today
        break;
      case "Last Month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "This Year":
        start = new Date(today.getFullYear(), 0, 1);
        // end is today
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

  const handleSaveExpense = (newExpenses) => {
    const formattedExpenses = newExpenses.map(exp => ({
      id: exp.id,
      date: exp.date,
      party: exp.party,
      category: exp.category,
      subCategory: exp.subCategory,
      amount: parseFloat(exp.totalAmount) || 0,
      paid: exp.payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
      balance: (parseFloat(exp.totalAmount) || 0) - exp.payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
      status: exp.status,
      paymentType: exp.payments.map(p => p.method).join(', ') || 'Pending',
      payments: exp.payments
    }));

    setExpenses([...expenses, ...formattedExpenses]);
    setViewMode('list');
    alert('Expense Created Successfully!');
  };

  const handleUpdateExpense = (updatedExpense) => {
    setExpenses(expenses.map(exp => {
      if (exp.id === updatedExpense.id) {
        return {
          ...exp,
          date: updatedExpense.date,
          party: updatedExpense.party,
          category: updatedExpense.category,
          subCategory: updatedExpense.subCategory,
          amount: parseFloat(updatedExpense.totalAmount) || 0,
          paid: updatedExpense.payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
          balance: (parseFloat(updatedExpense.totalAmount) || 0) - updatedExpense.payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
          status: updatedExpense.status,
          paymentType: updatedExpense.payments.map(p => p.method).join(', ') || 'Pending',
          payments: updatedExpense.payments
        };
      }
      return exp;
    }));
    setViewMode('list');
    setSelectedExpense(null);
    alert('Expense Updated Successfully!');
  };

  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setViewMode('update');
    setActiveRowMenu(null);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
    setActiveRowMenu(null);
  };

  // Modal Handlers
  const handleCreateCategory = (name) => {
    alert(`Created Category: ${name}`);
    setInputModal({ ...inputModal, isOpen: false });
  };

  const handleCreateSubCategory = (name) => {
    alert(`Created Sub Category: ${name} under ${selectedCategory}`);
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

  const handlePaymentUpdate = (updatedPayments) => {
    setExpenses(expenses.map(exp => {
      if (exp.id === paymentModal.expenseId) {
        const paid = updatedPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        const balance = exp.amount - paid;
        let status = 'Unpaid';
        if (balance <= 0 && paid > 0) status = 'Full Paid';
        else if (paid > 0 && balance > 0) status = 'Partially Paid';
        else if (paid === 0) status = 'Nil';

        return {
          ...exp,
          payments: updatedPayments,
          paid,
          balance,
          status,
          paymentType: updatedPayments.map(p => p.method).join(', ') || 'Pending'
        };
      }
      return exp;
    }));
    setPaymentModal({ ...paymentModal, isOpen: false });
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

  const dateOptions = ["Today", "Yesterday", "This Month", "Last Month", "This Year", "Custom Range"];

  if (viewMode === 'add') {
    return (
      <AddExpenseForm
        onCancel={() => setViewMode('list')}
        onSave={handleSaveExpense}
        categories={categories}
        subCategories={subCategories}
      />
    );
  }

  if (viewMode === 'update' && selectedExpense) {
    return (
      <UpdateExpenseForm
        onCancel={() => { setViewMode('list'); setSelectedExpense(null); }}
        onUpdate={handleUpdateExpense}
        expense={selectedExpense}
        categories={categories}
        subCategories={subCategories}
      />
    );
  }

  const activeExpense = expenses.find(e => e.id === paymentModal.expenseId);

  return (
    <div className="operational-expenses-container">
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
              {/* Calendar Icon could go here */}
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

        {/* Category Filter */}
        <div className="filter-group">
          <label className="filter-label">Select Category</label>
          <CustomDropdown
            options={categories}
            selected={selectedCategory}
            onSelect={(cat) => { setSelectedCategory(cat); setSelectedSubCategory(""); }}
            placeholder="Select Category"
            searchPlaceholder="Search Category"
            onAddNew={() => setInputModal({ isOpen: true, type: 'createCategory' })}
            onRename={(item) => setInputModal({ isOpen: true, type: 'rename', item })}
            onDelete={(item) => setDeleteModal({ isOpen: true, item, category: 'Category' })}
            type="category"
          />
        </div>

        {/* Sub Category Filter */}
        <div className="filter-group">
          <label className="filter-label">Select Sub Category</label>
          <CustomDropdown
            options={selectedCategory ? subCategories[selectedCategory] || [] : []}
            selected={selectedSubCategory}
            onSelect={setSelectedSubCategory}
            placeholder="Select Sub Category"
            searchPlaceholder="Search Sub Category"
            onAddNew={() => setInputModal({ isOpen: true, type: 'createSubCategory' })}
            onRename={(item) => setInputModal({ isOpen: true, type: 'rename', item })}
            onDelete={(item) => setDeleteModal({ isOpen: true, item, category: 'Sub Category' })}
            disabled={!selectedCategory}
            type="subCategory"
          />
        </div>

        {/* Total Expense Display */}
        <div className="total-expense-group">
          <label className="filter-label">Total Expense Amount</label>
          <div className="total-expense-amount">₹ {totalExpense.toLocaleString()}</div>
        </div>
      </div>

      {/* Header & Actions */}
      <div className="page-header">
        <div className="table-title">{getTableTitle()}</div>
        <button className="add-expense-main-btn" onClick={() => setViewMode('add')}>
          <FaPlus /> Add Expense
        </button>
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
              <th>Date Created</th>
              <th>Party</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Total Amount</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Payment Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.date}</td>
                <td>{exp.party}</td>
                <td>{exp.category}</td>
                <td>{exp.subCategory}</td>
                <td>₹ {exp.amount.toLocaleString()}</td>
                <td>₹ {exp.paid.toLocaleString()}</td>
                <td>₹ {exp.balance.toLocaleString()}</td>
                <td>
                  <span
                    className={`status-badge ${exp.status === "Full Paid"
                      ? "badge-paid"
                      : exp.status === "Partially Paid"
                        ? "badge-partial"
                        : "badge-unpaid"
                      }`}
                  >
                    {exp.status}
                  </span>
                </td>
                <td>
                  <div className="payment-type">
                    {exp.paymentType}
                    <FaPlus
                      className="plus-icon-green"
                      onClick={() => setPaymentModal({ isOpen: true, expenseId: exp.id, mode: 'view' })}
                    />
                  </div>
                </td>
                <td style={{ position: 'relative' }}>
                  <FaEllipsisV
                    className="more-options"
                    onClick={() => setActiveRowMenu(activeRowMenu === exp.id ? null : exp.id)}
                  />
                  {activeRowMenu === exp.id && (
                    <div className="row-options-menu">
                      <div onClick={() => handleEditClick(exp)}>Update</div>
                      <div onClick={() => handleDeleteExpense(exp.id)} className="delete">Delete</div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      <PaymentDetailsOverlay
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
        onConfirm={handlePaymentUpdate}
        initialPayments={activeExpense?.payments}
        totalAmount={activeExpense?.amount}
        mode={paymentModal.mode}
        onEdit={() => setPaymentModal({ ...paymentModal, mode: 'edit' })}
      />
    </div>
  );
}
