type DatabaseConnectProps = {
  databaseUrl: string
  onDatabaseUrlChange: (value: string) => void
  onConnect: () => void
  status: string
}

export function DatabaseConnect({
  databaseUrl,
  onDatabaseUrlChange,
  onConnect,
  status,
}: DatabaseConnectProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="database-url" className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
          Database URL
        </label>
        <input
          id="database-url"
          value={databaseUrl}
          onChange={(event) => onDatabaseUrlChange(event.target.value)}
          placeholder="postgresql://user:pass@host:5432/dbname"
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-500"
        />
      </div>

      <button
        type="button"
        onClick={onConnect}
        className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        Connect database
      </button>

      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-sm text-emerald-100">
        {status}
      </div>
    </div>
  )
}
