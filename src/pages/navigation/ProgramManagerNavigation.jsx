import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgramManagement from "./../../assets/SVGs/salesManagerScreen/ProgramManagement";
import ReportSvg from "./../../assets/SVGs/salesManagerScreen/ReportSvg";
import AgentManagementSvg from "./../../assets/SVGs/programManagerScreen/AgentManagementSvg";
import CostSvg from "./../../assets/SVGs/programManagerScreen/CostSvg";
import AddUserSvg from "./../../assets/SVGs/programManagerScreen/AddUserSvg";
import DataCollectionSvg from "../../assets/SVGs/dataManagerScreen/DataCollectionSvg";
import OptimizeSvg from "./../../assets/SVGs/programManagerScreen/OptimizeSvg";
import AutomateSvg from "../../assets/SVGs/globalSvgs/AutomateSvg";

const ProgramManagerNavigation = () => {
  const navigate = useNavigate();
  const [hoverStates, setHoverStates] = useState({
    first: false,
    second: false,
    third: false,
    fourth: false,
    sixth: false,
    fifth: false,
    seventh: false,
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
        {/*program management */}
        <div
          className={`relative flex items-center justify-center rounded-full border-2 border-dashed border-[#D9D9D9] w-[336px] h-[336px] bg-white  z-[100] `}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-10px)] h-[calc(100%-10px)]  ${
              hoverStates.first ? "bg-[#333] " : "bg-[#D9D9D9] "
            }`}
          >
            {hoverStates.first ? (
              <p className="uppercase font-bold text-3xl text-center">
                Program Management
              </p>
            ) : (
              <ProgramManagement />
            )}
          </div>
        </div>
        {/* second*/}
        <div
          // onMouseOver={(e) => handleMouseOver(e, "second")}
          // onMouseLeave={(e) => handleMouseOut(e, "second")}

          className={`flex items-center justify-center rounded-full border-2  border-[#D9D9D930] w-[318px] h-[318px] absolute left-2 -top-64 ${
            hoverStates.second ? "z-[6]" : "z-[3]"
          }`}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-39px)] h-[calc(100%-39px)] ] ${
              hoverStates.second ? " bg-[#D5DEFA] z-[6]" : "z-[3]  bg-[#fbc89f]"
            } `}
          >
            {hoverStates.second ? (
              <p className="w-[9rem] text-center uppercase font-bold text-[28px]">
                Agent Management
              </p>
            ) : (
              // <img src="../../assets/react.svg" />
              <AgentManagementSvg />
            )}
          </div>
        </div>
        {/* third */}
        <div className="flex items-center justify-center rounded-full border-2 border-dashed border-[#D9D9D9] w-44 h-44 absolute -right-[185px] -top-10 ">
          <div className="relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-12px)] h-[calc(100%-12px)]  bg-[#22851266]">
            {/* Dashed circle border */}
            {/* <div className="absolute inset-0 w-full h-full rounded-full border-2 border-dashed border-black" /> */}
            {/* Star ribbon icon (replace with an actual SVG icon if available) */}

            <div className="relative text-black">
              {/* Placeholder for the icon; you might want to replace this with an SVG or FontAwesome icon */}
              <CostSvg />
            </div>
            {/* Dashed lines extending outward */}
            <div className="absolute w-[1px] h-14 transform rotate-[125deg] -top-10 left-0 border-[1px] border-dashed border-[#D9D9D9]" />
            <div className="absolute w-[1px] h-14 transform  rotate-[0deg] -bottom-14 right-8 border-[1px] border-dashed border-[#D9D9D9]" />
            <div className="absolute w-[1px] h-4 transform  rotate-[60deg] bottom-10 -left-4 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
        {/* fourth*/}
        <div
          onClick={() => {
            navigate("add-user");
          }}
          onMouseOver={(e) => handleMouseOver(e, "fourth")}
          onMouseLeave={(e) => handleMouseOut(e, "fourth")}
          className={`flex items-center justify-center rounded-full border-2  border-[#D9D9D930] w-[318px] h-[318px] absolute -right-56 -bottom-40  ${
            hoverStates.fourth ? "z-[6]" : "z-[3]"
          }`}
        >
          {" "}
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-39px)] h-[calc(100%-39px)]    z-3 hover:z-5 ${
              hoverStates.fourth
                ? "z-[6] bg-[#1E40AF] "
                : "z-[3] bg-[#1E40AF30]"
            }`}
          >
            {hoverStates.fourth ? (
              <p className="uppercase font-bold text-3xl text-center">
                Add User
              </p>
            ) : (
              <AddUserSvg />
              // <OmnichannelCommunicationSvg />
            )}
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

        {/*sixth */}
        <div
          className={`flex items-center justify-center rounded-full border-2  border-[#D9D9D930] w-[318px] h-[318px] absolute -left-56 -bottom-40 ${
            hoverStates.sixth ? "z-[6]" : "z-[3]"
          }`}
        >
          <div className="relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-39px)] h-[calc(100%-39px)] bg-[#22851266]   z-3 hover:z-5">
            <OptimizeSvg />
          </div>
        </div>
        {/* seventh */}
        <div className=" flex items-center justify-center rounded-full border-2 border-dashed border-[#D9D9D9] w-44 h-44 absolute -left-[185px] -top-10  ">
          <div className="relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-12px)] h-[calc(100%-12px)]  bg-[#1E40AF66]">
            {/* Dashed circle border */}
            {/* <div className="absolute inset-0 w-full h-full rounded-full border-2 border-dashed border-black" /> */}
            {/* Star ribbon icon (replace with an actual SVG icon if available) */}
            <div className="relative text-black">
              {/* Placeholder for the icon; you might want to replace this with an SVG or FontAwesome icon */}
              <ReportSvg />
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

export default ProgramManagerNavigation;
