from django.contrib import admin
from .models import Client, Facility


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "email",
        "phone",
        "office_name",
        "created_at",
    )

    search_fields = (
        "name",
        "email",
        "phone",
    )


@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "manager",
    )

    search_fields = (
        "name",
    )