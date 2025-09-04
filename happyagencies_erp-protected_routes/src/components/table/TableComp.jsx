import React from "react";
import styles from "./tablecomp.module.css";
import { useNavigate } from "react-router-dom";

export default function TableComp({
  tableHeading,
  tableColumns,
  tableData,
  getRowData,
  triggerSearch
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.table}>
          <div className={styles.tableHead}>
            {tableHeading?.map((val, index) => (
              <div onClick={()=>triggerSearch(val)} key={index}>{val}</div>
            ))}
          </div>
          <div className={styles.tableData}>
            {tableData?.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.tableDataContainer}>
                {tableColumns.map((column, columnIndex) => (
                  <div
                    onClick={(event) => getRowData(tableData[rowIndex], event)}
                    className={styles.fields}
                    key={columnIndex}
                  >
                    <div>{row[column]}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


TableComp.defaultProps = {
  triggerSearch: ()=>{},
};
