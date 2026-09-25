import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../types/chat";

interface ChatMessagesProps {
  messages: ChatMessage[];
  loading: boolean;
}

function ChatMessages({
  messages,
  loading,
}: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white">
            Ask your database anything
          </h2>

          <p className="text-gray-400 mt-2">
            Ask questions about your customers, orders,
            products, and more.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-4xl mx-auto">

        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex mb-6 ${
                isUser
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl px-4 py-3 rounded-2xl ${
                  isUser
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">
                    {message.content}
                  </p>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start mb-6">
            <div className="bg-gray-800 text-gray-400 px-4 py-3 rounded-2xl">
              Thinking...
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ChatMessages;