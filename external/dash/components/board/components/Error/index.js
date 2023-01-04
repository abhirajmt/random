import React, { useEffect } from "react";
import Format from "../Intl/Format";
import errorImage from "./assets/errorImage.svg";
import messages from "./messages.json";
import "./style.css";

const Error = ({ onMount, onTryAgain, onReportIssue }) => {
  useEffect(() => {
    onMount();
  }, []);

  return (
    <div className="error-wrapper relative bg-white">
      <div className="error-block absolute text-center">
        <img
          alt="error"
          width="auto"
          height="332"
          className="mx-auto"
          src={errorImage}
        />
        <div className="mt-12 text-lg font-semibold text-shark leading-24">
          <Format {...messages.title} />
        </div>
        <div className="mt-2 text-md font-normal text-outerSpace leading-20">
          <Format {...messages.subtitle} />
        </div>
        <div className="mt-10">
          {onReportIssue && (
            <button
              className="btn btn-report-issue mr-6 text-md font-semibold leading-30 px-6 rounded-md border outline-none ext-darkOuterSpace border-alto bg-white"
              onClick={onReportIssue}
              type="button"
            >
              <Format {...messages.reportIssue} />
            </button>
          )}
          <button
            className="btn btn-try-again text-md font-semibold leading-30 px-6 rounded-md border outline-none text-white border-indigo bg-indigo"
            onClick={onTryAgain}
            type="button"
          >
            <Format {...messages.tryAgain} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;
