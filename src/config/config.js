const config = {
  // 환경별 BASE URL 설정
  baseUrl: "127.0.0.1",
  port: 8000,

  timeout: 3000,
};

export const AUTH_API = `https://${config.baseUrl}:${config.port}/moru/api/auth`;
export const USERS_API = `https://${config.baseUrl}:${config.port}/moru/api/users`;
export const ADMIN_API = `https://${config.baseUrl}:${config.port}/moru/api/admin`;
export const CARDS_API = `https://${config.baseUrl}:${config.port}/moru/api/cards`;
export const DECK_API = `https://${config.baseUrl}:${config.port}/moru/api/deck`;

export default config;
