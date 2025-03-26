import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailSvg from "../../assets/SVGs/ChannelManagerScreen/EmailSvg";
import SmsSVG from "../../assets/SVGs/ChannelManagerScreen/SmsSVG";
import BpoSvg from "../../assets/SVGs/ChannelManagerScreen/BpoSvg";
import ChatSvg from "../../assets/SVGs/ChannelManagerScreen/ChatSvg";
import DataIntegrationSvg from "./../../assets/SVGs/BroadcastCustomerScreen/DataIntegrationSvg";

const BroadcastCustomerNavigation = () => {
  const navigate = useNavigate();
  const [hoverStates, setHoverStates] = useState({
    email: false,
    agentManagement: false,
    data: false,
    campaign: false,
    dataIntegration: false,
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
          // onMouseOver={(e) => handleMouseOver(e, "email")}
          // onMouseLeave={(e) => handleMouseOut(e, "email")}
          className={`flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] absolute left-0 -top-[340px] ${
            hoverStates.email ? "z-[6]" : "z-[3]"
          }`}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px] ] ${
              hoverStates.email
                ? " bg-[#228512] z-[6]"
                : "z-[3]  bg-[#22851230]"
            } `}
          >
            {" "}
            {hoverStates.email ? (
              <p className="w-[9rem] text-center uppercase font-bold text-[28px]">
                Email
              </p>
            ) : (
              <EmailSvg />
            )}
            <div className="absolute w-[1px] h-36 transform rotate-[60deg] top-32 -left-20 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>

        {/* 2*/}
        <div className="flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] absolute -right-96 -top-32 ">
          <div className="relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px]  bg-[#1E40AF30]">
            <div className="relative text-white">
              <SmsSVG />
            </div>
            {/* Dashed lines extending outward */}
            <div className="absolute w-[1px] h-32 transform rotate-[125deg] -top-10 -left-14 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
        {/* 3*/}
        <div
          className={`flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] absolute -right-60 -bottom-64  ${
            hoverStates.data ? "z-[6]" : "z-[3]"
          }`}
        >
          <div className="relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px]  bg-[#1E1E1E30]  z-3 hover:z-5">
            <BpoSvg />
            <div className="absolute w-[1px] h-[100px] transform rotate-[20deg] -top-[103px] right-14 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
        {/* 4 */}
        <div className="flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] absolute right-60 -bottom-64 ">
          <div className="relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px] bg-[#1E40AF30] ">
            <div className="relative text-white">
              {/* Placeholder for the icon; you might want to replace this with an SVG or FontAwesome icon */}
              <ChatSvg />
            </div>
            {/* Dashed lines extending outward */}
            <div className="absolute w-[1px] h-44 transform rotate-[90deg] top-[75px] -right-[110px] border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
        {/*5 */}
        <div
          className={`relative flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] bg-white  z-[100] -left-96 -top-32`}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px]  ${
              hoverStates.dataIntegration ? "bg-[#F5760E3] " : "bg-[#F5760E30] "
            }`}
          >
            {" "}
            {hoverStates.dataIntegration ? (
              <p className="uppercase font-bold text-3xl text-center">
                Data Integration
              </p>
            ) : (
              <DataIntegrationSvg />
            )}
            <div className="absolute w-[1px] h-24 transform rotate-[-25deg] bottom-[-105px] right-16 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastCustomerNavigation;
