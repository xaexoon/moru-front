import axios from "axios";
import { API_BASE_URL } from "../config/config";

const getAccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default apiClient;
