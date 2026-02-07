import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import useFetch from "../../features/hooks/useFetch";
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

export function ResetPassword({ open, setOpen }) {
  const { toBeEdited } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const { postData, loading } = useFetch();

  const handleClose = () => {
    setOpen(false);
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
      console.log(error);
    }
  };

  useEffect(() => {
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage("");
        resetField("password");
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [responseMessage]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Reset Password
          </DialogTitle>
          <DialogDescription>
            Reset password for user: <span className="font-semibold">{toBeEdited?.username}</span>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="pr-10"
                {...register("password", { required: true })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-sm text-red-500">
                *This field is required
              </span>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  Reset Password
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
