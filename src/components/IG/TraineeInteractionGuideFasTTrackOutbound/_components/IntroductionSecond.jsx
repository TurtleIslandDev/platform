import React, { useEffect } from "react";

import fasTTrackLogo from "../../../../assets/images/FasTrack_logo.png";
import bg from "../../../../assets/bgImages/bgInteractionGuide.png";
import { useForm } from "react-hook-form";
import TraineeSVG from "../../../../assets/SVGs/TraineeSVG";
import Button from "../../../Buttons/Button";
import BackSvg from "../../../../assets/SVGs/globalSvgs/BackSvg";
import ObjectionsDropdown from "../../../dropdowns/ObjectionsDropdown";
import QuestionsDropdown from "../../../dropdowns/QuestionsDropdown";
import NextSvg from "../../../../assets/SVGs/globalSvgs/NextSvg";
import { ProgressIG } from "../../../Stepper/ProgressIG";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "../../../../features/slice/igSlice";
import OutBoundCall from "../../../../assets/SVGs/OutBoundCall";
import useInteractionGuide from "@features/hooks/InteractionGuideHooks";
const IntroductionSecond = () => {
  const dispatch = useDispatch();
  const { handleButtonBack, handleButtonNext } = useInteractionGuide();
  const { leadInfo } = useSelector((state) => state.ig);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      radio: "yes", // Set 'option1' as the default selected value
    },
  });
  const radio = watch("radio");
  const ObjectionData = [
    {
      objection: `${leadInfo?.first_name} is not available, can I take a message for you?`,
      answer:
        " Is it possible to rather put through to their voicemail? If not, I will send through an email a bit later today. Thanks so very much for your help, you have been amazing",
    },
  ];
  const questionsData = [
    {
      question: "IS THIS DEBT SETTLEMENT",
      answer:
        "No, debt invalidation is a service provided by licensed attorneys working on your behalf to have your debts invalidated so they can stop negatively impacting your credit report without you being required to pay the debt.",
    },
    {
      question: "What is this about",
      answer:
        "Im calling regarding the debt invalidation program that is currently available in your state",
    },
  ];

  const onSubmit = (data) => {
    console.log(data); // You can send the form data to an API or use it elsewhere
  };
  useEffect(() => {
    console.log(radio, "radio");
  }, [radio]);
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
          <img src={fasTTrackLogo} className="w-40" />
          <p className="font-bold text-2xl text-[#1414C9] bg-[#EAEAEA] rounded-md px-2.5 py-1.5">
            Introduction
          </p>
          <div className="transform scale-75">
            <OutBoundCall color={"#228512"} />
          </div>
        </div>
        <div className="bg-white w-full flex justify-between flex-col px-10 py-4 flex-1  mt-3">
          <p className="font-nunitoSans text-[#3F3F3F] text-[18px] leading-7">
            This is ( Mr/Mrs) {leadInfo?.last_name} right?
          </p>
          <div>
            <div>
              <p className="font-nunitoSans text-xl text-[#ff0000]">PAUSE</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="yes"
                      defaultChecked
                      {...register("radio", {
                        required: "Please select an option",
                      })}
                    />
                    Yes
                  </label>
                </div>

                <div>
                  <label>
                    <input
                      type="radio"
                      value="No"
                      {...register("radio", {
                        required: "Please select an option",
                      })}
                    />
                    No
                  </label>
                </div>
              </form>
            </div>
            <div>
              <p className="font-nunitoSans text-xl text-[#24A652]">
                COACHING NOTES
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white w-full px-10 flex-col gap-4 justify-center items-center py-3">
          <div className="bg-transparent w-full flex justify-between items-center mb-3">
            <Button bgColor={"#1414C9"} onClick={handleButtonBack()}>
              <BackSvg />
              Back
            </Button>
            {/* #228512 */}
            <ObjectionsDropdown ObjectionsData={ObjectionData} />
            <QuestionsDropdown questionsData={questionsData} />
            <Button bgColor={"#228512"} onClick={handleButtonNext()}>
              Next <NextSvg />
            </Button>
          </div>
          <ProgressIG />
        </div>
      </div>
    </div>
  );
};

export default IntroductionSecond;
