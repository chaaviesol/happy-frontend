import React from 'react'
import { Col, Container, Image, Row, Table } from 'react-bootstrap'

export default function Salespdf() {
  return (
    <>
     <div className="po-mainContainer">
        <Container className="po-Container">
          {/* First Row>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
          <Row >
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
              <span className="po-purchaseOrder">Sales Order</span>
              <div style={{
                      color: "rgba(0, 29, 25, 0.55)",
                      fontWeight: "700",
                    }}> Invoice # :  PO12345</div>
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
                    <b>Lorem Ipsum</b>{" "}
                  </span>
                </Col>{" "}
              </Row>
              <Row className="po-Container-Rows">
                <Col>
                  <span
                    style={{ color: "var(--main-color)" }}
                    className="po-Container-spans"
                  >
                    address line 1
                  </span>
                </Col>{" "}
              </Row>
              <Row className="po-Container-Rows">
                <Col>
                  <span
                    style={{ color: "var(--main-color)" }}
                    className="po-Container-spans"
                  >
                    address line 2
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
                  <span
                    style={{
                      color: "rgba(0, 29, 25, 0.55)",
                      fontWeight: "700",
                    }}
                  >
                   11/1/2023
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
             
            </Col>
          </Row>

          {/* End of TO section Row */}

          {/* Table >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

          <Table variant="light" borderless>
            <thead>
              <tr>
                <th>SI No:</th>
                <th className='text-left'>Product</th>
                <th className='text-left'>Product Code</th>
                <th className='text-left'>Qty</th>
                <th>Rate</th>
                <th>Tax%</th>
                <th>Net amount</th>
              </tr>
            </thead>
            <tr style={{ border: "2px solid var(--main-color)" }}></tr>
            <tbody>
              {/* {polist?.products?.map((data, index) => ( */}
                <tr>
                  <td>1</td>
                  <td className="po-table-sec-texts text-left">
                  Lorem Ipsum
                  </td>
                  <td className="po-table-sec-texts text-left">
                  9999
                  </td>
                  <td className='text-left'>4</td>
                  <td>₹9999</td>
                  <td>18</td>
                  <td>₹9999999</td>
                </tr>

                <tr>
                  <td>2</td>
                  <td className="po-table-sec-texts text-left">
                  Lorem Ipsum
                  </td>
                  <td className="po-table-sec-texts text-left">
                  9999
                  </td>
                  <td className='text-left'>4</td>
                  <td>₹9999</td>
                  <td>18</td>
                  <td>₹9999999</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td className="po-table-sec-texts text-left">
                  Lorem Ipsum
                  </td>
                  <td className="po-table-sec-texts text-left">
                  9999
                  </td>
                  <td className='text-left'>4</td>
                  <td>₹9999</td>
                  <td>18</td>
                  <td>₹9999999</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td className="po-table-sec-texts text-left">
                  Lorem Ipsum
                  </td>
                  <td className="po-table-sec-texts text-left">
                  9999
                  </td>
                  <td className='text-left'>4</td>
                  <td>₹9999</td>
                  <td>18</td>
                  <td>₹9999999</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td className="po-table-sec-texts text-left">
                  Lorem Ipsum
                  </td>
                  <td className="po-table-sec-texts text-left">
                  9999
                  </td>
                  <td className='text-left'>4</td>
                  <td>₹9999</td>
                  <td>18</td>
                  <td>₹9999999</td>
                </tr>


              {/* ))} */}
            </tbody>
            <tr style={{ border: "2px solid var(--main-color)" }}></tr>
          </Table>
        <Row>
         <Col lg={9}></Col> 
         <Col lg={3}>
           <Row className='mt-1 text-left'>
            <Col lg={6}>Sub Total</Col>
            <Col lg={6}>00000.0</Col>
           </Row>
           <Row className='mt-1 text-left'>
            <Col lg={6}>Discount</Col>
            <Col lg={6}>000000.0</Col>
           </Row>
           <Row className='mt-1 text-left'>
            <Col lg={6}>
                <b>Grand Total</b>
             </Col>
            <Col lg={6}>
                <b> ₹0000000.0</b>
            </Col>
           </Row>
            
            </Col>  
        </Row>

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
              {/* {notes.map((data, index) => ( */}
                <Row className='mt-2'> 
                  <Col>
                    <span >
                      <b>
                    1.  Lorem ipsum dolor sit amet consectetur adipiscingelit, sed do eiusmod tempor

                      </b>
                    </span>
                  </Col>
                </Row>
                <Row className='mt-2'>
                  <Col>
                    <span >
                      <b>
                    2.  Lorem ipsum dolor sit amet consectetur adipiscingelit, sed do eiusmod tempor

                      </b>
                    </span>
                  </Col>
                </Row>
                <Row className='mt-2'>
                  <Col>
                    <span >
                      <b>
                    3.  Lorem ipsum dolor sit amet consectetur adipiscingelit, sed do eiusmod tempor

                      </b>
                    </span>
                  </Col>
                </Row>
            {/* //   ))} */}
            </Col>
          </Row>
        </Container>
      </div>
    
    </>
  )
}
