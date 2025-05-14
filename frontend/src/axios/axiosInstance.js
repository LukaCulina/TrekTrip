import axios from 'axios';
import { useAuth } from '../context/AuthContext';

let retryCounter = 0; // Initialize the retry counter+
//const { isLoggedIn, logout } = useAuth();

const refreshAccessToken = async () => {

  try {
    const res = await axios.post('http://localhost:8080/auth/refreshToken', {
      token: localStorage.getItem('authToken')
    });
    const accessToken = res.data.accessToken;
    console.log('Refreshed token:', accessToken);
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    /*if (error.response && error.response.status === 401) {
      // Handle refresh token expiration (401 Unauthorized)
      logout(); // Call the logout function from AuthContext
    }
    throw error;*/
  }
};

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://dark-ardis-lukaculina-bde5dd25.koyeb.app/',
});

// Request interceptor to attach the token to the request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 403) {
      if (retryCounter < 3) { // Set the maximum number of retries
        retryCounter++;
        try {
          const accessToken = await refreshAccessToken();
          // Retry the original request with the new access token
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance.request(error.config);
        } catch (refreshError) {
          // Handle refresh error
          console.error('Error refreshing access token:', refreshError);
          throw refreshError;
        }
      } else {
        // If reached the maximum number of retries, handle the error or log it
        console.error('Maximum retry attempts reached');
        return Promise.reject(error);
      }
    }
    // For other errors, just return the error
    return Promise.reject(error);
  }
);

export default axiosInstance;
