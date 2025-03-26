import { useEffect } from "react";
import { setLeadInfo, setStep, setTotalSteps } from "../slice/igSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { dummyLead } from "@data/dummyData";

const useInteractionGuide = () => {
  // Custom hook to extract query params
  const dispatch = useDispatch();
  const { step, totalSteps } = useSelector((state) => state.ig);
  const getQueryParams = () => {
    const { search } = useLocation();
    return new URLSearchParams(search);
  };

  // Custom hook to extract and dispatch lead information
  const extractLeadInfo = (totalSteps) => {
    //total steps determine the total length of the interaction guide
    if (totalSteps > 0) {
      const queryParams = getQueryParams();

      useEffect(() => {
        console.log("queryParams", queryParams);
        // Convert all query parameters to an object
        let paramsObject = {};
        queryParams?.forEach((value, key) => {
          paramsObject[key] = value;
        });
        console.log(queryParams.size, "query params", paramsObject);
        dispatch(
          setLeadInfo({
            leadInfo: queryParams?.size > 0 ? paramsObject : dummyLead,
          })
        );
        dispatch(
          setTotalSteps({
            totalSteps: totalSteps,
          })
        );
        return () => {
          //onComponentUnmount update to step 1
          dispatch(setStep({ step: 1 }));
        };
      }, []); // Add dependencies to make sure useEffect runs when they change
    } else {
      alert(
        "In order to use extractLeadInfo hook you need to enter total steps of your Interaction Guide"
      );
    }
  };
  const handleButtonNext = () => {
    return () => {
      dispatch(setStep({ step: step === totalSteps ? totalSteps : step + 1 }));
      const currentDate = new Date();
      console.log("Next:", currentDate.toString());
    };
  };
  const handleButtonBack = () => {
    return () => {
      dispatch(setStep({ step: step > 1 ? step - 1 : 1 }));
      const currentDate = new Date();
      console.log("Back:", currentDate.toString());
    };
  };
  return {
    getQueryParams,
    extractLeadInfo,
    handleButtonBack,
    handleButtonNext,
  };
};

export default useInteractionGuide;
