import os
import uuid
from typing import List

from django.conf import settings
from fastapi import APIRouter, FastAPI, File, Form, HTTPException, Query, UploadFile

from wedding.models import (
    RSVP,
    Announcement,
    FAQItem,
    Guest,
    GuestbookMessage,
    Photo,
    ScheduleEvent,
    SongRequest,
    WeddingInfo,
)

from . import schemas

# Endpoints are plain `def` on purpose: FastAPI runs them in a thread pool,
# which is exactly what the synchronous Django ORM needs.

api = FastAPI(title="Wedding API", version="1.0")
router = APIRouter()

MAX_UPLOAD_BYTES = 8 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif"}


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/info", response_model=schemas.WeddingInfoOut)
def get_info():
    info = WeddingInfo.objects.first()
    if info is None:
        info = WeddingInfo.objects.create()
    return info


@router.get("/schedule", response_model=List[schemas.ScheduleEventOut])
def get_schedule():
    return list(ScheduleEvent.objects.all())


@router.get("/faq", response_model=List[schemas.FAQItemOut])
def get_faq():
    return list(FAQItem.objects.all())


@router.get("/announcements", response_model=List[schemas.AnnouncementOut])
def get_announcements():
    return list(Announcement.objects.filter(is_active=True)[:5])


@router.post("/rsvp")
def submit_rsvp(payload: schemas.RSVPIn):
    guest = None
    if payload.invite_code:
        guest = Guest.objects.filter(invite_code__iexact=payload.invite_code.strip()).first()
        if guest is None:
            raise HTTPException(status_code=404, detail="We couldn't find that invite code.")

    data = payload.model_dump(exclude={"invite_code"})
    if not payload.attending:
        data["party_size"] = 0
        data["meal_choice"] = ""
        data["dietary_notes"] = ""

    if guest is not None:
        # One RSVP per invited guest: a second submission updates the first.
        RSVP.objects.update_or_create(guest=guest, defaults=data)
    else:
        RSVP.objects.create(**data)
    return {"ok": True}


@router.get("/seating", response_model=List[schemas.SeatingOut])
def find_seat(name: str = Query(min_length=2, max_length=120)):
    return list(Guest.objects.filter(name__icontains=name.strip())[:10])


@router.get("/guestbook", response_model=List[schemas.GuestbookOut])
def get_guestbook():
    return list(GuestbookMessage.objects.filter(approved=True)[:100])


@router.post("/guestbook", response_model=schemas.GuestbookOut)
def post_guestbook(payload: schemas.GuestbookIn):
    return GuestbookMessage.objects.create(**payload.model_dump())


@router.get("/photos", response_model=List[schemas.PhotoOut])
def get_photos():
    return list(Photo.objects.filter(approved=True)[:200])


@router.post("/photos", response_model=schemas.PhotoOut)
def register_photo(payload: schemas.PhotoIn):
    """Used when the browser uploaded straight to Cloudinary and just reports the URL."""
    if not payload.image_url.startswith("https://"):
        raise HTTPException(status_code=400, detail="Image URL must be https.")
    return Photo.objects.create(**payload.model_dump())


@router.post("/photos/upload", response_model=schemas.PhotoOut)
def upload_photo(
    file: UploadFile = File(...),
    uploader_name: str = Form(""),
    caption: str = Form(""),
):
    """Local development fallback: store the file on disk when Cloudinary isn't configured."""
    extension = ALLOWED_IMAGE_TYPES.get(file.content_type or "")
    if extension is None:
        raise HTTPException(status_code=400, detail="Please upload a JPG, PNG, WebP or GIF image.")

    content = file.file.read(MAX_UPLOAD_BYTES + 1)
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="That photo is too large (max 8 MB).")

    folder = os.path.join(settings.MEDIA_ROOT, "photos")
    try:
        os.makedirs(folder, exist_ok=True)
        filename = f"{uuid.uuid4().hex}{extension}"
        with open(os.path.join(folder, filename), "wb") as out:
            out.write(content)
    except OSError:
        raise HTTPException(status_code=503, detail="Photo uploads aren't available right now.")

    return Photo.objects.create(
        uploader_name=uploader_name[:120],
        caption=caption[:200],
        image_url=f"/media/photos/{filename}",
    )


@router.post("/songs")
def request_song(payload: schemas.SongRequestIn):
    SongRequest.objects.create(**payload.model_dump())
    return {"ok": True}


api.include_router(router)
