import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Search, UserPlus, Edit, KeyRound, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setTobeEdited } from "../../features/slice/userSlice";
import useFetch from "../../features/hooks/useFetch";
import { EditUser } from "../../components/modals/EditUser";
import { ResetPassword } from "../../components/modals/ResetPassword";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navigationBar/navbar";

const Roster = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fetchData, loading } = useFetch();

  useEffect(() => {
    fetchData("/guide_auth/getAllUsers", undefined, (res) => {
      setAllUsers(res?.data);
    });
  }, []);

  // Filter users based on search term (username)
  const filteredUsers = allUsers.filter((user) => {
    if (!user) return false;
    if (!searchTerm.trim()) return true;
    return user.username?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-[95%] mx-auto p-6 pt-16 space-y-6">
      <Navbar />
      
      <EditUser open={open} setOpen={setOpen} />
      <ResetPassword open={resetPasswordOpen} setOpen={setResetPasswordOpen} />

      {/* Search and Add User Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Users
          </CardTitle>
          <CardDescription>Search for users by username</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by username..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                navigate("/admin-navigation/add-user");
              }}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Records</CardTitle>
          <CardDescription>
            {loading 
              ? "Loading users..." 
              : searchTerm.trim()
                ? `Showing ${filteredUsers.length} of ${allUsers.length} user${allUsers.length !== 1 ? 's' : ''}`
                : `Showing ${allUsers.length} user${allUsers.length !== 1 ? 's' : ''}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm.trim() 
                  ? `No users found matching "${searchTerm}"`
                  : "No users found"
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => {
                    if (!user) return null;
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                            {user.username}
                          </div>
                        </TableCell>
                        <TableCell>{user?.newFields?.firstName || "-"}</TableCell>
                        <TableCell>{user?.newFields?.lastName || "-"}</TableCell>
                        <TableCell>{user?.newFields?.userCompany || "-"}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                dispatch(
                                  setTobeEdited({
                                    data: user,
                                  })
                                );
                                setOpen((prev) => !prev);
                              }}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                dispatch(
                                  setTobeEdited({
                                    data: user,
                                  })
                                );
                                setResetPasswordOpen((prev) => !prev);
                              }}
                              className="flex items-center gap-1"
                            >
                              <KeyRound className="h-3 w-3" />
                              Reset Password
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Roster;
