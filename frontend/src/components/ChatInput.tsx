type ChatInputProps = {
  value: string
  onChange: (value: string) => void
  onSend: () => void
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  return (
    <div className="border-t border-slate-800 bg-slate-900/80 p-4">
      <div className="flex gap-3">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSend()
            }
          }}
          placeholder="Type your question..."
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-500"
        />
        <button
          type="button"
          onClick={onSend}
          className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Send
        </button>
      </div>
    </div>
  )
}
