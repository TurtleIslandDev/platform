import React, { useState, useEffect } from "react";
import { Home, LogOut } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"

import { Button } from "../../components/ui/button"
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/slice/userSlice";
import { env } from "../../config/env";

const AUTH_URL = env.AUTH_URL;

export default function Navbar() {

  const dispatch = useDispatch();
  const { username, role } = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  const getRoleNavigationRoute = (userRole: string | null) => {
    if (!userRole) return "/";
    
    const roleRouteMap: Record<string, string> = {
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

  const handleLogoClick = () => {
    const dashboardRoute = getRoleNavigationRoute(role);
    navigate(dashboardRoute);
  };

  return (
    <nav className="flex h-16 w-full items-center justify-between bg-white px-6 mb-2 fixed top-0 left-0 z-50 shadow-sm border-b">
      {/* Brand Logo - Clickable to redirect to dashboard */}
      <button
        onClick={handleLogoClick}
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
          <span className="text-gray-900">{username}</span>
        </div>
        
        {/* Navigation Actions */}
        <div className="flex items-center gap-3" >
          <Button variant="outline" size="sm" asChild style={{ display: "none" }}>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => {
            dispatch(logout());
            navigate("/");
          }}>
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </nav>
  )
}
