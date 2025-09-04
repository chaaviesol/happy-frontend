import React from 'react'
import "./Admin_Navigate.css"
import { AddCircle, AddShoppingCart, Category, CheckCircle, FeaturedPlayList, Notifications, PersonAdd, Toc, Warehouse } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import Newtopbar_ from '../../../components/admin components/Newtopbar_';
import { prismaBaseApi } from '../../../config';
import axios from 'axios';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useEffect } from 'react';
import { useState } from 'react';
import Chart_graph from '../../../components/admin components/Chart_graph';
import { Pie } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Chart as ChartJS } from "chart.js/auto";
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
export default function Admin_navigate() {
    const navigate = useNavigate()
    const [notifications, setnotifications] = useState({})
    const [data, setdata] = useState([])
    const [TOtal_users, setTOtal_users] = useState({})
    const [PresentStaff, setPresentStaff] = useState({})
    const [full_filled_Data, setfull_filled_Data] = useState([

    ])
    const axiosPrivate=useAxiosPrivate()
    const usertype="SU"
    // const allowedpages=["HeyChavie", "inventory", "NewProducts", "productlist", "CreatePO", "polist","SOlist"]
    // const allowedpages=[]
    // const allowedpages = ["Inventory", "Newsalesorder", "Solist","Salesorders", "Quotationworklist", "Service&Return"];
    const allowedpages=[
        "HeyChavie",
        "Inventory",
        "NewProducts",
        "Productlist",
        "Category",
        "NewUser",
        "Worklist",
        "CreatePO",
        "POlist",
        "Supplierlist",
        "Customerlist",
        "Newsalesorder",
        "SOlist",
        "Quotationworklist",
        "Service&Return",
        "Leavelist",
        "Staffclaim",
      ]



    useEffect(() => {
    
      
        axiosPrivate.post(`/notification/notification_types`).then((res) => {
            // console.log("res===>", res)
            setnotifications(res.data)

        })
        axiosPrivate.get(`/user/users_types`).then((res) => {
            // console.log("res===>", res)
            setTOtal_users(res.data)
        })
        axiosPrivate.get(`/sales/order_fulfilled`).then((res) => {
            // console.log("res===>", res)
            setfull_filled_Data(res.data)
        })
        axiosPrivate.post(`/staff/total`).then((res) => {
            // console.log("res===>", res)
            setPresentStaff(res.data.data)
        })

        AOS.init({
            once: true,
        });
    }, [])

    useEffect(() => {
        if (notifications) {
            let OR = notifications.OR || [];
            let CO = notifications.CO || [];
            let PD = notifications.PD || [];
            let RT = notifications.RT || [];
            let UR = notifications.UR || [];
            let SR = notifications.SR || [];

            OR = OR.filter((ele => (ele.read == "N")))
            CO = CO.filter((ele => (ele.read == "N")))
            PD = PD.filter((ele => (ele.read == "N")))
            RT = RT.filter((ele => (ele.read == "N")))
            UR = UR.filter((ele => (ele.read == "N")))
            SR = SR.filter((ele => (ele.read == "N")))

            setdata([
                {
                    name: "New Products",
                    pageName:"NewProducts",
                    logo: <AddCircle style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/addproducts"
                }, {
                    name: "New User",
                    pageName:"NewUser",
                    logo: <PersonAdd style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/register_new"
                }, {
                    name: "Create PO",
                    pageName:"CreatePO",
                    logo: <AddShoppingCart style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/purchase"
                }, {
                    name: "New sales order",
                    pageName:"Newsalesorder",
                    logo: <ShoppingCartCheckoutIcon style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/new_sales_order"
                }, {
                    name: "PO list",
                    pageName:"POlist",
                    logo: <Toc style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/purchaseorders"
                }, {
                    name: "Sales orders",
                    pageName:"SOlist",
                    logo: <FormatListNumberedIcon style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/so_list",
                    notification: CO.length
                }, {
                    name: "Supplier list",
                    pageName:"Supplierlist",
                    logo: <GroupIcon style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/supplierlist",
                },
                {
                    name: "Customer list",
                    pageName:"Customerlist",
                    logo: <GroupIcon style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/customerlist",
                }, {
                    name: "Quotation worklist",
                    pageName:"Quotationworklist",
                    logo: <RequestQuoteIcon style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/admin_quotation",
                    notification: OR.length
                }, {
                    name: "Inventory",
                    pageName:"Inventory",
                    logo: <Warehouse style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/inventory"
                }, {
                    name: "Product list",
                    pageName:"productlist",
                    logo: <FeaturedPlayList style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/prodlist"
                }, {
                    name: "Category",
                    pageName:"Category",
                    logo: <Category style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/category_manager"
                }, {
                    name: "Work list",
                    pageName:"Worklist",
                    logo: <CheckCircle style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/worklist",
                    notification: UR.length
                }, {
                    name: "Product worklist",
                    pageName:"SO list",
                    logo: <ConstructionIcon style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/productworklist",
                    notification: PD.length
                }, {
                    name: "Leave list",
                    pageName:"Leavelist",
                    logo: <ConstructionIcon style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/leave_list",
                    notification: PD.length
                }, {
                    name: "Staff claim",
                    pageName:"Staffclaim",
                    logo: <ConstructionIcon style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/staff_claim",
                    notification: PD.length
                }, {
                    name: "Service & Return",
                    pageName:"Service&Return",
                    logo: <ConstructionIcon style={{ fontSize: '30px', color: 'white', textAlign: "center" }} />,
                    redirect: "/adm_service_view",
                    notification: SR.length + RT.length
                }
            ])
        }

    }, [notifications])


    // console.log("present_staff==>", PresentStaff)
    const salesorder = {
        labels: full_filled_Data.map(entry => {
            const words = entry.month.split(' ');
            return words[words.length - 1];
        }).reverse(),
        datasets: [
            {
                label: "Sales order",
                data: full_filled_Data?.map(entry => entry.total_amount),
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "#006357"
            },
            {
                label: "Remaining payment",
                data: full_filled_Data?.map(entry => entry.remaining_amount),
                fill: false,
                borderColor: "rgb(214, 182, 21)"
            }
        ]
    };
    const placedOrders = {
        labels: full_filled_Data.map(entry => {
            const words = entry.month.split(' ');
            return words[words.length - 1];
        }).reverse(),
        datasets: [
            {
                label: "Placed orders",
                data: full_filled_Data?.map(entry => entry.total_salesorders),
                backgroundColor: [
                    "#006357",
                ],
            },
        ],
    };
    const attendance = {
        labels: ["Present staff", "Absent staff"],
        datasets: [
            {
                data: [PresentStaff.total_staff_present, PresentStaff.total_staffabsent],
                backgroundColor: [
                    "#006357",
                    "rgb(214 182 21)"
                ],
            }
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'left',
            },
        },
        chart: {
            type: 'pie',
            height: 100,
            background: '#F6F8FA',
            toolbar: {
                show: false,
                autoSelected: 'pan',
            },
        },
        // Other options...
    };

    const options2 = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                align: 'start'

            },
        },
        chart: {
            type: 'pie',
            height: 100,
            background: '#F6F8FA',
            toolbar: {
                show: false,
                autoSelected: 'pan',
            },
        },
        // Other options...
    };

    const filteredData = allowedpages.length > 0
  ? data.filter(dt => {
    if(dt.pageName){

        const formattedName = dt.pageName.replace(/\s/g, '')
        return allowedpages.includes(formattedName);
    }
    
    })
  : data;
