import { React, useContext, useEffect, useState } from "react";
import user_access from "./user_access.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../../../components/admin components/Sidebar";
import Newtopbar_ from "../../../../components/admin components/Newtopbar_";
// import { prismaBaseApi } from "../../../../config";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import useFileUpload from "../../../../hooks/useFileUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { prismaBaseApi } from "../../../../config";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

export default function User_access() {
  const [userAccessData, setUserAccessData] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [clickedIndex, setClickedIndex] = useState();
  const [newrow, setnewrow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState();
  const [isShowModal, setIsShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newManageAccess, setNewManageAccess] = useState(false);
  const { setIndex, index } = useFileUpload();
  const navigate = useNavigate();

  async function fetchData() {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(`/useraccess/view`);
      setUserAccessData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handleRequest = (index) => {
    setIsShowModal(true);
    setClickedIndex(index);
  };
  const pages = [
    { name: "Inventory", value: "Inventory", hasTickOption: true },
    { name: "New Products", value: "NewProducts", hasTickOption: false },
    { name: "Product list", value: "Productlist", hasTickOption: false },
    { name: "Category", value: "category", hasTickOption: false },
    { name: "New User", value: "NewUser", hasTickOption: false },
    { name: "Worklist", value: "worklist", hasTickOption: false },
    { name: "Create PO", value: "CreatePO", hasTickOption: false },
    { name: "PO list", value: "POlist", hasTickOption: false },
    { name: "Supplier list", value: "supplierlist", hasTickOption: false },
    { name: "Customer list", value: "customerlist", hasTickOption: false },
    { name: "New sales order", value: "Newsalesorder", hasTickOption: false },
    { name: "SO list", value: "SOlist", hasTickOption: false },
    {
      name: "Quotation worklist",
      value: "Quotationworklist",
      hasTickOption: false,
    },
    { name: "Service & Return", value: "Service&Return", hasTickOption: false },
    { name: "Leave list", value: "leavelist", hasTickOption: false },
    { name: "Staff claim", value: "staffclaim", hasTickOption: false },
    { name: "Task worklist", value: "taskworklist", hasTickOption: false },
  ];

  const handleOptionChange = (event, name) => {
    const isChecked = event.target.checked;
    let clonedState = [...userAccessData];
    let accessUpdate = clonedState[clickedIndex].access;
    let index = accessUpdate.indexOf(name);
    if (!isChecked) {
      accessUpdate.splice(index, 1);
      clonedState[clickedIndex].access = accessUpdate;
      setUserAccessData(clonedState);
    } else {
      accessUpdate.push(name);
      clonedState[clickedIndex].access = accessUpdate;
      setUserAccessData(clonedState);
    }
  };

  const addNewRow = () => {
    setnewrow(true);
    setCurrentIndex(userAccessData.length);
    // Assuming your columns are user_type, division, and department
    // const newRow = { user_type: '', division: '', department: '', access: [] };
    // setUserAccessData(prevState => [...prevState, newRow]);
  };
  const handleInputChange = (e, rowIndex, columnName) => {
    console.log(e, rowIndex, columnName);

    const { value } = e.target;

    setUserAccessData((prevState) => {
      const newState = [...prevState];
      const crrIndex = newState[currentIndex] || {};
      crrIndex[columnName] = value;
      console.log({crrIndex})
      console.log(newState[currentIndex]);

      if (newState[currentIndex]) {
        newState[currentIndex] = crrIndex;
      } else {
        newState.push(crrIndex);
      }
      return newState;
    });
  };

  const handleNewManageAccess = (event, name) => {
    const isChecked = event.target.checked;
    let clonedState = [...userAccessData];
    let accessUpdate = clonedState[currentIndex]?.access || [];

    if (!isChecked) {
      let index = accessUpdate?.indexOf(name);
      accessUpdate.splice(index, 1);
      clonedState[currentIndex].access = accessUpdate;
      setUserAccessData(clonedState);
    } else {
      accessUpdate.push(name);
      clonedState[currentIndex].access = accessUpdate;
      setUserAccessData(clonedState);
    }
  };
  const handleNewAccessClick = () => {
    const CrrState = userAccessData[currentIndex];
    console.log(CrrState);
    if (CrrState?.user_type && CrrState?.department && CrrState?.division) {
      setNewManageAccess(true);
      setIsShowModal(true);
    } else {
      alert("All fields are manadatory");
    }
  };
  const handleConfirm = async () => {
    setLoading(true);
    const isValid = userAccessData.every(
      (ele) => ele.user_type && ele.division && ele.department && ele.access
    );

    if (isValid) {
      try {
        const response = await axiosPrivate.post(`/useraccess`, {
          access_list: userAccessData,
        });
        if (response.data.success == true) {
          toast.success("Success");
          fetchData();
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert("all fields are required");
      setLoading(false);
    }
  };
  const handleRemoveItem = (indexToRemove) => {
    const newData = userAccessData.filter(
      (_, index) => index !== indexToRemove
    );
    setUserAccessData(newData);
  };
  console.log("main userAccessData=>", userAccessData);

  return (
    <>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Newtopbar_ />
        <div className={user_access.mainContainer}>

          <div style={{ marginBottom: "2rem" }}></div>
          <div style={{ textAlign: "left" }}></div>
          <div className={user_access.table}>
            <div className={user_access.tableHead}>
              <div
                className={user_access.qty}
                style={{
                  background: "#9ca3af",
                }}
              >
                User Type
              </div>
              <div
                className={user_access.qty}
                style={{
                  background: "#9ca3af",
                }}
              >
                Division
              </div>
              <div
                className={user_access.qty}
                style={{
                  background: "#9ca3af",
                }}
              >
                Department
              </div>

              <div style={{ width: "10%" }}></div>
            </div>

            <div className={user_access.tableData}>
              {userAccessData?.map((value, index) => (
                <div
                  key={index}
                  style={{
                    background: index % 2 === 0 ? "white" : "#f5f5f4",
                  }}
                  className={user_access.tableRow}
                >
                  <div className={user_access.qty}> {value.user_type} </div>
                  <div className={user_access.qty}>{value.division}</div>
                  <div className={user_access.qty}>{value.department}</div>
                  {/* <div >{value.access}</div>  */}
                  <div>
                    <button
                      className={user_access.serviceBtn}
                      onClick={() => handleRequest(index)}
                      variant="outlined"
                    >
                      Manage Access
                    </button>
                    <button
                      style={{
                        border: "none",
                        backgroundColor: "transparent",
                        color: "#6b7280",
                      }}
                      onClick={() => handleRemoveItem(index)}
                    >
                      <HighlightOffIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <button onClick={addNewRow} className={user_access.addNewRowBtn}>
                New User Access
              </button>
            </div>
          </div>
          <Modal
            open={newrow}
            onClose={() => {
              setnewrow(false);
            }}
          >
            <div className={user_access.modalContainer2}>
              <div className={user_access.modalrow2}>
                <div
                  key={index}
                  style={{
                    background: index % 2 === 0 ? "white" : "#f5f5f4",
                  }}
                  className={`${user_access.tableRow2} p-4`}
                >
                  <div className={user_access.modaltype}>
                    <label className={user_access.labelstyle}>User Type</label>
                    <select
                      type="text"
                      maxLength={3}
                      onChange={(e) =>
                        handleInputChange(e, userAccessData.length, "user_type")
                      }
                    >
                      <option value="">Select User Type</option>
                      <option value="ADM"> ADM</option>
                      <option value="SU">SU</option>
                    </select>
                  </div>
                  <div className={user_access.modaltype}>
                    <label className={user_access.labelstyle}>Division </label>
                    <select
                      type="text"
                      // value={userAccessData[userAccessData.length - 1]?.division || ''}
                      onChange={(e) =>
                        handleInputChange(e, userAccessData.length, "division")
                      }
                    >
                      <option value="">Select Division</option>
                      <option value="bikes"> Bikes</option>
                      <option value="toys">Toys</option>
                      <option value="baby">Baby</option>
                    </select>
                  </div>
                  <div className={user_access.modaltype}>
                    <label className={user_access.labelstyle}>
                      Department{" "}
                    </label>
                    <select
                      type="text"
                      // value={userAccessData[userAccessData.length - 1]?.department || ''}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          userAccessData.length,
                          "department"
                        )
                      }
                    >
                      <option value="">Select Department</option>
                      <option value="Purchase"> Purchase</option>
                      <option value="Sales">Sales</option>
                      <option value="Staff">Staff</option>
                      <option value="Fitting">Fitting</option>
                      <option value="Packing">Packing</option>
                      <option value="Dispatch">Dispatch</option>
                    </select>
                  </div>
                  <div>
                    <button
                      className={user_access.serviceBtn2}
                      onClick={handleNewAccessClick}
                      variant="outlined"
                    >
                      Manage Access
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <div style={{ display: "flex", justifyContent: "flex-end" }}></div>
          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              gap: "4rem",
              justifyContent: "center",
            }}
          >
            <button className={user_access.confirmBtn} onClick={handleConfirm}>
              Confirm
            </button>
            <button
              className={user_access.closeBtn}
              onClick={() => {
                navigate(-1);
              }}
            >
              Close
            </button>
          </div>

          <Modal
            open={isShowModal}
            onClose={() => {
              setIsShowModal(false);
            }}
          >
            <div className={user_access.modalContainer}>
              <div className={user_access.modalrow}>
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {pages.map((page, index) => (
                    <div key={index}>
                      <label
                        id={user_access.labels}
                        className="m-0 ml-3"
                        htmlFor=""
                        style={{ fontSize: "18px", marginBottom: "8px" }}
                      >
                        {page.name}
                      </label>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {pages.map((page, index) => (
                    <div key={index}>
                      <input
                        style={{ height: "15px", marginTop: "6px" }}
                        type="checkbox"
                        checked={userAccessData[clickedIndex]?.access?.includes(
                          page.value
                        )}
                        onChange={(event) => {
                          newManageAccess
                            ? handleNewManageAccess(event, page.value)
                            : handleOptionChange(event, page.value);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Modal>

          <ToastContainer>
            position="top-right" autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick rtl={false}, pauseOnFocusLoss draggable pauseOnHover
          </ToastContainer>
        </div>
        </div>
      </div>

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
