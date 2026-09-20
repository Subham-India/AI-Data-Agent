from pydantic import BaseModel, Field


class DatabaseConnectionRequest(BaseModel):
    database_url: str = Field(
        ...,
        description="SQLAlchemy database connection URL"
    )


class DatabaseConnectionResponse(BaseModel):
    success: bool
    message: str