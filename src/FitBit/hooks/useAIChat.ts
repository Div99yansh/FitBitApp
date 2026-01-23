import { useState, useCallback } from "react";
import { apiCall } from "../api";
import type { ChatMessage, DailySummary, ChatAskResponse } from "../types";

interface UseAIChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (
    question: string,
    userId: string,
    date: string,
    dailySummary: DailySummary
  ) => Promise<void>;
  clearMessages: () => void;
}

export const useAIChat = (token: string | null): UseAIChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (
      question: string,
      userId: string,
      date: string,
      dailySummary: DailySummary
    ) => {
      // Add user message immediately
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setIsLoading(true);
      setError(null);

      try {
        const response: ChatAskResponse = await apiCall(
          "/chat/ask",
          {
            method: "POST",
            body: JSON.stringify({
              userId,
              date,
              dailySummary,
              question,
            }),
          },
          token
        );

        // Add AI response
        const aiMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.answer,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get response";
        setError(errorMessage);

        // Add error message to chat
        const errorChatMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorChatMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
};
