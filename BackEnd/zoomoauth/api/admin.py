from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(ZoomUser)
admin.site.register(Tokens)
admin.site.register(CreateMeeting)
admin.site.register(userData)