import { useMemo, useState } from 'react'

import { ChatHeader } from './components/ChatHeader'
import { ChatInput } from './components/ChatInput'
import { ChatMessages } from './components/ChatMessages'
import { Sidebar } from './components/Sidebar'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function App() {
  const [databaseUrl, setDatabaseUrl] = useState('')
  const [databaseId, setDatabaseId] = useState('')
  const [status, setStatus] = useState('Ready to connect.')
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Ask a question about your database and I will translate it into SQL for you.',
    },
  ])

  const isReady = useMemo(() => Boolean(databaseId), [databaseId])

  const handleConnect = async () => {
    if (!databaseUrl.trim()) {
      setStatus('Please enter a database URL.')
      return
    }

    try {
      setStatus('Connecting to database...')
      const response = await fetch('/database/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ database_url: databaseUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Connection failed')
      }

      const match = (data.message || '').match(/Database ID:\s*([^\s]+)/i)
      const nextDatabaseId = match ? match[1] : ''

      if (nextDatabaseId) {
        setDatabaseId(nextDatabaseId)
      }

      setStatus(data.message || 'Connected successfully.')
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Database connected successfully. You can now ask questions.',
        },
      ])
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not connect to database.'
      setStatus(message)
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Connection error: ${message}`,
        },
      ])
    }
  }

  const handleSend = async () => {
    const trimmed = messageText.trim()

    if (!trimmed) {
      setStatus('Please enter a question.')
      return
    }

    if (!isReady) {
      setStatus('Connect a database before asking questions.')
      return
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    }

    setMessages((previous) => [...previous, userMessage])
    setMessageText('')
    setStatus('Running the SQL agent...')

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ database_id: databaseId, message: trimmed }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Request failed')
      }

      const answer = data.answer || 'No answer returned.'
      const sqlQuery = data.sql_query ? `SQL:\n${data.sql_query}` : ''
      const queryResult = data.query_result ? `\n\nResult:\n${data.query_result}` : ''

      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `${answer}${sqlQuery}${queryResult}`,
        },
      ])
      setStatus('Query completed successfully.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The agent failed to answer.'
      setStatus(message)
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Error: ${message}`,
        },
      ])
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 p-6">
        <div className="w-full max-w-sm">
          <Sidebar
            databaseUrl={databaseUrl}
            onDatabaseUrlChange={setDatabaseUrl}
            onConnect={handleConnect}
            status={status}
            databaseId={databaseId}
            onDatabaseIdChange={setDatabaseId}
          />
        </div>

        <main className="flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/30">
          <ChatHeader />
          <ChatMessages messages={messages} />
          <ChatInput value={messageText} onChange={setMessageText} onSend={handleSend} />
        </main>
      </div>
    </div>
  )
}

export default App