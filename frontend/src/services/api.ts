import type { DatabaseConnectionRequest, DatabaseConnectionResponse } from '../types/database';
import type { ChatResponse } from '../types/chat';

const API_URL = import.meta.env.VITE_API_URL;

export async function connectDatabase(databaseUrl: string): Promise<DatabaseConnectionResponse> {
  const requestBody: DatabaseConnectionRequest = {
    database_url: databaseUrl,
  };

  const response = await fetch(`${API_URL}/database/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Database connect failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as DatabaseConnectionResponse;
  return data;
}

export async function sendMessage(databaseId: string, message: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      database_id: databaseId,
      message,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Chat API failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as ChatResponse & { detail?: string };

  return {
    answer: data.answer || '',
    sql_query: data.sql_query || '',
    query_result: data.query_result || '',
  };
}
