from django.db import models
import pytz

zones=[(timezone,timezone) for timezone in pytz.all_timezones]
    
class Zoomuser(models.Model):
    first_name = models.CharField(max_length=255, null=True)
    last_name = models.CharField(max_length=255, null=True)
    email = models.EmailField(null=True, unique=True)
    userid = models.CharField(max_length=255, null=True)
    displayname =  models.CharField(max_length=255, null=True)
    
    def __str__(self):
        return str(self.userid) 

class Tokens(models.Model):
    code = models.CharField(max_length=255, null=True)
    accesstoken = models.CharField(max_length=255,null=True)
    refreshtoken = models.CharField(max_length=255, null=True)

class CreateMeeting(models.Model):
    topic = models.CharField(max_length=255, null=False)
    start_time = models.DateTimeField(null=False)
    duration = models.IntegerField(null=False)
    timezone = models.CharField(max_length=255,choices=zones, null=False)
    url = models.CharField(max_length=255, null=True)
    meeting_id = models.CharField(max_length=255, null=True)
    passcode = models.CharField(max_length=255, null=True)

    def __str__(self):
        return str(self.meeting_id) 