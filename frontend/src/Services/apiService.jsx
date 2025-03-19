import axios from "axios";
import { toast } from "react-toastify";

// Create Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Set the base URL from environment variables
  timeout: 5000, // Set a timeout for requests
  headers: {
    "Content-Type": "application/json", // Default headers
  },
});

const handleResponse = async (apiCall) => {
  try {
    const response = await apiCall;
    return {
      success: true,
      data: response.data,
      fullResponse: response, // Include the complete response object
    };
  } catch (error) {
    return {
      success: false,
      errors: error.response?.data?.errors || { message: error.message },
      fullResponse: error.response || error,
    };
  }
};

export const userSignup = async (data) => {
  return handleResponse(
    apiClient.post("/api/register/", data, { authRequired: false })
  );
};

export const login = async (data) => {
  // console.log("🔵 Attempting login...");
  const response = await handleResponse(apiClient.post("/api/login/", data));
  if (response.success==true) {
    // console.log("✅ Login successful. Storing tokens...");
    console.log(response);
    toast.success(" Login successful")
    localStorage.setItem("accessToken", response.data.data.access);
    localStorage.setItem("refreshToken", response.data.data.refresh);
    // localStorage.setItem("userId",)
    console.log("accessToken", response.data.access);
    window.dispatchEvent(new Event("loginStatusChanged"));
  }else{
    console.log(response);
    toast.error(" Login Failed")
  }
  return response;
};

export const checkLoginStatus = () => !!localStorage.getItem("accessToken");

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.dispatchEvent(new Event("loginStatusChanged"));
};

const generateConfig = (isFormData = false, authRequired = true) => ({
  headers: {
    "Content-Type": isFormData ? "multipart/form-data" : "application/json",
  },
  authRequired,
});

export const movieList = async () => {
  return handleResponse(
    apiClient.get("/api/movies/movies/", generateConfig())
  );
};
