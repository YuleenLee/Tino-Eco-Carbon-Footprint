from quart import Quart, Response, request, abort
from datetime import datetime, timedelta
import hashlib
import asyncio
import asqlite

HEADERS = {
    'Access-Control-Allow-Origin': '*',
}

app = Quart(__name__)
conn = None

async def is_officer(email):
    async with conn.cursor() as cursor:
        user = await (await cursor.execute("""SELECT 1 FROM user_info WHERE is_officer = 1 AND email = ?""", (email))).fetchone()
        return user is not None

@app.route("/")
async def main():
    return "Online."

@app.post("/user_points")
async def user_points():
    data = await request.get_json(force=True)

    try:
        email = data["email"]
    except KeyError:
        abort(400)
        
    async with conn.cursor() as cursor:
        points_row = await (await cursor.execute("SELECT points FROM user_info WHERE email = ?", (email))).fetchone()

    return {"points": points_row[0]}, 200, HEADERS

@app.post("/is_valid_session")
async def is_valid_session():
    data = await request.get_json(force=True)
    
    try:
        email = data["email"]
        session_id = data["session_id"]
    except KeyError:
        abort(400)
    except TypeError:
        {"is_valid_session": False}, 200, HEADERS

    async with conn.cursor() as cursor:
        session = await (await cursor.execute("""
        SELECT expires
        FROM session_info
        WHERE session_id = ? AND email = ?
        """,
        (session_id, email))).fetchone()

    if session is None or session[0] < datetime.now():
        return {"is_valid_session": False}, 200, HEADERS
    return {"is_valid_session": True}, 200, HEADERS

@app.post("/is_officer")
async def officer():
    data = await request.get_json(force=True)

    try:
        email = data["email"]
    except KeyError:
        abort(400)
        
    return {"is_officer": await is_officer(email)}, 200, HEADERS

@app.post("/create_account")
async def create_account():
    data = await request.get_json(force=True)

    try:
        email = data["email"]
        password = data["password"]
    except KeyError:
        abort(400)

    async with conn.cursor() as cursor:
        user = await (await cursor.execute("""
        SELECT 1
        FROM user_info
        WHERE email = ?
        """,
        (email))).fetchone()

        if user is not None:
            return {'message': 'A user with that email already exists.'}, 404, HEADERS

        await cursor.execute("""
        INSERT INTO user_info(email, password)
        VALUES (?, ?)
        """,
        (email, password))
        await conn.commit()

    return Response(status=201, headers=HEADERS)

@app.post("/login")
async def login():
    data = await request.get_json(force=True)
    
    try:
        email = data["email"]
        password = data["password"]
    except KeyError:
        abort(400)

    async with conn.cursor() as cursor:
        user = await (await cursor.execute("""
        SELECT 1
        FROM user_info
        WHERE email = ? AND password = ?
        """,
        (email, password))).fetchone()

        if user is None:
            return {'message': 'Invalid login information.'}, 404, HEADERS
        
        now = datetime.now()
        session_id = hashlib.sha256(f"{email}{password}{now}".encode()).hexdigest()
        await cursor.execute("""
        INSERT INTO session_info
        VALUES (?, ?, ?)
        """,
        (session_id, email, now + timedelta(days=7)))

    return {"session_id": session_id}, 201, HEADERS

@app.post("/submitted_tasks")
async def submitted_tasks():
    data = await request.get_json(force=True)

    try:
        email = data["email"]
    except KeyError:
        abort(400)

    async with conn.cursor() as cursor:
        if await is_officer(email):
            stuff = await (await cursor.execute("SELECT * FROM submitted_tasks")).fetchall()
        else:
            stuff = await (await cursor.execute("SELECT * FROM submitted_tasks WHERE email = ?", (email))).fetchall()
        
    tasks = []
    for row in stuff:
        tasks.append({
            "submission_id": row[0],
            "task_id": row[1],
            "email": row[2],
            "submission": row[3],
        })

    return {'data': tasks}, 200, HEADERS

@app.post("/accepted_tasks")
async def accepted_tasks():
    data = await request.get_json(force=True)

    try:
        email = data["email"]
    except KeyError:
        abort(400)

    async with conn.cursor() as cursor:
        if await is_officer(email):
            stuff = await (await cursor.execute("SELECT * FROM accepted_tasks")).fetchall()
        else:
            stuff = await (await cursor.execute("SELECT * FROM accepted_tasks WHERE email = ?", (email))).fetchall()
        
    tasks = []
    for row in stuff:
        tasks.append({
            "submission_id": row[0],
            "task_id": row[1],
            "email": row[2],
            "submission": row[3],
        })

    return {'data': tasks}, 200, HEADERS

@app.get("/leaderboard")
async def leaderboard():
    users = []
    async with conn.cursor() as cursor:
        for row in await (await cursor.execute("""
        SELECT email, points FROM user_info
        WHERE points > 0
        ORDER BY points DESC
        """)).fetchall():
            users.append({
                "email": row[0],
                "points": row[1],
            })

    return {'data': users}, 200, HEADERS

@app.post("/submit_task")
async def submit_task():
    data = await request.get_json(force=True)

    try:
        email = data["email"]
        task_id = int(data["task_id"])
        submission = data["submission"]
    except KeyError:
        abort(400)

    async with conn.cursor() as cursor:
        task1 = (await (await cursor.execute("""
        SELECT COUNT(*)
        FROM submitted_tasks
        WHERE task_id = ? AND email = ?
        """,
        (task_id, email))).fetchone())[0]
        task2 = (await (await cursor.execute("""
        SELECT COUNT(*)
        FROM accepted_tasks
        WHERE task_id = ? AND email = ?
        """,
        (task_id, email))).fetchone())[0]
        
        task_limit = await (await cursor.execute("""
        SELECT "limit"
        FROM task_info
        WHERE task_id = ?
        """,
        (task_id))).fetchone()

        if task_limit is None:
            return {'message': 'Invalid task.'}, 404, HEADERS
        
        if task_limit[0] != -1 and task1 + task2 >= task_limit[0]:
            return {'message': 'Maximum submissions reached.'}, 404, HEADERS

        await cursor.execute("""
        INSERT INTO submitted_tasks(task_id, email, submission)
        VALUES (?, ?, ?)
        """,
        (task_id, email, submission))
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
            WHERE email = ?
            """,
            (task[2]))).fetchone())[0]
            await cursor.execute("""
            UPDATE user_info
            SET points = ?
            WHERE email = ?
            """,
            (user_points + points, task[2]))

            await conn.commit()

    return Response(status=201, headers=HEADERS)

async def run():
    global conn
    async with asqlite.connect('backend/website.db', detect_types=asqlite.PARSE_DECLTYPES | asqlite.PARSE_COLNAMES) as c:
        conn = c
        await app.run_task()

asyncio.run(run())