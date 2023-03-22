from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(ZoomUser)
admin.site.register(code)
admin.site.register(Tokens)
admin.site.register(CreateMeeting)