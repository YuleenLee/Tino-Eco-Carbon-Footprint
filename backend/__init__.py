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

@app.route("/create_account", methods=["POST"])
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

@app.route("/login", methods=["POST"])
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
            return json.dumps({
                'success':False,
                'message': 'Invalid login information.'}
            ), 400, {'ContentType':'application/json'} 
        
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@app.route("/submit_task", methods=["POST"])
async def submit_task():
    data = await request.get_json(force=True)

    try:
        username = data["username"]
        task_id = data["task_id"]
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
        FROM reviewed_tasks
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
        
        if task1[0] + task2[0] >= task_limit[0]:
            return json.dumps({
                'success':False,
                'message': 'Maximum submissions reached.'}
            ), 400, {'ContentType':'application/json'}

        await cursor.execute("""
        INSERT INTO submitted_tasks
        VALUES (?, ?, ?)
        """,
        (task_id, username, submission))
        await conn.commit()

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

async def run():
    global session, cursor
    async with aiohttp.ClientSession() as s, asqlite.connect('website.db') as c:
        session = s
        conn = c
        await app.run_task(host="0.0.0.0", port=3786)

asyncio.run(run())