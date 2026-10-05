"""One-off helper: test DATABASE_URL from backend/.env (run from backend/)."""
import os
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE))
os.chdir(BASE)

from dotenv import load_dotenv

load_dotenv(BASE / ".env")

import dj_database_url
import psycopg

url = os.environ.get("DATABASE_URL", "").strip()
if not url:
    print("DATABASE_URL is empty — SQLite will be used.")
    sys.exit(0)

if "YOUR_PASSWORD" in url or "password@" in url.lower() and "YOUR_" in url:
    print("DATABASE_URL still contains placeholder text (YOUR_PASSWORD).")
    print("Edit backend/.env and set your real PostgreSQL password.")
    sys.exit(1)

cfg = dj_database_url.parse(url)
host = cfg.get("HOST") or "localhost"
port = cfg.get("PORT") or 5432
user = cfg.get("USER") or "postgres"
password = cfg.get("PASSWORD") or ""
dbname = cfg.get("NAME") or "postgres"

try:
    with psycopg.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        dbname="postgres",
        connect_timeout=5,
    ) as conn:
        conn.execute("SELECT 1")
    print(f"Connected to PostgreSQL at {host}:{port} as {user}.")
except Exception as exc:
    print(f"Connection failed: {exc}")
    sys.exit(1)

try:
    with psycopg.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        dbname=dbname,
        connect_timeout=5,
    ) as conn:
        conn.execute("SELECT 1")
    print(f"Database '{dbname}' exists and is reachable.")
except psycopg.OperationalError:
    print(f"Server OK but database '{dbname}' missing — create it with:")
    print(f'  psql -U {user} -h {host} -c "CREATE DATABASE {dbname};"')
    sys.exit(2)
