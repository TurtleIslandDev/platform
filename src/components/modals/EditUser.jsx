import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import useFetch from "../../features/hooks/useFetch";
import { userPermissions } from "../../data/constants";
import { setTobeEdited } from "../../features/slice/userSlice";
export function EditUser({ open, setOpen }) {
  const dispatch = useDispatch();
  const { toBeEdited } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [permissions, setPermissions] = useState([]);
  const { postData, loading } = useFetch();
  const handleBack = () => {
    setOpen(!open);
  };
  const {
    register,
    handleSubmit,
    resetField,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      role: toBeEdited.role,
      company: toBeEdited?.newFields?.company,
      address: toBeEdited?.newFields?.address,
      phone: toBeEdited?.newFields?.phone,
      contact: toBeEdited?.newFields?.contact,
      firstName: toBeEdited?.newFields?.firstName,
      lastName: toBeEdited?.newFields?.lastName,
      email: toBeEdited?.newFields?.email,
      revenueShareSplit: toBeEdited?.newFields?.revenueShareSplit,
      perRecordCost: toBeEdited?.newFields?.perRecordCost,
      payoutSchedule: toBeEdited?.newFields?.payoutSchedule,
      dataTypesAvailable: toBeEdited?.newFields?.dataTypesAvailable,
      dataOwnershipDuration: toBeEdited?.newFields?.dataOwnershipDuration,
      authorizedPrograms: [],
      authorizations: toBeEdited?.newFields?.authorizations,
      userPermissions: toBeEdited?.newFields?.userPermissions,
    },
  });
  var role = watch("role");

  useEffect(() => {
    if (role) {
      const newPermissions = userPermissions[role] || [];
      setPermissions(newPermissions);
      setValue("userPermissions", newPermissions || []);
    }
  }, [role]);

  const checkRole = watch("subRole");
  const onSubmit = async (data) => {
    const excludedKeys = ["role"];
    let newFields = {};
    // Extract all keys except the excluded ones
    for (let key in data) {
      if (!excludedKeys.includes(key)) {
        newFields[key] = data[key];
        delete data[key]; // Remove from the original object
      }
    }
    // Add newFields to the original object
    data.newFields = newFields;
    console.log(data);
    data.username = toBeEdited?.username;
    try {
      if (token?.length) {
        postData(
          "/guide_auth/changeRole",
          data,
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
    let fieldsToReset = [
      "company",
      "address",
      "phone",
      "contact",
      "firstName",
      "lastName",
      "email",
      "revenueShareSplit",
      "payoutSchedule",
      "dataTypesAvailable",
      "dataOwnershipDuration",
      "authorizedPrograms",
      "perRecordCost",
      "authorizations",
      "phonePassword",
    ];
    for (let i = 0; i < fieldsToReset.length; i++) {
      resetField(fieldsToReset[i]);
    }
  }, [checkRole]);
  useEffect(() => {
    let fieldsToReset = ["role", "password"];
    for (let i = 0; i < fieldsToReset.length; i++) {
      resetField(fieldsToReset[i]);
    }
  }, [open]);
  useEffect(() => {
    // Only run this effect if responseMessage is set
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage(""); // Reset the responseMessage after 5 seconds
        handleBack();
      }, 5000);

      // Cleanup the timeout if component unmounts or responseMessage changes
      return () => clearTimeout(timer);
    }
  }, [responseMessage]);
  // useEffect(() => {
  //   return () => {
  //     dispatch(setTobeEdited({ data: {} }));
  //   };
  // }, []);
  return (
    <>
      <Dialog open={open} handler={setOpen} dismiss={{ outside: true }}>
        <DialogHeader>Edit User</DialogHeader>
        <DialogBody
          className=""
          style={{ height: "100%", maxHeight: "600px", overflowY: "scroll" }}
        >
          <p>
            <span>Selected User: </span>
            {toBeEdited?.username}
          </p>
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
              <p className="text-2xl text-[#222] mb-2">Select User Role</p>
              <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
                <select
                  className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                  placeholder="Password"
                  {...register("role", { required: true })}
                >
                  <option value="" disabled selected>
                    Select User Role
                  </option>
                  <option value="agent">Agent</option>
                  <option value="channelManager">Channel Manager</option>
                  <option value="dataManager">Data Manager</option>
                  <option value="salesManager">Sales Manager</option>
                  <option value="programManager">Program Manager</option>
                  <option value="teamLead">Team Lead</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="performanceManager">
                    Performance Manager
                  </option>
                  <option value="admin">Admin</option>
                  <option value="programOwner">Program Owner</option>
                  <option value="bpo">BPO</option>
                  <option value="dataVendor">Data Vendor</option>
                  <option value="broadcastCustomer">Broadcast Customer</option>
                  <option value="trainee">Trainee</option>
                  <option value="applicant">Applicant</option>
                  <option value="internal">Internal</option>
                  <option value="client">Client</option>
                </select>
              </label>
              {errors.role && (
                <span className="text-right text-red-500 text-xs">
                  *This field is required
                </span>
              )}
            </div>
            {role === "dataVendor" &&
              (checkRole === "partner" || "supplier") && (
                <div className="w-full mb-8">
                  <p className="text-2xl text-[#222] mb-2">Select Sub Role</p>
                  <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
                    <select
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="Select User Role"
                      {...register("subRole", { required: true })}
                    >
                      <option value="" disabled selected>
                        Select Sub User Role
                      </option>
                      <option value="partner">Partner</option>
                      <option value="supplier">Supplier</option>
                    </select>
                  </label>
                  {errors.subRole && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
              )}
            <div className="w-full mb-5">
              <p className="text-2xl text-[#222] mb-2">First Name</p>
              <label className="input input-bordered flex items-center gap-2 ">
                <input
                  {...register("firstName", { required: true })}
                  type="text"
                  className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                  placeholder="First Name"
                />
              </label>
              {errors.firstName && (
                <span className="text-right text-red-500 text-xs">
                  *This field is required
                </span>
              )}
            </div>

            <div className="w-full mb-5">
              <p className="text-2xl text-[#222] mb-2">Last Name</p>
              <label className="input input-bordered flex items-center gap-2 ">
                <input
                  {...register("lastName", { required: true })}
                  type="text"
                  className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                  placeholder="Last Name"
                />
              </label>
              {errors.lastName && (
                <span className="text-right text-red-500 text-xs">
                  *This field is required
                </span>
              )}
            </div>
            <div className="w-full mb-5">
              <p className="text-2xl text-[#222] mb-2">Email</p>
              <label className="input input-bordered flex items-center gap-2 ">
                <input
                  {...register("email", { required: true })}
                  type="text"
                  className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                  placeholder="email"
                />
              </label>
              {errors.email && (
                <span className="text-right text-red-500 text-xs">
                  *This field is required
                </span>
              )}
            </div>
            {role === "agent" && (
              <>
                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">Phone</p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("phone", { required: true })}
                      type="number"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="phone"
                    />
                  </label>
                  {errors.phone && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-8">
                  <p className="text-2xl text-[#222] mb-2">Phone Password</p>
                  <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="Phone Password"
                      {...register("phonePassword", { required: true })}
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
                  {errors.phonePassword && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-8">
                  <p className="text-2xl text-[#222] mb-2">
                    Select Pay Structure
                  </p>
                  <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
                    <select
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="Password"
                      {...register("payStructure", { required: true })}
                    >
                      <option value="" disabled selected>
                        Select Pay Structure
                      </option>
                      <option value="commission">Commission</option>
                      <option value="hourly">Hourly</option>
                    </select>
                  </label>
                  {errors.payStructure && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
              </>
            )}
            {checkRole === "partner" && role === "dataVendor" && (
              <div className="w-full">
                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">Company</p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("company", { required: true })}
                      type="text"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="company"
                    />
                  </label>
                  {errors.company && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">Address</p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("address", { required: true })}
                      type="text"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="address"
                    />
                  </label>
                  {errors.address && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">Phone</p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("phone", { required: true })}
                      type="text"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="phone"
                    />
                  </label>
                  {errors.phone && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">Contact</p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("contact", { required: true })}
                      type="text"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="contact"
                    />
                  </label>
                  {errors.contact && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>

                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">Authorizations</p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("authorizations", { required: true })}
                      type="text"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="Authorizations"
                    />
                  </label>
                  {errors.authorizations && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                {/* Revenue Share split % */}
                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">
                    Revenue share split (%)
                  </p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("revenueShareSplit", { required: true })}
                      type="number"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="Revenue share split %"
                    />
                  </label>
                  {errors.revenueShareSplit && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-8">
                  <p className="text-2xl text-[#222] mb-2">Payout Schedule</p>
                  <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
                    <select
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="Password"
                      {...register("payoutSchedule", { required: true })}
                    >
                      {" "}
                      <option value="" disabled selected>
                        Select Payout Schedule
                      </option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bimonthly">Bimonthly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </label>
                  {errors.payoutSchedule && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-8">
                  <p className="text-2xl text-[#222] mb-2">
                    Data Types Available
                  </p>
                  <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
                    <select
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="Password"
                      {...register("dataTypesAvailable", { required: true })}
                    >
                      <option value="" disabled selected>
                        Select Available Data Types
                      </option>
                      <option value="Web Form">Web Form</option>
                      <option value="API">API</option>
                      <option value="List">List</option>
                    </select>
                  </label>
                  {errors.dataTypesAvailable && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-8">
                  <p className="text-2xl text-[#222] mb-2">
                    Data ownership duration
                  </p>
                  <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
                    <select
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="Password"
                      {...register("dataOwnershipDuration", { required: true })}
                    >
                      <option value="" disabled selected>
                        Select Data ownership duration
                      </option>
                      <option value="30 days">30 days</option>
                      <option value="90 days">90 days</option>
                      <option value="1 year">1 year</option>
                      <option value="Indefinite">Indefinite</option>
                    </select>
                  </label>
                  {errors.dataOwnershipDuration && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-8">
                  <p className="text-2xl text-[#222] mb-2">
                    Authorized Programs
                  </p>
                  <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
                    <div>
                      <label>
                        <input
                          {...register("authorizedPrograms", {
                            required: true,
                          })}
                          type="checkbox"
                          value="Debt"
                        />
                        Debt
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          {...register("authorizedPrograms", {
                            required: true,
                          })}
                          type="checkbox"
                          value="Personal Loans"
                        />
                        Personal Loans
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          {...register("authorizedPrograms", {
                            required: true,
                          })}
                          type="checkbox"
                          value="Mortgages"
                        />
                        Mortgages
                      </label>
                    </div>
                  </label>
                  {errors.authorizedPrograms && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
              </div>
            )}
            {checkRole === "supplier" && role === "dataVendor" && (
              <div className="w-full">
                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">Company</p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("company", { required: true })}
                      type="text"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="company"
                    />
                  </label>
                  {errors.company && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">Address</p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("address", { required: true })}
                      type="text"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="address"
                    />
                  </label>
                  {errors.address && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">Phone</p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("phone", { required: true })}
                      type="text"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="phone"
                    />
                  </label>
                  {errors.phone && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">Contact</p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("contact", { required: true })}
                      type="text"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="contact"
                    />
                  </label>
                  {errors.contact && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">First Name</p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("firstName", { required: true })}
                      type="text"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="First Name"
                    />
                  </label>
                  {errors.firstName && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>

                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">Last Name</p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("lastName", { required: true })}
                      type="text"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="Last Name"
                    />
                  </label>
                  {errors.lastName && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">Email</p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("email", { required: true })}
                      type="text"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="email"
                    />
                  </label>
                  {errors.email && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">Authorizations</p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("authorizations", { required: true })}
                      type="text"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="Authorizations"
                    />
                  </label>
                  {errors.authorizations && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                {/* Per Record cost ($)*/}
                <div className="w-full mb-5">
                  <p className="text-2xl text-[#222] mb-2">
                    Per Record cost ($)
                  </p>
                  <label className="input input-bordered flex items-center gap-2 ">
                    <input
                      {...register("perRecordCost", { required: true })}
                      type="number"
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="Per Record cost ($)"
                    />
                  </label>
                  {errors.perRecordCost && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-8">
                  <p className="text-2xl text-[#222] mb-2">Payout Schedule</p>
                  <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
                    <select
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="Password"
                      {...register("payoutSchedule", { required: true })}
                    >
                      {" "}
                      <option value="" disabled selected>
                        Select Payout Schedule
                      </option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bimonthly">Bimonthly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </label>
                  {errors.payoutSchedule && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-8">
                  <p className="text-2xl text-[#222] mb-2">
                    Data Types Available
                  </p>
                  <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
                    <select
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="Password"
                      {...register("dataTypesAvailable", { required: true })}
                    >
                      <option value="" disabled selected>
                        Select Available Data Types
                      </option>
                      <option value="Web Form">Web Form</option>
                      <option value="API">API</option>
                      <option value="List">List</option>
                    </select>
                  </label>
                  {errors.dataTypesAvailable && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-8">
                  <p className="text-2xl text-[#222] mb-2">
                    Data ownership duration
                  </p>
                  <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
                    <select
                      className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
                      placeholder="Password"
                      {...register("dataOwnershipDuration", { required: true })}
                    >
                      <option value="" disabled selected>
                        Select Data ownership duration
                      </option>
                      <option value="30 days">30 days</option>
                      <option value="90 days">90 days</option>
                      <option value="1 year">1 year</option>
                      <option value="Indefinite">Indefinite</option>
                    </select>
                  </label>
                  {errors.dataOwnershipDuration && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
                <div className="w-full mb-8">
                  <p className="text-2xl text-[#222] mb-2">
                    Authorized Programs
                  </p>
                  <label className="input input-bordered flex bg-transparent items-center gap-2 relative">
                    <div>
                      <label>
                        <input
                          {...register("authorizedPrograms", {
                            required: true,
                          })}
                          type="checkbox"
                          value="Debt"
                        />
                        Debt
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          {...register("authorizedPrograms", {
                            required: true,
                          })}
                          type="checkbox"
                          value="Personal Loans"
                        />
                        Personal Loans
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          {...register("authorizedPrograms", {
                            required: true,
                          })}
                          type="checkbox"
                          value="Mortgages"
                        />
                        Mortgages
                      </label>
                    </div>
                  </label>
                  {errors.authorizedPrograms && (
                    <span className="text-right text-red-500 text-xs">
                      *This field is required
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="w-full mb-8">
              <p className="text-2xl text-[#222] mb-2">User Permissions</p>
              <div className="input input-bordered flex bg-transparent gap-2 relative flex-col items-start">
                {permissions?.map((permission, index) => {
                  return (
                    <label key={index}>
                      <input
                        {...register("userPermissions", {})}
                        type="checkbox"
                        value={permission}
                        className="mr-3"
                      />
                      {permission}
                    </label>
                  );
                })}
              </div>
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
                className="bg-[#1E40AF] rounded-[60px] py-4 px-10 text-white font-bold text-xl max-w-56"
              >
                Update User
              </button>
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
}
