type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type ChatMessagesProps = {
  messages: ChatMessage[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-5">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-7 ${
            message.role === 'user'
              ? 'ml-auto border-cyan-500/30 bg-cyan-500/10 text-cyan-50'
              : 'border-slate-700 bg-slate-800/80 text-slate-100'
          }`}
        >
          <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
            {message.role === 'user' ? 'You' : 'Agent'}
          </div>
          <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
        </div>
      ))}
    </div>
  )
}
