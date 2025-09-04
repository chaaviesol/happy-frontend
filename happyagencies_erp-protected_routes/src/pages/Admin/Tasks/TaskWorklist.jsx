import React, { useState, useEffect } from "react";
import { prismaBaseApi } from "../../../config";
import axios from "../../../api/axios";
import TableComp from "../../../components/table/TableComp";
import Modal from "./Modal";
import styles from "./styles.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputAdornment, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export default function TaskWorklist() {
  const [columnData, setColumnData] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowSoModal, setIsShowSoModal] = useState(false); 
  const [isShowSearchField, setIsShowSearchField] = useState(false);
  const [clickedSalesData, setClickedSalesData] = useState({});
  const [workerType, setWorkerType] = useState("packing");
  const [salesOrderDetails, setSalesOrderDetails] = useState({});
  const axiosPrivate=useAxiosPrivate()
  const tableHeadings = ["Sl No", "So number", "Amount", "Task status"];
  const columnHeadings = ["SlNo", "so_number", "total_amount", "button"];
  const fieldWidth = [{ flex: 1 }, { flex: 7 }, { flex: 7 }, { flex: 7 }];

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
  const fetchData = async () => {
    try {
      const response = await axiosPrivate.get(
        `/salesorders/fitting`
      );
      const { data } = response.data;
      const keyToKeep = ["sales_id", "so_number", "total_amount"];
      const filteredData = data.map((item, index) => {
        const filteredObject = {};
        for (const key of keyToKeep) {
          filteredObject[key] = item[key];
        }
        filteredObject.button = (
          <button id="pending" className={styles.pendingBtn}>
            Pending
          </button>
        );
        filteredObject.SlNo = index + 1;
        return filteredObject;
      });
      setColumnData(filteredData);
    } catch (err) {
      toast.error("error fetching data", toastConfig);
      console.error(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleGetRowData = (clickedSalesData, event) => {
    if (isShowSearchField) {
      setIsShowSearchField(false);
      return;
    }
    setClickedSalesData(clickedSalesData);
    if (event.target.id === "pending") {
      setIsShowModal(true);
      return;
    }
    handleGetSalesDetails(clickedSalesData.sales_id);
  };
  const handleGetSalesDetails = async (sales_id) => {
    try {
      const response = await axiosPrivate.post(
        `/sales/quoted_details`,
        {
          sales_id,
        }
      );
      if (response.status === 200) {
        console.log(response);
        const data = response.data[0];
        const productsData = data.products;
        const tableHeadings = ["Sl No", "Product name", "qty", "select type"];
        const columnHeadings = ["SlNo", "product_name", "qty", "selecttype"];
        const keyToKeep = [
          "SlNo",
          "product_name",
          "qty",
          "selecttype",
          "product_id",
          "access",
        ];
        const filteredData = productsData.map((item, index) => {
          const filteredObject = {};
          for (const key of keyToKeep) {
            filteredObject[key] = item[key];
          }
          filteredObject.SlNo = index + 1;
          return filteredObject;
        });
        setSalesOrderDetails({
          soNumber: data.so_number,
          tableProdData: filteredData,
          tableHeadings,
          columnHeadings,
        });
        setIsShowSoModal(true);
      }
    } catch (err) {
      toast.error("something went wrong", toastConfig);
    } finally {
    }
  };

  const handleConfirm = async () => {
    const apiEndpointResult = apiEndPointDecider(workerType);
    const body = {
      sales_id: clickedSalesData?.sales_id,
      status:apiEndpointResult?.status
    };
    try {
      const response = await axiosPrivate.post(
        `/salesorders/${apiEndpointResult.post}`,
        body
      );
      toast.success("Task Marked as completed", toastConfig);
    } catch (err) {
      toast.error(err, toastConfig);
    } finally {
      handleCancel();
      fetchData();
    }
  };
  //endpoint and sending status decider
  const apiEndPointDecider = (workerType) => {
    const apiEndpoint = {};

    switch (workerType) {
      case "fitter":
        apiEndpoint.status = "fitted";
        apiEndpoint.post = "fitted";
        apiEndpoint.get = "fitting";
        break;
      case "packing":
        apiEndpoint.status = "packed";
        apiEndpoint.post = "packed";
        apiEndpoint.get = "packing";
        break;
      case "dispatch":
        apiEndpoint.status = "dispatched";
        apiEndpoint.post = "dispatched";
        apiEndpoint.get = "dispatch";
        break;
      default:
        break;
    }

    return apiEndpoint;
  };
  const searchSo = (heading) => {
    setIsShowSearchField(!isShowSearchField);
  };
  const handleSearchChanges = (event) => {
    const clonedState = [...columnData];
    const value = event.target.value.toLowerCase();
    const filteredData = clonedState.filter(
      (ele) => ele && ele.so_number.toLowerCase().includes(value)
    );
    const remainingData = clonedState.filter(
      (ele) => ele && !ele.so_number.toLowerCase().includes(value)
    );
    const sortedSoArray = [...filteredData, ...remainingData];
    const g = sortedSoArray.map((ele, index) => {
      ele.SlNo = index + 1;
      return ele;
    });

    setColumnData(g);
  };
  //cleanup
  const handleCancel = () => {
    setClickedSalesData({});
    setIsShowModal(false);
    setIsShowSoModal(false);
    setSalesOrderDetails({});
  };
  console.log(salesOrderDetails);

  // console.log("columnData", columnData);
  return (
    <div style={{ height: "100vh", padding: "2rem", position: "relative" }}>
      {isShowSearchField && (
        <div className={styles.searchBox}>
          <TextField
            onChange={handleSearchChanges}
            label="Search with So number"
            id="outlined-end-adornment"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </div>
      )}
      <TableComp
        tableHeading={tableHeadings}
        tableColumns={columnHeadings}
        tableData={columnData}
        getRowData={handleGetRowData}
        triggerSearch={searchSo}
      />
      <Modal
        isShowModal={isShowModal}
        close={handleCancel}
        confirm={handleConfirm}
        showSoData={isShowSoModal}
        salesData={salesOrderDetails}
      />
      <ToastContainer />
    </div>
  );
}
