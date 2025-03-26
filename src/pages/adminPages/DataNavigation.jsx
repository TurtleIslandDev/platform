import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AgentGuiSvg from "../../assets/SVGs/AgentGuiSvg";
import PayrollSvg from "../../assets/SVGs/PayrollSvg";
import CeritficationsSvg from "../../assets/SVGs/CeritficationsSvg";
import AgentLearningSvg from "../../assets/SVGs/agentScreen/AgentLearningSvg";
import AgentPerformanceSvg from "../../assets/SVGs/agentScreen/AgentPerformanceSvg";
import Cookies from "universal-cookie";
import AutomateSvg from "../../assets/SVGs/globalSvgs/AutomateSvg";
import TraineeSVG from "./../../assets/SVGs/TraineeSVG";

const DataNavigation = () => {
  const navigate = useNavigate();
  const cookies = new Cookies(null, null, { path: "/" });
  const [hoverStates, setHoverStates] = useState({
    first: false,
    second: false,
    third: false,
    fourth: false,
    fifth: false,
    sixth: false,
    seventh: false,
  });

  const handleMouseOver = (e, name) => {
    setHoverStates((prev) => ({ ...prev, [name]: true }));
  };
  const handleMouseOut = (e, name) => {
    setHoverStates((prev) => ({ ...prev, [name]: false }));
  };

  useEffect(() => {
    const token = cookies.get("token");
    // if (!token) {
    //   navigate("/");
    // }
  }, []);

  return (
    <div className="w-full h-[calc(100vh+300px)]  flex items-center justify-center ">
      <div className="relative  rounded-full">
        {/* first */}
        <div
          className={`relative flex items-center justify-center rounded-full border-2 border-dashed border-[#D9D9D9] w-[336px] h-[336px] bg-white  z-[100] `}
        >
          <div
            onClick={() => {
              window.location.href =
                "https://vici-lp1.itsbuzzmarketing.com/vicidial/admin_listloader_fourth_gen.php";
            }}
            onMouseOver={(e) => handleMouseOver(e, "first")}
            onMouseLeave={(e) => handleMouseOut(e, "first")}
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-10px)] h-[calc(100%-10px)]  ${
              hoverStates.first ? "bg-[#333] " : "bg-[#D9D9D9] "
            }`}
          >
            {hoverStates.first ? (
              <></>
            ) : (
              //   <p className="uppercase font-bold text-3xl">Data</p>
              <p className="uppercase font-bold text-3xl">Data</p>
              //   <AgentGuiSvg />
            )}
          </div>
        </div>

        {/* second*/}
        <div
          onMouseOver={(e) => handleMouseOver(e, "second")}
          onMouseLeave={(e) => handleMouseOut(e, "second")}
          onClick={() => {
            window.location.href =
              "https://vici-lp1.itsbuzzmarketing.com/vicidial/realtime_report.php?RR=4&DB=0&group=Press1";
          }}
          className={`flex items-center justify-center rounded-full border-2  border-[#D9D9D930] w-[318px] h-[318px] absolute left-2 -top-64 ${
            hoverStates.second ? "z-[6]" : "z-[3]"
          }`}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-39px)] h-[calc(100%-39px)] ] ${
              hoverStates.second ? " bg-[#F5874B] z-[6]" : "z-[3]  bg-[#fbc89f]"
            } `}
          >
            {hoverStates.second ? (
              <p className="w-[9rem] text-center uppercase font-bold text-[28px]">
                {/* Real Time Report */}
              </p>
            ) : (
              // <img src="../../assets/react.svg" />
              //   <AgentLearningSvg />
              <p className="w-[9rem] text-center uppercase font-bold text-[28px]">
                Real Time Report
              </p>
            )}
          </div>
        </div>
        {/* third */}
        <div
          onMouseOver={(e) => handleMouseOver(e, "third")}
          onMouseLeave={(e) => handleMouseOut(e, "third")}
          onClick={() => {
            window.location.href = window.location.href =
              "https://vici-lp1.itsbuzzmarketing.com/vicidial/welcome.php";
          }}
          className="flex items-center justify-center rounded-full border-2 border-dashed border-[#D9D9D9] w-44 h-44 absolute -right-[185px] -top-10 "
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-12px)] h-[calc(100%-12px)] ${
              hoverStates.third
                ? " bg-[#228512] z-[6]"
                : "z-[3]  bg-[#22851266]"
            }`}
          >
            {/* Placeholder for the icon; you might want to replace this with an SVG or FontAwesome icon */}
            <div className="relative text-white">
              {hoverStates.third ? (
                <p className="uppercase font-bold text-xl text-center">
                  {/* Admin Agent Selection */}
                </p>
              ) : (
                <p className="uppercase font-bold text-xl text-center">
                  Admin Agent Selection
                </p>
              )}
            </div>

            {/* Dashed lines extending outward */}
            <div className="absolute w-[1px] h-14 transform rotate-[125deg] -top-10 left-0 border-[1px] border-dashed border-[#D9D9D9]" />
            <div className="absolute w-[1px] h-14 transform  rotate-[0deg] -bottom-14 right-8 border-[1px] border-dashed border-[#D9D9D9]" />
            <div className="absolute w-[1px] h-4 transform  rotate-[60deg] bottom-10 -left-4 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
        {/* fourth*/}
        <div
          onMouseOver={(e) => handleMouseOver(e, "fourth")}
          onMouseLeave={(e) => handleMouseOut(e, "fourth")}
          onClick={() => {
            window.location.href =
              "https://vici-lp1.itsbuzzmarketing.com/vicidial/admin.php";
          }}
          className={`flex items-center justify-center rounded-full border-2  border-[#D9D9D930] w-[318px] h-[318px] absolute -right-56 -bottom-40  ${
            hoverStates.fourth ? "z-[6]" : "z-[3]"
          }`}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-39px)] h-[calc(100%-39px)] z-3 hover:z-5 ${
              hoverStates.fourth ? "bg-[#1E40AF] z-[6]" : "z-[3] bg-[#D5DEFA]"
            }`}
          >
            {hoverStates.fourth ? (
              <p className="w-[9rem] text-center uppercase font-bold text-[28px]">
                Work
              </p>
            ) : (
              <AgentGuiSvg />
            )}
          </div>
        </div>
        {/* fifth */}
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

        {/* sixth*/}
        <div
          onMouseOver={(e) => handleMouseOver(e, "sixth")}
          onMouseLeave={(e) => handleMouseOut(e, "sixth")}
          onClick={() => {
            window.location.href =
              "https://vici-lp1.itsbuzzmarketing.com/agc/vicidial.php";
          }}
          className={`flex items-center justify-center rounded-full border-2  border-[#D9D9D930] w-[318px] h-[318px] absolute -left-56 -bottom-40 ${
            hoverStates.sixth ? "z-[6]" : "z-[3]"
          }`}
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-39px)] h-[calc(100%-39px)] ] ${
              hoverStates.sixth
                ? " bg-[#228512] z-[6]"
                : "z-[3]  bg-[#22851266]"
            } `}
          >
            {" "}
            <div className="relative text-white">
              {hoverStates.sixth ? (
                <p className="uppercase font-bold text-xl text-center">
                  {/* Agent Link */}
                </p>
              ) : (
                <p className="uppercase font-bold text-xl text-center">
                  Agent Link
                </p>
              )}
            </div>
          </div>
        </div>
        {/* seventh */}
        <div
          //   onMouseOver={(e) => handleMouseOver(e, "seventh")}
          //   onMouseLeave={(e) => handleMouseOut(e, "seventh")}
          //   onClick={() => {
          //     navigate(
          //       "/agent-trainee-navigation/trainee-interaction-guide-fasttrack"
          //     );
          //   }}
          className=" flex items-center justify-center rounded-full border-2 border-dashed border-[#D9D9D9] w-44 h-44 absolute -left-[185px] -top-10  "
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[calc(100%-12px)] h-[calc(100%-12px)] ${
              hoverStates.seventh ? "bg-[#1E40AF] z-[6]" : "z-[3] bg-[#D5DEFA]"
            }`}
          >
            <div className="relative text-white">
              {hoverStates.seventh ? (
                <p className="uppercase font-bold text-xl text-center">
                  interaction guide
                </p>
              ) : (
                <div className="transform scale-150">
                  <TraineeSVG />
                </div>
                // <OmnichannelCommunicationSvg />
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

export default DataNavigation;
