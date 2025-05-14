// src/utils/APICore.js
import * as jwt_decode from "jwt-decode";  // Use named import for jwt-decode
import axios from "axios";
import config from "../../config";

// Set default headers and base URL
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = config.API_URL;
axios.defaults.withCredentials = false;

const AUTH_SESSION_KEY = "authToken";

// Set the default authorization header
const setAuthorization = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Get user data from session storage
const getUserFromSession = () => {
  const user = sessionStorage.getItem(AUTH_SESSION_KEY);
  return user ? JSON.parse(user) : null;
};

class APICore {
  // Method to check if the user is authenticated by checking the token's validity
  isUserAuthenticated = () => {
    const user = this.getLoggedInUser();
    if (!user) {
      console.warn("No user found. User is not authenticated.");
      return false;
    }

    const decoded = jwt_decode(user.token); // Using named import jwt_decode
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      this.setLoggedInUser(null);
      return false;
    } else {
      return true;
    }
  };

  // Set logged in user in session storage
  setLoggedInUser = (session) => {
    if (session) {
      sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
      setAuthorization(session.token); // Automatically set the token in axios headers
    } else {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
      setAuthorization(null);
    }
  };

  // Get the logged in user
  getLoggedInUser = () => {
    return getUserFromSession();
  };

  // Fetch data from the API
  get = (url, params) => {
    const user = this.getLoggedInUser();
    const token = user ? user.token : null;
    if (token) {
      setAuthorization(token); // Dynamically set the Authorization header
    }

    return axios.get(url, { params });
  };

  post = (url, data) => {
    const user = this.getLoggedInUser();
    const token = user ? user.token : null; // Get token from session if exists

    if (token) {
      setAuthorization(token); // Dynamically set the Authorization header
    }

    return axios.post(url, data);
  };
  put = (url, data) => {
    const user = this.getLoggedInUser();
    const token = user ? user.token : null; // Get token from session if exists

    if (token) {
      setAuthorization(token); // Dynamically set the Authorization header
    }

    return axios.put(url, data);
  };
  update = (url, data) => {
    const user = this.getLoggedInUser();
    const token = user ? user.token : null; // Get token from session if exists

    if (token) {
      setAuthorization(token); // Dynamically set the Authorization header
    }

    return axios.put(url, data);
  };

  delete = (url) => {
    const user = this.getLoggedInUser();
    const token = user ? user.token : null; // Get token from session if exists

    if (token) {
      setAuthorization(token); // Dynamically set the Authorization header
    }

    return axios.delete(url);
  };
}

export const apiCore = new APICore();
