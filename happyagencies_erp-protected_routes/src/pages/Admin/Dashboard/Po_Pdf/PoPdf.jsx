import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Image, Row, Table } from "react-bootstrap";
import "./popdf.css";
import axios from "axios";
import moment from "moment";
import { prismaBaseApi } from "../../../../config";
import { useLocation } from "react-router-dom";
import { Download } from "@mui/icons-material";
import html2pdf from "html2pdf.js";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
export default function PoPdf() {
  const [selectedpo, setSelectedpo] = useState();
  const [polist, setPolist] = useState();
  const [notes, setNotes] = useState([]);
  const location = useLocation();
  const passedPoNum = { po: location.state.po_num };
  const axiosPrivate=useAxiosPrivate()

  useEffect(() => {
    axiosPrivate.post(`/purchase/polist`, passedPoNum).then((res) => {
      console.log(res);
      setPolist(res.data);
      const poNotes = Object?.values(res.data?.po_notes);
      setNotes(poNotes);
    });
  }, []);

  const handlePdfDownload = () => {
    const element = document.getElementById("pdf-content");
    const opt = {
      margin: 10,
      filename: polist.po_num,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <>
      <div className="po-mainContainer">
        <Container className="po-Container" id="pdf-content">
          {/* First Row>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
          <Row>
            <Col md={6} lg={6}>
              <Row className="po-Container-Rows">
                <Col
                  style={{ padding: "0", margin: "0" }}
                  className="text-left"
                  md={3}
                  lg={2}
                >
                  <Image className="po-logo" src="assets/pologo.png"></Image>
                </Col>
                <Col md={8} lg={8}>
                  <Row className="row">
                    <Col>
                      {" "}
                      <span className="po-happyTxt">
                        <b>Happy Agencies</b>{" "}
                      </span>{" "}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <span className="po-placeTxt"> Calicut</span>{" "}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col className="text-right" md={6} lg={6}>
              <span className="po-purchaseOrder">PURCHASE ORDER</span>
            </Col>
          </Row>
          {/* End of first Row------------------------------------- */}

          {/* Second row To section>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

          <Row style={{ paddingTop: "1rem" }}>
            <Col md={6} lg={6}>
              <Row className="po-Container-Rows">
                <Col>
                  <span style={{ marginLeft: "0%" }}>
                    {" "}
                    <b>To,</b>{" "}
                  </span>
                </Col>
              </Row>

              <Row className="po-Container-Rows">
                <Col>
                  <span
                    style={{ color: "var(--main-color)" }}
                    className="po-Container-spans"
                  >
                    {" "}
                    <b>{selectedpo?.trade_name}</b>{" "}
                  </span>
                </Col>{" "}
              </Row>
              <Row className="po-Container-Rows">
                <Col>
                  <span
                    style={{ color: "var(--main-color)" }}
                    className="po-Container-spans"
                  >
                    {polist?.address?.building},{polist?.address?.address},
                      {polist?.pincode}
                 
                  </span>
                </Col>{" "}
              </Row>
              <Row className="po-Container-Rows">
                <Col>
                  <span
                    style={{ color: "var(--main-color)" }}
                    className="po-Container-spans"
                  >
                      {polist?.address?.district},{polist?.address?.state},
                  </span>
                </Col>
              </Row>
              <Row className="po-Container-Rows">
                <Col>
                  <span
                    style={{ color: "var(--main-color)" }}
                    className="po-Container-spans"
                  >
                    <b>Ph: +91 9876543210</b>
                  </span>
                </Col>
              </Row>
            </Col>
            <Col className="text-right" md={6} lg={6}>
              <Row>
                <Col>
                  <span style={{ color: "#001D19" }}>
                    <b> PO # :{polist?.po_num}</b>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <span
                    style={{
                      color: "rgba(0, 29, 25, 0.55)",
                      fontWeight: "700",
                    }}
                  >
                    {moment &&
                      moment(polist && polist?.created_date)?.format(
                        "DD-MM-YYYY"
                      )}
                  </span>
                </Col>
              </Row>
              <Row>
                {" "}
                <Col>
                  <span
                    style={{
                      color: "rgba(0, 29, 25, 0.55)",
                      fontWeight: "700",
                    }}
                  >
                    Calicut
                  </span>
                </Col>{" "}
              </Row>
              <Row>
                {" "}
                <Col style={{ paddingTop: "1rem" }}>
                  <span
                    style={{
                      borderRadius: "10px",
                      border: "3px solid var(--main-color)",
                      padding: ".5rem 5rem .5rem .4rem",
                    }}
                  >
                    {" "}
                    <b>Logistics: {polist?.logistics_name}</b>{" "}
                  </span>
                </Col>{" "}
              </Row>
            </Col>
          </Row>

          {/* End of TO section Row */}

          {/* Table >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

          <Table variant="light" borderless>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>SI No:</th>
                <th style={{ textAlign: "left" }}>Product</th>
                <th style={{ textAlign: "left" }}>M.code</th>
                <th style={{ textAlign: "left" }}>Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ border: "2px solid var(--main-color)" }}></tr>

              {polist?.products?.map((value, index) => (
                <tr>
                  <td style={{ textAlign: "left" }} key={index}>
                    {index + 1}
                  </td>
                  <td className="po-table-sec-texts text-left">
                    {value?.prod_name}
                  </td>
                  <td className="po-table-sec-texts text-left">
                    {value?.manufacturer_code}
                  </td>
                  <td style={{ textAlign: "left" }}>{value?.qty}</td>
                </tr>
              ))}
            </tbody>
            <tr style={{ border: "2px solid var(--main-color)" }}></tr>
          </Table>

          <Row
            style={{
              textAlign: "left",
              border: "2px solid var(--main-color",
              borderRadius: "10px",

              padding: "1rem",
            }}
          >
            <Col lg={1}>
              <span>
                <b>Note</b>
              </span>
            </Col>
            <Col lg={11}>
              {notes?.map((value, index) => (
                <Row>
                  <Col>
                    <span key={index}>
                      <b>
                        {index + 1}.{value}{" "}
                      </b>
                    </span>
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            <div className="mt-5">
              <button
                className=" btn-success p-2"
                style={{ border: "none", borderRadius: "10px" }}
                type="button"
                onClick={handlePdfDownload}
              >
                Download Pdf
                <Download />
              </button>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
}
