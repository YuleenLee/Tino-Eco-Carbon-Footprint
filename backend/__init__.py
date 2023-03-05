from quart import Quart
import aiohttp
import asyncio
import asqlite

app = Quart(__name__)
session = None
conn = None

@app.route("/")
async def main():
    return "Online"

async def run():
    global session, cursor
    async with aiohttp.ClientSession() as s, asqlite.connect('website.db') as c:
        session = s
        conn = c
        await app.run_task(host="0.0.0.0", port=3786)

asyncio.run(run())