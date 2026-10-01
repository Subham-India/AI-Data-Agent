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
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  ${
                    isUser
                      ? "max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3"
                      : "max-w-[90%] bg-gray-800/80 text-gray-100 rounded-2xl rounded-bl-md px-5 py-4"
                  }
                `}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap break-words text-sm leading-6">
                    {message.content}
                  </p>
                ) : (
                  <div
                    className="
                      text-sm leading-7
                      [&>p]:mb-4
                      [&>p:last-child]:mb-0

                      [&>h1]:text-2xl
                      [&>h1]:font-bold
                      [&>h1]:text-white
                      [&>h1]:mb-4
                      [&>h1]:mt-2

                      [&>h2]:text-xl
                      [&>h2]:font-semibold
                      [&>h2]:text-white
                      [&>h2]:mb-3
                      [&>h2]:mt-5

                      [&>h3]:text-lg
                      [&>h3]:font-semibold
                      [&>h3]:text-white
                      [&>h3]:mb-2
                      [&>h3]:mt-4

                      [&>ul]:list-disc
                      [&>ul]:pl-6
                      [&>ul]:mb-4
                      [&>ul]:space-y-1

                      [&>ol]:list-decimal
                      [&>ol]:pl-6
                      [&>ol]:mb-4
                      [&>ol]:space-y-1

                      [&_li]:pl-1

                      [&_strong]:font-semibold
                      [&_strong]:text-white

                      [&_em]:italic
                      [&_em]:text-gray-300

                      [&_a]:text-blue-400
                      [&_a]:underline
                      [&_a]:underline-offset-2

                      [&_code]:bg-gray-900
                      [&_code]:text-blue-300
                      [&_code]:px-1.5
                      [&_code]:py-0.5
                      [&_code]:rounded
                      [&_code]:text-[13px]

                      [&_pre]:bg-gray-700
                      [&_pre]:border
                      [&_pre]:border-gray-600
                      [&_pre]:rounded-xl
                      [&_pre]:p-4
                      [&_pre]:my-4
                      [&_pre]:overflow-x-auto

                      [&_pre_code]:bg-transparent
                      [&_pre_code]:p-0
                      [&_pre_code]:text-gray-100
                      [&_pre_code]:text-[13px]

                      [&_blockquote]:border-l-4
                      [&_blockquote]:border-gray-600
                      [&_blockquote]:pl-4
                      [&_blockquote]:text-gray-400
                      [&_blockquote]:italic
                      [&_blockquote]:my-4

                      [&_hr]:border-gray-700
                      [&_hr]:my-5

                      [&_table]:w-full
                      [&_table]:border-collapse
                      [&_table]:my-4
                      [&_table]:text-sm

                      [&_thead]:bg-gray-900

                      [&_th]:border
                      [&_th]:border-gray-700
                      [&_th]:px-3
                      [&_th]:py-2
                      [&_th]:text-left
                      [&_th]:font-semibold
                      [&_th]:text-white

                      [&_td]:border
                      [&_td]:border-gray-700
                      [&_td]:px-3
                      [&_td]:py-2
                      [&_td]:text-gray-300

                      [&_tr:nth-child(even)]:bg-gray-900/40
                    "
                  >
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
          <div className="flex justify-start">
            <div className="bg-gray-800/80 text-gray-400 px-5 py-3 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-2">
                <span>Thinking</span>

                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ChatMessages;