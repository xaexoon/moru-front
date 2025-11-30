import axios from "axios";
import { getApiUrl } from "../config/config";

// Axios
const apiClient = axios.create({
  baseURL: getApiUrl(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
