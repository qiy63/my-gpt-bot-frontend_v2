import api from "./axios";

export type LoginMetricPoint = { day: string; count: number };

export type LoginMetrics = {
  total: number;
  daily: LoginMetricPoint[];
};

export type AdminFeedback = {
  id: number;
  user_id?: number;
  user_name?: string;
  email?: string;
  message: string;
  rating: number | null;
  screenshot_url?: string | null;
  created_at: string;
};

export const fetchLoginMetrics = async (): Promise<LoginMetrics> => {
  const res = await api.get("/admin/metrics/logins");
  return res.data;
};

export const fetchAdminFeedback = async (): Promise<AdminFeedback[]> => {
  const res = await api.get("/admin/feedback");
  return res.data.feedback || [];
};
