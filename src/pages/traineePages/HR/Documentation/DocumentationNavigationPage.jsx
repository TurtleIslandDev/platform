import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportSvg from "@assets/SVGs/salesManagerScreen/ReportSvg";
import ResultsSvg from "../../../../assets/SVGs/globalSvgs/ResultsSvg";
import DocumentSvg from "../../../../assets/SVGs/globalSvgs/DocumentSvg";

const DocumentationNavigationPage = () => {
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
          onClick={() => {
            navigate("/agent-trainee-navigation/hr/documentation/form-w9");
          }}
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
                Form-w9
              </p>
            ) : (
              <ReportSvg />
              //   <p>per</p>
            )}
            <div className="absolute w-[1px] h-[230px] transform rotate-[-45deg] -bottom-44 -right-14 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
        {/*2 */}
        <div
          onMouseOver={(e) => handleMouseOver(e, "second")}
          onMouseLeave={(e) => handleMouseOut(e, "second")}
          onClick={() => {
            navigate("/agent-trainee-navigation/hr/documentation/form-1099");
          }}
          className="flex items-center justify-center rounded-full border border-1 border-[#D9D9D930] w-[312px] h-[312px] absolute -right-80 -bottom-28 "
        >
          <div
            className={`relative flex items-center justify-center text-2xl font-semibold text-white rounded-full cursor-pointer w-[267px] h-[267px]    z-3 hover:z-5 ${
              hoverStates.second ? "bg-[#1E40AF] " : "bg-[#1E40AF30]"
            }`}
          >
            {hoverStates.second ? (
              <p className="uppercase font-bold text-3xl">Form 1099</p>
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
            navigate(
              "/agent-trainee-navigation/hr/documentation/upload-identification"
            );
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
                Upload Identification
              </p>
            ) : (
              <div className="transform" style={{ scale: "2" }}>
                <DocumentSvg />
              </div>
            )}
            <div className="absolute w-[1px] h-[230px] transform rotate-[45deg]  -top-52 right-0 border-[1px] border-dashed border-[#D9D9D9]" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DocumentationNavigationPage;
