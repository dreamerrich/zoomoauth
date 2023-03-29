from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Zoomuser)
admin.site.register(Tokens)
class CreateMeetAdmin(admin.ModelAdmin):
    readonly_fields = ('url','meeting_id','passcode')
    list_display = ('topic','start_time','duration')
admin.site.register(CreateMeeting, CreateMeetAdmin)