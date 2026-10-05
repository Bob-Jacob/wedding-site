import datetime
import secrets

from django.db import models

_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # no 0/O/1/I to avoid mix-ups


def generate_invite_code():
    return "".join(secrets.choice(_CODE_ALPHABET) for _ in range(6))


def default_wedding_date():
    return datetime.datetime(2026, 11, 14, 14, 0, tzinfo=datetime.timezone.utc)


class WeddingInfo(models.Model):
    """Single row holding the couple's details. Edit it in the admin."""

    partner_one = models.CharField(max_length=80, default="Partner One")
    partner_two = models.CharField(max_length=80, default="Partner Two")
    wedding_date = models.DateTimeField(default=default_wedding_date)
    tagline = models.CharField(max_length=160, blank=True, default="We're getting married!")
    our_story = models.TextField(blank=True)
    venue_name = models.CharField(max_length=160, blank=True)
    venue_address = models.CharField(max_length=255, blank=True)
    parking_info = models.TextField(blank=True)
    dress_code = models.CharField(max_length=160, blank=True)
    meal_options = models.CharField(
        max_length=255,
        default="Chicken,Beef,Vegetarian",
        help_text="Comma-separated list shown on the RSVP form.",
    )
    emergency_contact_name = models.CharField(max_length=80, blank=True)
    emergency_contact_phone = models.CharField(max_length=40, blank=True)

    class Meta:
        verbose_name = "wedding details"
        verbose_name_plural = "wedding details"

    def __str__(self):
        return f"{self.partner_one} & {self.partner_two}"


class ScheduleEvent(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=160, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["start_time"]

    def __str__(self):
        return f"{self.start_time:%H:%M} {self.title}"


class FAQItem(models.Model):
    question = models.CharField(max_length=200)
    answer = models.TextField()
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]
        verbose_name = "FAQ item"

    def __str__(self):
        return self.question


class Guest(models.Model):
    name = models.CharField(max_length=120)
    email = models.CharField(max_length=254, blank=True)
    invite_code = models.CharField(max_length=12, unique=True, default=generate_invite_code)
    table_number = models.PositiveIntegerField(null=True, blank=True)
    table_name = models.CharField(max_length=80, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class RSVP(models.Model):
    guest = models.ForeignKey(Guest, null=True, blank=True, on_delete=models.SET_NULL, related_name="rsvps")
    name = models.CharField(max_length=120)
    email = models.CharField(max_length=254, blank=True)
    attending = models.BooleanField()
    party_size = models.PositiveSmallIntegerField(default=1)
    meal_choice = models.CharField(max_length=80, blank=True)
    dietary_notes = models.CharField(max_length=300, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "RSVP"

    def __str__(self):
        return f"{self.name} ({'yes' if self.attending else 'no'})"


class Announcement(models.Model):
    """Live banner shown at the top of every page. Post one from the admin on the day."""

    message = models.CharField(max_length=240)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.message


class GuestbookMessage(models.Model):
    name = models.CharField(max_length=120)
    message = models.TextField(max_length=1000)
    approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name}: {self.message[:40]}"


class Photo(models.Model):
    uploader_name = models.CharField(max_length=120, blank=True)
    caption = models.CharField(max_length=200, blank=True)
    image_url = models.CharField(max_length=500)
    approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Photo by {self.uploader_name or 'a guest'}"


class SongRequest(models.Model):
    guest_name = models.CharField(max_length=120, blank=True)
    song = models.CharField(max_length=160)
    artist = models.CharField(max_length=160, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.song} - {self.artist}" if self.artist else self.song
