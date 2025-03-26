import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import BpoSvg from "../../assets/SVGs/ChannelManagerScreen/BpoSvg";
import DataUser from "./../../assets/SVGs/addUserScreen/DataUser";
import PlatformSvg from "./../../assets/SVGs/addUserScreen/PlatformSvg";

const AddUserNavigation = () => {
  const navigate = useNavigate();
  const [hoverStates, setHoverStates] = useState({
    platform: false,
    dataUser: false,
    agent: false,
    fourth: false,
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
          onMouseOver={(e) => handleMouseOver(e, "dataUser")}
          onMouseLeave={(e) => handleMouseOut(e, "dataUser")}
          className={`flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] absolute -left-80 -top-80  ${
            hoverStates.dataUser ? "z-[6]" : "z-[3]"
          }`}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px]    z-3 hover:z-5 ${
              hoverStates.dataUser
                ? "z-[6] bg-[#228512]"
                : "z-[3] bg-[#22851240]"
            }`}
          >
            {hoverStates.dataUser ? (
              <p className="uppercase font-bold text-3xl">Data User</p>
            ) : (
              <DataUser />
            )}
            <div className="absolute w-[1px] h-[325px] transform rotate-[90deg] -bottom-8 -right-48 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
        {/* 2*/}
        <div
          onMouseOver={(e) => handleMouseOver(e, "platform")}
          onMouseLeave={(e) => handleMouseOut(e, "platform")}
          className="flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] absolute -right-80 -top-80 "
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px]    z-3 hover:z-5 ${
              hoverStates.platform
                ? "z-[6] bg-[#F5760E]"
                : "z-[3] bg-[#F5760E40]"
            }`}
          >
            {hoverStates.platform ? (
              <p className="uppercase font-bold text-3xl">Platform</p>
            ) : (
              <PlatformSvg />
            )}
            {/* Dashed lines extending outward */}
            <div className="absolute w-[1px] h-[120px] transform rotate-[0deg] -bottom-36 left-1/2 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
        {/*3 */}
        <div
          onMouseOver={(e) => handleMouseOver(e, "agent")}
          onMouseLeave={(e) => handleMouseOut(e, "agent")}
          className="flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] absolute -right-80 -bottom-28 "
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px]    z-3 hover:z-5 ${
              hoverStates.agent ? "bg-[#1E40AF] " : "bg-[#1E40AF30]"
            }`}
          >
            {hoverStates.agent ? (
              <p className="uppercase font-bold text-3xl">Agent</p>
            ) : (
              <BpoSvg />
            )}
            {/* Dashed lines extending outward */}
            <div className="absolute w-[1px] h-[330px] transform rotate-[90deg] -top-5 -left-48 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
        {/*4 */}
        <div
          //   onMouseOver={(e) => handleMouseOver(e, "fourth")}
          //   onMouseLeave={(e) => handleMouseOut(e, "fourth")}
          className={`relative flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] bg-white  z-[100] -left-80 -bottom-28`}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px]  ${
              hoverStates.fourth ? "bg-[#1E40AF] " : "bg-[#D9D9D9] "
            }`}
          >
            {" "}
            {hoverStates.fourth ? (
              <p className="uppercase font-bold text-3xl text-center">Fourth</p>
            ) : (
              <></>
            )}
            <div className="absolute w-[1px] h-32 transform rotate-[0deg] -top-36 right-1/2 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserNavigation;
