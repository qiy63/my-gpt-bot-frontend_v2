import api from "./axios";

export type FeedbackEntry = {
  id: number;
  user_id?: number;
  message: string;
  rating: number | null;
  screenshot_url?: string | null;
  created_at: string;
};

export const fetchFeedback = async (): Promise<FeedbackEntry[]> => {
  const res = await api.get("/feedback");
  return res.data.feedback || [];
};

export const submitFeedback = async (input: {
  message: string;
  rating: number;
  screenshot?: File | null;
}): Promise<FeedbackEntry> => {
  const formData = new FormData();
  formData.append("message", input.message);
  formData.append("rating", String(input.rating || 0));
  if (input.screenshot) formData.append("screenshot", input.screenshot);

  const res = await api.post("/feedback", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
