from quart import Quart, Response, request, abort
import asyncio
import asqlite
import secrets

HEADERS = {
    'Access-Control-Allow-Origin': '*',
}

app = Quart(__name__)
conn = None

@app.route("/")
async def main():
    return "Online."

@app.get("/officers")
async def officers():
    officers = []
    async with conn.cursor() as cursor:
        for row in await (await cursor.execute("""SELECT username FROM user_info WHERE is_officer = 1""")).fetchall():
            officers.append(row[0])

    return {'data': officers}, 200, HEADERS

@app.post("/create_account")
async def create_account():
    data = await request.get_json(force=True)

    try:
        username = data["username"]
        password = data["password"]
    except KeyError:
        abort(400)

    async with conn.cursor() as cursor:
        user = await (await cursor.execute("""
        SELECT 1
        FROM user_info
        WHERE username = ?
        """,
        (username))).fetchone()

        if user is not None:
            return {'message': 'A user with that username already exists.'}, 404, HEADERS

        await cursor.execute("""
        INSERT INTO user_info(username, password)
        VALUES (?, ?)
        """,
        (username, password))
        await conn.commit()

    return Response(status=201, headers=HEADERS)

@app.post("/login")
async def login():
    data = await request.get_json(force=True)
    
    try:
        username = data["username"]
        password = data["password"]
    except KeyError:
        abort(400)

    async with conn.cursor() as cursor:
        user = await (await cursor.execute("""
        SELECT 1
        FROM user_info
        WHERE username = ? AND password = ?
        """,
        (username, password))).fetchone()

        if user is None:
            return {'message': 'Invalid login information.'}, 404, HEADERS

    return Response(status=201, headers=HEADERS)

@app.get("/submitted_tasks")
async def submitted_tasks():
    tasks = []
    async with conn.cursor() as cursor:
        for row in await (await cursor.execute("""SELECT * FROM submitted_tasks""")).fetchall():
            tasks.append({
                "submission_id": row[0],
                "task_id": row[1],
                "username": row[2],
                "submission": row[3],
            })

    return {'data': tasks}, 200, HEADERS

@app.get("/accepted_tasks")
async def accepted_tasks():
    tasks = []
    async with conn.cursor() as cursor:
        for row in await (await cursor.execute("""SELECT * FROM accepted_tasks""")).fetchall():
            tasks.append({
                "submission_id": row[0],
                "task_id": row[1],
                "username": row[2],
                "submission": row[3],
            })

    return {'data': tasks}, 200, HEADERS

@app.get("/leaderboard")
async def leaderboard():
    users = []
    async with conn.cursor() as cursor:
        for row in await (await cursor.execute("""
        SELECT username, points FROM user_info
        ORDER BY points DESC
        """)).fetchall():
            users.append({
                "username": row[0],
                "points": row[1],
            })

    return {'data': users}, 200, HEADERS

@app.post("/submit_task")
async def submit_task():
    data = await request.get_json(force=True)

    try:
        username = data["username"]
        task_id = int(data["task_id"])
        submission = data["submission"]
    except KeyError:
        abort(400)

    async with conn.cursor() as cursor:
        task1 = await (await cursor.execute("""
        SELECT COUNT(*)
        FROM submitted_tasks
        WHERE task_id = ? AND username = ? AND submission = ?
        """,
        (task_id, username, submission))).fetchone()
        task2 = await (await cursor.execute("""
        SELECT COUNT(*)
        FROM accepted_tasks
        WHERE task_id = ? AND username = ? AND submission = ?
        """,
        (task_id, username, submission))).fetchone()

        if task1 is not None or task2 is not None:
            return {'message': 'Duplucate submission.'}, 404, HEADERS
        
        task_limit = await (await cursor.execute("""
        SELECT limit
        FROM task_info
        WHERE task_id = ?
        """,
        (task_id))).fetchone()
        if task_limit is None:
            return {'message': 'Invalid task.'}, 404, HEADERS
        
        if task_limit[0] != -1 and task1[0] + task2[0] >= task_limit[0]:
            return {'message': 'Maximum submissions reached.'}, 404, HEADERS

        await cursor.execute("""
        INSERT INTO submitted_tasks(task_id, username, submission)
        VALUES (?, ?, ?)
        """,
        (task_id, username, submission))
        await conn.commit()

    return Response(status=201, headers=HEADERS)

@app.post("/review_task")
async def review_task():
    data = await request.get_json(force=True)

    try:
        submission_id = int(data["submission_id"])
        accepted = bool(data["accepted"])
        points = int(data["points"])
    except KeyError:
        abort(400)

    async with conn.cursor() as cursor:
        if accepted:
            task = await (await cursor.execute("""
            SELECT 1 FROM accepted_tasks
            WHERE submission_id = ?
            """,
            (submission_id))).fetchone()
            if task is not None:
                return {'message': 'Task already accepted.'}, 404, HEADERS
        
        task = await (await cursor.execute("""
        SELECT * FROM submitted_tasks
        WHERE submission_id = ?
        """,
        (submission_id))).fetchone()
        if task is None:
            return {'message': 'Task does not exist.'}, 404, HEADERS

        await cursor.execute("""
        DELETE FROM submitted_tasks
        WHERE submission_id = ?
        """,
        (submission_id))

        if accepted:
            await cursor.execute("""
            INSERT INTO accepted_tasks
            VALUES (?, ?, ?, ?)
            """,
            (task[0], task[1], task[2], task[3]))

            user_points = (await (await cursor.execute("""
            SELECT points FROM user_info
            WHERE username = ?
            """,
            (task[2]))).fetchone())[0]
            await cursor.execute("""
            UPDATE user_info
            SET points = ?
            WHERE username = ?
            """,
            (user_points + points, task[2]))

            await conn.commit()

    return Response(status=201, headers=HEADERS)

async def run():
    global conn
    async with asqlite.connect('backend/website.db') as c:
        conn = c
        await app.run_task()

asyncio.run(run())