from quart import Quart, request, abort
import aiohttp
import asyncio
import asqlite
import json

app = Quart(__name__)
session = None
conn = None

@app.route("/")
async def main():
    return "Online"

@app.post("/create_account")
async def create_account():
    data = await request.get_json(force=True)

    try:
        username = session["username"]
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
            return json.dumps({
                'success':False,
                'message': 'A user with that username already exists.'}
            ), 400, {'ContentType':'application/json'} 

        await cursor.execute("""
        INSERT INTO user_info(username, password)
        VALUES (?, ?)
        """,
        (username, password))
        await conn.commit()

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@app.post("/login")
async def login():
    data = await request.get_json(force=True)

    try:
        username = session["username"]
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
            return json.dumps({
                'success':False,
                'message': 'Invalid login information.'}
            ), 400, {'ContentType':'application/json'} 
        
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

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

    return json.dumps({'success':True, 'data': tasks}), 200, {'ContentType':'application/json'}

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

    return json.dumps({'success':True, 'data': tasks}), 200, {'ContentType':'application/json'}

@app.post("/submit_task")
async def submit_task():
    data = await request.get_json(force=True)

    try:
        username = session["username"]
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
            return json.dumps({
                'success':False,
                'message': 'Duplucate submission.'}
            ), 400, {'ContentType':'application/json'}
        
        task_limit = await (await cursor.execute("""
        SELECT limit
        FROM task_info
        WHERE task_id = ?
        """,
        (task_id))).fetchone()
        if task_limit is None:
            return json.dumps({
                'success':False,
                'message': 'Invalid task.'}
            ), 400, {'ContentType':'application/json'}
        
        if task_limit[0] != -1 and task1[0] + task2[0] >= task_limit[0]:
            return json.dumps({
                'success':False,
                'message': 'Maximum submissions reached.'}
            ), 400, {'ContentType':'application/json'}

        await cursor.execute("""
        INSERT INTO submitted_tasks(task_id, username, submission)
        VALUES (?, ?, ?)
        """,
        (task_id, username, submission))
        await conn.commit()

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.post("/review_task")
async def review_task():
    data = await request.get_json(force=True)

    try:
        submission_id = data["submission_id"]
        accepted = data["accepted"]
        points = data["points"]
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
                return json.dumps({
                    'success':False,
                    'message': 'Task already accepted.'}
                ), 400, {'ContentType':'application/json'}
        
        task = await (await cursor.execute("""
        SELECT * FROM submitted_tasks
        WHERE submission_id = ?
        """,
        (submission_id))).fetchone()
        if task is None:
            return json.dumps({
                'success':False,
                'message': 'Task does not exist.'}
            ), 400, {'ContentType':'application/json'}

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

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

async def run():
    global session, cursor
    async with aiohttp.ClientSession() as s, asqlite.connect('backend/website.db') as c:
        session = s
        conn = c
        await app.run_task(host="0.0.0.0", port=3786)

asyncio.run(run())