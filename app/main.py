from fastapi import FastAPI

from app.config import settings
from app.api.database import router as database_router
from app.api.chat import router as chat_router


app = FastAPI(
    title=settings.app_name
)


app.include_router(database_router)
app.include_router(chat_router)


@app.get("/")
def root():
    return {
        "message": "SQL Agent API is running"
    }