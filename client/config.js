// src/config.js

const config = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:4000/api", // Use VITE_ prefixed variable
};

export default config;
