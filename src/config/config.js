const config = {
  // 환경별 BASE URL 설정
  baseUrl: "3.38.188.127",
  port: 8080,

  timeout: 3000,
};

export const API_BASE_URL = `http://${config.baseUrl}:${config.port}/moru/api`;

export const AUTH_API = `${API_BASE_URL}/auth`;
export const USERS_API = `${API_BASE_URL}/users`;
export const ADMIN_API = `${API_BASE_URL}/admin`;
export const CARDS_API = `${API_BASE_URL}/cards`;
export const DECK_API = `${API_BASE_URL}/deck`;
export const DATAFIELD_API = `${API_BASE_URL}/datafield`;

export default config;