import api from "./axios";

export type LegalInfoItem = {
  id: number;
  title: string;
  category: string;
  short_description?: string | null;
  tags?: string | null;
  status?: string | null;
  file_url?: string | null;
  mime_type?: string | null;
  file_size?: number | null;
  created_at?: string;
  updated_at?: string;
};

export const fetchLegalInfo = async (): Promise<LegalInfoItem[]> => {
  const res = await api.get("/legal-info");
  return res.data.items || [];
};

export const createLegalInfo = async (
  payload: Omit<LegalInfoItem, "id"> & { file: File }
): Promise<LegalInfoItem> => {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("category", payload.category);
  if (payload.short_description) form.append("short_description", payload.short_description);
  if (payload.tags) form.append("tags", payload.tags);
  if (payload.status) form.append("status", payload.status);
  form.append("file", payload.file);

  const res = await api.post("/legal-info", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateLegalInfo = async (
  id: number,
  payload: Partial<Omit<LegalInfoItem, "id">> & { file?: File }
): Promise<void> => {
  const form = new FormData();
  if (payload.title) form.append("title", payload.title);
  if (payload.category) form.append("category", payload.category);
  if (payload.short_description !== undefined) form.append("short_description", payload.short_description || "");
  if (payload.tags !== undefined) form.append("tags", payload.tags || "");
  if (payload.status) form.append("status", payload.status);
  if (payload.file) form.append("file", payload.file);

  await api.put(`/legal-info/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteLegalInfo = async (id: number): Promise<void> => {
  await api.delete(`/legal-info/${id}`);
};

export const downloadLegalInfo = async (id: number): Promise<Blob> => {
  const res = await api.get(`/legal-info/${id}/download`, { responseType: "blob" });
  return res.data as Blob;
};

export const reindexLegalInfo = async (): Promise<
  { id: number; status: string; message?: string }[]
> => {
  const res = await api.post("/legal-info/reindex");
  return res.data.items || [];
};
