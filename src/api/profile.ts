import API from "./axios";

export interface Profile {
  user_id: number;
  full_name?: string;
  phone?: string;
  gender?: string;
  birthdate?: string;
  address?: string;
  occupation?: string;
  national_id?: string;
  profile_picture_url?: string | null;
}

export const getProfile = async (): Promise<Profile> => {
  const res = await API.get("/api/profile");
  return res.data.profile;
};

export const updateProfile = async (data: FormData): Promise<Profile> => {
  const res = await API.put("/api/profile", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};