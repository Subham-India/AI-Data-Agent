from fastapi import APIRouter, HTTPException

from app.agent.graph import sql_agent
from app.agent.state import AgentState
from app.models.chat import ChatRequest, ChatResponse
from app.services.database_service import get_database_engine
from app.database.schema import get_database_schema


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest):

    try:
        # Get the database engine using database_id
        engine = get_database_engine(request.database_id)

        if engine is None:
            raise HTTPException(
                status_code=404,
                detail="Database connection not found",
            )

        # Get schema using the engine
        schema = get_database_schema(engine)

        # Initial LangGraph state
        initial_state: AgentState = {
            "database_id": request.database_id,
            "schema": schema,
            "messages": [
                {
                    "role": "user",
                    "content": request.message,
                }
            ],
            "sql_query": "",
            "query_result": "",
            "answer": "",
        }

        # Run SQL Agent
        result = sql_agent.invoke(initial_state)

        return ChatResponse(
            answer=result["answer"],
            sql_query=result["sql_query"],
            query_result=result["query_result"],
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )