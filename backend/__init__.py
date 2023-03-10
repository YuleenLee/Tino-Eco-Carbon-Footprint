from quart import Quart, Response, request, session, abort
import aiohttp
import asyncio
import asqlite
import secrets

app = Quart(__name__)
session = None
conn = None

app.secret_key = secrets.token_hex()

@app.route("/")
async def main():
    return "Online"

@app.post("/create_account")
async def create_account():
    data = await request.form

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
            return {'message': 'A user with that username already exists.'}, 404

        await cursor.execute("""
        INSERT INTO user_info(username, password)
        VALUES (?, ?)
        """,
        (username, password))
        await conn.commit()

    return Response(status=201)

@app.post("/login")
async def login():
    data = await request.form

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
            return {'message': 'Invalid login information.'}, 404
    
    session["username"] = username

    return Response(status=201)

@app.post("/logout")
async def logout():
    session.pop("username", None)
    return Response(status=201)

@app.get("/submitted_tasks")
async def submitted_tasks():
    tasks = []
    async with conn.cursor() as cursor:
        for row in await (await conn.execute("""SELECT * FROM submitted_tasks""")).fetchall():
            tasks.append({
                "submission_id": row[0],
                "task_id": row[1],
                "username": row[2],
                "submission": row[3],
            })

    return {'data': tasks}, 200

@app.get("/accepted_tasks")
async def accepted_tasks():
    tasks = []
    async with conn.cursor() as cursor:
        for row in await (await conn.execute("""SELECT * FROM accepted_tasks""")).fetchall():
            tasks.append({
                "submission_id": row[0],
                "task_id": row[1],
                "username": row[2],
                "submission": row[3],
            })

    return {'data': tasks}, 200

@app.post("/submit_task")
async def submit_task():
    data = await request.form

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
            return {'message': 'Duplucate submission.'}, 404
        
        task_limit = await (await cursor.execute("""
        SELECT limit
        FROM task_info
        WHERE task_id = ?
        """,
        (task_id))).fetchone()
        if task_limit is None:
            return {'message': 'Invalid task.'}, 404
        
        if task_limit[0] != -1 and task1[0] + task2[0] >= task_limit[0]:
            return {'message': 'Maximum submissions reached.'}, 404

        await cursor.execute("""
        INSERT INTO submitted_tasks(task_id, username, submission)
        VALUES (?, ?, ?)
        """,
        (task_id, username, submission))
        await conn.commit()

    return Response(status=204)

@app.post("/review_task")
async def review_task():
    data = await request.form

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
                return {'message': 'Task already accepted.'}, 404
        
        task = await (await cursor.execute("""
        SELECT * FROM submitted_tasks
        WHERE submission_id = ?
        """,
        (submission_id))).fetchone()
        if task is None:
            return {'message': 'Task does not exist.'}, 404

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

    return Response(status=204)

async def run():
    global session, cursor
    async with aiohttp.ClientSession() as s, asqlite.connect('backend/website.db') as c:
        session = s
        conn = c
        await app.run_task(host="0.0.0.0", port=3786)

asyncio.run(run())