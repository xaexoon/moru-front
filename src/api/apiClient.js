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

// 요청 인터셉터
apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  const noAuthUrls = ["/auth/login", "/auth/register"];
  const isNoAuthUrl = noAuthUrls.some((url) => config.url?.includes(url));

  if (accessToken && !isNoAuthUrl) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  
  (error) => {
    const status = error.response?.status;
    
    // 401 Unauthorized - 토큰 만료
    if (status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      if (!window.location.pathname.includes("/login")) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
      }
    }
    
    // 403은 alert 없이 조용히 처리 (컴포넌트에서 개별 처리하도록)
    // if (status === 403) {
    //   alert("접근 권한이 없습니다.");
    // }
    
    return Promise.reject(error);
  }
);

export default apiClient;