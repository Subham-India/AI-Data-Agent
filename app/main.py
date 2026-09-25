from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.database import router as database_router
from app.api.chat import router as chat_router


app = FastAPI(
    title=settings.app_name
)


print("========== STARTUP CONFIG ==========")
print("MODEL:", settings.model_name)
print("GROQ KEY EXISTS:", bool(settings.groq_api_key))
print(
    "GROQ KEY LENGTH:",
    len(settings.groq_api_key) if settings.groq_api_key else 0
)
print("====================================")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "SQL Agent API is running"
    }


@app.get("/test-groq")
def test_groq():
    from langchain_groq import ChatGroq

    print("TEST-GROQ: started")

    llm = ChatGroq(
        model=settings.model_name,
        groq_api_key=settings.groq_api_key,
        max_retries=0,
        timeout=30,
    )

    response = llm.invoke("Say hello")

    print("TEST-GROQ: successful")

    return {
        "message": response.content
    }


app.include_router(database_router)
app.include_router(chat_router)