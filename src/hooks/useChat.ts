import { useState } from "react";
import axios from "../api/axios";

export interface Message {
  id: number;
  type: "user" | "assistant";
  content: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content,
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await axios.post(
        "/ask",
        { question: content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const assistantMessage: Message = {
        id: userMessage.id + 1,
        type: "assistant",
        content: res.data.answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage: Message = {
        id: messages.length + 2,
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
  };
};