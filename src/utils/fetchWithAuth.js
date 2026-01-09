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
      // Try to get the error message from the backend response
      let errorMessage = null;
      try {
        // Clone the response so we can read it without consuming it
        const clonedResponse = response.clone();
        const data = await clonedResponse.json();
        errorMessage = data?.message || data?.error || null;
      } catch (e) {
        // If response is not JSON or can't be parsed, use fallback message
      }
      
      if (errorMessage) {
        // Show the specific error message from backend
        toast.error(errorMessage, {
          position: "top-right",
          className: "toastPosition",
          autoClose: 5000,
        });
      } else {
        // Fallback to generic session expired message if no specific message
        toast.error("Your session has expired. Please log out and log in again to reauthenticate.", {
          position: "top-right",
          className: "toastPosition",
          autoClose: 5000,
        });
      }
      
      return response; // Return response so caller can handle it
    }
    
    return response;
  } catch (error) {
    // Re-throw network errors
    throw error;
  }
};




