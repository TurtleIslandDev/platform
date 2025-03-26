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
import { useDispatch } from "react-redux";
import { setStep } from "../../../../features/slice/igSlice";
import CallSvg from "../../../../assets/SVGs/CallSvg";
import useInteractionGuide from "@features/hooks/InteractionGuideHooks";
const GreetingFirst = () => {
  const { handleButtonBack, handleButtonNext } = useInteractionGuide();
  const dispatch = useDispatch();
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
      objection: "X is not available, can I take a message for you?",
      answer:
        " Is it possible to rather put through to their voicemail? If not, I will send through an email a bit later today. Thanks so very much for your help, you have been amazing",
    },
  ];
  const questionsData = [
    {
      question: "What is this about?",
      answer: " Im calling regarding the debt invalidation program thats",
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
            Greeting
          </p>
          <div className="transform scale-75">
            {/* <OutBoundCall color={"#228512"} /> */}
            <CallSvg color={"#FF0000"} />
          </div>
        </div>
        <div className="bg-white w-full flex justify-between flex-col px-10 py-4 flex-1  mt-3">
          <p className="font-nunitoSans text-[#3F3F3F] text-[18px] leading-7">
            Hi thank you for calling the fasttrack relief relief department, how
            may I help you
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

export default GreetingFirst;
