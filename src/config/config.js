const config = {
  // 환경별 BASE URL 설정
  baseUrl: "3.38.188.127",
  // baseUrl:"3.35.23.35",
  port: 8080,

  timeout: 3000,
};

export const API_BASE_URL = `http://${config.baseUrl}:${config.port}/moru/api`;

export const AUTH_API = "/auth";
export const USERS_API = "/users";
export const ADMIN_API = "/admin";
export const CARDS_API = "/card";
export const DECK_API = "/deck";
export const DATAFIELD_API = "/data-field";

export default config;
