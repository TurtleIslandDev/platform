import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import useFetch from "./../../features/hooks/useFetch";
import { useSelector } from "react-redux";
const UploadDataPage = () => {
  const { token } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");  
  const [dataTemplates, setDataTemplates] = useState({});
  const [currTemplates, setCurrTemplates] = useState([]);
  const [uploadData, setUploadData] = useState([]);
  const [wait, setWait] = useState(false);

  const UPLOAD_URL = "https://endpoint.itsbuzzmarketing.com";
  // const UPLOAD_URL = "http://127.0.0.1:3173";
  // const UPLOAD_URL = "https://combined-service.r9tsjnbaapfz8.us-east-1.cs.amazonlightsail.com/"

  const { postData } = useFetch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getDataTemplates = async () => {    
    try {       
      const url = `${UPLOAD_URL}/guides/get_templates`;


      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      setResponseMessage(data);

      if (data.status === "success") {
        const keys = Object.keys(data.data);        

        setDataTemplates(data.data);

        if (keys.length > 0){
          setCurrTemplates(data.data[keys[0]]);     
        }        
        
      }
    }
    catch (error) {}
  };

  const getUploadData = async () => {
    try {
      const url = `${UPLOAD_URL}/guides/get_upload_tasks`;


      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setResponseMessage(data);
      if (data.status === "success") {        
        setUploadData(data.data);
      }
    }

    catch (error) {}

  };


  useEffect(() => {    
    getDataTemplates();
    getUploadData();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (token?.length) {
        const fileInput = document.createElement('input');    
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.click();    
        fileInput.onchange = async (e) => {
          const file = e.target.files[0];
          const formData = new FormData();
          formData.append("file", file);
          formData.append("source", data.source);
          formData.append("template", data.template);
          try {

            // upload file
            const url = `${UPLOAD_URL}/guides/upload`;

            setWait(true);

            const response = await fetch(url, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });

            const data = await response.json();
                        
            // add task to upload data            
            if (data.status === "success") {
              setUploadData((prevData) => {
                const newData = [...prevData];
                newData.push(data.data);
                newData.slice().reverse();
                return newData;
              });
            }
            
            setResponseMessage(data.message);

            setWait(false);
          } catch (error) {
            // TODO: add error handling here
            // console.log(error);
          }
        };
      }
    } catch (error) {
      // TODO: add error handling here
      // console.log(error);
    }
  };
  // useEffect(() => {}, [responseMessage]);
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="rounded-[38px] bg-white w-[780px] py-14 px-16 flex flex-col items-center justify-center gap-14">
        <h1 className="text-4xl font-semibold">Data Upload</h1>
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
          
          <div className="w-full mb-4">
            <p className="text-2xl text-[#222] mb-2">Select Data Source</p>
            <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
              <select
                className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                placeholder="Select Data Template"
                {...register("source", { required: true })}
                onChange={(e) => {
                  setCurrTemplates(
                    dataTemplates[e.target.value]
                  );
                }}
              >
                {Object.keys(dataTemplates)?.map((template, index) => (
                  <option key={index} value={template}> {template} </option>
                ))}
              </select>
            </label>   

            <p className="text-2xl text-[#222] mb-2">Select Data Template</p>
            <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
              <select
                className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                placeholder="Select Data Template"
                {...register("template", { required: true })}
              >
                {currTemplates?.map((template, index) => (
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
            upload
          </button>          
        </form>

        <div className="w-full mt-8">
          <h2 className="text-2xl font-semibold mb-4">Recently Uploaded Tasks</h2>
          <ul className="pl-5"  style={{maxHeight: "200px", overflowY: "auto"}}>
            {uploadData.slice().reverse().map((data, index) => (
              <li key={index} className="mb-2">
                <span className="font-bold">{data.file_name}</span> - {data.timestamp} -{" "}
                {data.completed ? (
                  <span className="text-green-500"> Completed</span>
                  
                ) : (    
                  data.stopped ? (
                      <span className="text-blue-500">  Stopped </span>
                    ) : (
                      <span className="text-red-green"> Processing </span>
                    )

                  
                )}
                {data.uploaded >= 0 && (
                  <span className="text-blue-500"> - {data.upload_count} uploaded - {data.duplicates}  duplicates skipped </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};



export default UploadDataPage;