import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import SupervisorSvg from "./../../assets/SVGs/QcAndSupervisorScreen/SupervisorSvg";
import CoachSvg from "./../../assets/SVGs/QcAndSupervisorScreen/CoachSvg";
import ReportSvg from "../../assets/SVGs/salesManagerScreen/ReportSvg";
import ScoringRulesSvg from "./../../assets/SVGs/QcAndSupervisorScreen/ScoringRulesSvg";
import QcLookupSvg from "./../../assets/SVGs/QcAndSupervisorScreen/QcLookupSvg";
import BuzzWordSvg from "../../assets/SVGs/BuzzWordSvg";
import AutomateSvg from "../../assets/SVGs/globalSvgs/AutomateSvg";

const QcAndSupervisorNavigation = () => {
  const navigate = useNavigate();
  const [hoverStates, setHoverStates] = useState({
    supervisor: false,
    coach: false,
    report: false,
    scoringRules: false,
    chat: false,
    supervisorReport: false,
    web: false,
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
        {/* Data Collection svg */}
        <div
          onMouseOver={(e) => handleMouseOver(e, "supervisor")}
          onMouseLeave={(e) => handleMouseOut(e, "supervisor")}
          className={`relative flex items-center justify-center rounded-full border-2 border-dashed border-[#D9D9D9] w-[336px] h-[336px] bg-white  z-[100] `}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-10px)] h-[calc(100%-10px)]  ${
              hoverStates.supervisor ? "bg-[#333] " : "bg-[#D9D9D9] "
            }`}
          >
            {hoverStates.supervisor ? (
              <p className="uppercase font-bold text-3xl text-center">
                Supervisor
              </p>
            ) : (
              <SupervisorSvg />
            )}
          </div>
        </div>
        {/* Coach*/}
        <div
          onClick={() => navigate("/coaching-report-submit")}
          onMouseOver={(e) => handleMouseOver(e, "coach")}
          onMouseLeave={(e) => handleMouseOut(e, "coach")}
          className={`flex items-center justify-center rounded-full border-2  border-[#D9D9D930] w-[318px] h-[318px] absolute left-2 -top-64 ${
            hoverStates.coach ? "z-[6]" : "z-[3]"
          }`}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-39px)] h-[calc(100%-39px)] ] ${
              hoverStates.coach
                ? " bg-[#F5760E] z-[6]"
                : "z-[3]  bg-[#F5760E30]"
            } `}
          >
            {hoverStates.coach ? (
              <p className="w-[9rem] text-center uppercase font-bold text-[28px]">
                Coach
              </p>
            ) : (
              <CoachSvg />
            )}
          </div>
        </div>
        {/* report */}
        <div
          className="flex items-center justify-center rounded-full border-2 border-dashed border-[#D9D9D9] w-44 h-44 absolute -right-[185px] -top-10"
          onClick={() => navigate("/qc-and-supervisor-navigation/create-template")}
        >
          <div className="relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-12px)] h-[calc(100%-12px)]  bg-[#22851266]">
            {/* Dashed circle border */}
            {/* <div className="absolute inset-0 w-full h-full rounded-full border-2 border-dashed border-black" /> */}
            {/* Star ribbon icon (replace with an actual SVG icon if available) */}

            <div className="relative text-black">
              {/* Placeholder for the icon; you might want to replace this with an SVG or FontAwesome icon */}
              <ReportSvg />
            </div>
            {/* Dashed lines extending outward */}
            <div className="absolute w-[1px] h-14 transform rotate-[125deg] -top-10 left-0 border-[1px] border-dashed border-[#D9D9D9]" />
            <div className="absolute w-[1px] h-14 transform  rotate-[0deg] -bottom-14 right-8 border-[1px] border-dashed border-[#D9D9D9]" />
            <div className="absolute w-[1px] h-4 transform  rotate-[60deg] bottom-10 -left-4 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
        {/* scoringRules*/}
        <div
          className={`flex items-center justify-center rounded-full border-2  border-[#D9D9D930] w-[318px] h-[318px] absolute -right-56 -bottom-40  ${
            hoverStates.scoringRules ? "z-[6]" : "z-[3]"
          }`}
        >
          <div className="relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-39px)] h-[calc(100%-39px)]  bg-[#1E40AF30]  z-3 hover:z-5">
            <ScoringRulesSvg />
          </div>
        </div>
        {/* fifth*/}
        <div
          onMouseOver={(e) => handleMouseOver(e, "fifth")}
          onMouseLeave={(e) => handleMouseOut(e, "fifth")}
          onClick={() => {
            navigate("/support");
          }}
          className="flex items-center justify-center rounded-full border-2 border-dashed border-[#D9D9D9] w-44 h-44 absolute right-20 -bottom-52 "
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-12px)] h-[calc(100%-12px)] ${
              hoverStates.fifth ? " bg-[#F5874B] z-[6]" : "z-[3]  bg-[#fbc89f]"
            }`}
          >
            {hoverStates.fifth ? (
              <p className="uppercase font-bold text-3xl text-center">
                Support
              </p>
            ) : (
              <AutomateSvg />
              // <OmnichannelCommunicationSvg />
            )}
            {/* Dashed lines extending outward */}
            <div className="absolute w-[1px] h-14 transform rotate-[-75deg] top-[75px] -left-[32px] border-[1px] border-dashed border-[#D9D9D9]" />
            <div className="absolute w-[1px] h-14 transform  rotate-[75deg] top-[75px] -right-[29px] border-[1px] border-dashed border-[#D9D9D9]" />
            <div className="absolute w-[1px] h-4 transform  -top-6 right-17 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>

        {/*qc lookup*/}
        <div
          className={`flex items-center justify-center rounded-full border-2  border-[#D9D9D930] w-[318px] h-[318px] absolute -left-56 -bottom-40 ${
            hoverStates.chat ? "z-[6]" : "z-[3]"
          }`}
        >
          <div className="relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-39px)] h-[calc(100%-39px)] bg-[#22851266]   z-3 hover:z-5">
            <QcLookupSvg />
          </div>
        </div>
        {/*  */}
        <div
          onClick={() => navigate("upload-data")}
          onMouseOver={(e) => handleMouseOver(e, "web")}
          onMouseLeave={(e) => handleMouseOut(e, "web")}
          className=" flex items-center justify-center rounded-full border-2 border-dashed border-[#D9D9D9] w-44 h-44 absolute -left-[185px] -top-10  "
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-12px)] h-[calc(100%-12px)] ${
              hoverStates.web ? "z-[6] bg-[#1E40AF] " : "z-[3] bg-[#1E40AF66]"
            }`}
          >
            <div className="relative text-white">
              {/* Placeholder for the icon; you might want to replace this with an SVG or FontAwesome icon */}
              {/* <WebSvg /> */}
              {hoverStates.web ? (
                <p className="uppercase font-bold text-3xl text-center">
                  Upload
                </p>
              ) : (
                "Upload"
              )}
            </div>
            {/* Dashed lines extending outward */}
            <div className="absolute w-[1px] h-14 transform rotate-[50deg] -top-10 right-0 border-[1px] border-dashed border-[#D9D9D9]" />
            <div className="absolute w-[1px] h-14 transform  rotate-[10deg] -bottom-14 left-6 border-[1px] border-dashed border-[#D9D9D9]" />
            <div className="absolute w-[1px] h-4 transform  rotate-[125deg] bottom-10 -right-4 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QcAndSupervisorNavigation;
