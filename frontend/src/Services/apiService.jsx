//Services/apiService.jsx
import axios from "axios";
import { toast } from "react-toastify";

// Create Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleResponse = async (apiCall) => {
  try {
    const response = await apiCall;
    return {
      success: true,
      data: response.data,
      fullResponse: response,
    };
  } catch (error) {
    return {
      success: false,
      errors: error.response?.data?.errors || { message: error.message },
      fullResponse: error.response || error,
    };
  }
};

// User Authentication
export const userSignup = async (data) => {
  return handleResponse(
    apiClient.post("/api/register/", data, { authRequired: false })
  );
};

export const login = async (data) => {
  const response = await handleResponse(apiClient.post("/api/login/", data));
  if (response.success == true) {
    toast.success("Login successful");
    localStorage.setItem("accessToken", response.data.data.access);
    localStorage.setItem("refreshToken", response.data.data.refresh);
    window.dispatchEvent(new Event("loginStatusChanged"));
  } else {
    toast.error("Login Failed");
  }
  return response;
};

export const checkLoginStatus = () => !!localStorage.getItem("accessToken");

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.dispatchEvent(new Event("loginStatusChanged"));
};

// Movies
export const getMovies = async (page = 1, query = "", genre = "") => {
  return handleResponse(
    apiClient.get("/api/movies/movies/", {
      params: {
        page,
        query: query !== "" ? query : null,
        genre: genre !== "" ? genre : null,
      },
    })
  );
};

export const getMovieDetails = async (movieId) => {
  return handleResponse(apiClient.get(`/api/movies/movies/${movieId}/`));
};

export const addToWatchList = async (movieId) => {
  return handleResponse(
    apiClient.post(
      `/api/movies/add-to-watchlist/`,
      { movie_id: movieId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    )
  );
};

export const getWatchlist = async (page = 1, genre = "", query = "") => {
  return handleResponse(
    apiClient.get("/api/movies/watchlist/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      params: {
        page,
        genre: genre || null,
        query: query || null,
      },
    })
  );
};

export const getTotalMoviesCount = async () => {
  return handleResponse(apiClient.get("/api/movies/total-movies/",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    } 
  ));
};

export const getAllMovies = async () => {
  return handleResponse(apiClient.get("/api/movies/all-movies/"));
};

// Ratings
export const addRating = async (movieId, data) => {
  return handleResponse(
    apiClient.post("/api/movies/ratings/", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    })
  );
};

export const updateRating = async (ratingId, data) => {
  return handleResponse(
    apiClient.put(`/api/movies/ratings/${ratingId}/`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    })
  );
};

export const deleteRating = async (ratingId) => {
  return handleResponse(
    apiClient.delete(`/api/movies/ratings/${ratingId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
  );
};

export const getMyRatingForMovie = async (movieId) => {
  return handleResponse(
    apiClient.get(`/api/movies/movies/${movieId}/my-rating/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
  );
};

export const getRatingsForMovie = async (movieId) => {
  return handleResponse(
    apiClient.get(`/api/movies/movies/${movieId}/ratings/`)
  );
};

// Recommendations
export const getRecommendations = async (page = 1, searchQuery = "", selectedGenre = "") => {
  let url = `/api/movies/recommendations/?page=${page}`;
  if (searchQuery) {
    url += `&search=${searchQuery}`;
  }
  if (selectedGenre) {
    url += `&genre=${selectedGenre}`;
  }

  const response = await apiClient.get(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return handleResponse(response);
};

// Profiles
export const getUserProfile = async () => {
  return handleResponse(
    apiClient.get("/api/profiles/me/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
  );
};

export const updateUserProfile = async (data) => {
  return handleResponse(
    apiClient.put("/api/profiles/update_me/", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "multipart/form-data",
      },
    })
  );
};

// Admin/Stats
export const getTotalUsers = async () => {
  return handleResponse(
    apiClient.get("/api/total-users/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
  );
};

export const getUsersByWeek = async (year, month) => {
  return handleResponse(
    apiClient.get(`/api/users-by-week/${year}/${month}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
  );
};

// Admin/User Management
export const getAllUsers = async () => {
  return handleResponse(
    apiClient.get("/api/admin/users/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
  );
};

export const activateUser = async (userId) => {
  return handleResponse(
    apiClient.post(
      `/api/admin/users/${userId}/activate_user/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    )
  );
};

export const deactivateUser = async (userId) => {
  return handleResponse(
    apiClient.post(
      `/api/admin/users/${userId}/deactivate_user/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    )
  );
};

// Contact Messages
export const submitContactMessage = async (data) => {
  return handleResponse(
    apiClient.post("/api/contact-messages/", data, { authRequired: false })
  );
};

export const getContactMessages = async () => {
  return handleResponse(
    apiClient.get("/api/contact-messages/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
  );
};