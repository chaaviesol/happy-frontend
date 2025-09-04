import { React, useState, useEffect, Suspense } from "react";
import styles from "./create.module.css";
import { Button, IconButton, styled } from "@mui/material";
import { Edit } from "@mui/icons-material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
export default function Create() {
  const [shareDetails, setShareDetails] = useState([]);

  const [loading, setLoading] = useState(false);
  const [totalProfit, setTotalProfit] = useState(0);
  const axiosPrivate = useAxiosPrivate();
  const navigate=useNavigate()

  const toastConfig = {
    position: "top-center",
    autoClose: 1700,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const CancelButton = styled(Button)(({ theme }) => ({
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    width: "7rem",
    padding: "6px 12px",
    lineHeight: 1.5,
    color: theme.palette.getContrastText("#78716c"),
    backgroundColor: "#78716c",
    "&:hover": {
      backgroundColor: "#484644",
    },
  }));
  const SaveButton = styled(Button)(({ theme }) => ({
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    width: "7rem",
    padding: "6px 12px",
    lineHeight: 1.5,
    color: theme.palette.getContrastText("#78716c"),
    backgroundColor: "#4CAF50",
    "&:hover": {
      backgroundColor: "#2c822e",
    },
  }));
  const AddNewButton = styled(Button)(({ theme }) => ({
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    width: "7rem",
    padding: "6px 12px",
    lineHeight: 1.5,
    color: theme.palette.getContrastText("#78716c"),
    backgroundColor: "#3b82f6",
    "&:hover": {
      backgroundColor: "#2563eb",
    },
  }));
  useEffect(() => {
    fetchShareDetails();
  }, []);

  const fetchShareDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get("profit/viewdistribution");
      console.log(response);
      setShareDetails(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (index) => {
    let dta = [...shareDetails];
    dta[index] = { ...dta[index], editable: !dta[index].editable };
    setShareDetails(dta);
  };
  const handleAddNewClick = () => {
    let dta = [...shareDetails];
    const newLine = { name: "", percentage: "", editable: true };
    dta.push(newLine);
    setShareDetails(dta);
  };
  const isPercentageExceeds = (value, oldValue) => {
    let totalPercentage = 0;
    shareDetails.forEach((ele) => {
      if (ele.percentage) {
        totalPercentage += parseFloat(ele.percentage);
      }
    });

    const addedPercentage =
      totalPercentage + parseFloat(value) - parseFloat(oldValue);
    if (addedPercentage > 100) {
      return true;
    } else {
      return false;
    }
  };
  const handleChange = (event, index) => {
    const { value, name } = event.target;
    let isExceeds = false;
    if (name === "percentage") {
      const oldValue = shareDetails[index]?.percentage;
      isExceeds = isPercentageExceeds(value, oldValue);
      if (isExceeds) {
        alert("cannot exceed 100 percentage");
      }
    }
    if (!isExceeds) {
      if (shareDetails[index]?.editable === false) {
        return;
      }
      let clone = [...shareDetails];
      if (name === "name") {
        clone[index] = { ...clone[index], name: value };
      } else {
        clone[index] = { ...clone[index], percentage: value };
      }
      setShareDetails(clone);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.post("profit/createprofit", {
        data: shareDetails,
      });
      console.log(response);
      if (response.status === 200) {
        toast.success("Saved", toastConfig);
        setTimeout(() => {
          fetchShareDetails();
        }, 1000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Calculate total percentage
    let totalPercentage = 0;
    shareDetails.forEach((ele) => {
      if (ele.percentage) {
        totalPercentage += parseFloat(ele.percentage);
      }
    });
    // Update total profit state
    setTotalProfit((prev) => parseFloat((100 - totalPercentage).toFixed(2)));
  }, [shareDetails]);
  console.log(totalProfit);
  console.log({ shareDetails });
  return (
    <>
      <div className={styles.main}>
        <p id={styles.heading}>Create/Update details</p>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead
              style={{
                zIndex: "999",
                fontSize: "13px",
                color: "black",
              }}
            >
              <tr className={styles.tableHeadRow}>
                <th style={{ width: "10%" }}>Sl no</th>
                <th style={{ width: "60%" }}>Name</th>
                <th style={{ width: "30%" }}>% Details</th>
              </tr>
            </thead>
            <tbody className={styles.tableData}>
              <tr className={styles.tableDataRow}>
                <td style={{ width: "10%" }}>1</td>
                <td style={{ width: "60%" }}>
                  <input
                    type="text"
                    name="name"
                    className={styles.input}
                    value="Profit Percentage"
                  />{" "}
                </td>
                <td style={{ width: "30%" }}>
                  <input
                    className={styles.inputBox}
                    type="number"
                    min={0}
                    value={totalProfit}
                    name="percentage"
                  />
                </td>
              </tr>
              {shareDetails.map((ele, index) => (
                <tr key={index} className={styles.tableDataRow}>
                  <td style={{ width: "10%" }}>{index + 2}</td>
                  <td style={{ width: "60%" }}>
                    {" "}
                    <input
                      type="text"
                      name="name"
                      disabled={!ele?.editable ? true : false}
                      onChange={(event) => handleChange(event, index)}
                      className={styles.input}
                      value={ele?.name}
                    />{" "}
                  </td>
                  <td style={{ width: "30%" }}>
                    {ele?.editable ? (
                      <input
                        className={styles.inputBox}
                        onChange={(event) => handleChange(event, index)}
                        type="number"
                        min={0}
                        value={ele?.percentage}
                        name="percentage"
                      />
                    ) : (
                      <input
                        value={ele?.percentage}
                        className={styles.disabledInputBox}
                        disabled
                        type="number"
                      />
                    )}
                    <IconButton onClick={() => handleEdit(index)}>
                      <Edit
                        style={{ color: ele?.editable ? "blue" : "grey" }}
                      />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.buttonContainer}>
            <AddNewButton onClick={handleAddNewClick}>Add New</AddNewButton>
            <SaveButton onClick={handleSave}>Save</SaveButton>
            <CancelButton onClick={()=>navigate(-1)}>Close</CancelButton>
          </div>
        </div>
        <ToastContainer />
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={loading}
          // onClick={handleCloseloading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
}
