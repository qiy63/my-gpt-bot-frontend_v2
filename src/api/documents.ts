import api from "./axios";
import { DEMO_MODE } from "../config/demo";

export type DocumentItem = {
  id: number;
  category_id: number;
  title: string;
  short_description?: string | null;
  prerequisites?: string | null;
  required_docs?: string | null;
  placeholder_url?: string | null;
  file_url?: string | null;
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
  if (DEMO_MODE) {
    return [
      {
        id: 1,
        name: "Tenancy",
        description: "Rental and tenancy-related documents",
        documents: [
          {
            id: 101,
            category_id: 1,
            title: "Tenancy Agreement Checklist",
            short_description: "Key terms and clauses to review before signing.",
            prerequisites: "Valid tenancy draft\nLandlord/tenant details",
            required_docs: "IC/passport copies\nUtility receipts",
            placeholder_url: "https://example.com/tenancy.pdf",
          },
        ],
      },
    ];
  }
  const res = await api.get("/documents");
  return res.data.categories || [];
};

export const createDocument = async (form: FormData) => {
  const res = await api.post("/documents", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateDocument = async (id: number, form: FormData) => {
  const res = await api.put(`/documents/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteDocument = async (id: number) => {
  const res = await api.delete(`/documents/${id}`);
  return res.data;
};

export const getDocumentDownloadUrl = (id: number) =>
  `${api.defaults.baseURL?.replace(/\/$/, "")}/documents/${id}/download`;

export const downloadDocument = async (id: number): Promise<Blob> => {
  const res = await api.get(`/documents/${id}/download`, {
    responseType: "blob",
  });
  return res.data as Blob;
};
