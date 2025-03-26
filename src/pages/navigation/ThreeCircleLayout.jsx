import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PerformanceManagementSvg from "./../../assets/SVGs/PerformanceManagementSvg";
import AgentPerformanceSvg from "../../assets/SVGs/agentScreen/AgentPerformanceSvg";
import ReportSvg from "../../assets/SVGs/salesManagerScreen/ReportSvg";
import RevenueSvg from "../../assets/SVGs/dataManagerScreen/RevenueSvg";

const ThreeCircleLayout = () => {
  const navigate = useNavigate();
  const [hoverStates, setHoverStates] = useState({
    profitabilityReport: false,
    coachingReport: false,
    performanceHistoricalReport: false,
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
          onMouseOver={(e) => handleMouseOver(e, "profitabilityReport")}
          onMouseLeave={(e) => handleMouseOut(e, "profitabilityReport")}
          className={`flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] absolute left-0 -top-80  ${
            hoverStates.profitabilityReport ? "z-[6]" : "z-[3]"
          }`}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px]    z-3 hover:z-5 ${
              hoverStates.profitabilityReport
                ? "z-[6] bg-[#F5760E]"
                : "z-[3] bg-[#F5760E40]"
            }`}
          >
            {hoverStates.profitabilityReport ? (
              <p className="uppercase font-bold text-3xl text-center">
                Profitability report{" "}
              </p>
            ) : (
              <RevenueSvg />
              //   <p>per</p>
            )}
            <div className="absolute w-[1px] h-[230px] transform rotate-[-45deg] -bottom-44 -right-14 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
        {/*3 */}
        <div
          onMouseOver={(e) => handleMouseOver(e, "coachingReport")}
          onMouseLeave={(e) => handleMouseOut(e, "coachingReport")}
          className="flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] absolute -right-80 -bottom-28 "
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px]    z-3 hover:z-5 ${
              hoverStates.coachingReport ? "bg-[#1E40AF] " : "bg-[#1E40AF30]"
            }`}
          >
            {hoverStates.coachingReport ? (
              <p className="uppercase font-bold text-3xl">Coaching</p>
            ) : (
              <ReportSvg />
            )}
            {/* Dashed lines extending outward */}
            <div className="absolute w-[1px] h-[330px] transform rotate-[90deg] -top-5 -left-48 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
        {/*4 */}
        <div
          onMouseOver={(e) => handleMouseOver(e, "performanceHistoricalReport")}
          onMouseLeave={(e) => handleMouseOut(e, "performanceHistoricalReport")}
          className={`relative flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] bg-white  z-[100] -left-80 -bottom-28`}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px]  ${
              hoverStates.performanceHistoricalReport
                ? "z-[6] bg-[#228512]"
                : "z-[3] bg-[#22851240]"
            }`}
          >
            {" "}
            {hoverStates.performanceHistoricalReport ? (
              <p className="uppercase font-bold text-3xl text-center">
                performance Historical Report
              </p>
            ) : (
              <PerformanceManagementSvg />
            )}
            <div className="absolute w-[1px] h-[230px] transform rotate-[45deg]  -top-52 right-0 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ThreeCircleLayout;
