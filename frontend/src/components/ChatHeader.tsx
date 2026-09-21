type ChatHeaderProps = {
  title?: string
}

export function ChatHeader({ title = 'SQL Agent Chat' }: ChatHeaderProps) {
  return (
    <header className="border-b border-slate-800 px-5 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Assistant</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-100">{title}</h1>
        </div>
      </div>
    </header>
  )
}
