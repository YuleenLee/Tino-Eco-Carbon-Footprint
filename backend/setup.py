import asyncio
import asqlite

async def main():
    async with asqlite.connect('website.db') as conn:
        async with conn.cursor() as cursor:
            await cursor.execute("""
            CREATE TABLE "users" (
                "username" TEXT,
                "password" TEXT,
                PRIMARY KEY("username")
            )
            """)
            await cursor.execute("""
            CREATE TABLE "task_info" (
                "task_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                "limit" INTEGER,
                "points" INTEGER
            )
            """)
            await cursor.execute("""
            CREATE TABLE "reviewed_tasks" (
                "task_id" INTEGER,
                "username" TEXT,
                "count" INTEGER,
                FOREIGN KEY("task_id") REFERENCES "task_info"("task_id") ON DELETE CASCADE,
                FOREIGN KEY("username") REFERENCES "users"("username") ON DELETE CASCADE
            )
            """)
            await cursor.execute("""
            CREATE TABLE "submitted_tasks" (
                "task_id" INTEGER,
                "username" TEXT,
                "submission" TEXT,
                FOREIGN KEY("task_id") REFERENCES "task_info"("task_id") ON DELETE CASCADE,
                FOREIGN KEY("username") REFERENCES "users"("username") ON DELETE CASCADE
            )
            """)
            await conn.commit()

asyncio.run(main())