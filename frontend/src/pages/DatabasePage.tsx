import { useState } from 'react';

import { DatabaseConnect } from '../components/DatabaseConnect';

type DatabasePageProps = {
  onDatabaseConnected: (databaseId: string) => void;
};

export default function DatabasePage({ onDatabaseConnected }: DatabasePageProps) {
  const [databaseUrl, setDatabaseUrl] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/30">
        <h1 className="mb-6 text-2xl font-semibold">Connect Database</h1>
        <DatabaseConnect
          databaseUrl={databaseUrl}
          onDatabaseUrlChange={setDatabaseUrl}
          onDatabaseConnected={onDatabaseConnected}
        />
      </div>
    </div>
  );
}
