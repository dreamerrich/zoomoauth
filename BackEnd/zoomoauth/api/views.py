from rest_framework.response import Response
from  .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework import viewsets
from django.conf import settings
from rest_framework import filters
from django.core.mail import send_mail
from zoomoauth import settings
import base64
import requests
import json
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponseRedirect, HttpResponse
from rest_framework.decorators import action

# Create your views here.

#------------------------- with oauth ---------------------------
auth_url = 'https://zoom.us/oauth/'

class ZoomUser(APIView):
    permission_classes = (AllowAny,)
    def get(self, request):
        serializer = CodeSerializer
        self.payload = {
            "client_id": settings.client_id,
            "response_type": "code",
            "redirect_uri": settings.redirect_uri
        }

        url = auth_url+'authorize'+'?' + \
            '&'.join(['='.join([k, v]) for k, v in self.payload.items()])
        print("???????????", url)
        return HttpResponseRedirect(url)

        # url = settings.redirect_uri
         
class ZoomToken(APIView):
    def post(self, request):
        code = request.GET['code']
        print("🚀 ~ file: views.py:43 ~ code:", code)
        self.id_secret_encrypted = base64.b64encode(
            (settings.client_id + ':' + settings.client_secret).encode('utf-8')).decode('utf-8')
        serializer = TokenSerializer
        if request.method == 'POST':

            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + self.id_secret_encrypted,
                'cache-control': "no-cache",
            }
            params = {
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": settings.redirect_uri,
            }
            response = requests.post(auth_url+'token', headers=headers, params=params)
            print (">>>>>>>>>>>>",response)
            # if serializer.is_valid():
            #     serializer.save(
            #         'access': 
            #     )
        return HttpResponse(response)
    
    def post(self, request):
        self.id_secret_encrypted = base64.b64encode(
            (settings.client_id + ':' + settings.client_secret).encode('utf-8')).decode('utf-8')
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + self.id_secret_encrypted
        }
        params = {
            "grant_type": "refresh_token",
            "refresh_token": "refresh_token"
        }
        response = requests.post(auth_url+'token', headers=headers, params=params)
        print("============", response)
        return HttpResponse(response)
    
    
class ZoomMeetings(APIView):
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated, ]
    api_url = 'https://api.zoom.us/v2/'

    def post(self, request, refresh_token, first_name, last_name, email, password):
        serializer_class = ZoomUserSerializer(data=request.data)
        headers = {
            'Authorization': 'Bearer ' + ZoomToken().get_accessToken(refresh_token=refresh_token).json()['access_token']
        }
        data = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "password": password
        }
        response = requests.post(self.api_url+'users', headers=headers, json=data)
        if serializer_class.is_valid():
            serializer_class.save()
            return Response(serializer_class.data, response)
        return Response(serializer_class.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, refresh_token):

        headers = {
            'Authorization': 'Bearer ' + ZoomUser().get_accessToken(refresh_token=refresh_token).json()['access_token']
        }
        response = requests.get(
            self.api_url+'users/me/zak', headers=headers)
        return response

    def post(self, request, refresh_token, meeting_name, start_time, duration, timezone, agenda):
        serializer_class = MeetingSerializer(data=request.data, context={'request':request})
        headers = {
            'Authorization': 'Bearer ' + ZoomUser().get_accessToken(refresh_token=refresh_token).json()['access_token']
        }
        data = {
            "topic": meeting_name,
            "start_time": start_time,
            "duration": duration,
            "timezone": timezone,
            "agenda": agenda,
        }
        response = requests.post(self.api_url+'users/me/meetings', headers=headers, json=data)
        meet_detail = response.text
        detail = json.loads(meet_detail)
        if serializer_class.is_valid(raise_exception=True):
            serializer_class.save(
                topic=request.data['topic'],
                start_time=request.data['start_time'],
                duration=request.data['duration'],
                timezone = request.data['timezone'],
                agenda = request.data['agenda'],
                url=detail['join_url'],
                meeting_id=detail['id'],
                passcode=detail['password'],
                user = self.request.user 
            )
            return Response(serializer_class.data)
        return response


    def get(self, refresh_token):
        
        headers = {
            'Authorization': 'Bearer ' + ZoomUser().get_accessToken(refresh_token=refresh_token).json()['access_token']
        }
        response = requests.get(
            self.api_url+'users/me/meetings', headers=headers)
        return response

    def get(self, refresh_token, meeting_id):
        
        headers = {
            'Authorization': 'Bearer ' + ZoomUser().get_accessToken(refresh_token=refresh_token).json()['access_token']
        }
        response = requests.get(
            self.api_url+'meetings/'+meeting_id, headers=headers)
        return response

    def delete(self, refresh_token, meeting_id):
        
        headers = {
            'Authorization': 'Bearer ' + ZoomUser().get_accessToken(refresh_token=refresh_token).json()['access_token']
        }
        response = requests.delete(
            self.api_url+'meetings/'+meeting_id, headers=headers)
        return response

    def patch(self,request, refresh_token, meeting_id, meeting_name, start_time, duration, timezone):
        
        headers = {
            'Authorization': 'Bearer ' + ZoomUser().get_accessToken(refresh_token=refresh_token).json()['access_token']
        }
        data = {
            "topic": meeting_name,
            "start_time": start_time,
            "duration": duration,
            "timezone": timezone,
        }
        response = requests.patch(self.api_url+'meetings/'+meeting_id, headers=headers, json=data)
        serializer_class = MeetingSerializer(meeting_id,data=request.data,context={'request':request})
        if serializer_class.is_valid(raise_exception=True):
            serializer_class.save()
            return Response(serializer_class.data)
        else :
            return Response("No data", serializer_class.error)

    def get(self, refresh_token):
        
        headers = {
            'Authorization': 'Bearer ' + ZoomUser().get_accessToken(refresh_token=refresh_token).json()['access_token']
        }
        response = requests.get(
            self.api_url+'users', headers=headers)
        return response

    def get(self, refresh_token, user_id):
        
        headers = {
            'Authorization': 'Bearer ' + ZoomUser().get_accessToken(refresh_token=refresh_token).json()['access_token']
        }
        response = requests.get(
            self.api_url+'users/'+user_id, headers=headers)
        return response

'''-------------filtering---------------'''  
class MeetingList(APIView):
    permission_classes = [IsAuthenticated, ]
    filter_backends = (filters.SearchFilter, DjangoFilterBackend)
    search_fields = ["topic"]
    filterset_field = ['start_time']

    def filter_queryset(self, queryset):

        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)
            return queryset

    def get_queryset(self):
        user = self.request.user
        return CreateMeeting.objects.filter(user=user)

    def get(self, request, format=None):
        the_filtered_qs = self.filter_queryset(self.get_queryset())
        serializer = MeetingSerializer(the_filtered_qs, many=True)
        return Response(serializer.data)