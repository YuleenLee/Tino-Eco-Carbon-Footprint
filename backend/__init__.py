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
            abort(400)

        await cursor.execute("""
        INSERT INTO user_info
        VALUES (?, ?, ?)
        """,
        (username, password, 0))
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
            abort(400)
        
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

async def run():
    global session, cursor
    async with aiohttp.ClientSession() as s, asqlite.connect('website.db') as c:
        session = s
        conn = c
        await app.run_task(host="0.0.0.0", port=3786)

asyncio.run(run())