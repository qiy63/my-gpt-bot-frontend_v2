import api from "./axios";

export type DocumentItem = {
  id: number;
  category_id: number;
  title: string;
  short_description?: string | null;
  prerequisites?: string | null;
  required_docs?: string | null;
  placeholder_url?: string | null;
  filename?: string | null;
  created_at?: string;
};

export type DocumentCategory = {
  id: number;
  name: string;
  description?: string | null;
  sort_order?: number | null;
  documents: DocumentItem[];
};

export const fetchDocuments = async (): Promise<DocumentCategory[]> => {
  const res = await api.get("/documents");
  return res.data.categories || [];
};

export const getDocumentDownloadUrl = (id: number) =>
  `${api.defaults.baseURL?.replace(/\/$/, "")}/documents/${id}/download`;

export const downloadDocument = async (id: number): Promise<Blob> => {
  const res = await api.get(`/documents/${id}/download`, {
    responseType: "blob",
  });
  return res.data as Blob;
};
