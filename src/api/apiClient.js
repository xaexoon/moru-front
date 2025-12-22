import axios from "axios";
import { API_BASE_URL } from "../config/config";

const getAccessToken = () => {
  return localStorage.getItem("accessToken");
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

  // 로그인, 회원가입 요청은 토큰 제외
  const noAuthUrls = ["/auth/login", "/auth/register"];
  const isNoAuthUrl = noAuthUrls.some((url) => config.url?.includes(url));

  if (accessToken && !isNoAuthUrl) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default apiClient;
