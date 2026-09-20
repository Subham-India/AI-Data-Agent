from app.database.executor import execute_query
from app.services.database_service import get_database_engine


def execute_sql(database_id: str, sql_query: str):
    engine = get_database_engine(database_id)

    if engine is None:
        raise ValueError("Database connection not found")

    return execute_query(engine, sql_query)