//   console.log(">>>>>",filteredData)
// const filteredData = allowedpages.length > 0
//   ? data.filter(dt => allowedpages.includes(dt.name))
//   : data;

    return (
        <>
            <div className='admin_na_align p-4'>
                <Newtopbar_ />
                <div className='setting_alignment_nav' >
                    <div style={{ height: "40px" }}></div>
                    {usertype==="SU" &&
                        
                    <div className='admn_na_startcards'>
                        <div data-aos="fade-right" data-aos-duration="1500" className='admn_na_startcard p-4'>
                            <div>
                                <p className='admn_na_P_tagstart'>Users</p>
                            </div>
                            <div className='admn_na_start_flx'>
                                <p className='admn_na_P_tag'><span style={{ color: "rgb(214 182 21)" }}>C</span>ustomers - {TOtal_users.CUS?.count}</p>
                                <p className='admn_na_P_tag'><span style={{ color: "rgb(214 182 21)" }}>S</span>uppliers - {TOtal_users.SUP?.count}</p>
                                <p className='admn_na_P_tag'><span style={{ color: "rgb(214 182 21)" }}>S</span>taff - {TOtal_users.ADM?.count}</p>
                            </div>
                        </div>
                        <div data-aos="fade-right" data-aos-duration="1500" className='admn_na_startcard'>
                            <Line data={salesorder} options={options2} />
                        </div>
                        <div data-aos="fade-left" data-aos-duration="1500" className='admn_na_startcard'>
                            <Bar data={placedOrders} />
                        </div>
                        <div data-aos="fade-left" data-aos-duration="1500" className='admn_na_startcard'>
                            <div className='admn_na_pie_Ptag_align'>
                                <p className='admn_na_P_tagstartal'>Present staff</p>
                            </div>
                            <div className='admn_na_pie_align'>
                                <Pie style={{ textAlign: 'center' }} data={attendance} options={options} />
                            </div>

                        </div>
                    </div>
                    }
                    <div style={{ height: "20px" }}></div>
                    <div className='row'>

                        {filteredData.map((dt,index) =>
                            <div key={index} className='col-sm-3 p-2' >
                                <div onClick={() => { navigate(`${dt.redirect}`) }} className='admn_na_cards'>
                                    <div className='admn_na_card'>
                                        {dt.name == "Work list" || dt.name === "So list" || dt.name == "Quote worklist" || dt.name == "Service & Return" || dt.name == "Product worklist" ?
                                            < div style={{ width: '100%', display: "flex", justifyContent: "end" }}>
                                                <p className='admn_na_ptagNoti'>{dt.notification}</p>
                                            </div>
                                            : ""
                                        }
                                        <div className='adm_na_crd_head p-2'>
                                            <div className='adm_na_crd_al'>
                                                {dt.logo}
                                            </div>
                                            <p className='adm_na_crd_ptags'>{dt.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div >
        </>
    )
}

