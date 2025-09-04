import React from "react";
import styles from "./styles.module.css";
import { Modal } from "@mui/material";

function Index({ show, image, setShow }) {

  return (
      <Modal  open={show} close={()=>setShow(false)}>
        <div onMouseLeave={()=>setShow(false)} className={styles.modalContainer}>
          <img className={styles.img} style={{ cursor: "pointer" }} src={image} onClick={()=>setShow(false)} />
        </div>
      </Modal>
  );
}

export default Index;
