import React from 'react'
import Side from './Side'
import {ContentPasteSearch} from '@mui/icons-material';
import {ArrowDropDownCircle} from '@mui/icons-material';
import Topbar from './admin components/Topbar';
export default function Pendingpo() {
  return (
    <>
    <div class="goods">
    <div className='row'>
    <div class="col-sm-3 col-md-3 col-lg-3"style={{padding:"0"}}>
    <Side/>
    </div>
    <div class="col-sm-9 col-md-9 col-lg-9 ">
    <Topbar/>
    <div className='card'style={{width:"100%",backgroundColor:"#A6C991",height:"30px"}}>
    <p className='text-center mt-1'style={{fontWeight:"800px",fontSize:"15px"}}>Purchase Order list</p>
    </div>
    <div className="row">
    <div className="col-sm-6">
      <div className='d-flex align-items-center mt-2'>
    <label class=" disabled" style={{fontWeight:"500PX",fontSize:"15px"}}>PO#</label> 
     <input type="search" class="form-control ml-5"style={{width:"50%",backgroundColor:"#E9F5E1"}}placeholder="Search PO #"/><ContentPasteSearch style={{position:"absolute",marginLeft:"53%"}}/>
     </div> 
    </div>
    <div className="col-sm-6">
    <div className="d-flex align-items-center  mt-2 dropdown">
    <label class=" disabled" style={{fontWeight:"500PX",fontSize:"15px"}}>Supplier#</label> 
     <input type="search" class="form-control ml-3"style={{width:"50%",backgroundColor:"#E9F5E1"}}placeholder="Select Supplier"/><ArrowDropDownCircle style={{position:"absolute",marginLeft:"58%"}} data-toggle="dropdown"aria-haspopup="true" aria-expanded="false"/>
     <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <button class="dropdown-item" type="button">Lorem Ipsum 1</button>
    <button class="dropdown-item" type="button">Lorem Ipsum 2</button>
    <button class="dropdown-item" type="button">Lorem Ipsum 3</button>
  </div>
     </div> 
    </div>    
    </div>

    <div className='row '>
  <div className='col-sm-12'>
<div class="scroll">
<table class="table table-borderless landscape ">
  <thead class="table-head">
    <tr>
      <th>Sl.no</th>
      <th>PO#</th>
      <th>Date</th>
      <th>Supplier</th>
      <th>Net amount</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
    
  </thead>

  <tbody>
 
<tr style={{border:"1px solid black"}}> </tr>
 
  {/* <div class="scroll"> */}
    <tr>
      <td> 1</td>
      <td>PO11223344</td>
      <td>30-1-2023</td>
      <td>Lorem Ipsum</td>
      <td>₹1234567.00</td>
      <td> Confirm</td>
      <td type="button" class="btn "style={{backgroundColor:"#F0CC6F",color:"white",borderRadius:"25px",padding:"2%",marginTop:"2%"}}>Goods Receipt</td>
      
    </tr>
    <tr>
      <td>2</td>
      <td>PO11223345</td>
      <td>30-1-2023</td>
      <td>Lorem Ipsum</td>
      <td>₹1234567.00</td>
      <td>Confirm</td>
      <td  type="button" class="btn mt-1"style={{backgroundColor:"#F0CC6F",color:"white",borderRadius:"25px",marginTop:"2%",padding:"2%"}}>Goods Receipt</td>
     
      
    </tr>
    <tr>
      <td>3</td>
      <td>PO11223346</td>
      <td>30-1-2023</td>
      <td>Lorem Ipsum</td>
      <td>₹1234567.00</td>
      <td>Confirm</td>
      <td type="button" class="btn mt-1 "style={{backgroundColor:"#F0CC6F",color:"white",borderRadius:"25px",marginTop:"2%",padding:"2%"}}>Goods Receipt</td>
      
    </tr>
    <tr>
      <td>4</td>
      <td>PO11223347</td>
      <td>30-1-2023</td>
      <td>Lorem Ipsum</td>
      <td>₹1234567.00</td>
      <td>Drafts</td>
      <td type="button" class="btn mt-1 "style={{backgroundColor:"#78E452",color:"white",borderRadius:"25px",marginTop:"2%",padding:"3%",width:"50%"}}>edit</td>
      
    </tr>
    <tr>
      <td>5</td>
      <td>PO11223346</td>
      <td>30-1-2023</td>
      <td>Lorem Ipsum</td>
      <td>₹1234567.00</td>
      <td>draft</td>
      <td type="button" class="btn mt-1 "style={{backgroundColor:"#78E452",color:"white",borderRadius:"25px",marginTop:"2%",padding:"3%",width:"50%"}}>edit</td>
      
    </tr>
    <tr>
      <td>6</td>
      <td>PO11223348</td>
      <td>30-1-2023</td>
      <td>Lorem Ipsum</td>
      <td>₹1234567.00</td>
      <td>Draft</td>
      <td type="button" class="btn mt-1 "style={{backgroundColor:"#78E452",color:"white",borderRadius:"25px",marginTop:"2%",padding:"3%",width:"50%"}}>edit</td>
    </tr>
    <tr>
      <td>6</td>
      <td>PO11223348</td>
      <td>30-1-2023</td>
      <td>Lorem Ipsum</td>
      <td>₹1234567.00</td>
      <td>Draft</td>
      <td type="button" class="btn mt-1 "style={{backgroundColor:"#78E452",color:"white",borderRadius:"25px",marginTop:"2%",padding:"3%",width:"50%"}}>edit</td>
    </tr>
    <tr>
      <td>7</td>
      <td>PO11223349</td>
      <td>30-1-2023</td>
      <td>Lorem Ipsum</td>
      <td>₹1234567.00</td>
      <td>Received</td>
      </tr>
    <tr>
      <td>8</td>
      <td>PO11223350</td>
      <td>30-1-2023</td>
      <td>Lorem Ipsum</td>
      <td>₹1234567.00</td>
      <td>Received</td>
       </tr>
       <tr>
      <td>9</td>
      <td>PO11223351</td>
      <td>30-1-2023</td>
      <td>Lorem Ipsum</td>
      <td>₹1234567.00</td>
      <td>Received</td>
       </tr>
       <tr>
      <td>10</td>
      <td>PO11223352</td>
      <td>30-1-2023</td>
      <td>Lorem Ipsum</td>
      <td>₹1234567.00</td>
      <td style={{color:"red"}}>Cancelled</td>
       </tr>
    
    <tr class="mt-5" style={{border:"1px solid black"}}>
</tr>
  </tbody>
</table></div>
</div>

</div>

    </div>
    </div>
    </div>

    </>
  )
}
