from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ---------- output ----------
class WeddingInfoOut(ORMModel):
    partner_one: str
    partner_two: str
    wedding_date: datetime
    tagline: str
    our_story: str
    venue_name: str
    venue_address: str
    parking_info: str
    dress_code: str
    meal_options: str
    emergency_contact_name: str
    emergency_contact_phone: str


class ScheduleEventOut(ORMModel):
    id: int
    title: str
    description: str
    location: str
    start_time: datetime
    end_time: Optional[datetime]


class FAQItemOut(ORMModel):
    id: int
    question: str
    answer: str


class AnnouncementOut(ORMModel):
    id: int
    message: str
    created_at: datetime


class GuestbookOut(ORMModel):
    id: int
    name: str
    message: str
    created_at: datetime


class PhotoOut(ORMModel):
    id: int
    uploader_name: str
    caption: str
    image_url: str
    created_at: datetime


class SeatingOut(ORMModel):
    name: str
    table_number: Optional[int]
    table_name: str


# ---------- input ----------
class RSVPIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: str = Field(default="", max_length=254)
    attending: bool
    party_size: int = Field(default=1, ge=1, le=10)
    meal_choice: str = Field(default="", max_length=80)
    dietary_notes: str = Field(default="", max_length=300)
    message: str = Field(default="", max_length=1000)
    invite_code: str = Field(default="", max_length=12)


class GuestbookIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    message: str = Field(min_length=1, max_length=1000)


class PhotoIn(BaseModel):
    uploader_name: str = Field(default="", max_length=120)
    caption: str = Field(default="", max_length=200)
    image_url: str = Field(min_length=8, max_length=500)


class SongRequestIn(BaseModel):
    guest_name: str = Field(default="", max_length=120)
    song: str = Field(min_length=1, max_length=160)
    artist: str = Field(default="", max_length=160)
