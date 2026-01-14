import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { hasRouteAccess } from "../../config/routePermissions";
import { logout } from "../../features/slice/userSlice";
import { AlertCircle, LogOut, Home } from "lucide-react";
import { Button } from "../ui/button";

/**
 * AdminRouteGuard Component
 * 
 * Validates user's role from Redux state and checks if they have access to the current route.
 * Shows an overlay if access is denied.
 * 
 * Only checks role/access type, does NOT validate token TTL.
 */
const AdminRouteGuard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, username, role } = useSelector((state) => state.user);
  const [hasAccess, setHasAccess] = useState(null); // null = loading, true = has access, false = no access
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getRoleNavigationRoute = (userRole) => {
    const roleRouteMap = {
      agent: "/agent-navigation",
      channelManager: "/channel-manager-navigation",
      dataManager: "/data-manager-navigation",
      salesManager: "/sales-manager-navigation",
      programManager: "/program-manager-navigation",
      teamLead: "/team-lead-navigation",
      supervisor: "/qc-and-supervisor-navigation",
      performanceManager: "/performance-navigation",
      admin: "/admin-navigation",
      programOwner: "/program-owner-navigation",
      bpo: "/bpo-navigation",
      dataVendor: "/data-vendor-navigation",
      broadcastCustomer: "/broadcast-customer-navigation",
      trainee: "/agent-trainee-navigation",
      applicant: "/applicant-navigation",
      internal: "/internal-navigation",
      partner: "/partner-navigation",
      supplier: "/supplier-navigation",
      closer: "/agent-navigation/dnc-form",
    };
    return roleRouteMap[userRole] || "/";
  };

  const handleDashboard = () => {
    const dashboardRoute = getRoleNavigationRoute(role);
    navigate(dashboardRoute);
  };

  useEffect(() => {
    // If no token or no role, deny access
    if (!token || !role) {
      setHasAccess(false);
      setIsLoading(false);
      return;
    }

    // Check if user has access to current route using role from Redux
    const currentRoute = location.pathname;
    const accessGranted = hasRouteAccess(currentRoute, role);

    // Normalize route for debug display
    const normalizedRoute = currentRoute.endsWith('/') && currentRoute !== '/' 
      ? currentRoute.slice(0, -1) 
      : currentRoute;

    console.log("🔍 AdminRouteGuard Debug:", {
      route: currentRoute,
      normalizedRoute: normalizedRoute,
      roleFromRedux: role,
      accessGranted: accessGranted
    });

    setHasAccess(accessGranted);
    setIsLoading(false);
  }, [location.pathname, token, role]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  // Show access denied overlay
  if (!hasAccess) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm">
        {/* Navbar Header */}
        <nav className="flex h-16 w-full items-center justify-between bg-white px-6 shadow-sm border-b">
          {/* Brand Logo - Clickable to redirect to dashboard */}
          <button
            onClick={handleDashboard}
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl font-bold">
              <span className="text-orange-500">itsBuzz</span>
              <span className="text-blue-600">Marketing</span>
            </span>
          </button>

          {/* User Info & Navigation Actions */}
          <div className="flex items-center gap-4">
            {/* Current User */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Welcome,</span>
              <span className="text-gray-900">{username || "User"}</span>
            </div>
            
            {/* Navigation Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        </nav>

        {/* Access Denied Content */}
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="bg-card border border-border rounded-lg shadow-lg p-8 max-w-md mx-4">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="h-16 w-16 text-destructive" />
              <h2 className="text-2xl font-semibold">Access Denied</h2>
              <p className="text-muted-foreground">
                You do not have access to this page.
              </p>
              {role && (
                <p className="text-sm text-muted-foreground">
                  Your current role: <span className="font-medium">{role}</span>
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                Please contact an administrator if you believe this is an error.
              </p>
              
              {/* Action Button */}
              <div className="mt-4">
                <Button
                  onClick={handleDashboard}
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User has access, render children
  return <>{children}</>;
};

export default AdminRouteGuard;

