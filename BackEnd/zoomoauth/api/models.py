from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import User
import pytz

zones=[(timezone,timezone) for timezone in pytz.all_timezones]
    
class ZoomUser(models.Model):
    first_name = models.CharField(max_length=64, null=False, unique=True)
    last_name = models.CharField(max_length=64, null=False, unique=True)
    email = models.EmailField(null=False, unique=True)
    password = models.CharField( max_length=32 ,null=False)
    type = models.IntegerField(null=True)

class Tokens(models.Model):
    code = models.CharField(max_length=255, null=True)
    accesstoken = models.CharField(max_length=255,null=True)
    refreshtoken = models.CharField(max_length=255, null=True)

class CreateMeeting(models.Model):
    user = models.ForeignKey(ZoomUser, on_delete=models.CASCADE, null=False)
    id = models.AutoField(primary_key=True)
    topic = models.CharField(max_length=255, null=False, unique=True)
    start_time = models.DateTimeField(null=False)
    duration = models.IntegerField(null=False)
    timezone = models.CharField(max_length=255,choices=zones, null=False)
    agenda = models.CharField(max_length=500, null=False, unique=True)
    url = models.CharField(max_length=255, null=False, editable=False)
    meeting_id = models.CharField(max_length=255, null=False, editable=False)
    passcode = models.CharField(max_length=255, null=False, editable=False)

    def __str__(self):
        return str(self.meeting_id) 

class userData(models.Model):
    firstname = models.CharField(max_length=255, null=True)
    lastname = models.CharField(max_length=255, null=True)
    userid = models.CharField(max_length=255, null=True)
    email = models.EmailField()