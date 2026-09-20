from sqlalchemy import text


def execute_query(engine, sql_query: str):
    with engine.connect() as connection:
        result = connection.execute(text(sql_query))

        rows = result.fetchall()
        columns = result.keys()

        return [
            dict(zip(columns, row))
            for row in rows
        ]