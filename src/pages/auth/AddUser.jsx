import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useFetch from "./../../features/hooks/useFetch";
import { useSelector } from "react-redux";
import { userPermissions } from "../../data/constants";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Eye, EyeOff, UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "../../components/navigationBar/navbar";

const AddUser = () => {
  const { token } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [showPhonePassword, setShowPhonePassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const { postData } = useFetch();
  const {
    register,
    handleSubmit,
    resetField,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      role: "",
      company: "",
      address: "",
      phone: "",
      contact: "",
      firstName: "",
      lastName: "",
      email: "",
      revenueShareSplit: "",
      perRecordCost: "",
      payoutSchedule: "",
      dataTypesAvailable: "",
      dataOwnershipDuration: "",
      authorizedPrograms: [],
      authorizations: "",
      userPermissions: "",
      userCompany: "",
    },
  });
  const checkRole = watch("subRole");
  const role = watch("role");
  useEffect(() => {
    if (role) {
      const newPermissions = userPermissions[role] || [];
      setValue("userPermissions", newPermissions || []);
    }
  }, [role]);
  const onSubmit = async (data) => {
    const excludedKeys = ["role", "username", "password"];
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

    try {
      if (token?.length) {
        postData(
          "/guide_auth/create/user/internal",
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
    // Only run this effect if responseMessage is set
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage(""); // Reset the responseMessage after 10 seconds
      }, 10000);

      // Cleanup the timeout if component unmounts or responseMessage changes
      return () => clearTimeout(timer);
    }
  }, [responseMessage]);

  return (
    <div className="max-w-[95%] mx-auto p-6 pt-16 space-y-6">
      <Navbar />
      
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Add User</h1>
      </div>

      {responseMessage?.message && (
        <Alert variant={responseMessage?.status === "success" ? "default" : "destructive"}>
          {responseMessage?.status === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{responseMessage?.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Set up the user's role, company, and credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="role" className="mb-2 block">
                Select User Role <span className="text-red-500">*</span>
              </Label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("role", { required: true })}
              >
                <option value="" disabled>
                  Select User Role
                </option>
                <option value="agent">Agent</option>
                <option value="channelManager">Channel Manager</option>
                <option value="dataManager">Data Manager</option>
                <option value="salesManager">Sales Manager</option>
                <option value="programManager">Program Manager</option>
                <option value="teamLead">Team Lead</option>
                <option value="supervisor">Supervisor</option>
                <option value="performanceManager">Performance Manager</option>
                <option value="admin">Admin</option>
                <option value="programOwner">Program Owner</option>
                <option value="bpo">BPO</option>
                <option value="dataVendor">Data Vendor</option>
                <option value="broadcastCustomer">Broadcast Customer</option>
                <option value="trainee">Trainee</option>
                <option value="applicant">Applicant</option>
                <option value="internal">Internal</option>
                <option value="client">Client</option>
                <option value="closer">Closer</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">*This field is required</p>
              )}
            </div>

            <div>
              <Label htmlFor="userCompany" className="mb-2 block">
                Select User Company <span className="text-red-500">*</span>
              </Label>
              <select
                id="userCompany"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("userCompany", { required: true })}
              >
                <option value="" disabled>
                  Select User Company
                </option>
                <option value="Buzz">Buzz</option>
                <option value="Fasttrack">Fasttrack</option>
                <option value="Total Interactions">Total Interactions</option>
              </select>
              {errors.userCompany && (
                <p className="text-red-500 text-xs mt-1">*This field is required</p>
              )}
            </div>

            {role === "dataVendor" && (checkRole === "partner" || checkRole === "supplier") && (
              <div>
                <Label htmlFor="subRole" className="mb-2 block">
                  Select Sub Role <span className="text-red-500">*</span>
                </Label>
                <select
                  id="subRole"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("subRole", { required: true })}
                >
                  <option value="" disabled>
                    Select Sub User Role
                  </option>
                  <option value="partner">Partner</option>
                  <option value="supplier">Supplier</option>
                </select>
                {errors.subRole && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="username" className="mb-2 block">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                {...register("username", { required: true })}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">*This field is required</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="mb-2 block">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pr-10"
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">*This field is required</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Enter the user's personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="mb-2 block">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="First Name"
                {...register("firstName", { required: true })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">*This field is required</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName" className="mb-2 block">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last Name"
                {...register("lastName", { required: true })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">*This field is required</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">*This field is required</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Agent Role Specific Fields */}
        {role === "agent" && (
          <Card>
            <CardHeader>
              <CardTitle>Agent Information</CardTitle>
              <CardDescription>Additional details for agent role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phone" className="mb-2 block">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="number"
                  placeholder="phone"
                  {...register("phone", { required: true })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="phonePassword" className="mb-2 block">
                  Phone Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="phonePassword"
                    type={showPhonePassword ? "text" : "password"}
                    placeholder="Phone Password"
                    className="pr-10"
                    {...register("phonePassword", { required: true })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPhonePassword(!showPhonePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPhonePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.phonePassword && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="payStructure" className="mb-2 block">
                  Select Pay Structure <span className="text-red-500">*</span>
                </Label>
                <select
                  id="payStructure"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("payStructure", { required: true })}
                >
                  <option value="" disabled>
                    Select Pay Structure
                  </option>
                  <option value="commission">Commission</option>
                  <option value="hourly">Hourly</option>
                </select>
                {errors.payStructure && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Vendor Partner Role Specific Fields */}
        {checkRole === "partner" && role === "dataVendor" && (
          <Card>
            <CardHeader>
              <CardTitle>Data Vendor Partner Information</CardTitle>
              <CardDescription>Additional details for data vendor partner role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company" className="mb-2 block">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="company"
                  {...register("company", { required: true })}
                />
                {errors.company && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="address" className="mb-2 block">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="address"
                  {...register("address", { required: true })}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone-partner" className="mb-2 block">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone-partner"
                  type="text"
                  placeholder="phone"
                  {...register("phone", { required: true })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="contact" className="mb-2 block">
                  Contact <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact"
                  type="text"
                  placeholder="contact"
                  {...register("contact", { required: true })}
                />
                {errors.contact && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="authorizations" className="mb-2 block">
                  Authorizations <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="authorizations"
                  type="text"
                  placeholder="Authorizations"
                  {...register("authorizations", { required: true })}
                />
                {errors.authorizations && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="revenueShareSplit" className="mb-2 block">
                  Revenue share split (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="revenueShareSplit"
                  type="number"
                  placeholder="Revenue share split %"
                  {...register("revenueShareSplit", { required: true })}
                />
                {errors.revenueShareSplit && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="payoutSchedule-partner" className="mb-2 block">
                  Payout Schedule <span className="text-red-500">*</span>
                </Label>
                <select
                  id="payoutSchedule-partner"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("payoutSchedule", { required: true })}
                >
                  <option value="" disabled>
                    Select Payout Schedule
                  </option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bimonthly">Bimonthly</option>
                  <option value="monthly">Monthly</option>
                </select>
                {errors.payoutSchedule && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="dataTypesAvailable-partner" className="mb-2 block">
                  Data Types Available <span className="text-red-500">*</span>
                </Label>
                <select
                  id="dataTypesAvailable-partner"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("dataTypesAvailable", { required: true })}
                >
                  <option value="" disabled>
                    Select Available Data Types
                  </option>
                  <option value="Web Form">Web Form</option>
                  <option value="API">API</option>
                  <option value="List">List</option>
                </select>
                {errors.dataTypesAvailable && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="dataOwnershipDuration-partner" className="mb-2 block">
                  Data ownership duration <span className="text-red-500">*</span>
                </Label>
                <select
                  id="dataOwnershipDuration-partner"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("dataOwnershipDuration", { required: true })}
                >
                  <option value="" disabled>
                    Select Data ownership duration
                  </option>
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                  <option value="1 year">1 year</option>
                  <option value="Indefinite">Indefinite</option>
                </select>
                {errors.dataOwnershipDuration && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label className="mb-2 block">
                  Authorized Programs <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-3 p-4 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <input
                      id="debt"
                      type="checkbox"
                      value="Debt"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      {...register("authorizedPrograms", { required: true })}
                    />
                    <Label htmlFor="debt" className="cursor-pointer font-normal">
                      Debt
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="personal-loans"
                      type="checkbox"
                      value="Personal Loans"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      {...register("authorizedPrograms", { required: true })}
                    />
                    <Label htmlFor="personal-loans" className="cursor-pointer font-normal">
                      Personal Loans
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="mortgages"
                      type="checkbox"
                      value="Mortgages"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      {...register("authorizedPrograms", { required: true })}
                    />
                    <Label htmlFor="mortgages" className="cursor-pointer font-normal">
                      Mortgages
                    </Label>
                  </div>
                </div>
                {errors.authorizedPrograms && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Vendor Supplier Role Specific Fields */}
        {checkRole === "supplier" && role === "dataVendor" && (
          <Card>
            <CardHeader>
              <CardTitle>Data Vendor Supplier Information</CardTitle>
              <CardDescription>Additional details for data vendor supplier role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company-supplier" className="mb-2 block">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company-supplier"
                  type="text"
                  placeholder="company"
                  {...register("company", { required: true })}
                />
                {errors.company && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="address-supplier" className="mb-2 block">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address-supplier"
                  type="text"
                  placeholder="address"
                  {...register("address", { required: true })}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone-supplier" className="mb-2 block">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone-supplier"
                  type="text"
                  placeholder="phone"
                  {...register("phone", { required: true })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="contact-supplier" className="mb-2 block">
                  Contact <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact-supplier"
                  type="text"
                  placeholder="contact"
                  {...register("contact", { required: true })}
                />
                {errors.contact && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="firstName-supplier" className="mb-2 block">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName-supplier"
                  type="text"
                  placeholder="First Name"
                  {...register("firstName", { required: true })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName-supplier" className="mb-2 block">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName-supplier"
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName", { required: true })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="email-supplier" className="mb-2 block">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email-supplier"
                  type="email"
                  placeholder="email"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="authorizations-supplier" className="mb-2 block">
                  Authorizations <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="authorizations-supplier"
                  type="text"
                  placeholder="Authorizations"
                  {...register("authorizations", { required: true })}
                />
                {errors.authorizations && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="perRecordCost" className="mb-2 block">
                  Per Record cost ($) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="perRecordCost"
                  type="number"
                  placeholder="Per Record cost ($)"
                  {...register("perRecordCost", { required: true })}
                />
                {errors.perRecordCost && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="payoutSchedule-supplier" className="mb-2 block">
                  Payout Schedule <span className="text-red-500">*</span>
                </Label>
                <select
                  id="payoutSchedule-supplier"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("payoutSchedule", { required: true })}
                >
                  <option value="" disabled>
                    Select Payout Schedule
                  </option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bimonthly">Bimonthly</option>
                  <option value="monthly">Monthly</option>
                </select>
                {errors.payoutSchedule && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="dataTypesAvailable-supplier" className="mb-2 block">
                  Data Types Available <span className="text-red-500">*</span>
                </Label>
                <select
                  id="dataTypesAvailable-supplier"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("dataTypesAvailable", { required: true })}
                >
                  <option value="" disabled>
                    Select Available Data Types
                  </option>
                  <option value="Web Form">Web Form</option>
                  <option value="API">API</option>
                  <option value="List">List</option>
                </select>
                {errors.dataTypesAvailable && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label htmlFor="dataOwnershipDuration-supplier" className="mb-2 block">
                  Data ownership duration <span className="text-red-500">*</span>
                </Label>
                <select
                  id="dataOwnershipDuration-supplier"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("dataOwnershipDuration", { required: true })}
                >
                  <option value="" disabled>
                    Select Data ownership duration
                  </option>
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                  <option value="1 year">1 year</option>
                  <option value="Indefinite">Indefinite</option>
                </select>
                {errors.dataOwnershipDuration && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>

              <div>
                <Label className="mb-2 block">
                  Authorized Programs <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-3 p-4 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <input
                      id="debt-supplier"
                      type="checkbox"
                      value="Debt"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      {...register("authorizedPrograms", { required: true })}
                    />
                    <Label htmlFor="debt-supplier" className="cursor-pointer font-normal">
                      Debt
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="personal-loans-supplier"
                      type="checkbox"
                      value="Personal Loans"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      {...register("authorizedPrograms", { required: true })}
                    />
                    <Label htmlFor="personal-loans-supplier" className="cursor-pointer font-normal">
                      Personal Loans
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="mortgages-supplier"
                      type="checkbox"
                      value="Mortgages"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      {...register("authorizedPrograms", { required: true })}
                    />
                    <Label htmlFor="mortgages-supplier" className="cursor-pointer font-normal">
                      Mortgages
                    </Label>
                  </div>
                </div>
                {errors.authorizedPrograms && (
                  <p className="text-red-500 text-xs mt-1">*This field is required</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button type="submit" size="lg" className="w-full max-w-md">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
