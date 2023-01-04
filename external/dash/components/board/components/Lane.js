// import React from "react";
import Grouper from "./Grouper";
import { getLaneClassesByColspan } from "../helpers/style";
import styles from '../fake/dashboard.module.css';

export const Lane = ({ colspan, groupers, index, ...restProps }) => {
  return (
    <>
      <div className={styles[getLaneClassesByColspan(colspan)]} style={{ width: index === 0 ? 950 : 350}}>
        {/* {groupers.map((grouper, index) => (
          <Grouper {...grouper} {...restProps} rank={index + 1} />
        ))} */}
          <Grouper {...groupers[0]} {...restProps} rank={1} />
      </div>
    </>
  );
};

export default Lane;