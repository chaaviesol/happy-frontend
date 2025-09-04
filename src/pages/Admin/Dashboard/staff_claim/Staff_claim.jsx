import React, { useEffect, useState } from 'react'
import "../leave_list/Leave_list.css"
import axios from 'axios'
import { prismaBaseApi } from '../../../../config'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Newtopbar_ from '../../../../components/admin components/Newtopbar_'
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
export default function Staff_claim() {
    const [fullData, setfullData] = useState([])
    const [setgoData, setsetgoData] = useState({
        id: "",
        status: "",
        modified_by: 1,
    })
    const axiosPrivate=useAxiosPrivate()
    useEffect(() => {
        if (setgoData.status) {
            axiosPrivate.post(`/staff/claim_approve`, setgoData).then((res) => {
                if (res.data.success === true) {
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
        axiosPrivate.get(`/staff/complete_claim`).then((res) => {
            console.log("res==>", res)
            setfullData(res.data.data)
        })
    }, [])
    return (
        <>
            <div className=' p-4'>
                <Newtopbar_ />
                <ToastContainer />
                <div style={{ height: "20px" }}></div>
                <div className='leave_list_start'>
                    <div id="Cart_Cntrl_heading">
                        <p>
                            Staff claim list
                        </p>
                    </div>
                    <div className='leave_list_set_table'>
                        <div className='leave_list_set_head_set'>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Id</p>
                            </div>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Staff id</p>
                            </div>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Name</p>
                            </div>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Claim type</p>
                            </div>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Claim amount</p>
                            </div>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Claim status</p>
                            </div>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Remarks</p>
                            </div>
                            <div className='leave_list_1_head'>
                                <p id='leave_list_head_ptag'>Accept/Reject</p>
                            </div>
                        </div>

                        {fullData.map((data, index) =>
                            <div key={index}
                                style={{
                                    backgroundColor:
                                        index % 2 === 0 ? "rgb(231 228 247)" : "",
                                    cursor: "pointer",
                                }} className='leave_list_table_data'>
                                <div className='leave_list_1_head'>
                                    <p id='leave_list_head_ptag'>{data.id}</p>
                                </div>
                                <div className='leave_list_1_head'>
                                    <p id='leave_list_head_ptag'>{data.staff_id}</p>
                                </div>
                                <div className='leave_list_1_head'>
                                    <p id='leave_list_head_ptag'>{data.name}</p>
                                </div>
                                <div className='leave_list_1_head'>
                                    <p id='leave_list_head_ptag'>{data.claim_type}</p>
                                </div>
                                <div className='leave_list_1_head'>
                                    <p id='leave_list_head_ptag'>{data.claim_amount}</p>
                                </div>
                                <div className='leave_list_1_head'>
                                    <p id='leave_list_head_ptag'>{data.claim_status}</p>
                                </div>
                                <div className='leave_list_1_head'>
                                    <p id='leave_list_head_ptag'>{data.remarks}</p>
                                </div>
                                <div className='leave_list_1_head'>
                                    <div style={{ display: 'flex' }}>
                                        <button onClick={() => { setsetgoData({ ...setgoData, status: "accepted", id: data.id }) }} className='leave_list_1_btn1_color'>accept</button>&nbsp;/&nbsp;<button onClick={() => { setsetgoData({ status: "rejected", id: data.id }) }} className='leave_list_1_btn2_color'>reject</button>
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
