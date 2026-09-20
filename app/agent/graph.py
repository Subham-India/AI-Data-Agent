from langgraph.graph import StateGraph, START, END

from app.agent.state import AgentState
from app.agent.nodes import (
    generate_sql,
    validate_sql,
    run_sql,
    generate_answer,
)


def build_graph():
    graph = StateGraph(AgentState)

    # Add nodes
    graph.add_node("generate_sql", generate_sql)
    graph.add_node("validate_sql", validate_sql)
    graph.add_node("run_sql", run_sql)
    graph.add_node("generate_answer", generate_answer)

    # Add edges
    graph.add_edge(START, "generate_sql")
    graph.add_edge("generate_sql", "validate_sql")
    graph.add_edge("validate_sql", "run_sql")
    graph.add_edge("run_sql", "generate_answer")
    graph.add_edge("generate_answer", END)

    return graph.compile()


sql_agent = build_graph()