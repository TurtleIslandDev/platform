import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PerformanceManagementSvg from "@assets/SVGs/PerformanceManagementSvg";
import AgentPerformanceSvg from "@assets/SVGs/agentScreen/AgentPerformanceSvg";
import ReportSvg from "@assets/SVGs/salesManagerScreen/ReportSvg";
import RevenueSvg from "@assets/SVGs/dataManagerScreen/RevenueSvg";
import ResultsSvg from "../../../assets/SVGs/globalSvgs/ResultsSvg";

const AgentCompensationNavigation = () => {
  const navigate = useNavigate();
  const [hoverStates, setHoverStates] = useState({
    first: false,
    second: false,
    third: false,
  });

  const handleMouseOver = (e, name) => {
    setHoverStates((prev) => ({ ...prev, [name]: true }));
  };
  const handleMouseOut = (e, name) => {
    setHoverStates((prev) => ({ ...prev, [name]: false }));
  };
  return (
    <div className="w-full h-[calc(100vh+300px)]  flex items-center justify-center ">
      <div className="relative  rounded-full">
        {/* 1*/}
        <div
          onMouseOver={(e) => handleMouseOver(e, "first")}
          onMouseLeave={(e) => handleMouseOut(e, "first")}
          className={`flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] absolute left-0 -top-80  ${
            hoverStates.first ? "z-[6]" : "z-[3]"
          }`}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px]    z-3 hover:z-5 ${
              hoverStates.first ? "z-[6] bg-[#F5760E]" : "z-[3] bg-[#F5760E40]"
            }`}
          >
            {hoverStates.first ? (
              <p className="uppercase font-bold text-3xl text-center">
                Previous Paid
              </p>
            ) : (
              <RevenueSvg />
              //   <p>per</p>
            )}
            <div className="absolute w-[1px] h-[230px] transform rotate-[-45deg] -bottom-44 -right-14 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
        {/*2 */}
        <div
          onMouseOver={(e) => handleMouseOver(e, "second")}
          onMouseLeave={(e) => handleMouseOut(e, "second")}
          className="flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] absolute -right-80 -bottom-28 "
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px]    z-3 hover:z-5 ${
              hoverStates.second ? "bg-[#1E40AF] " : "bg-[#1E40AF30]"
            }`}
          >
            {hoverStates.second ? (
              <p className="uppercase font-bold text-3xl text-center">
                Current Day Totals
              </p>
            ) : (
              <ReportSvg />
            )}
            {/* Dashed lines extending outward */}
            <div className="absolute w-[1px] h-[330px] transform rotate-[90deg] -top-5 -left-48 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
        {/*3 */}
        <div
          onMouseOver={(e) => handleMouseOver(e, "third")}
          onMouseLeave={(e) => handleMouseOut(e, "third")}
          onClick={() => {
            // navigate("/agent-trainee-navigation/hr/documentation/form-1099");
            // navigate("coaching-report-accept");
          }}
          className={`relative flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] bg-white  z-[100] -left-80 -bottom-28`}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px]  ${
              hoverStates.third ? "z-[6] bg-[#228512]" : "z-[3] bg-[#22851240]"
            }`}
          >
            {" "}
            {hoverStates.third ? (
              <p className="uppercase font-bold text-3xl text-center">
                Ability to filter
              </p>
            ) : (
              <div className="transform scale-150">
                <ResultsSvg />
              </div>
            )}
            <div className="absolute w-[1px] h-[230px] transform rotate-[45deg]  -top-52 right-0 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AgentCompensationNavigation;
