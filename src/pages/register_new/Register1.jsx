import React from 'react'
import { useState } from 'react'
import Admin_reg from '../admin_reg/Admin_reg'
import Customer from '../Customer/customer_reg/Customer'
import Supplier_reg from '../../pages/Supplier_view/supplier_reg/Supplier_reg'
import "./Register1.css"
import { useLocation, useNavigate } from "react-router-dom";
import Pre from './Preregisterform'
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Register1() {
  const location = useLocation();
  const navigate = useNavigate();
  const toggle = location.state
  const [renderingState, setrenderingState] = useState({
    customer: false,
    admin: false,
    supplier: toggle === "sup" ? true : false
  })
  return (
    <>
      <div id='home_admn_reg_mainset' >
        <button
          onClick={() => navigate(-1)}
          className=" beautiful-button back-button"
        >
          <ArrowBackIcon style={{ fontSize: "22px", marginRight: "6px" }} />
          Back
        </button>

        <div id='home_admn_reg_setting1'>
          <img id='home_admn_reg_setting1_img' src="./assets/logo.png" alt="" />
          <p id='home_admn_reg_setting1_ptag1'>Happy Group</p>
        </div>
        <div id='home_admn_reg_setting2'>
          {renderingState.customer || renderingState.supplier || renderingState.admin ? "" :
            <>

              <button onClick={() => { setrenderingState({ customer: true }) }} className="beautiful-button">
                Customer
              </button>
              <div style={{ width: "20px", height: "20px" }}></div>
              <button onClick={() => { setrenderingState({ supplier: true }) }} className="beautiful-button">
                Supplier
              </button>
              <div style={{ width: "20px", height: "20px" }}></div>
              <button onClick={() => { setrenderingState({ admin: true }) }} className="beautiful-button">
                Admin
              </button>
            </>

          }
          {renderingState.admin ?
            <Admin_reg />
            :
            ""
          }
          {renderingState.customer ?
            // <Pre />
            <Customer/>
            :
            ""
          }
          {renderingState.supplier ?
            <Supplier_reg />
            :
            ""
          }

        </div>



      </div>
    </>

  )
}

