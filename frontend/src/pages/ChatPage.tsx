import { useState } from 'react';

import { ChatHeader } from '../components/ChatHeader';
import { ChatInput } from '../components/ChatInput';
import ChatMessages from '../components/ChatMessages';
import { Sidebar } from '../components/Sidebar';
import useChat from '../hooks/useChat';

type ChatPageProps = {
  databaseId: string;
};

export default function ChatPage({ databaseId }: ChatPageProps) {
  const { messages, loading, sendMessage, clearChat } = useChat(databaseId);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    const trimmed = input.trim();

    if (!trimmed || loading) {
      return;
    }

    setInput('');
    await sendMessage(trimmed);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar onNewChat={clearChat} />

      <main className="flex min-w-0 flex-1 flex-col">
        <ChatHeader />
        <ChatMessages messages={messages} loading={loading} />
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          loading={loading}
        />
      </main>
    </div>
  );
}
