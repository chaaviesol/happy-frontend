import React from "react";
import Sidebar from "../../../../components/admin components/Sidebar";
import OperationalExpenses from "./OperationalExpenses";
import _newtopbar_ from "../../../../components/admin components/Newtopbar_";
import { Row, Col, Container, Form } from "react-bootstrap";

export default function OperationalExpensesWrapper() {
  return (
    <Sidebar type="expenses">
        <_newtopbar_ />
      <div style={{ display: "flex", width: "100%" }}>
        <div style={{ flex: 1, padding: "20px" }}>
          <Row className="mb-4">
                <Col sm={12}>
                  <span className="products-headline">Operational Expenses</span>
                </Col>
              </Row>
          <OperationalExpenses />
        </div>
      </div>
    </Sidebar>
  );
}
