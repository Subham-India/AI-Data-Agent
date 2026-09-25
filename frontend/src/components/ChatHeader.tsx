type ChatHeaderProps = {
  title?: string;
};

export function ChatHeader({ title = 'SQL Agent' }: ChatHeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 px-5 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Assistant</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-100">{title}</h1>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Database connected
        </div>
      </div>
    </header>
  );
}
