import API from "./axios";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
  const res = await API.post("/auth/register", { name, email, password });
  return res.data;
};