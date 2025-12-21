import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import {
  AUTH_API,
  USERS_API,
  CARDS_API,
  DECK_API,
  ADMIN_API,
  DATAFIELD_API,
} from "../config/config";

//////////////   AUTH API    //////////////
//회원가입
export const useSignUp = () => {
  return useMutation({
    mutationFn: (credentials) =>
      apiClient.post(`${AUTH_API}/register`, credentials),
  });
};

//로그인
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials) =>
      apiClient.post(`${AUTH_API}/login`, credentials),
  });
};

// 로그아웃
export const useLogout = () => {
  return useMutation({
    mutationFn: (credentials) =>
      apiClient.post(`${AUTH_API}/logout`, credentials),
  });
};

// 토큰 재발급
export const useReissuedToken = () => {
  return useMutation({
    mutationFn: (credentials) =>
      apiClient.post(`${AUTH_API}/refresh`, credentials),
  });
};

//////////////   USERS API    //////////////
// 개인프로필 조회
export const useGetMyInfo = (options = {}) => {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: () => apiClient.get(`${USERS_API}/me`),
    ...options,
  });
};

// 개인프로필 수정
export const useUpdateMyInfo = () => {
  return useMutation({
    mutationFn: (credentials) =>
      apiClient.patch(`${USERS_API}/me`, credentials),
  });
};

// 회원탈퇴
export const useDeleteMyInfo = () => {
  return useMutation({
    mutationFn: (data) => apiClient.delete(`${USERS_API}/me`, { data }),
  });
};

//////////////   ADMIN API    //////////////
// 전체 사용자 목록 조회
export const useAllUsers = () => {
  return useMutation({
    mutationFn: (data) => apiClient.patch(`${ADMIN_API}/users`, data),
  });
};

// 사용자 활성화
export const useActiveUser = () => {
  return useMutation({
    mutationFn: ({ id, data }) =>
      apiClient.patch(`${ADMIN_API}/users/${id}/activation`, data),
  });
};

//////////////   CARDS API    //////////////
// 카드 생성
export const useCreateCard = () => {
  return useMutation({
    mutationFn: (data) => apiClient.post(`${CARDS_API}`, data),
  });
};

// 카드 조회
export const useGetCards = (options = {}) => {
  return useQuery({
    queryKey: ["cards"],
    queryFn: () => apiClient.get(`${CARDS_API}`),
    ...options,
  });
};

export const useGetCard = (id, options = {}) => {
  return useQuery({
    queryKey: ["card", id],
    queryFn: () => apiClient.get(`${CARDS_API}/${id}`),
    enabled: !!id,
    ...options,
  });
};

//////////////   DECK API    //////////////
// 전체 덱 조회
export const useGetAllDecks = (options = {}) => {
  return useQuery({
    queryKey: ["decks"],
    queryFn: () => apiClient.get(`${DECK_API}`),
    ...options,
  });
};

// 특정 덱 조회
export const useGetDeck = (id, options = {}) => {
  return useQuery({
    queryKey: ["decks", id],
    queryFn: () => apiClient.get(`${DECK_API}/${id}`),
    enabled: !!id,
    ...options,
  });
};

//덱 생성
export const useCreateDeck = () => {
  return useMutation({
    mutationFn: (data) => apiClient.post(`${DECK_API}`, data),
  });
};

// 덱 삭제
export const useDeleteDeck = () => {
  return useMutation({
    mutationFn: (id) => apiClient.delete(`${DECK_API}/${id}`),
  });
};

//////////////   DATAFIELD API    //////////////

export const useGetDatafield = (options = {}) => {
   return useQuery({
    queryKey: ["datafield"],
    queryFn: () => apiClient.get(`${DATAFIELD_API}`),
    ...options,
  });
}


export const useCreateDatafield = () => {
  return useMutation({
    mutationFn: (data) => apiClient.post(`${DATAFIELD_API}`, data),
  });
}
