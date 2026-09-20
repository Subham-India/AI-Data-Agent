from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    database_id: str
    schema: str

    messages: Annotated[list, add_messages]

    sql_query: str
    query_result: str
    answer: str