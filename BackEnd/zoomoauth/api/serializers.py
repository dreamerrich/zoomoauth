from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import User
from .models import *;



class MeetingSerializer(serializers.ModelSerializer):
  class Meta:
    model = CreateMeeting
    fields = '__all__'

class ZoomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zoomuser
        fields = ('first_name', 'last_name', 'userid', 'email')

class TokenSerializer(serializers.ModelSerializer):
   class Meta:
      model = Tokens
      fields = ('code','accesstoken', 'refreshtoken')

