from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine


def create_database_engine(database_url: str) -> Engine:
    """
    Create a SQLAlchemy engine for a database.
    """

    engine = create_engine(
        database_url,
        pool_pre_ping=True,
    )

    return engine


def test_database_connection(database_url: str) -> bool:
    """
    Test whether the database connection works.
    """

    engine = None

    try:
        engine = create_database_engine(database_url)

        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return True

    except Exception:
        return False

    finally:
        if engine is not None:
            engine.dispose()