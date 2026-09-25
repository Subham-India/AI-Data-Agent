import time
import traceback

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
    total_start = time.perf_counter()

    print("\n================ CHAT STARTED ================")

    try:
        # -----------------------------------
        # 1. Get database engine
        # -----------------------------------
        engine_start = time.perf_counter()

        engine = get_database_engine(request.database_id)

        print(
            f"CHAT: database engine found in "
            f"{time.perf_counter() - engine_start:.2f}s"
        )

        if engine is None:
            raise HTTPException(
                status_code=404,
                detail="Database connection not found",
            )

        # -----------------------------------
        # 2. Get database schema
        # -----------------------------------
        schema_start = time.perf_counter()

        print("CHAT: schema retrieval started")

        schema = get_database_schema(engine)

        print(
            f"CHAT: schema retrieval finished in "
            f"{time.perf_counter() - schema_start:.2f}s"
        )

        # -----------------------------------
        # 3. Create initial agent state
        # -----------------------------------
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

        # -----------------------------------
        # 4. Run LangGraph
        # -----------------------------------
        invoke_start = time.perf_counter()

        print("CHAT: LangGraph invocation started")

        result = sql_agent.invoke(initial_state)

        print(
            f"CHAT: LangGraph invocation finished in "
            f"{time.perf_counter() - invoke_start:.2f}s"
        )

        # -----------------------------------
        # 5. Return response
        # -----------------------------------
        print(
            f"CHAT: total execution time "
            f"{time.perf_counter() - total_start:.2f}s"
        )

        print("================ CHAT SUCCESS ================\n")

        return ChatResponse(
            answer=result["answer"],
            sql_query=result["sql_query"],
            query_result=result["query_result"],
        )

    except HTTPException:
        raise

    except Exception as e:

        # -----------------------------------
        # Print the REAL error
        # -----------------------------------
        print("\n")
        print("========== CHAT ERROR ==========")
        print("ERROR TYPE:", type(e).__name__)
        print("ERROR:", str(e))
        print("TRACEBACK:")
        traceback.print_exc()
        print("================================")
        print(
            f"TOTAL TIME BEFORE ERROR: "
            f"{time.perf_counter() - total_start:.2f}s"
        )
        print("\n")

        # Return the original error to frontend
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )