from django.contrib import admin

from .models import (
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


@admin.register(WeddingInfo)
class WeddingInfoAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        # Only ever one row of wedding details.
        return not WeddingInfo.objects.exists()


@admin.register(ScheduleEvent)
class ScheduleEventAdmin(admin.ModelAdmin):
    list_display = ("start_time", "end_time", "title", "location")
    ordering = ("start_time",)


@admin.register(FAQItem)
class FAQItemAdmin(admin.ModelAdmin):
    list_display = ("position", "question")
    list_editable = ("question",)
    ordering = ("position",)


@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ("name", "table_number", "table_name", "invite_code", "email")
    list_editable = ("table_number", "table_name")
    search_fields = ("name", "email", "invite_code")


@admin.register(RSVP)
class RSVPAdmin(admin.ModelAdmin):
    list_display = ("name", "attending", "party_size", "meal_choice", "dietary_notes", "created_at")
    list_filter = ("attending", "meal_choice")
    search_fields = ("name", "email")


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ("message", "is_active", "created_at")
    list_editable = ("is_active",)


@admin.register(GuestbookMessage)
class GuestbookMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "message", "approved", "created_at")
    list_editable = ("approved",)


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ("uploader_name", "caption", "image_url", "approved", "created_at")
    list_editable = ("approved",)


@admin.register(SongRequest)
class SongRequestAdmin(admin.ModelAdmin):
    list_display = ("song", "artist", "guest_name", "created_at")
