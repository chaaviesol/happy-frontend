import React, { useRef } from "react";

function InvoicePrint({ TotalData }) {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current;
    const WindowPrt = window.open("", "", "width=900,height=650");
    WindowPrt.document.write(`
      <html>
        <head>
          <title>Estimate</title>
          <style>
            body {
              font-family: "Arial", sans-serif;
              margin: 30px;
              color: #000;
            }

            h2 {
              text-align: center;
              margin-bottom: 5px;
              text-transform: uppercase;
              font-size: 20px;
              border-bottom: 2px solid #000;
              display: inline-block;
              padding: 5px 20px;
            }

            .header {
              margin-bottom: 10px;
              font-size: 14px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              font-size: 13px;
            }

            th, td {
              border: 1px solid #000;
              padding: 6px 8px;
              text-align: center;
            }

            th {
              background-color: #f8f8f8;
              font-weight: bold;
            }

            .total-section {
              margin-top: 20px;
              font-size: 14px;
              text-align: right;
              line-height: 1.6;
            }

            .amount-line {
              border-top: 1px solid #000;
              padding-top: 5px;
              margin-top: 5px;
              display: inline-block;
              min-width: 200px;
              text-align: right;
            }

            .words {
              margin-top: 10px;
              font-size: 13px;
              text-align: left;
              font-style: italic;
            }

            .footer-note {
              margin-top: 15px;
              text-align: left;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  };

  // Convert number to words (simple Indian format)
  const numberToWords = (num) => {
    if (!num) return "";
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
      "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const numToWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000)
        return a[Math.floor(n / 100)] + " Hundred " + (n % 100 === 0 ? "" : "and " + numToWords(n % 100));
      if (n < 100000)
        return numToWords(Math.floor(n / 1000)) + " Thousand " + numToWords(n % 1000);
      if (n < 10000000)
        return numToWords(Math.floor(n / 100000)) + " Lakh " + numToWords(n % 100000);
      return numToWords(Math.floor(n / 10000000)) + " Crore " + numToWords(n % 10000000);
    };

    return numToWords(Math.floor(num)) + " Only";
  };

  return (
    <>
      <button
        onClick={handlePrint}
        id="Cart_Cntrl_las_btnsX1"
        disabled={!TotalData?.products || TotalData.products.length === 0}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "5px" }}></div>
          Print Estimate
        </div>
      </button>

      {/* Hidden printable layout */}
      <div ref={printRef} style={{ display: "none" }}>
        <div style={{ textAlign: "center" }}>
          <h2>ESTIMATE</h2>
        </div>

        <div className="header">
          <p><b>Customer Name:</b> {TotalData?.user_name || "Customer"}</p>
          <p><b>Date:</b> {new Date().toLocaleDateString()}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Gross Amount</th>
              <th>Discount</th>
              <th>Net Amount</th>
            </tr>
          </thead>
          <tbody>
            {TotalData?.products?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td style={{ textAlign: "left" }}>{item?.product_name}</td>
                <td>{item?.qty}</td>
                <td>{item?.product_Price || item?.original_price}</td>
                <td>{(item?.qty * (item?.product_Price || item?.original_price)).toFixed(2)}</td>
                <td>{item?.normalDiscount?.discount ? `${item.normalDiscount.discount}%` : "-"}</td>
                <td>{item?.total?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total-section">
          <p>Gross Amount: ₹{TotalData?.grandTotal?.toFixed(2)}</p>
          <p>
            Discount Amount: ₹
            {(() => {
              const discount = TotalData?.discount?.discount || 0;
              const type = TotalData?.discount?.type;
              const grandTotal = TotalData?.grandTotal || 0;

              if (type === "Rupees") {
                return parseFloat(discount).toFixed(2);
              } else if (type === "Percentage") {
                const discountValue = (grandTotal * discount) / 100;
                return parseFloat(discountValue).toFixed(2);
              } else {
                return "0.00";
              }
            })()}
          </p>
          <p className="amount-line">
            Invoice Amount: ₹{TotalData?.tl_amt?.toFixed(2)}
          </p>
          <div className="words">
            <b>Rupees:</b> {numberToWords(TotalData?.tl_amt)}
          </div>
          <p style={{ fontSize: "0.9rem", textAlign: "right" }}>* GST Extra</p>
        </div>

        <div className="footer-note">
          <p><b>Note:</b> Thank you for your business!</p>
        </div>
      </div>
    </>
  );
}

export default InvoicePrint;
