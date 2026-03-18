import api from "./axios";
import { DEMO_MODE } from "../config/demo";

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
  if (DEMO_MODE) {
    return {
      answer:
        "This is a demo response. In production, the assistant will provide detailed property law guidance.",
    };
  }
  const res = await api.post("/ask", { question });
  return res.data;
};

export const fetchConversations = async (): Promise<ChatConversation[]> => {
  if (DEMO_MODE) {
    const stored = localStorage.getItem("demo_conversations");
    return stored ? JSON.parse(stored) : [];
  }
  const res = await api.get("/chat/conversations");
  return res.data.items || [];
};

export const createConversation = async (title?: string): Promise<ChatConversation> => {
  if (DEMO_MODE) {
    const item = { id: Date.now(), title: title || "New Chat" };
    const stored = await fetchConversations();
    const next = [item, ...stored];
    localStorage.setItem("demo_conversations", JSON.stringify(next));
    return item;
  }
  const res = await api.post("/chat/conversations", { title });
  return res.data;
};

export const fetchMessages = async (conversationId: number): Promise<ChatMessage[]> => {
  if (DEMO_MODE) {
    const stored = localStorage.getItem(`demo_messages_${conversationId}`);
    return stored ? JSON.parse(stored) : [];
  }
  const res = await api.get(`/chat/conversations/${conversationId}/messages`);
  return res.data.items || [];
};

export const addMessage = async (
  conversationId: number,
  role: "user" | "assistant",
  content: string
): Promise<{ id: number }> => {
  if (DEMO_MODE) {
    const existing = await fetchMessages(conversationId);
    const next = [
      ...existing,
      { id: Date.now(), role, content, created_at: new Date().toISOString() },
    ];
    localStorage.setItem(`demo_messages_${conversationId}`, JSON.stringify(next));
    return { id: Date.now() };
  }
  const res = await api.post(`/chat/conversations/${conversationId}/messages`, {
    role,
    content,
  });
  return res.data;
};
