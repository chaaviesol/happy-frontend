import React, { useEffect, useState } from 'react'
import "./Leave_list.css"
import axios from 'axios'
import { prismaBaseApi } from '../../../../config'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Newtopbar_ from '../../../../components/admin components/Newtopbar_'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
export default function Leave_lists() {
    const [fullData, setfullData] = useState([])
    const [setgoData, setsetgoData] = useState({
        staff_id: "",
        modified_by: 1,
        status: "",
        id: "",

    })
    const axiosPrivate=useAxiosPrivate()
    useEffect(() => {
        if (setgoData.status) {
            console.log(setgoData)
            axiosPrivate.post(`/staff/approval`, setgoData).then((res) => {
                console.log("res====>", res.data.success)
                if (res.data.success) {
                    toast.success(res.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    let olddt = [...fullData]
                    const indexfind = olddt.findIndex((ele => (ele.id == setgoData.id)))
                    console.log(indexfind);
                    olddt.splice(indexfind, 1)
                    setfullData(olddt)
                }
            })
        }

    }, [setgoData])
    useEffect(() => {
        axiosPrivate.get(`/staff/complete_leave`).then((res) => {
            console.log("res==>", res)
            setfullData(res.data.data)
        })
    }, [])
    return (
        <>
            <ToastContainer />

            <div className=' p-4'>
                <Newtopbar_ />
                <div style={{ height: "20px" }}></div>
                <div className='leave_list_start'>
                    <div id="Cart_Cntrl_heading">
                        <p>
                            Staff leave list
                        </p>
                    </div>
                    <div className='leave_list_set_table'>
                        <div className='leave_list_set_head_set'>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Employer ID</p>
                            </div>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Name</p>
                            </div>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Leave type</p>
                            </div>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Start date</p>
                            </div>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>End date</p>
                            </div>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Total days</p>
                            </div>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Document</p>
                            </div>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Accept/Reject</p>
                            </div>
                        </div>

                        {fullData.map((data, index) =>
                            <div key={index} style={{
                                backgroundColor:
                                    index % 2 === 0 ? "rgb(231 228 247)" : "",
                                cursor: "pointer",
                            }} className='leave_list_table_data'>
                                <div className='leave_list_1_head'>
                                    <p id='leave_list_head_ptag'>{data.staff_id}</p>
                                </div>
                                <div className='leave_list_1_head'>
                                    <p id='leave_list_head_ptag'>{data.name}</p>
                                </div>
                                <div className='leave_list_1_head'>
                                    <p id='leave_list_head_ptag'>{data.leave_type}</p>
                                </div>
                                <div className='leave_list_1_head'>
                                    <p id='leave_list_head_ptag'>{data.from_date}</p>
                                </div>
                                <div className='leave_list_1_head'>
                                    <p id='leave_list_head_ptag'>{data.to_date}</p>
                                </div>
                                <div className='leave_list_1_head'>
                                    <p id='leave_list_head_ptag'>{data.total_days}</p>
                                </div>
                                <div className='leave_list_1_head'>
                                    <p id='leave_list_head_ptag'>{data.document}</p>
                                </div>
                                <div className='leave_list_1_head'>
                                    <div style={{ display: 'flex' }}>
                                        <button onClick={() => { setsetgoData({ ...setgoData, staff_id: data.staff_id, status: "accepted", id: data.id }) }} className='leave_list_1_btn1_color'>accept</button>&nbsp;/&nbsp;<button onClick={() => { setsetgoData({ staff_id: data.staff_id, status: "rejected", id: data.id }) }} className='leave_list_1_btn2_color'>reject</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

        </>

    )
}
