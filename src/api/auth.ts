import api from "./axios";
import { DEMO_MODE } from "../config/demo";

export const loginApi = async (email: string, password: string) => {
  if (DEMO_MODE) {
    return {
      token: "demo-token",
      userId: 1,
      user: { id: 1, name: "Demo User", email, role: "user" },
    };
  }
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerApi = async (
  name: string,
  email: string,
  password: string
) => {
  if (DEMO_MODE) {
    return { message: "Registered (demo)" };
  }
  const res = await api.post("/auth/register", {
    name,
    email,
    password,
  });
  return res.data;
};
