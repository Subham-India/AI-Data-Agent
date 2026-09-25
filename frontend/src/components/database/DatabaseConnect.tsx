type DatabaseConnectProps = {
  databaseUrl: string;
  onDatabaseUrlChange: (value: string) => void;
  onConnect: () => void | Promise<void>;
  isConnecting: boolean;
  status: string;
  error: string | null;
};

export default function DatabaseConnect({
  databaseUrl,
  onDatabaseUrlChange,
  onConnect,
  isConnecting,
  status,
  error,
}: DatabaseConnectProps) {
  return (
    <div style={{ maxWidth: 540, margin: '2rem auto', padding: 24, border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <h2 style={{ marginBottom: 16 }}>Database Connection</h2>

      <label htmlFor="database-url" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
        Database URL
      </label>

      <input
        id="database-url"
        type="text"
        value={databaseUrl}
        onChange={(event) => onDatabaseUrlChange(event.target.value)}
        placeholder="postgresql://user:password@host:5432/dbname"
        disabled={isConnecting}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          border: '1px solid #cbd5e1',
          borderRadius: 8,
          marginBottom: 16,
          fontSize: 14,
        }}
      />

      <button
        type="button"
        onClick={onConnect}
        disabled={isConnecting || !databaseUrl.trim()}
        style={{
          width: '100%',
          padding: '0.8rem 1rem',
          border: 'none',
          borderRadius: 8,
          background: isConnecting ? '#94a3b8' : '#2563eb',
          color: '#fff',
          fontWeight: 700,
          cursor: isConnecting ? 'not-allowed' : 'pointer',
        }}
      >
        {isConnecting ? 'Connecting...' : 'Connect Database'}
      </button>

      <div style={{ marginTop: 16, minHeight: 24 }}>
        {error ? (
          <p style={{ color: '#dc2626', margin: 0 }}>{error}</p>
        ) : (
          <p style={{ color: '#475569', margin: 0 }}>{status}</p>
        )}
      </div>
    </div>
  );
}
