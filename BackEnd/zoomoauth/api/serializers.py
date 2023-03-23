from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import User
from .models import *;
from django.contrib.auth import get_user_model
User = get_user_model()



class MeetingSerializer(serializers.ModelSerializer):
  user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
  class Meta:
    model = CreateMeeting
    fields = '__all__'

  def get_inventory(self, obj):
    user = self.context['request'].user
    return user

class ZoomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZoomUser
        fields = ('id', 'first_name', 'last_name', 'password', 'type')

class TokenSerializer(serializers.ModelSerializer):
   class Meta:
      model = Tokens
      fields = ('code','accesstoken', 'refreshtoken')

class UserdataSerialzer(serializers.ModelSerializer):
   class Meta:
      model = userData
      fields = '__all__'
