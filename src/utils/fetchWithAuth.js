import { toast } from "react-toastify";

/**
 * Wrapper around fetch() that handles 401 errors globally
 * Shows a reauthentication message and logs out the user
 * 
 * @param {string} url - The URL to fetch
 * @param {RequestInit} options - Fetch options (headers, method, body, etc.)
 * @returns {Promise<Response>} - The fetch response
 */
export const fetchWithAuth = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    
    // Check for 401 Unauthorized
    if (response.status === 401) {
      // Show toast message
      toast.error("Your session has expired. Please log out and log in again to reauthenticate.", {
        position: "top-right",
        className: "toastPosition",
        autoClose: 5000,
      });
      
      return response; // Return response so caller can handle it
    }
    
    return response;
  } catch (error) {
    // Re-throw network errors
    throw error;
  }
};




