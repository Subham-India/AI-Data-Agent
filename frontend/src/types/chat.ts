export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

export interface ChatResponse {
  answer: string;
  sql_query: string;
  query_result: string;
}
