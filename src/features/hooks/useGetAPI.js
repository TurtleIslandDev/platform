import { useState } from "react";
import { apiClient } from "../../config/https";
import { useSelector, useDispatch } from "react-redux";
import { getHeaders } from "../../helpers/config";
import { toast } from "react-toastify";
import { logout } from "../slice/userSlice";

const useGetAPI = () => {
  const { token } = useSelector((state) => state.user);
  const [getRes, setResponse] = useState(null);
  const [getLoading, setLoading] = useState(false);
  const [getError, setError] = useState("");
  const [getSuccess, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const notify = (type, mesg) => {
    if (type === "success") {
      toast.success(mesg, {
        position: "top-right",
        className: "toastPosition",
      });
    }
    if (type === "error") {
      toast.error(mesg, {
        position: "top-right",
        className: "toastPosition",
      });
    }
  };

  const getData = async (url, setLocalState) => {
    setLoading(true);
    const headers = await getHeaders(token);
    try {
      const response = await apiClient.get(url, { headers });
      if (response?.data) {
        setResponse(response.data);
        setLoading(false);
        setError("");
        setSuccess(true);
        await setLocalState && setLocalState(response.data);
        // console.log(response.data,"check api data"); 
        // if (response.data?.message)  notify("success", response.data.message)
       
        // if (cbFunction) await dispatch(cbFunction(response.data));
      }
    } catch (e) {
      setLoading(false);
      if (e.message=="Unauthorized") {
        dispatch(logout())
      }
      setError(e.message);
      //temporary commented error log
      // console.log(e.message,"checking  message------>");
      // notify("error", e.message);
    }
  };

  return {
    getRes,
    getLoading,
    getError,
    getSuccess,
    getData,
  };
};

export default useGetAPI;