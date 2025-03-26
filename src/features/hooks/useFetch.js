import { useState } from "react";
import { apiClient } from "../../config/https";
import { useSelector, useDispatch } from "react-redux";
import { getHeaders } from "../../helpers/config";
// import { toast } from "react-toastify";
// use axios to hit multiple endpoints
import axios from "axios";
import { logout } from "../slice/userSlice";

const useFetch = () => {
  const { token } = useSelector((state) => state.user);
  const [res, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  // const notify = (type, mesg) => {
  //   if (type === "success") {
  //     toast.success(mesg, {
  //       position: "top-right",
  //       className: "toastPosition",
  //     });
  //   }
  //   if (type === "error") {
  //     toast.error(mesg, {
  //       position: "top-right",
  //       className: "toastPosition",
  //     });
  //   }
  // };

  // Get
  const fetchData = async (url, cbFunction, setLocalState) => {
    setLoading(true);
    const headers = await getHeaders(token);
    try {
      let response = await apiClient.get(url, { headers });
      if (response?.data) {
        setResponse(response.data);

        setLoading(false);
        setError("");
        cbFunction && dispatch(cbFunction(response.data));
        setLocalState && setLocalState(response.data);
      }
    } catch (e) {
      setLoading(false);
      if (e.status === 401) {
        dispatch(logout());
      } else if (e.status !== 404) {
        setError(e.data?.message);
        //notify("error", e.data?.message);
      } else if (e.status !== 401) {
        setError(e.statusText);
        //notify("error", e.statusText);
      }
    }
  };

  // Get Data From Multiple endpoints
  //when hit this api function  it will call all the callback functions one by one and then return the data in
  // an array format and combine the results into one object
  //to hit use   fetchMultipleData(
  // ["first endpoint", "second endpoint"],
  // [cb to update store if needed , multiple cbs],
  // [{}, {}]
  const fetchMultipleData = async (url, cbFunction, payload) => {
    setLoading(true);
    const headers = await getHeaders(token);
    try {
      if (typeof url === "object" && url.length > 0) {
        const response = await axios.all(
          url.map((endpoint, ind) => {
            return apiClient
              .post(endpoint, payload[ind], { headers })
              .then((res) => res)
              .catch((e) => console.error(e));
          })
        );
        const isResponseValid = response.some((val) => val?.data && true);
        if (isResponseValid) {
          const responseData = [];
          response.forEach((res) =>
            res?.data ? responseData.push(res.data) : undefined
          );
          setResponse(responseData);
          setLoading(false);
          setError("");
          cbFunction &&
            cbFunction.forEach((cb, ind) => dispatch(cb(responseData[ind])));
          // setLocalState && setLocalState(response.data);
        }
      }
    } catch (e) {
      setLoading(false);
      if (e.status === 401) {
        dispatch(logout());
      }
      if (e.status !== 404) {
        setError(e.data?.message);
        //notify("error", e.data?.message);
      } else {
        setError(e.statusText);
        //notify("error", e.statusText);
      }
    }
  };

  // Post
  const postData = async (
    url,
    payload,
    cbFunction,
    resetToken,
    formData,
    setLocalState
  ) => {
    setLoading(true);
    const headers = resetToken
      ? await getHeaders(resetToken)
      : await getHeaders(token, formData);
    try {
      const response = await apiClient.post(url, payload, { headers });
      if (response?.data) {
        setResponse(response.data);
        setLoading(false);
        setSuccess(true);
        cbFunction && dispatch(cbFunction(response.data));
        setLocalState && setLocalState(response.data);
        // if (response?.data.message) {
        //   console.log(response);
        // notify("success", response.data?.message);
        // if (response.data?.message){
        //     notify("success", response.data?.message);
        //   } else {
        //       notify("error", response.data?.message);
        //     }
        //     }
      } else {
        throw new Error("error internet");
      }
    } catch (e) {
      setLoading(false);
      setSuccess(false);
      if (e.status === 401) {
        dispatch(logout());
      }
      if (e.status !== 404) {
        setError(e.data?.message);
        //notify("error", e.data?.message);
      } else {
        setError(e.statusText);
        //notify("error", e.statusText);
      }
    }
  };

  // Patch
  const patchData = async (url, payload, cbFunction, setValues, formData) => {
    setLoading(true);
    const headers = formData
      ? await getHeaders(token, formData)
      : await getHeaders(token);
    try {
      const response = await apiClient.patch(url, payload, { headers });
      if (response?.data) {
        setResponse(response.data);
        setLoading(false);
        setError("");
        setSuccess(true);
        //notify("success", response.data?.message);

        cbFunction && dispatch(cbFunction(response.data));
        setValues && setValues(response.data);
      }
    } catch (e) {
      setLoading(false);
      setSuccess(false);
      if (e?.data?.status === 401) {
        if (e.data?.message === "Invalid old password") {
          setError(e.data?.message);
        } else {
          dispatch(logout());
        }
      }
      if (e.status !== 404) {
        setError(e.data?.message);
        //notify("error", e.data?.message);
      } else {
        setError(e.statusText);
        //notify("error", e.statusText);
      }
    }
  };
  // forgotpass
  const patchPass = async (
    url,
    payload,
    cbFunction,
    setValues,
    formData,
    tokenParam
  ) => {
    setLoading(true);
    const headers = formData
      ? await getHeaders(tokenParam, formData)
      : await getHeaders(tokenParam);
    try {
      const response = await apiClient.patch(url, payload, { headers });

      if (response?.data) {
        setResponse(response.data);
        setLoading(false);
        setError("");
        setSuccess(true);
        //notify("success", response.data?.message);
        cbFunction && dispatch(cbFunction(response.data));
        setValues && setValues(response.data);
      }
    } catch (e) {
      setLoading(false);
      setSuccess(false);
      if (e.status === 401) {
        dispatch(logout());
      }
      if (e.status !== 404) {
        setError(e.data?.message);
        //notify("error", e.data?.message);
      } else {
        setError(e.statusText);
        //notify("error", e.statusText);
      }
    }
  };

  // Put
  const putData = async (url, payload, cbFunction, setValues, formData) => {
    setLoading(true);
    const headers = formData
      ? await getHeaders(token, formData)
      : await getHeaders(token);
    try {
      const response = await apiClient.put(url, payload, { headers });

      if (response?.data) {
        setResponse(response.data);
        setLoading(false);
        setError("");
        setSuccess(true);
        cbFunction && dispatch(cbFunction(response.data));
        setValues && setValues(response.data);
        if (response?.data.message) {
          console.log(response);
        } //notify("success", response.data?.message);
      }
    } catch (e) {
      setLoading(false);
      setSuccess(false);
      if (e.status === 401) {
        dispatch(logout());
      }
      setError(e.data?.message);
      if (e.status !== 404) {
        //notify("error", e.data?.message);
      } else {
        setError(e.statusText);
        //notify("error", e.statusText);
      }
    } finally {
      setLoading(false);
      setSuccess(false);
    }
  };

  // Post
  // setLocalStorage cb function to clear local data or perform  new functionality
  const deleteData = async (url, setLocalState) => {
    setLoading(true);
    const headers = await getHeaders(token);
    try {
      const response = await apiClient.delete(url, { headers });
      if (response?.data) {
        setResponse(response.data);
        setLoading(false);
        setError("");
        setLocalState && setLocalState(response.data);
        if (response?.data.message) {
          console.log(response);
        } //notify("success", response.data?.message);
      }
    } catch (e) {
      setLoading(false);
      if (e.status === 401) {
        dispatch(logout());
      }
      if (e.status !== 404) {
        setError(e.data?.message);
        //notify("error", e.data?.message);
      } else {
        setError(e.statusText);
        //notify("error", e.statusText);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    res,
    loading,
    error,
    success,
    fetchData,
    deleteData,
    fetchMultipleData,
    postData,
    patchData,
    patchPass,
    putData,
  };
};

export default useFetch;
