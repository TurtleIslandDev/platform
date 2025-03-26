import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Menu,
  MenuHandler,
  Button,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { setTobeEdited } from "../../features/slice/userSlice";
import useFetch from "../../features/hooks/useFetch";
import { EditUser } from "../../components/modals/EditUser";
import { data } from "autoprefixer";
import { ResetPassword } from "../../components/modals/ResetPassword";
import { useNavigate } from "react-router-dom";

const TABLE_HEAD = [
  "Username",
  "First Name",
  "Last Name",
  "Company",
  "Role",
  "Actions",
];

const TABLE_ROWS = [
  {
    name: "John Michael",
    job: "Manager",
    date: "23/04/18",
  },
  {
    name: "Alexa Liras",
    job: "Developer",
    date: "23/04/18",
  },
  {
    name: "Laurent Perrier",
    job: "Executive",
    date: "19/09/17",
  },
  {
    name: "Michael Levi",
    job: "Developer",
    date: "24/12/08",
  },
  {
    name: "Richard Gran",
    job: "Manager",
    date: "04/10/21",
  },
];
const Rooster = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [open, setOpen] = useState(false);

  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fetchData, loading } = useFetch();
  useEffect(() => {
    fetchData("/guide_auth/getAllUsers", undefined, (res) => {
      console.log(res);
      setAllUsers(res?.data);
    });
  }, []);
  return (
    <div className="px-6">
      <EditUser open={open} setOpen={setOpen} />
      <ResetPassword open={resetPasswordOpen} setOpen={setResetPasswordOpen} />

      <div className="w-full mb-5">
        <p className="text-2xl text-[#222] mb-2">Search Users</p>
        <label className="input input-bordered flex items-center gap-2 ">
          <input
            // {...register("username", { required: true })}
            type="text"
            className="grow h-16 border border-[#cccccc] rounded pl-5 focus:outline-none"
            placeholder="username"
          />
          <button
            className="bg-[#1E40AF] text-white h-full p-4 rounded-lg"
            onClick={() => {
              navigate("/admin-navigation/add-user");
            }}
          >
            Add User
          </button>
        </label>
      </div>
      {loading ? (
        <>Loading Users</>
      ) : (
        <Card className="h-full w-full overflow-scroll">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user, index) => {
                const isLast = index === allUsers.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={index}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {user.username}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {user?.newFields?.firstName}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {user?.newFields?.lastName}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {user?.newFields?.userCompany}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {user.role}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <button
                        className="bg-[#F5874B] px-4 py-1 rounded-md"
                        onClick={() => {
                          dispatch(
                            setTobeEdited({
                              data: user,
                            })
                          );
                          setOpen((prev) => !prev);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="ml-4 bg-[#22851266] px-4 py-1 rounded-md "
                        onClick={() => {
                          dispatch(
                            setTobeEdited({
                              data: user,
                            })
                          );
                          setResetPasswordOpen((prev) => !prev);
                        }}
                      >
                        Reset Password
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default Rooster;
