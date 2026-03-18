import api from "./axios";
import { DEMO_MODE } from "../config/demo";

export type FeedbackEntry = {
  id: number;
  user_id?: number;
  message: string;
  rating: number | null;
  screenshot_url?: string | null;
  created_at: string;
};

export const fetchFeedback = async (): Promise<FeedbackEntry[]> => {
  if (DEMO_MODE) {
    const stored = localStorage.getItem("demo_feedback");
    return stored ? JSON.parse(stored) : [];
  }
  const res = await api.get("/feedback");
  return res.data.feedback || [];
};

export const submitFeedback = async (input: {
  message: string;
  rating: number;
  screenshot?: File | null;
}): Promise<FeedbackEntry> => {
  if (DEMO_MODE) {
    const entry: FeedbackEntry = {
      id: Date.now(),
      message: input.message,
      rating: input.rating,
      created_at: new Date().toISOString(),
      screenshot_url: input.screenshot ? input.screenshot.name : null,
    };
    const existing = await fetchFeedback();
    const next = [entry, ...existing];
    localStorage.setItem("demo_feedback", JSON.stringify(next));
    return entry;
  }
  const formData = new FormData();
  formData.append("message", input.message);
  formData.append("rating", String(input.rating || 0));
  if (input.screenshot) formData.append("screenshot", input.screenshot);

  const res = await api.post("/feedback", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
