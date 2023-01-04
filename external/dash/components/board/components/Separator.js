import React from "react";
import { getLaneClassesByColspan } from "../helpers/style";

export const Separator = ({ colspan = 4 }) => {
  const colspanClass = getLaneClassesByColspan(colspan);

  return (
    <div className={`border-solid border-t border-pearl ${colspanClass}`} />
  );
};
export default Separator;
