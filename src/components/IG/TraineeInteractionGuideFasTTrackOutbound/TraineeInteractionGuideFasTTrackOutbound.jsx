import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GreetingFirst from "./_components/GreetingFirst";
import IntroductionSecond from "./_components/IntroductionSecond";
import useInteractionGuide from "../../../features/hooks/InteractionGuideHooks";
import Third from "./_components/Third";
import { setStep } from "../../../features/slice/igSlice";
import { useLocation } from "react-router-dom";

const TraineeInteractionGuideFasTTrackOutbound = () => {
  const dispatch = useDispatch(); // Initialize dispatch
  const { step } = useSelector((state) => state.ig);
  const location = useLocation();
  const { extractLeadInfo } = useInteractionGuide();
  extractLeadInfo(3); //send Total steps
  useEffect(() => {
    dispatch(setStep({ step: 1 }));
  }, [location.pathname]);
  return (
    <>
      {step === 1 ? (
        <GreetingFirst />
      ) : step === 2 ? (
        <IntroductionSecond />
      ) : step === 3 ? (
        <Third />
      ) : null}
    </>
  );
};

export default TraineeInteractionGuideFasTTrackOutbound;
