import React from "react";
import Button from "../../../Buttons/Button";
import ObjectionsDropdown from "../../../dropdowns/ObjectionsDropdown";
import ItsBuzzMarketingLogo from "../../../../assets/SVGs/logos/ItsBuzzMarketingLogo";
import QuestionsDropdown from "../../../dropdowns/QuestionsDropdown";
import { ProgressIG } from "../../../Stepper/ProgressIG";
import bg from "../../../../assets/bgImages/bgInteractionGuide.png";
import BackSvg from "../../../../assets/SVGs/globalSvgs/BackSvg";
import NextSvg from "../../../../assets/SVGs/globalSvgs/NextSvg";
import OutBoundCall from "../../../../assets/SVGs/OutBoundCall";
const Outbound = () => {
  const ObjectionData = [
    {
      objection: "Objection 1",
      answer:
        "1 he customer wants to review their current bill, including charges, due date, and payment options",
    },
    {
      objection: "Objection 2",
      answer:
        "2 he customer wants to review their current bill, including charges, due date, and payment options",
    },
    {
      objection: "Objection 3",
      answer:
        "3 he customer wants to review their current bill, including charges, due date, and payment options",
    },
    {
      objection: "Objection 4",
      answer:
        "4 he customer wants to review their current bill, including charges, due date, and payment options",
    },
    {
      objection: "Objection 5",
      answer:
        "5 he customer wants to review their current bill, including charges, due date, and payment options",
    },
  ];
  const questionsData = [
    {
      question: "Question 1",
      answer:
        "he customer wants to review their current bill, including charges, due date, and payment options",
    },
    {
      question: "Question 2",
      answer:
        "he customer wants to review their current bill, including charges, due date, and payment options",
    },
    {
      question: "Question 3",
      answer:
        "he customer wants to review their current bill, including charges, due date, and payment options",
    },
    {
      question: "Question 4",
      answer:
        "he customer wants to review their current bill, including charges, due date, and payment options",
    },
    {
      question: "Question 5",
      answer:
        "he customer wants to review their current bill, including charges, due date, and payment options",
    },
  ];
  const handleButtonNext = () => {
    const currentDate = new Date();
    console.log("Next:", currentDate.toString());
  };
  const handleButtonBack = () => {
    const currentDate = new Date();
    console.log("Back:", currentDate.toString());
  };
  return (
    <div className=" flex w-full justify-center h-full">
      <div
        className=" w-full h-full flex flex-col flex-1"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white w-full flex justify-between items-center px-10 py-4 rounded-b-md">
          <ItsBuzzMarketingLogo size={"small"} />
          <p className="font-bold text-2xl text-[#1414C9] bg-[#EAEAEA] rounded-md px-2.5 py-1.5">
            Introduction
          </p>
          <div className="transform scale-75">
            <OutBoundCall color={"#228512"} />
          </div>
        </div>
        <div className="bg-white w-full flex justify-between flex-col px-10 py-4 flex-1  mt-3">
          <p className="font-nunitoSans text-[#3F3F3F] text-[18px] leading-7">
            Hi is (Mr/Mrs) [Prospect Last] my name is [agents name], This is not
            a Sales Call but I want to let you know Our team at Ti Solutions
            helps businesses like yours identify cost-saving and profit
            opportunities by designing, developing, implementing, and managing
            efficient software and business systems that can simplify customer
            interaction management operations and create a stable foundation for
            growth at an increased profit margin. Does that sound like something
            that could be of interest to you?
          </p>
          <div>
            <p className="font-nunitoSans text-xl text-[#ff0000]">WARNING</p>
            <p className="font-nunitoSans text-xl text-[#24A652]">
              COACHING NOTES
            </p>
          </div>
        </div>
        <div className="bg-white w-full px-10 flex-col gap-4 justify-center items-center py-3">
          <div className="bg-transparent w-full flex justify-between items-center mb-3">
            <Button bgColor={"#1414C9"} onClick={handleButtonBack}>
              <BackSvg />
              Back
            </Button>
            {/* #228512 */}
            <ObjectionsDropdown ObjectionsData={ObjectionData} />
            <QuestionsDropdown questionsData={questionsData} />
            <Button bgColor={"#228512"} onClick={handleButtonNext}>
              Next <NextSvg />
            </Button>
          </div>
          <ProgressIG />
        </div>
      </div>
    </div>
  );
};

export default Outbound;
