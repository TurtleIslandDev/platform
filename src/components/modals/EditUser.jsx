import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Eye, EyeOff, UserCog, Loader2, Save } from "lucide-react";
import useFetch from "../../features/hooks/useFetch";
import { userPermissions } from "../../data/constants";
import { setTobeEdited } from "../../features/slice/userSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";

export function EditUser({ open, setOpen }) {
  const dispatch = useDispatch();
  const { toBeEdited } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [permissions, setPermissions] = useState([]);
  const { postData, loading } = useFetch();

  const handleClose = () => {
    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    resetField,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      role: toBeEdited?.role,
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
      subRole: "",
      payStructure: "",
      phonePassword: "",
    },
  });

  const role = watch("role");
  const checkRole = watch("subRole");

  useEffect(() => {
    if (role) {
      const newPermissions = userPermissions[role] || [];
      setPermissions(newPermissions);
      setValue("userPermissions", newPermissions || []);
    }
  }, [role, setValue]);

  const onSubmit = async (data) => {
    const excludedKeys = ["role"];
    let newFields = {};
    for (let key in data) {
      if (!excludedKeys.includes(key)) {
        newFields[key] = data[key];
        delete data[key];
      }
    }
    data.newFields = newFields;
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
  }, [checkRole, resetField]);

  useEffect(() => {
    let fieldsToReset = ["role", "password"];
    for (let i = 0; i < fieldsToReset.length; i++) {
      resetField(fieldsToReset[i]);
    }
  }, [open, resetField]);

  useEffect(() => {
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage("");
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [responseMessage]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Edit User
          </DialogTitle>
          <DialogDescription>
            Editing user: <span className="font-semibold">{toBeEdited?.username}</span>
          </DialogDescription>
        </DialogHeader>

        {responseMessage?.message && (
          <div
            className={`p-3 rounded-md text-sm ${
              responseMessage?.status === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : responseMessage?.status === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : ""
            }`}
          >
            {responseMessage?.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* User Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">User Role</Label>
            <Controller
              name="role"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select User Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="channelManager">Channel Manager</SelectItem>
                    <SelectItem value="dataManager">Data Manager</SelectItem>
                    <SelectItem value="salesManager">Sales Manager</SelectItem>
                    <SelectItem value="programManager">Program Manager</SelectItem>
                    <SelectItem value="teamLead">Team Lead</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="performanceManager">Performance Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="programOwner">Program Owner</SelectItem>
                    <SelectItem value="bpo">BPO</SelectItem>
                    <SelectItem value="dataVendor">Data Vendor</SelectItem>
                    <SelectItem value="broadcastCustomer">Broadcast Customer</SelectItem>
                    <SelectItem value="trainee">Trainee</SelectItem>
                    <SelectItem value="applicant">Applicant</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="closer">Closer</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <span className="text-sm text-red-500">*This field is required</span>
            )}
          </div>

          {/* Sub Role for Data Vendor */}
          {role === "dataVendor" && (
            <div className="space-y-2">
              <Label htmlFor="subRole">Sub Role</Label>
              <Controller
                name="subRole"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sub Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="partner">Partner</SelectItem>
                      <SelectItem value="supplier">Supplier</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subRole && (
                <span className="text-sm text-red-500">*This field is required</span>
              )}
            </div>
          )}

          {/* Basic Info - Always Shown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="First Name"
                {...register("firstName", { required: true })}
              />
              {errors.firstName && (
                <span className="text-sm text-red-500">*This field is required</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Last Name"
                {...register("lastName", { required: true })}
              />
              {errors.lastName && (
                <span className="text-sm text-red-500">*This field is required</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-sm text-red-500">*This field is required</span>
            )}
          </div>

          {/* Agent-specific fields */}
          {role === "agent" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone"
                  {...register("phone", { required: true })}
                />
                {errors.phone && (
                  <span className="text-sm text-red-500">*This field is required</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phonePassword">Phone Password</Label>
                <div className="relative">
                  <Input
                    id="phonePassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Phone Password"
                    className="pr-10"
                    {...register("phonePassword", { required: true })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.phonePassword && (
                  <span className="text-sm text-red-500">*This field is required</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="payStructure">Pay Structure</Label>
                <Controller
                  name="payStructure"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Pay Structure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="commission">Commission</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.payStructure && (
                  <span className="text-sm text-red-500">*This field is required</span>
                )}
              </div>
            </>
          )}

          {/* Partner-specific fields */}
          {checkRole === "partner" && role === "dataVendor" && (
            <DataVendorFields
              type="partner"
              register={register}
              errors={errors}
              control={control}
            />
          )}

          {/* Supplier-specific fields */}
          {checkRole === "supplier" && role === "dataVendor" && (
            <DataVendorFields
              type="supplier"
              register={register}
              errors={errors}
              control={control}
            />
          )}

          {/* User Permissions */}
          <div className="space-y-3">
            <Label>User Permissions</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border border-gray-200 rounded-md bg-gray-50">
              {permissions?.map((permission, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`permission-${index}`}
                    value={permission}
                    {...register("userPermissions")}
                  />
                  <Label
                    htmlFor={`permission-${index}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {permission}
                  </Label>
                </div>
              ))}
              {(!permissions || permissions.length === 0) && (
                <p className="text-sm text-gray-500 col-span-2">
                  Select a role to view available permissions
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update User
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Extracted component for Data Vendor fields to reduce repetition
function DataVendorFields({ type, register, errors, control }) {
  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
      <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wide">
        {type === "partner" ? "Partner Details" : "Supplier Details"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            placeholder="Company"
            {...register("company", { required: true })}
          />
          {errors.company && (
            <span className="text-sm text-red-500">*This field is required</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="Address"
            {...register("address", { required: true })}
          />
          {errors.address && (
            <span className="text-sm text-red-500">*This field is required</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="Phone"
            {...register("phone", { required: true })}
          />
          {errors.phone && (
            <span className="text-sm text-red-500">*This field is required</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Contact</Label>
          <Input
            id="contact"
            placeholder="Contact"
            {...register("contact", { required: true })}
          />
          {errors.contact && (
            <span className="text-sm text-red-500">*This field is required</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="authorizations">Authorizations</Label>
        <Input
          id="authorizations"
          placeholder="Authorizations"
          {...register("authorizations", { required: true })}
        />
        {errors.authorizations && (
          <span className="text-sm text-red-500">*This field is required</span>
        )}
      </div>

      {type === "partner" ? (
        <div className="space-y-2">
          <Label htmlFor="revenueShareSplit">Revenue Share Split (%)</Label>
          <Input
            id="revenueShareSplit"
            type="number"
            placeholder="Revenue share split %"
            {...register("revenueShareSplit", { required: true })}
          />
          {errors.revenueShareSplit && (
            <span className="text-sm text-red-500">*This field is required</span>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="perRecordCost">Per Record Cost ($)</Label>
          <Input
            id="perRecordCost"
            type="number"
            placeholder="Per Record cost ($)"
            {...register("perRecordCost", { required: true })}
          />
          {errors.perRecordCost && (
            <span className="text-sm text-red-500">*This field is required</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="payoutSchedule">Payout Schedule</Label>
          <Controller
            name="payoutSchedule"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bimonthly">Bimonthly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.payoutSchedule && (
            <span className="text-sm text-red-500">*Required</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataTypesAvailable">Data Types Available</Label>
          <Controller
            name="dataTypesAvailable"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Form">Web Form</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                  <SelectItem value="List">List</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.dataTypesAvailable && (
            <span className="text-sm text-red-500">*Required</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataOwnershipDuration">Ownership Duration</Label>
          <Controller
            name="dataOwnershipDuration"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 days">30 days</SelectItem>
                  <SelectItem value="90 days">90 days</SelectItem>
                  <SelectItem value="1 year">1 year</SelectItem>
                  <SelectItem value="Indefinite">Indefinite</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.dataOwnershipDuration && (
            <span className="text-sm text-red-500">*Required</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Authorized Programs</Label>
        <div className="flex flex-wrap gap-4 p-3 border rounded-md">
          {["Debt", "Personal Loans", "Mortgages"].map((program) => (
            <div key={program} className="flex items-center space-x-2">
              <Checkbox
                id={`program-${program}`}
                value={program}
                {...register("authorizedPrograms", { required: true })}
              />
              <Label
                htmlFor={`program-${program}`}
                className="text-sm font-normal cursor-pointer"
              >
                {program}
              </Label>
            </div>
          ))}
        </div>
        {errors.authorizedPrograms && (
          <span className="text-sm text-red-500">*At least one program is required</span>
        )}
      </div>
    </div>
  );
}
