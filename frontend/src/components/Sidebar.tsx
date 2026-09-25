type SidebarProps = {
  onNewChat: () => void;
};

export function Sidebar({ onNewChat }: SidebarProps) {
  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-900/80 p-4">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-sm font-bold text-cyan-300">
          SQL
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">SQL Agent</h2>
        </div>
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-left text-sm font-medium text-slate-100 transition hover:border-cyan-500/40 hover:bg-slate-800/90"
      >
        New Chat
      </button>
    </aside>
  );
}
