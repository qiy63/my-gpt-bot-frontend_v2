import { useEffect, useState } from "react";
import {
  askQuestion,
  fetchConversations,
  createConversation,
  fetchMessages,
  addMessage,
  type ChatConversation,
  type ChatMessage,
} from "../api/chat";

export interface Message {
  id: number;
  type: "user" | "assistant";
  content: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

  const loadConversations = async () => {
    const data = await fetchConversations();
    setConversations(data);
  };

  useEffect(() => {
    loadConversations().catch((err) => console.error("Load conversations error:", err));
  }, []);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }
    fetchMessages(activeConversationId)
      .then((items: ChatMessage[]) => {
        setMessages(
          items.map((m) => ({
            id: m.id,
            type: m.role,
            content: m.content,
          }))
        );
      })
      .catch((err) => console.error("Load messages error:", err));
  }, [activeConversationId]);

  const sendMessage = async (content: string) => {
    let conversationId = activeConversationId;
    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content,
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      if (!conversationId) {
        const title = content.trim().split(/\s+/).slice(0, 8).join(" ");
        const created = await createConversation(title);
        conversationId = created.id;
        setActiveConversationId(created.id);
        await loadConversations();
      }

      await addMessage(conversationId, "user", content);

      const res = await askQuestion(content);

      const assistantMessage: Message = {
        id: Date.now() + 1,
        type: "assistant",
        content: res.answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await addMessage(conversationId, "assistant", res.answer);
      await loadConversations();
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage: Message = {
        id: Date.now() + 2,
        type: "assistant",
        content: "Error: Could not fetch response.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    loading,
    conversations,
    activeConversationId,
    setActiveConversationId,
    reloadConversations: loadConversations,
    startNewChat: () => setActiveConversationId(null),
  };
};
