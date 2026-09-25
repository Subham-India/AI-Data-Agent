import { useState } from 'react';

import DatabasePage from './pages/DatabasePage';
import ChatPage from './pages/ChatPage';

function App() {
  const [databaseId, setDatabaseId] = useState<string | null>(null);

  if (databaseId === null) {
    return <DatabasePage onDatabaseConnected={setDatabaseId} />;
  }

  return <ChatPage databaseId={databaseId} />;
}

export default App;