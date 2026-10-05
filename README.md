# Wedding Website

A mobile-first wedding site that works on the day itself: live schedule, announcements, RSVP, seating finder, photo sharing, guestbook and song requests.

| Part | Tech |
|---|---|
| Frontend | React + Vite + React Router |
| API | FastAPI (the endpoints the site calls) |
| Data + admin | Django ORM, migrations and the Django admin |
| Database | Neon Postgres (SQLite locally until you add Neon) |
| Photos | Cloudinary free tier (or local disk in development) |
| Hosting | Vercel (frontend + backend as two projects) |

Django and FastAPI run as **one** app: `config/asgi.py` serves the API at `/api/*` and the Django admin at `/admin/`.
The couple edit everything (schedule, tables, FAQ, announcements) in the Django admin, no code needed.

```
wedding-site/
├── backend/
│   ├── config/            Django settings, urls, asgi.py (FastAPI + Django together)
│   ├── wedding/           Django app: models, admin, migrations
│   ├── wedding_api/       FastAPI: schemas.py and main.py (all endpoints)
│   ├── api/index.py       Vercel entry point
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/         Home, Schedule, Venue, Rsvp, Seating, Photos, Guestbook, Songs
    │   ├── components/    Layout, AnnouncementBanner, State
    │   ├── api.js         fetch helper
    │   └── styles.css
    └── package.json
```

## Run it locally

### 1. Backend (terminal 1)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # Windows: copy .env.example .env
python manage.py migrate
python manage.py createsuperuser   # your admin login
uvicorn config.asgi:app --reload --port 8000
```

- Admin: http://127.0.0.1:8000/admin/ (start by filling in **Wedding details**, then add schedule events, guests and FAQ items)
- API docs: http://127.0.0.1:8000/api/docs

### 2. Frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies `/api` and `/media` to the backend.

## Connect Neon (Postgres)

1. Create a free project at neon.tech.
2. Copy the **pooled** connection string and put it in `backend/.env` as `DATABASE_URL`.
3. Run `python manage.py migrate` again. Same code, now on Postgres.

## Free photo storage: Cloudinary

1. Sign up free at cloudinary.com and note your **cloud name**.
2. Settings → Upload → add an **unsigned upload preset** (limit it to images; a folder like `wedding` is handy).
3. In `frontend/.env` set `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`.

Guests' browsers upload straight to Cloudinary and the API only stores the URL, which avoids Vercel's request-size limit. Without these two variables, photos are saved to `backend/media/` (fine for development, not for Vercel).

## Deploy on Vercel

Create **two** Vercel projects from the same repo:

**Backend** (root directory `backend`)
Set environment variables: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=0`, `DJANGO_ALLOWED_HOSTS` (your backend domain), `DATABASE_URL`, `CORS_ALLOWED_ORIGINS` (your frontend URL), `CSRF_TRUSTED_ORIGINS` (your backend URL, with `https://`), `WEDDING_TIME_ZONE`.
Run `python manage.py migrate` once against Neon from your own machine (with `DATABASE_URL` set), and create the admin user the same way.

**Frontend** (root directory `frontend`, framework preset Vite)
Set `VITE_API_URL` to the backend URL, plus the two Cloudinary variables.

## Day-of tips

- Post a **live announcement** from the admin (Announcements → add). It appears on every guest's phone within ~30 seconds.
- Photos and guestbook messages have an **approved** checkbox, so anything unwanted can be hidden in one click.
- Print a paper schedule as a backup in case the venue's signal is poor.
