import axios from "axios";

// Create Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Set the base URL from environment variables
  timeout: 5000, // Set a timeout for requests
  headers: {
    "Content-Type": "application/json", // Default headers
  },
});
