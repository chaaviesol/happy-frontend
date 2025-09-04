import { React, useState, useEffect } from "react";
import "./settle.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ButtonComp } from "../../../components/ButtonComponent/ButtonComp";
import { useNavigate } from "react-router-dom";

export const Settle = () => {
  const [dates, setDates] = useState({ start_date: "", end_date: "" });
  const [tableData, setTableData] = useState([]);
  const [totalPoAmount, setTotalPoAMount] = useState();
  const [loading, setLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

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

  const fetchLastSettledDate = async () => {
    try {
      const response = await axiosPrivate.get(`profit/getlastsettledon`);
      console.log({ response });
      const lastSettledOn = response.data.lastSettledOn;
      setDates({ start_date: lastSettledOn });
    } catch (err) {
      console.error(err);
    } finally {
    }
  };
  useEffect(() => {
    fetchLastSettledDate();
  }, []);

  const handleDate = (date) => {
    setDates({ ...dates, end_date: date });
  };
  // table details
  const handleGenerate = async () => {
    if (!dates.end_date) {
      return;
    }
    setLoading(true);
    try {
      const response = await axiosPrivate.post(`profit/account_details`, {
        end_date: dates.end_date,
      });
      console.log({ response });
      setTableData(response?.data?.tableData);
      setTotalPoAMount(response?.data?.totalSalesAmount);
    } catch (err) {
      console.error(err);
      if (err.response.status === 404) {
        setTableData([])
        toast.error("No sales orders found in given range", toastConfig);
      }
    } finally {
      setLoading(false);
    }
  };
  //settle
  const handleSettle = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.post(`profit/addsettle`, {
        end_date: dates.end_date,
        data: tableData,
      });
      console.log({ response });
      if (response.status === 200) {
        toast.success("Success", toastConfig);
        fetchLastSettledDate();
        setTableData([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="settle_container">
        <div className="settle_main">
          <div className="settle_heading settle_flexcenter">
            <span>Profit distribution</span>
          </div>
          <div className="settle_generate">
            <div className="settle_datecontainer">
              <div className="settle_startdate">
                <DatePicker
                  // minDate={new Date()}
                  className="settle_dinputBox "
                  selected={
                    dates?.start_date ? new Date(dates.start_date) : null
                  }
                  name="start_date"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Start date"
                />
              </div>
              <div className="settle_endtdate">
                <DatePicker
                  minDate={
                    dates?.start_date ? new Date(dates.start_date) : null
                  }
                  maxDate={new Date(Date.now() - 24 * 60 * 60 * 1000)}
                  className="settle_inputBox "
                  selected={dates?.end_date ? new Date(dates.end_date) : null}
                  onChange={(date) => handleDate(date, "end_date")}
                  name="end_date"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="End date"
                />
              </div>
            </div>
            <div className="settle_generatebtn">
              <ButtonComp
                type="blue"
                onClick={handleGenerate}
                text="Generate"
              />
            </div>
          </div>
          <div className="settle_tablecontainer">
            <div className="settle_lastsettledon">
              <span>
                {dates.start_date &&
                  ` last settled on
                ${new Date(dates.start_date).toLocaleDateString([], {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}`}
              </span>
            </div>
            <div className="settle_table">
              <div className="settle_tablehead">
                <span className="settle_col1 settle_flexcenter">Sl No</span>
                <span className="settle_col2 settle_flexcenter">
                  Account Name
                </span>
                <span className="settle_col3 settle_flexcenter">Amount</span>
              </div>
              <div className="settle_tablebody">
                {tableData.map((data, index) => (
                  <div key={index} className="settle_tablerow">
                    <div className="settle_bodycol1 ">
                      <span>{index + 1}</span>
                    </div>
                    <div className="settle_bodycol2">
                      <span>{data?.name}</span>
                    </div>
                    <div className="settle_bodycol3">
                      <span>{data?.distributedAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="settle_buttons ">
            <ButtonComp onClick={() => navigate(-1)} text="Close" type="red" />
            <ButtonComp onClick={handleSettle} text="Settle" type="green" />
          </div>
        </div>
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
        <ToastContainer />
      </div>
    </>
  );
};
