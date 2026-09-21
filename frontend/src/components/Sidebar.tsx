import { DatabaseConnect } from './DatabaseConnect'

type SidebarProps = {
  databaseUrl: string
  onDatabaseUrlChange: (value: string) => void
  onConnect: () => void
  status: string
  databaseId: string
  onDatabaseIdChange: (value: string) => void
}

export function Sidebar({
  databaseUrl,
  onDatabaseUrlChange,
  onConnect,
  status,
  databaseId,
  onDatabaseIdChange,
}: SidebarProps) {
  return (
    <aside className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/30">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Database</h2>
      </div>

      <DatabaseConnect
        databaseUrl={databaseUrl}
        onDatabaseUrlChange={onDatabaseUrlChange}
        onConnect={onConnect}
        status={status}
      />

      <div className="mt-6">
        <label htmlFor="database-id" className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">
          Database ID
        </label>
        <input
          id="database-id"
          value={databaseId}
          onChange={(event) => onDatabaseIdChange(event.target.value)}
          placeholder="Connected database ID"
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-500"
        />
      </div>
    </aside>
  )
}
