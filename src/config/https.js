import axios from "axios";
import { toast } from "react-toastify";

const base_url = import.meta.env.VITE_AUTH_URL || "https://auth.itsbuzzmarketing.com";
// const auth_url = "";
// const base_url = "http://localhost:3000";
const axiosBaseClient = (type) => {
  return axios.create({
    // baseURL: type === "auth" ? auth_url : base_url,
    baseURL: base_url,
  });
};
const axiosClient = axiosBaseClient("base");
// const axiosAuthClient = axiosBaseClient("auth");

const api = (axioss) => {
  return {
    get: (url, config = {}) => {
      return axioss.get(url, config);
    },
    post: (url, body, config = {}) => {
      return axioss.post(url, body, config);
    },
    put: (url, body, config = {}) => {
      return axioss.put(url, body, config);
    },
    delete: (url, config = {}) => {
      return axioss.delete(url, config);
    },
    patch: (url, body, config = {}) => {
      return axioss.patch(url, body, config);
    },
  };
};

async function requestHandlers(request) {
  return request;
}

const responseHandler = async (response) => {
  return response;
};

const errorHandler = (error) => {
  const { response, config } = error;
  
  // Handle 401 Unauthorized errors globally
  if (response && response.status === 401) {
    // Try to get the error message from the backend response
    const errorMessage = response.data?.message || response.data?.error || null;
    
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
    
    // Return a rejected promise to prevent further processing
    return Promise.reject(error);
  }

  // For other errors, return response as before
  if (response && response?.status) {
    return response;
  }
  
  return Promise.reject(error);
};

//inceptors
axiosClient.interceptors.request.use(requestHandlers, errorHandler);
axiosClient.interceptors.response.use(responseHandler, errorHandler);
// axiosAuthClient.interceptors.response.use(responseHandler, errorHandler);

export const apiClient = api(axiosClient);
// export const authApiClient = api(axiosAuthClient);
