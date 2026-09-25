import time

from langchain_groq import ChatGroq

from app.agent.state import AgentState
from app.agent.prompts import (
    SQL_GENERATION_PROMPT,
    ANSWER_PROMPT,
)
from app.agent.tools import execute_sql
from app.config import settings


def create_llm():
    print("LLM: creating ChatGroq")
    print("LLM: model =", settings.model_name)
    print("LLM: API key exists =", bool(settings.groq_api_key))
    print(
        "LLM: API key length =",
        len(settings.groq_api_key) if settings.groq_api_key else 0,
    )

    return ChatGroq(
        model=settings.model_name,
        groq_api_key=settings.groq_api_key,
        max_retries=0,
        timeout=30,
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

        return "\n".join(
            part for part in parts if part
        )

    if hasattr(value, "text"):
        return str(value.text)

    return str(value)


def generate_sql(state: AgentState):

    print("\n========== GENERATE SQL ==========")

    messages = state["messages"]

    question = messages[-1].content
    previous_messages = messages[:-1]

    prompt = SQL_GENERATION_PROMPT.format(
        schema=state["schema"],
        question=question,
        messages=previous_messages,
    )

    print("NODE: SQL prompt created")

    llm = create_llm()

    print("NODE: Groq SQL request started")

    start = time.perf_counter()

    try:
        response = llm.invoke(prompt)

    except Exception as e:
        print("!!! SQL GROQ ERROR !!!")
        print("TYPE:", type(e).__name__)
        print("ERROR:", str(e))
        raise

    print(
        "NODE: Groq SQL request finished in",
        f"{time.perf_counter() - start:.2f}s",
    )

    sql_query = _extract_text(
        response.content
    ).strip()

    print("SQL QUERY:", sql_query)

    print("========== GENERATE SQL END ==========\n")

    return {
        "sql_query": sql_query
    }


def validate_sql(state: AgentState):

    print("\n========== VALIDATE SQL ==========")

    sql_query = str(
        state["sql_query"]
    ).strip().upper()

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
        raise ValueError(
            "Only SELECT queries are allowed"
        )

    print("SQL validation successful")
    print("========== VALIDATE SQL END ==========\n")

    return {}


def run_sql(state: AgentState):

    print("\n========== RUN SQL ==========")

    start = time.perf_counter()

    result = execute_sql(
        state["database_id"],
        state["sql_query"],
    )

    print(
        "SQL execution finished in",
        f"{time.perf_counter() - start:.2f}s",
    )

    print("RESULT:", result)

    print("========== RUN SQL END ==========\n")

    return {
        "query_result": str(result)
    }


def generate_answer(state: AgentState):

    print("\n========== GENERATE ANSWER ==========")

    messages = state["messages"]

    question = messages[-1].content

    prompt = ANSWER_PROMPT.format(
        question=question,
        sql_query=state["sql_query"],
        query_result=state["query_result"],
    )

    print("NODE: Answer prompt created")

    llm = create_llm()

    print("NODE: Groq answer request started")

    start = time.perf_counter()

    try:
        response = llm.invoke(prompt)

    except Exception as e:
        print("!!! ANSWER GROQ ERROR !!!")
        print("TYPE:", type(e).__name__)
        print("ERROR:", str(e))
        raise

    print(
        "NODE: Groq answer request finished in",
        f"{time.perf_counter() - start:.2f}s",
    )

    answer = _extract_text(
        response.content
    ).strip()

    print("ANSWER:", answer)

    print("========== GENERATE ANSWER END ==========\n")

    return {
        "answer": answer
    }