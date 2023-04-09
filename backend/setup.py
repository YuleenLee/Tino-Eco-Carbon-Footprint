import asyncio
import asqlite

async def main():
    async with asqlite.connect('website.db') as conn:
        async with conn.cursor() as cursor:
            await cursor.execute("""
            CREATE TABLE "user_info" (
                "email" TEXT,
                "name" TEXT,
                "password" TEXT,
                "points" INTEGER DEFAULT 0 CHECK(points>=0),
                "is_officer" BOOLEAN DEFAULT 0 CHECK(is_officer>=0),
                PRIMARY KEY("email")
            )
            """)
            await cursor.execute("""
            CREATE TABLE "task_info" (
                "task_id" INTEGER PRIMARY KEY,
                "limit" INTEGER
            )
            """)
            await cursor.execute("""
            CREATE TABLE "tasks" (
                "submission_id" INTEGER PRIMARY KEY,
                "task_id" INTEGER,
                "email" TEXT,
                "submission" TEXT,
                "accepted" BOOLEAN,
                FOREIGN KEY("task_id") REFERENCES "task_info"("task_id") ON DELETE CASCADE,
                FOREIGN KEY("email") REFERENCES "user_info"("email") ON DELETE CASCADE
            )
            """)
            await cursor.execute("""
            CREATE TABLE "session_info" (
                "session_id" TEXT,
                "email" TEXT,
                "expires" TIMESTAMP,
                FOREIGN KEY("email") REFERENCES "user_info"("email") ON DELETE CASCADE
            )
            """)

            one_time = [1, 2, 3, 5, 7, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 26, 29, 31, 32, 34, 39, 43, 44, 45, 46, 47, 50, 52]
            multiple_times = [4, 6, 8, 11, 17, 30, 40, 41, 42, 48, 49]
            unlimited_times = [10, 24, 25, 27, 28, 33, 35, 36, 37, 38]

            data = []

            for i in range(1, 51):
                if i == 30:
                    data.append((i, 3))
                elif i == 51:
                    data.append((i, 2))
                elif i in one_time:
                    data.append((i, 1))
                elif i in multiple_times:
                    data.append((i, 5))
                elif i in unlimited_times:
                    data.append((i, -1))

            await cursor.executemany("""
            INSERT INTO task_info
            VALUES (?, ?)
            """,
            data)

            await conn.commit()

asyncio.run(main())