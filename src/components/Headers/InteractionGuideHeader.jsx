import React from "react";

const InteractionGuideHeader = ({ title, companyIcon, igIcon }) => {
  return (
    <div className="bg-white w-full flex justify-between items-center px-10 py-4 rounded-b-md">
      <img src={companyIcon} className="w-40" />
      <p className="font-bold text-2xl text-[#1414C9] bg-[#EAEAEA] rounded-md px-2.5 py-1.5">
        {title}
      </p>
      {igIcon}
    </div>
  );
};

export default InteractionGuideHeader;
