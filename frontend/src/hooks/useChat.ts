import { useCallback, useState } from 'react';

import { sendMessage as sendChatMessage } from '../services/api';
import type { ChatMessage } from '../types/chat';

export default function useChat(databaseId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmed = message.trim();

      if (!trimmed) {
        return;
      }

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
      };

      setMessages((previous) => [...previous, userMessage]);
      setLoading(true);

      try {
        const response = await sendChatMessage(databaseId, trimmed);

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.answer || 'No response returned.',
        };

        setMessages((previous) => [...previous, assistantMessage]);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        setMessages((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `Sorry, I couldn't process that request. ${errorMessage}`,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [databaseId],
  );

  return {
    messages,
    loading,
    sendMessage,
    clearChat,
  };
}
