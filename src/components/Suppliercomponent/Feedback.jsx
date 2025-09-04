import React, { useState, useEffect, useContext } from "react";
import { Button, Col, Row } from "react-bootstrap";
import moment from 'moment';
import './supplierco.css';
import { MyContext } from "../../Contexts/Contexts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { prismaBaseApi } from "../../config";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
export default function Feedback() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { supplierlist, setSupplierlist } = useContext(MyContext)
  const [state, setState] = useState(true)
  const axiosPrivate = useAxiosPrivate()
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    console.log(inputValue);
  };
  useEffect(() => {

    const method = { method: "view", user_id: supplierlist.id };
    axiosPrivate.post(`/user/userfeedback`, method).then((res) => {
      console.log("res>>>>>>>>>>>>>", res);
      // setFeedbackData(res?.data);
      if (Array.isArray(res?.data)) {
        setFeedbackData(res?.data);
      }

    });



  }, [inputValue]);

  const handlePostClick = () => {


    console.log(inputValue);
    const data1 = {
      method: "feedback",
      post: inputValue,
      post_by: "6",
      user_id: supplierlist.id,
    }
    // axiosPrivate.post(`${baseApi}/supplierfeedback`)
    axiosPrivate.post(`/user/userfeedback`, data1).then(res => {
      console.log(res);
      setFeedbackData([...feedbackData]);
      setInputValue("")
      toast.success(res.data)
    })

  };


  return (
    <>
      <ToastContainer>
        position="top-right" autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
      </ToastContainer>
      <Row>
        <Col lg={1}></Col>
        <Col lg={10}>
          <div
            className="card mt-5"
            style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)" }}
          >
            <div className="card-body" style={{ maxHeight: "500px", overflowY: "auto" }}>
              <div class="form-group">
                <label for="exampleFormControlTextarea1">
                  Post new feedback
                </label>
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  value={inputValue}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="row">
                <div className="col-sm-9"></div>
                <div className="col-sm-3">
                  <Button
                    onClick={handlePostClick}
                    style={{
                      backgroundColor: "#67BEB8",
                      borderRadius: "25px",
                      width: "145px",
                    }}
                  >
                    POST
                  </Button>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-sm-2">
                  <b>History</b>
                </div>
                <div className="col-sm-6"></div>
              </div>
              <div >
                <table class="table mt-2 "  >
                  <thead>
                    <tr style={{ fontSize: "12px" }}>
                      <th scope="col" style={{ width: "80px" }}>SL NO</th>
                      <th scope="col">Date</th>
                      <th scope="col" style={{ width: "400px", textAlign: "left" }}>Feedback</th>
                      <th scope="col">Posted by</th>
                    </tr>
                  </thead>

                  <tbody style={{ fontSize: "12px" }}>
                    {feedbackData?.map((feedback, index) => (
                      <tr key={index}>
                        <th scope="row" style={{ width: "80px" }}>{index + 1}</th>
                        <td>{moment(feedback?.created_date).format('DD/MM/YYYY')}</td>
                        <td style={{ width: "400px", textAlign: "left" }}>{feedback?.feedback_text}</td>
                        <td>{feedback?.created_by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </Col>
        <Col lg={1}></Col>
      </Row>
      <Row>
        <Col lg={1}></Col>
        <Col lg={10}></Col>
      </Row>
    </>
  );
}
