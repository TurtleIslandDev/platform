import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useFetch from "./../../features/hooks/useFetch";
import { useSelector } from "react-redux";

import { saveAs } from "file-saver";


const UploadDataPage = () => {
  const { token } = useSelector((state) => state.user);
  const [responseMessage, setResponseMessage] = useState("");
  const [dataFields, setDataFields] = useState([]);
  const [uploadData, setUploadData] = useState([]);
  const [wait, setWait] = useState(false);

  const UPLOAD_URL = "http://127.0.0.1:3000";

  const { postData } = useFetch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getDataFields = async () => {    
    try {       
      const url = `${UPLOAD_URL}/guides/get_fields`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setResponseMessage(data);


      if (data.status === "success") {
        setDataFields(data.data);        
      }
    }
    catch (error) {}
  };


  useEffect(() => {    
    getDataFields();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (token?.length) {

        const data_fields = data.dataFields;   
        const body = { fields: data_fields };     

        try {
            const url = `${UPLOAD_URL}/guides/export`;
            setWait(true); 
            
            // get data from the server
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = response;
            setResponseMessage(data);
            
            
            if (!data.ok) {
                setWait(false);
                return;
            }

            const blob = await data.blob();
            saveAs(blob, "exported_data.csv");

            setWait(false);
        } catch (error) {
            // add error handling here
            console.log(error);
        }
        };
    } catch (error) {
      // add error handling here
      console.log(error);
    }
  };
  // useEffect(() => {}, [responseMessage]);
return (
    <div className="h-screen w-full flex items-center justify-center">
        <div className="rounded-[38px] bg-white w-[780px] py-14 px-16 flex flex-col items-center justify-center gap-14">
            <h1 className="text-4xl font-semibold">Data Export</h1>
            <form
                className="w-full flex flex-col items-center"
                onSubmit={handleSubmit(onSubmit)}
            >
                {responseMessage?.message &&
                    (responseMessage?.status === "success" ? (
                        <p className="text-green-400">{responseMessage?.message}</p>
                    ) : responseMessage?.status === "error" ? (
                        <p className="text-red-400">{responseMessage?.message}</p>
                    ) : null)}          
                
                <div className="w-full mb-8">
                    <p className="text-2xl text-[#222] mb-2">Select Fields</p>
                    <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
                        <select
                            className="grow h-24 border border-[#cccccc] rounded pl-5 focus:outline-none"
                            placeholder="Select Data Template"
                            {...register("dataFields", { required: true })}
                            multiple
                        >
                            {dataFields.map((template, index) => (
                                <option key={index} value={template}> {template} </option>
                            ))}
                        </select>            
                    </label>            
                </div>

                <button
                    type="submit"
                    className={`rounded-[60px] py-4 px-10 text-white font-bold text-xl max-w-48 ${
                        wait ? "bg-gray-400 cursor-not-allowed" : "bg-[#1E40AF]"
                    }`}
                    disabled={wait}
                >
                    Export
                </button>          
            </form>

        </div>
    </div>
);
};



export default UploadDataPage;