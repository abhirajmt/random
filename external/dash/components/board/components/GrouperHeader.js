import React from "react";

export const GrouperHeader = ({ name, description }) => (
  <>
    {name && (
      <div className="pb-4">
        <div className="text-xl font-semibold text-shark">{name}</div>
        {description && (
          <div className="pt-1 text-sm text-darkOuterSpace">{description}</div>
        )}
      </div>
    )}
  </>
);

export default GrouperHeader;
