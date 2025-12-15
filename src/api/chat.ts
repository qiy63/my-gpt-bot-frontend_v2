import axios from "./axios";

export const askQuestion = async (question: string, token: string | null) => {
  if (!token) throw new Error("No token");
  const res = await axios.post(
    "/ask",
    { question },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
