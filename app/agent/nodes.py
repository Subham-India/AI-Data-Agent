from langchain_google_genai import ChatGoogleGenerativeAI

from app.agent.state import AgentState
from app.agent.prompts import (
    SQL_GENERATION_PROMPT,
    ANSWER_PROMPT,
)
from app.agent.tools import execute_sql
from app.config import settings


llm = ChatGoogleGenerativeAI(
    model=settings.model_name,
    google_api_key=settings.gemini_api_key,
)


def _extract_text(value):
    if value is None:
        return ""

    if isinstance(value, str):
        return value

    if isinstance(value, list):
        parts = []

        for item in value:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict):
                text = item.get("text")
                if text:
                    parts.append(str(text))
                elif "parts" in item:
                    parts.extend(
                        _extract_text(item["parts"]).splitlines()
                    )
            elif hasattr(item, "text"):
                parts.append(str(item.text))

        return "\n".join(part for part in parts if part)

    if hasattr(value, "text"):
        return str(value.text)

    return str(value)


def generate_sql(state: AgentState):
    messages = state["messages"]

    question = messages[-1].content

    previous_messages = messages[:-1]

    prompt = SQL_GENERATION_PROMPT.format(
        schema=state["schema"],
        question=question,
        messages=previous_messages,
    )

    response = llm.invoke(prompt)
    sql_query = _extract_text(response.content).strip()

    return {
        "sql_query": sql_query
    }


def validate_sql(state: AgentState):
    sql_query = str(state["sql_query"]).strip().upper()

    forbidden_keywords = [
        "INSERT",
        "UPDATE",
        "DELETE",
        "DROP",
        "ALTER",
        "TRUNCATE",
        "CREATE",
    ]

    for keyword in forbidden_keywords:
        if sql_query.startswith(keyword):
            raise ValueError(
                f"Unsafe SQL query detected: {keyword}"
            )

    if not (
        sql_query.startswith("SELECT")
        or sql_query.startswith("WITH")
    ):
        raise ValueError("Only SELECT queries are allowed")

    return {}


def run_sql(state: AgentState):
    result = execute_sql(
        state["database_id"],
        state["sql_query"],
    )

    return {
        "query_result": str(result)
    }


def generate_answer(state: AgentState):
    messages = state["messages"]

    question = messages[-1].content

    prompt = ANSWER_PROMPT.format(
        question=question,
        sql_query=state["sql_query"],
        query_result=state["query_result"],
    )

    response = llm.invoke(prompt)
    answer = _extract_text(response.content).strip()

    return {
        "answer": answer
    }