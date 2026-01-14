/**
 * Route permissions mapping based on backend endpoint role requirements
 * Maps admin routes to the allowed roles that can access them
 * 
 * This is determined by checking what backend endpoints each route calls
 * and using the most restrictive role requirement from those endpoints
 */

export const ROUTE_PERMISSIONS = {
  // Admin-only routes
  "/admin-navigation/roster": ["admin"],
  "/admin-navigation/data": ["admin"],
  "/admin-navigation/other-roles-access": ["admin"],
  "/admin-navigation": ["admin"],

  // Admin + Supervisor routes
  "/admin-navigation/upload-data": ["admin", "supervisor"],
  "/admin-navigation/create-template": ["admin", "supervisor"],
  "/admin-navigation/export-data": ["admin", "supervisor"],
  "/admin-navigation/buzzword-admin": ["admin", "supervisor"],
  "/admin-navigation/data/contacts-dashboard": ["admin", "supervisor"],
  "/admin-navigation/dnc-form": ["admin", "supervisor"],

  // Admin + Supervisor + Data Vendor + Data Manager routes
  "/admin-navigation/upload-lead-file": ["admin", "supervisor", "dataVendor", "dataManager"],
  "/admin-navigation/upload-lead-file-queue": ["admin", "supervisor", "dataVendor", "dataManager"],

  // Admin + Program Owner + Supervisor routes
  "/admin-navigation/add-user": ["admin", "programOwner", "supervisor"],
};

/**
 * Normalize role name for comparison
 * Backend returns camelCase role names (e.g., "admin", "supervisor", "dataManager")
 * This function normalizes to lowercase for case-insensitive comparison
 */
export const normalizeRole = (role) => {
  if (!role) return null;
  return role.toLowerCase();
};

/**
 * Check if a user role has access to a route
 * @param {string} route - The route path
 * @param {string} userRole - The user's role (from backend, camelCase format)
 * @returns {boolean} - Whether the user has access
 */
export const hasRouteAccess = (route, userRole) => {
  // Normalize route by removing trailing slash for consistent matching
  const normalizedRoute = route.endsWith('/') && route !== '/' 
    ? route.slice(0, -1) 
    : route;
  
  const allowedRoles = ROUTE_PERMISSIONS[normalizedRoute];
  
  if (!allowedRoles) {
    // If route not in mapping, allow access to everyone
    return true;
  }
  
  const normalizedUserRole = normalizeRole(userRole);
  return allowedRoles.some(role => normalizeRole(role) === normalizedUserRole);
};

