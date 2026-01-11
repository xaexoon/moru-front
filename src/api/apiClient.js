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

  // 로그인, 회원가입 요청은 토큰 제외
  const noAuthUrls = ["/auth/login", "/auth/register"];
  const isNoAuthUrl = noAuthUrls.some((url) => config.url?.includes(url));

  if (accessToken && !isNoAuthUrl) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// 응답 인터셉터 - 토큰 만료 처리
apiClient.interceptors.response.use(
  // 성공 응답
  (response) => response,
  
  // 에러 응답
  (error) => {
    const status = error.response?.status;
    
    // 401 Unauthorized - 토큰 만료 또는 유효하지 않은 토큰
    if (status === 401) {
      // 로컬 스토리지 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      // 현재 페이지가 로그인 페이지가 아닐 때만 리다이렉트
      if (!window.location.pathname.includes("/login")) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
      }
    }
    
    // 403 Forbidden - 권한 없음
    if (status === 403) {
      alert("접근 권한이 없습니다.");
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;