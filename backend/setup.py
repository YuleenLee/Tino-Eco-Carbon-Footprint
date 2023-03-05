import asyncio
import asqlite

async def main():
    async with asqlite.connect('website.db') as conn:
        async with conn.cursor() as cursor:
            await cursor.execute("""
            CREATE TABLE "user_info" (
                "username" TEXT,
                "password" TEXT,
                "points" INTEGER DEFAULT 0 CHECK(points>=0),
                PRIMARY KEY("username")
            )
            """)
            await cursor.execute("""
            CREATE TABLE "task_info" (
                "task_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                "limit" INTEGER
            )
            """)
            await cursor.execute("""
            CREATE TABLE "submitted_tasks" (
                "submission_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                "task_id" INTEGER,
                "username" TEXT,
                "submission" TEXT,
                FOREIGN KEY("task_id") REFERENCES "task_info"("task_id") ON DELETE CASCADE,
                FOREIGN KEY("username") REFERENCES "users"("username") ON DELETE CASCADE
            )
            """)
            await cursor.execute("""
            CREATE TABLE "reviewed_tasks" (
                "submission_id" INTEGER,
                "task_id" INTEGER,
                "username" TEXT,
                "submission" TEXT,
                FOREIGN KEY("task_id") REFERENCES "task_info"("task_id") ON DELETE CASCADE,
                FOREIGN KEY("username") REFERENCES "users"("username") ON DELETE CASCADE
            )
            """)
            await conn.commit()

asyncio.run(main())