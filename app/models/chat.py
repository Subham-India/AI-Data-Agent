from pydantic import BaseModel


class ChatRequest(BaseModel):
    database_id: str
    message: str


class ChatResponse(BaseModel):
    answer: str
    sql_query: str
    query_result: str