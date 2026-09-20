from fastapi import APIRouter, HTTPException

from app.models.database import (
    DatabaseConnectionRequest,
    DatabaseConnectionResponse,
)

from app.services.database_service import (
    connect_database,
    get_database_engine,
)

from app.database.schema import get_database_schema


router = APIRouter(
    prefix="/database",
    tags=["Database"],
)


@router.post(
    "/connect",
    response_model=DatabaseConnectionResponse,
)
def connect(request: DatabaseConnectionRequest):

    try:
        database_id = connect_database(
            request.database_url
        )

        return DatabaseConnectionResponse(
            success=True,
            message=f"Database connected successfully. "
                    f"Database ID: {database_id}",
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.get("/{database_id}/schema")
def get_schema(database_id: str):

    try:
        engine = get_database_engine(
            database_id
        )

        schema = get_database_schema(
            engine
        )

        return {
            "success": True,
            "database_id": database_id,
            "schema": schema,
        }

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error),
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve database schema: {error}",
        )