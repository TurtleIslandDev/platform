import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import useFetch from "../../features/hooks/useFetch";

export function ResetPassword({ open, setOpen }) {
  const { toBeEdited } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const { postData, loading } = useFetch();
  const handleBack = () => {
    setOpen(!open);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm({
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      let payload = {
        username: toBeEdited?.username,
        password: data?.password,
      };
      if (token?.length) {
        postData(
          "/guide_auth/changePassword",
          payload,
          undefined,
          undefined,
          undefined,
          (res) => {
            setResponseMessage(res);
          }
        );
      }
    } catch (error) {
      // add error handling here
      console.log(error);
    }
  };

  useEffect(() => {
    // Only run this effect if responseMessage is set
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage(""); // Reset the responseMessage after 5 seconds
        resetField("password");
        handleBack();
      }, 3000);

      // Cleanup the timeout if component unmounts or responseMessage changes
      return () => clearTimeout(timer);
    }
  }, [responseMessage]);
  return (
    <>
      <Dialog open={open} dismiss={{ outsidePress: true }}>
        <DialogHeader>Edit User</DialogHeader>
        <DialogBody
          className=""
          style={{ height: "100%", maxHeight: "600px", overflowY: "scroll" }}
        >
          <p>
            <span>Selected User: </span>
            {toBeEdited?.username}
          </p>
          {responseMessage?.message &&
            (responseMessage?.status === "success" ? (
              <p className="text-green-400">{responseMessage?.message}</p>
            ) : responseMessage?.status === "error" ? (
              <p className="text-red-400">{responseMessage?.message}</p>
            ) : null)}
          <form
            className="w-full flex flex-col items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full mb-8">
              <p className="text-2xl text-[#222] mb-2">New Password</p>
              <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                  placeholder="Password"
                  {...register("password", { required: true })}
                />
                <svg
                  className="absolute right-5 cursor-pointer"
                  width={29}
                  height={18}
                  viewBox="0 0 29 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  <path
                    d="M18.6332 9.10754C18.6332 11.38 16.7103 13.2222 14.3383 13.2222C11.9664 13.2222 10.0435 11.38 10.0435 9.10754C10.0435 6.83504 11.9664 4.99286 14.3383 4.99286C16.7103 4.99284 18.6332 6.83507 18.6332 9.10754ZM14.3461 0.540161C11.8902 0.551055 9.34461 1.14893 6.93486 2.29359C5.14564 3.1785 3.40196 4.42698 1.88836 5.96797C1.14495 6.75459 0.196758 7.89361 0.043457 9.10888C0.0615737 10.1616 1.19077 11.4609 1.88836 12.2498C3.30773 13.7303 5.006 14.9439 6.93486 15.9251C9.18207 17.0157 11.6694 17.6436 14.3461 17.6785C16.8043 17.6675 19.3494 17.0627 21.7565 15.9251C23.5457 15.0402 25.2902 13.7908 26.8039 12.2498C27.5472 11.4632 28.4954 10.3242 28.6488 9.10888C28.6306 8.05618 27.5014 6.75678 26.8039 5.96792C25.3845 4.48745 23.6853 3.27476 21.7565 2.29355C19.5104 1.20378 17.0169 0.580185 14.3461 0.540161ZM14.3443 2.66763C18.0658 2.66763 21.0826 5.55186 21.0826 9.10981C21.0826 12.6677 18.0658 15.552 14.3443 15.552C10.6228 15.552 7.60596 12.6677 7.60596 9.10981C7.60596 5.55186 10.6228 2.66763 14.3443 2.66763Z"
                    fill="#999999"
                  />
                </svg>
              </label>
              {errors.password && (
                <span className="text-right text-red-500 text-xs">
                  *This field is required
                </span>
              )}
            </div>

            <div>
              <Button
                variant="text"
                color="red"
                onClick={handleBack}
                className="mr-1"
              >
                <span>Back</span>
              </Button>
              <button
                type="submit"
                className="bg-[#1E40AF] rounded-[60px] py-2 px-6 text-white "
              >
                Reset Password
              </button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
}
