import React, { useState, useEffect } from "react";
import { Row, Col, Table, Button, Form } from "react-bootstrap";

export default function OperationalExpenses() {
  const [activeTab, setActiveTab] = useState("add"); // 'add' or 'history'
  const [expenses, setExpenses] = useState([]);
  const [todayExpenses, setTodayExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: "", amount: "" });
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    month: "",
    year: "",
  });

  // Helper to format date as dd-mm-yyyy
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const todayDate = formatDate(new Date());

  // Scrollable table wrapper style
  const tableWrapperStyle = {
    maxHeight: "300px",
    overflowY: "auto",
    display: "block",
    border: "1px solid #ddd",
    borderRadius: "8px",
  };

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const todays = expenses.filter(
      (exp) => new Date(exp.date).toLocaleDateString() === today
    );
    setTodayExpenses(todays);
  }, [expenses]);

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) {
      alert("Please enter both description and amount.");
      return;
    }

    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      date: new Date().toISOString(),
    };

    setExpenses((prev) => [expense, ...prev]);
    setNewExpense({ description: "", amount: "" });
  };

  const filteredHistory = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    const fromDate = filters.from ? new Date(filters.from) : null;
    const toDate = filters.to ? new Date(filters.to) : null;

    let matchesDateRange = true;
    if (fromDate && expDate < fromDate) matchesDateRange = false;
    if (toDate && expDate > toDate) matchesDateRange = false;

    let matchesMonthYear = true;
    if (filters.month && expDate.getMonth() + 1 !== parseInt(filters.month))
      matchesMonthYear = false;
    if (filters.year && expDate.getFullYear() !== parseInt(filters.year))
      matchesMonthYear = false;

    return matchesDateRange && matchesMonthYear;
  });

  const totalAmount = filteredHistory.reduce(
  (sum, exp) => sum + exp.amount,
  0
);


  return (
    <div>
      {/* Top Row: Tabs Left, Date Right */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        {/* Tabs */}
        <div style={{ display: "flex", gap: "20px" }}>
          <Button
            variant={activeTab === "add" ? "dark" : "outline-dark"}
            onClick={() => setActiveTab("add")}
          >
            Add Expenses
          </Button>
          <Button
            variant={activeTab === "history" ? "dark" : "outline-dark"}
            onClick={() => setActiveTab("history")}
          >
            Expense History
          </Button>
        </div>

        {/* Date */}
        <h6 style={{ margin: 0, fontWeight: "600" }}>Date: {todayDate}</h6>
      </div>

      {/* Add Expenses Tab */}
      {activeTab === "add" && (
        <>
          {/* Today's Expenses */}
          {todayExpenses.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h6>Expenses Added Today</h6>
              <div style={tableWrapperStyle}>
                <Table borderless hover size="sm">
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f5f5f5",
                      zIndex: 1,
                    }}
                  >
                    <tr>
                      <th>Description</th>
                      <th>Amount (₹)</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayExpenses.map((exp) => (
                      <tr key={exp.id}>
                        <td>{exp.description}</td>
                        <td>₹ {exp.amount}</td>
                        <td>{new Date(exp.date).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}

          {/* Add Expense Form */}
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              borderRadius: "12px",
              background: "#fafafa",
            }}
          >
            <h6>Add New Expense</h6>
            <Row style={{ marginTop: "30px" }}>
              <Col sm={6}>
                <Form.Control
                  type="text"
                  placeholder="Description"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, description: e.target.value })
                  }
                  style={{
                    border: "1px solid #aaa",
                    borderRadius: "5px",
                    transition: "0.3s",
                    padding: "5px",
                  }}
                  onFocus={(e) =>
                    (e.target.style.boxShadow =
                      "0 0 5px 2px rgba(0,123,255,0.5)")
                  }
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
              </Col>
              <Col sm={4}>
                <Form.Control
                  type="number"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  style={{
                    border: "1px solid #aaa",
                    borderRadius: "5px",
                    transition: "0.3s",
                    padding: "5px",
                  }}
                  onFocus={(e) =>
                    (e.target.style.boxShadow =
                      "0 0 5px 2px rgba(0,123,255,0.5)")
                  }
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
              </Col>
              <Col sm={2}>
                <Button variant="success" onClick={handleAddExpense}>
                  Add
                </Button>
              </Col>
            </Row>
          </div>
        </>
      )}

      {/* Expense History Tab */}
      {activeTab === "history" && (
        <div style={{ marginTop: "20px" }}>
          <h5>Expense History</h5>

          {/* Filters */}
          <Row
            style={{
               marginBottom: "20px",
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "15px",
            }}
          >
            {/* From Date */}
            <Col sm="auto" style={{ display: "flex", flexDirection: "column" }}>
              <Form.Label style={{ marginBottom: "5px" }}>From Date</Form.Label>
              <Form.Control
                type="date"
                value={filters.from}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, from: e.target.value }))
                }
                style={{
                  border: "1px solid #aaa",
                  borderRadius: "5px",
                  padding: "5px",
                  transition: "0.3s",
                }}
                onFocus={(e) =>
                  (e.target.style.boxShadow =
                    "0 0 5px 2px rgba(0,123,255,0.5)")
                }
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
            </Col>

            {/* To Date */}
            <Col sm="auto" style={{ display: "flex", flexDirection: "column" }}>
              <Form.Label style={{ marginBottom: "5px" }}>To Date</Form.Label>
              <Form.Control
                type="date"
                value={filters.to}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, to: e.target.value }))
                }
                style={{
                  border: "1px solid #aaa",
                  borderRadius: "5px",
                  padding: "5px",
                  transition: "0.3s",
                }}
                onFocus={(e) =>
                  (e.target.style.boxShadow =
                    "0 0 5px 2px rgba(0,123,255,0.5)")
                }
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
            </Col>

            {/* Month */}
            <Col sm="auto" style={{ display: "flex", flexDirection: "column" }}>
              <Form.Label style={{ marginBottom: "5px" }}>Month</Form.Label>
              <Form.Select
                value={filters.month}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, month: e.target.value }))
                }
                style={{
                  border: "1px solid #aaa",
                  borderRadius: "5px",
                  padding: "5px",
                  transition: "0.3s",
                }}
                onFocus={(e) =>
                  (e.target.style.boxShadow =
                    "0 0 5px 2px rgba(0,123,255,0.5)")
                }
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              >
                <option value="">All</option>
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {/* Year */}
            <Col sm="auto" style={{ display: "flex", flexDirection: "column" }}>
              <Form.Label style={{ marginBottom: "5px" }}>Year</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g. 2025"
                value={filters.year}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, year: e.target.value }))
                }
                style={{
                  border: "1px solid #aaa",
                  borderRadius: "5px",
                  padding: "5px",
                  transition: "0.3s",
                }}
                onFocus={(e) =>
                  (e.target.style.boxShadow =
                    "0 0 5px 2px rgba(0,123,255,0.5)")
                }
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
            </Col>
          </Row>

          {/* History Table */}
          <div style={tableWrapperStyle}>
            <Table borderless hover responsive>
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f5f5f5",
                  zIndex: 1,
                }}
              >
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
             <tbody>
  {filteredHistory.length > 0 ? (
    <>
      {filteredHistory.map((exp) => (
        <tr key={exp.id}>
          <td>{formatDate(exp.date)}</td>
          <td>{exp.description}</td>
          <td>₹ {exp.amount}</td>
        </tr>
      ))}
      <tr style={{marginTop:'100px'}}>
        <td></td>
        <td style={{ fontWeight: "600", textAlign: "right" }}>Total:</td>
        <td style={{ fontWeight: "600" }}>₹ {totalAmount.toFixed(2)}</td>
      </tr>
    </>
  ) : (
    <tr>
      <td colSpan="3" style={{ textAlign: "center" }}>
        No expenses found for the selected filters.
      </td>
    </tr>
  )}
</tbody>

            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
