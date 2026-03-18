import API from "./axios";
import { DEMO_MODE } from "../config/demo";

export interface Profile {
  user_id: number;
  full_name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  birthdate?: string;
  address?: string;
  occupation?: string;
  national_id?: string;
  profile_picture_url?: string | null;
}

export const getProfile = async (): Promise<Profile> => {
  if (DEMO_MODE) {
    const stored = localStorage.getItem("demo_profile");
    if (stored) return JSON.parse(stored);
    const demo: Profile = {
      user_id: 1,
      full_name: "Demo User",
      email: "demo@example.com",
      phone: "",
      gender: "",
      birthdate: "",
      address: "",
      occupation: "",
      national_id: "",
      profile_picture_url: null,
    };
    localStorage.setItem("demo_profile", JSON.stringify(demo));
    return demo;
  }
  const res = await API.get("/api/profile");
  return res.data.profile;
};

export const updateProfile = async (data: FormData): Promise<Profile> => {
  if (DEMO_MODE) {
    const demo = await getProfile();
    data.forEach((value, key) => {
      if (typeof value === "string") {
        (demo as any)[key] = value;
      }
    });
    localStorage.setItem("demo_profile", JSON.stringify(demo));
    return demo as Profile;
  }
  const res = await API.put("/api/profile", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
