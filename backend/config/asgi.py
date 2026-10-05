"""
One ASGI app that serves everything:

    /api/*     -> FastAPI  (what the React site talks to)
    /media/*   -> uploaded photos (local development fallback)
    /*         -> Django   (the admin at /admin/ and its static files)

Run locally with:  uvicorn config.asgi:app --reload
"""
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django

django.setup()

from django.conf import settings  # noqa: E402
from django.core.wsgi import get_wsgi_application  # noqa: E402
from fastapi import FastAPI  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from fastapi.middleware.wsgi import WSGIMiddleware  # noqa: E402
from fastapi.staticfiles import StaticFiles  # noqa: E402

from wedding_api.main import api  # noqa: E402

django_app = get_wsgi_application()

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/api", api)

try:
    os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
    app.mount("/media", StaticFiles(directory=settings.MEDIA_ROOT), name="media")
except OSError:
    # Read-only filesystem (e.g. serverless). Photos go to Cloudinary there instead.
    pass

app.mount("/", WSGIMiddleware(django_app))
