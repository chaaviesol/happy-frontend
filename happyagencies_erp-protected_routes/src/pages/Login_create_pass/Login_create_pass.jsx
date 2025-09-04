import React, { useState } from 'react'
import "./Login_create.css"
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";


import { useNavigate } from 'react-router-dom'
import { prismaBaseApi } from '../../config';
export default function Login_create_pass() {
    const [otptrue, setotptrue] = useState({
        otpsent: false,
        login_success: false,
        inputonchange: false
    })
    const [inpvalue, setinpvalue] = useState({
    })
    const [userid, setuserid] = useState()

    const inpchange = (e) => {
        const name = e.target.name
        const value = e.target.value

        setinpvalue({ ...inpvalue, [name]: value })

    }
    const navigate = useNavigate()
    const sentotp_fn = () => {
        axios.post(`${prismaBaseApi}/user/forgotPwd`, inpvalue)
            .then((res) => {
                console.log("response===>", res);
                setotptrue({ otpsent: true });
                setuserid(res.data.data)
            }).catch(error => {
                console.log("Error:", error);
                toast.error("Incorrect Email", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });



    }
    const getotp = () => {
        axios.post(`${prismaBaseApi}/user/otpLogin`, inpvalue).then((res) => {
            console.log(res);
            if (res.data.success) {
                setotptrue({ login_success: true })
            }
        }).catch(error => {
            console.log("Error:", error);
            toast.error("Incorrect OTP", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        });
    }
    const newpassword = () => {
        if (inpvalue.password == inpvalue.repassword) {
            console.log(otptrue.inputonchange);
            setotptrue({ ...otptrue, inputonchange: false })

            axios.post(`${prismaBaseApi}/user/resetPwd/${userid}`, inpvalue).then((res) => {
                console.log(res);
                if (res.data.success) {
                    navigate("/login")
                }
            })
        } else {
            setotptrue({ ...otptrue, inputonchange: true })
        }
    }
    console.log(userid);
    return (
        <>
            <ToastContainer />
            <div id='create_align'>
                <div id='create_box'>
                    {!otptrue.login_success ?
                    <div className="create_forgot_pass">
                    <p>Forgot Password</p>
                    <form>
                        <div class="create_user_box">
                            <input id='create_forgot_inp' onChange={inpchange} required="" name="email" type="text" />
                            <label>Email</label>
                        </div>
                        {otptrue.otpsent ?
                            <div className="create_user_box">
                                <input id='create_forgot_inp' onChange={inpchange} required="" name="otp" type="text" />
                                <label>Otp</label>
                            </div>
                            : ""}
                        {!otptrue.otpsent ?
                            <a onClick={sentotp_fn} href="#">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                Sent otp
                            </a>
                            : ""}
                        {otptrue.otpsent ?
                            <a onClick={getotp} href="#">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                Submit
                            </a>
                            : ""
                        }
                    </form>
                </div>
                : ""}
            {otptrue.login_success ?
                <div className="create_forgot_pass">
                    <p>Reset Password</p>
                    <form>
                        <div class="create_user_box">
                            <input id='create_forgot_inp' onChange={inpchange} required="" name="password" type="password" />
                            <label> Enter new password</label>
                        </div>
                        <div className="create_user_box">

                            {otptrue.inputonchange ? <div>
                                <div style={{ height: "2px" }}></div>

                                <p style={{ fontSize: "0.6rem", color: "red", textAlign: "start", margin: "00px 00px 00px 00px" }}>passwords doesn't match</p>
                            </div> : ""

                            }
                            <input id='create_forgot_inp' onChange={inpchange} required="" name="repassword" type="password" />
                            <label>Re enter password</label>
                        </div>
                        <a onClick={newpassword} href="#">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Submit
                        </a>
                    </form>
                </div>
                : ""}
        </div>

    </div>

</>
)
}