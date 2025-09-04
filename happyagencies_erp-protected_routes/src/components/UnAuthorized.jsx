import { useNavigate } from "react-router-dom";
import styles from "./unAuthorized.module.css";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  const buttonStyle = {
    padding: "6px",
    fontSize: "16px",
    backgroundColor: "#1e293b",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    outline: "none",
    marginRight: "10px", 
    
  };

  return (
    <>
      <div className={styles.body}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className={styles.lock}></div>
        </div>
        <div className={styles.message}>
          <h1 className={styles.h1}>Access to this page is restricted</h1>
          <p>
            Please check with the site admin if you believe this is a mistake.
          </p>
        </div>
        <div style={{ textAlign: "center", width: "36%", paddingTop: "1.2rem" }}>
          <button style={buttonStyle} onClick={goBack}>
            Go Back
          </button>
        </div>
      </div>
    </>
  );
};

export default Unauthorized;
