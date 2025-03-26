import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GreetingFirst from "./_components/GreetingFirst";
import { setStep } from "../../../features/slice/igSlice";
import Third from "./_components/Third.jsx";
import useInteractionGuide from "@features/hooks/InteractionGuideHooks";
import { useLocation } from "react-router-dom";
const TraineeInteractionGuideFasTTrackInbound = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { step } = useSelector((state) => state.ig);
  const { extractLeadInfo } = useInteractionGuide();
  extractLeadInfo(2); //send Total step
  useEffect(() => {
    //onComponentUnmount update to step 1
    dispatch(setStep({ step: 1 }));
  }, [location.pathname]);
  return <>{step === 1 ? <GreetingFirst /> : step === 2 ? <Third /> : null}</>;
};

export default TraineeInteractionGuideFasTTrackInbound;
