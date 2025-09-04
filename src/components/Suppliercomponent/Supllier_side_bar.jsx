import React, { useEffect, useState } from 'react'
import "../../components/Customer_component/Side_product_listing.css"
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Supllier_side_bar() {
    const [state, setstate] = useState({
        myProfile: false,
        order: false,
        serviceRequest: false,
        return: false
    })
    const navigate=useNavigate()

    useEffect(() => {
        AOS.init({
            once: true,
        });
    }, [])
    const statechanges = (list) => {
        if (list == "myProfile") {
            if (state.myProfile == false) {
                setstate({
                    myProfile: true, order: false,
                    serviceRequest: false,
                    return: false
                })
            } else {
                setstate({
                    myProfile: false, order: false,
                    serviceRequest: false,
                    return: false
                })
            }

        } else if (list == "order") {
            if (state.order == false) {
                setstate({
                    myProfile: false, order: true,
                    serviceRequest: false,
                    return: false
                })
            } else {
                setstate({
                    myProfile: false, order: false,
                    serviceRequest: false,
                    return: false
                })
            }

        } else if (list == "serviceRequest") {
            if (state.serviceRequest == false) {
                setstate({
                    myProfile: false, order: false,
                    serviceRequest: true,
                    return: false
                })
            } else {
                setstate({
                    myProfile: false, order: false,
                    serviceRequest: false,
                    return: false
                })
            }

        } else if (list == "return") {
            if (state.return == false) {
                setstate({
                    myProfile: false, order: false,
                    serviceRequest: false,
                    return: true
                })
            } else {
                setstate({
                    myProfile: false, order: false,
                    serviceRequest: false,
                    return: false
                })
            }

        }

    }
    console.log("state changes====>", state);
    return (
        <>
            <div data-aos="fade-right" id='side_alighn'>
                <div id='side_bar'>
                    <div style={{ height: "5rem" }}></div>
                    <div id='media_heig'></div>

                    <div id='side_bar_prdct'>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ color: "white", margin: "5px 00px 00px 00px" }} width="24" height="24" fill="currentColor" class="bi bi-person-lines-fill" viewBox="0 0 16 16">
                            <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
                        </svg>
                        &nbsp;&nbsp;
                        <button onClick={() => { statechanges("myProfile") }} id='btn_set_prdct' className='containerfluid'>
                            My profile
                        </button>

                    </div>
                    <div style={{ height: "1.5rem" }}></div>
                    {state.myProfile == true ?
                        <>
                            <div id='side_bar_prdct_txt' >
                                <div id='dsply_none' style={{ width: "70px" }}></div>
                                <a id='prdct_text_dec' onClick={(()=>navigate("/sup_edit_profile"))}>Profile</a>
                            </div>
                            <div style={{ height: "0.5rem" }}></div>
                            <div id='side_bar_prdct_txt' >
                                <div id='dsply_none' style={{ width: "70px" }}></div>
                                <a id='prdct_text_dec' href="">Support</a>
                            </div>
                            <br />

                        </>

                        : ""}

                    <div id='side_bar_prdct'>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ color: "white", margin: "3px 00px 00px 00px" }} width="24" height="24" fill="currentColor" class="bi bi-cart-check-fill" viewBox="0 0 16 16">
                            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1.646-7.646-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708z" />
                        </svg>
                        &nbsp;&nbsp;
                        <button onClick={() => { statechanges("order") }} id='btn_set_prdct' className='containerfluid'>
                            Order
                        </button>
                    </div>
                    <div style={{ height: "1.5rem" }}></div>

                    {state.order == true ?
                        <>
                            <div id='side_bar_prdct_txt' >
                                <div id='dsply_none' style={{ width: "70px" }}></div>
                                <a id='prdct_text_dec' href="">New Order</a>
                            </div>
                            <div style={{ height: "0.5rem" }}></div>
                            <div id='side_bar_prdct_txt' >
                                <div id='dsply_none' style={{ width: "70px" }}></div>
                                <a id='prdct_text_dec' href="">Past Order</a>
                            </div>
                            <br />
                        </>
                        : ""}


                    <div id='side_bar_prdct'>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ color: "white", margin: "5px 00px 00px 00px" }} width="23" height="23" fill="currentColor" class="bi bi-wrench-adjustable-circle-fill" viewBox="0 0 16 16">
                            <path d="M6.705 8.139a.25.25 0 0 0-.288-.376l-1.5.5.159.474.808-.27-.595.894a.25.25 0 0 0 .287.376l.808-.27-.595.894a.25.25 0 0 0 .287.376l1.5-.5-.159-.474-.808.27.596-.894a.25.25 0 0 0-.288-.376l-.808.27.596-.894Z" />
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm-6.202-4.751 1.988-1.657a4.5 4.5 0 0 1 7.537-4.623L7.497 6.5l1 2.5 1.333 3.11c-.56.251-1.18.39-1.833.39a4.49 4.49 0 0 1-1.592-.29L4.747 14.2a7.031 7.031 0 0 1-2.949-2.951ZM12.496 8a4.491 4.491 0 0 1-1.703 3.526L9.497 8.5l2.959-1.11c.027.2.04.403.04.61Z" />
                        </svg>
                        &nbsp;&nbsp;
                        <button onClick={() => { statechanges("serviceRequest") }} id='btn_set_prdct' className='containerfluid'>
                            Service Request
                        </button>
                    </div>
                    <div style={{ height: "1.5rem" }}></div>
                    {state.serviceRequest == true ?
                        <>
                            <div id='side_bar_prdct_txt' >
                                <div id='dsply_none' style={{ width: "70px" }}></div>
                                <a id='prdct_text_dec' href="">New Service Request</a>
                            </div>
                            <div style={{ height: "0.5rem" }}></div>
                            <div id='side_bar_prdct_txt' >
                                <div id='dsply_none' style={{ width: "70px" }}></div>
                                <a id='prdct_text_dec' href="">Past Service Request</a>
                            </div>
                            <br />
                        </> : ""}
                    <div id='side_bar_prdct'>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ color: "white", margin: "5px 00px 00px 00px" }} width="24" height="24" fill="currentColor" class="bi bi-arrow-return-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z" />
                        </svg>
                        &nbsp;&nbsp;
                        <button onClick={() => { statechanges("return") }} id='btn_set_prdct' className='containerfluid'>
                            Return
                        </button>
                    </div>
                    <div style={{ height: "1.5rem" }}></div>
                    {state.return == true ?
                        <>
                            <div id='side_bar_prdct_txt' >
                                <div id='dsply_none' style={{ width: "70px" }}></div>
                                <a id='prdct_text_dec' href="">New Return</a>
                            </div>
                            <div style={{ height: "0.5rem" }}></div>
                            <div id='side_bar_prdct_txt' >
                                <div id='dsply_none' style={{ width: "70px" }}></div>
                                <a id='prdct_text_dec' href="">Past Return</a>
                            </div>
                            <br />
                        </>
                        : ""}
                    <div id='side_bar_prdct'>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ color: "white", margin: "5px 00px 00px 00px" }} width="24" height="24" fill="currentColor" class="bi bi-question-diamond-fill" viewBox="0 0 16 16">
                            <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z" />
                        </svg>
                        &nbsp;&nbsp;
                        &nbsp; <a id='btn_set_prdct_help' href="">Help</a>
                    </div>
                </div>
            </div>
        </>
    )
}
