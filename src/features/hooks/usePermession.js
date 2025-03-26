import { useSelector } from "react-redux";

const roles = {
  admin: "admin",
  user: "user",
};

const permissions = {
  "user.dashboard": [roles.user],
  "admin.dashboard": [roles.admin],
};

const usePermission = () => {
  const auth = useSelector((state) => state.user);

  const hasPermission = (permissionName) => {
    return permissions[permissionName].includes(auth?.user.role);
  };

  return { hasPermission };
};

export default usePermission;
