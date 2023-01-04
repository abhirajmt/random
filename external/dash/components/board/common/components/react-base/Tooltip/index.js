import React, { useState } from "react";
import "./style.css";
// const React = window.React;
// const { useState, useEffect } = window.React;
export const Tooltip = ({ isRightPositioned }) => {
  const [opened, updateOpened] = useState(false);

  const toggleOpened = () => {
    updateOpened(!opened);
  };

  return (
    <div className="tooltip-wrapper md:relative inline-block align-middle leading-28 overflow-visible">
      <div onMouseOver={toggleOpened} onMouseOut={toggleOpened}>
        <slot name="trigger" />
      </div>
      {opened && (
        <div
          className={`${
            opened
              ? "opened absolute mt-4 block bg-shark rounded-md z-10"
              : "closed hidden"
          } ${!isRightPositioned ? "tooltip-left-pos" : "tooltip-right-pos"}`}
        >
          <div className="tooltip-content-wrapper relative px-6 py-2 leading-16 text-xxs text-white">
            <slot name="content" />
            <div
              className="arrow-up absolute h-0"
              style={!isRightPositioned ? "left: 45px" : "right: 24px"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
