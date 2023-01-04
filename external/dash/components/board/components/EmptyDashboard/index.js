import React from "react";
import Format from "../../common/components/react-base/Intl/Format";
import emptyContent from "./assets/empty-content.svg";
import messages from "./messages.json";
import "./style.css";

const EmptyDashboard = () => (
  <div className="error-wrapper relative bg-white">
    <div className="error-block absolute text-center">
      <img
        alt="error"
        width="auto"
        height="192"
        className="mx-auto"
        src={emptyContent}
      />
      <div className="mt-12 text-lg font-semibold text-shark leading-24">
        <Format {...messages.title} />
      </div>
      <div className="mt-2 text-md font-normal text-outerSpace leading-20">
        <Format {...messages.subtitle} />
      </div>
      <div className="text-md font-normal text-outerSpace leading-20">
        <Format {...messages.subtitle2} />
      </div>
    </div>
  </div>
);

export default EmptyDashboard;
