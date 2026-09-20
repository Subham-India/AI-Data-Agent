from sqlalchemy import inspect
from sqlalchemy.engine import Engine


def get_database_schema(engine: Engine) -> str:
    """
    Inspect the database and return a readable schema description.
    """

    inspector = inspect(engine)

    schema_parts = []

    tables = inspector.get_table_names()

    for table_name in tables:
        schema_parts.append(f"Table: {table_name}")

        columns = inspector.get_columns(table_name)

        for column in columns:
            column_name = column["name"]
            column_type = column["type"]

            schema_parts.append(
                f"  - {column_name}: {column_type}"
            )

        primary_key = inspector.get_pk_constraint(table_name)

        primary_key_columns = primary_key.get("constrained_columns", [])

        if primary_key_columns:
            schema_parts.append(
                f"  Primary Key: {', '.join(primary_key_columns)}"
            )

        foreign_keys = inspector.get_foreign_keys(table_name)

        for foreign_key in foreign_keys:
            constrained_columns = foreign_key.get(
                "constrained_columns", []
            )

            referred_table = foreign_key.get(
                "referred_table"
            )

            referred_columns = foreign_key.get(
                "referred_columns", []
            )

            if constrained_columns and referred_table:
                schema_parts.append(
                    f"  Foreign Key: "
                    f"{', '.join(constrained_columns)} "
                    f"-> "
                    f"{referred_table}"
                    f"({', '.join(referred_columns)})"
                )

        schema_parts.append("")

    return "\n".join(schema_parts)