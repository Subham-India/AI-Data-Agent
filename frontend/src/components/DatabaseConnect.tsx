import { useState } from 'react';

import { connectDatabase } from '../services/api';

type DatabaseConnectProps = {
  databaseUrl: string;
  onDatabaseUrlChange: (value: string) => void;
  onDatabaseConnected: (databaseId: string) => void;
};

export function DatabaseConnect({
  databaseUrl,
  onDatabaseUrlChange,
  onDatabaseConnected,
}: DatabaseConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Ready to connect.');

  const handleConnect = async () => {
    if (!databaseUrl.trim()) {
      setError('Please enter a database URL.');
      setStatus('Please enter a database URL.');
      return;
    }

    setIsConnecting(true);
    setError(null);
    setStatus('Connecting to database...');

    try {
      const response = await connectDatabase(databaseUrl.trim());

      if (!response.success || !response.database_id) {
        throw new Error(response.message || 'Database connection failed.');
      }

      onDatabaseConnected(response.database_id);
      setStatus(response.message || 'Database connected successfully.');
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Could not connect to database.';
      setError(message);
      setStatus(message);
    } finally {
      setIsConnecting(false);
    }
  };

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
          disabled={isConnecting}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <button
        type="button"
        onClick={handleConnect}
        disabled={isConnecting || !databaseUrl.trim()}
        className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-cyan-700"
      >
        {isConnecting ? 'Connecting...' : 'Connect database'}
      </button>

      <div
        className={`rounded-xl border px-3 py-3 text-sm ${
          error ? 'border-red-500/30 bg-red-500/10 text-red-100' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
        }`}
      >
        {status}
      </div>
    </div>
  );
}
