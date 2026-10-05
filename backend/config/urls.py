from django.contrib import admin
from django.urls import path

admin.site.site_header = "Wedding Control Room"
admin.site.site_title = "Wedding admin"
admin.site.index_title = "Manage the big day"

urlpatterns = [
    path("admin/", admin.site.urls),
]
