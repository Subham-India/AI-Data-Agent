import uuid

from app.database.connection import (
    create_database_engine,
    test_database_connection,
)


# Temporary in-memory storage.
# We will replace this with a proper storage system later.
_database_connections = {}


def connect_database(database_url: str) -> str:
    """
    Test the database connection and store the engine.

    Returns a unique database ID.
    """

    connected = test_database_connection(database_url)

    if not connected:
        raise ValueError("Could not connect to database")

    database_id = str(uuid.uuid4())

    engine = create_database_engine(database_url)

    _database_connections[database_id] = engine

    return database_id


def get_database_engine(database_id: str):
    """
    Get a database engine using its database ID.
    """

    engine = _database_connections.get(database_id)

    if engine is None:
        raise ValueError("Database connection not found")

    return engine