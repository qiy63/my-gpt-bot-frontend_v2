import api from "./axios";

export type ChatConversation = {
  id: number;
  title?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

export const askQuestion = async (question: string) => {
  const res = await api.post("/ask", { question });
  return res.data;
};

export const fetchConversations = async (): Promise<ChatConversation[]> => {
  const res = await api.get("/chat/conversations");
  return res.data.items || [];
};

export const createConversation = async (title?: string): Promise<ChatConversation> => {
  const res = await api.post("/chat/conversations", { title });
  return res.data;
};

export const fetchMessages = async (conversationId: number): Promise<ChatMessage[]> => {
  const res = await api.get(`/chat/conversations/${conversationId}/messages`);
  return res.data.items || [];
};

export const addMessage = async (
  conversationId: number,
  role: "user" | "assistant",
  content: string
): Promise<{ id: number }> => {
  const res = await api.post(`/chat/conversations/${conversationId}/messages`, {
    role,
    content,
  });
  return res.data;
};
