from rest_framework.response import Response
from  .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework import viewsets
from django.conf import settings
from rest_framework import filters
from zoomoauth import settings
import datetime
import base64
import requests
import json
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.http import Http404

# Create your views here.

'''-------------Oauth---------------'''

'''-------------Oauth authorization---------------'''
auth_url = 'https://zoom.us/oauth/'

class ZoomUser(APIView):
    permission_classes = (AllowAny,)
    def get(self, request):
        self.payload = {
            "client_id": settings.client_id,
            "response_type": "code",
            "redirect_uri": settings.redirect_uri
        }

        url = auth_url+'authorize'+'?' + \
            '&'.join(['='.join([k, v]) for k, v in self.payload.items()])
        print("???????????", url)
        return HttpResponseRedirect(url)

        # url = requests.get(auth_url+'authorize', params=params)
        # print("???????????", url)
        # data = {
        #     'redirect_url': url.url
        # }
        # print(data)
        # return JsonResponse(data)
        
        # url = settings.redirect_uri

'''-------------get data from frontend---------------'''

class Codeget(APIView):
    def get(self, request):
        code = request.headers.get('X-MyCookie')
        print("🚀 ~ file: views.py:52 ~ code:", code)
        
        return Response("code")
    
'''-------------obtaining tokens---------------'''

class ZoomToken(APIView):
    def post(self, request): 
        serializer_class = TokenSerializer(data=request.data)
        self.id_secret_encrypted = base64.b64encode(
            (settings.client_id + ':' + settings.client_secret).encode('utf-8')).decode('utf-8')
        authcode = request.headers.get('X-MyCookie')
        print("🚀 ~ file: views.py:43 ~ authcode: from fetch", authcode)

        headers = { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + self.id_secret_encrypted,
                'cache-control': 'no-cache',
            }
            
        params = {
                "code": authcode,
                "grant_type": "authorization_code",
                "redirect_uri": settings.redirect_uri,
            }
        response = requests.post(auth_url+'token', headers=headers, params=params)
        tokendata = response.text
        tokens = json.loads(tokendata)
        # print("🚀 ~ file: views.py:79 ~ tokens:", tokens)
        if serializer_class.is_valid():
            try:
                serializer_class.save(
                    code = authcode,
                    accesstoken=tokens['access_token'],
                    refreshtoken=tokens['refresh_token']
                )
            except KeyError as e:
                print(f"Error: {e}")
        return Response(tokens)
    
    def get(self, request):
        serializer_class = ZoomUserSerializer(data=request.data)
        access_token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        print("🚀 ~ file: views.py:174 ~ access_token:", access_token)
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + access_token
        }
        response = requests.get(api_url+'users', headers=headers)
        userinfo = response.text
        data = json.loads(userinfo)
        userdetail = data['users']
        first = userdetail[0]['first_name']
        last = userdetail[0]['last_name']
        id = userdetail[0]['id']
        displayname = userdetail[0]['display_name']
        self.email = userdetail[0]['email']
        if serializer_class.is_valid(raise_exception=False):
            try:
                serializer_class.save(
                    first_name=userdetail[0]['first_name'],
                    last_name=userdetail[0]['last_name'],
                    userid=id,
                    displayname=displayname,
                    email=self.email
                )
            except KeyError as e:
                print(f"Error: {e}")
        return response
    
'''-------------get tokens from frontend---------------'''
    
class getTokens(APIView):
    def post(self, request, *args, **kwargs):
        access1 = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        return Response("ok")

'''-------------obtaning a new access token---------------'''

class refreshtoken(APIView):
    def post(self, request):
        serializer_class = TokenSerializer(data=request.data)
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
        tokendata = response.text
        tokens = json.loads(tokendata)
        if serializer_class.is_valid():
            try:
                serializer_class.save(
                    accesstoken=tokens['access_token'],
                    refreshtoken=tokens['refresh_token']
                )
            except KeyError as e:
                print(f"Error: {e}")
        return Response(tokens)
    
'''-------------zoom CRUD---------------'''

api_url = "https://api.zoom.us/v2/"
class ZoomMeetings(APIView):

    def post(self, request):
        serializer_class = MeetingSerializer(data=request.data)
        access_token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        headers = {
            'Authorization': 'Bearer ' + access_token
        }
        date = datetime.datetime.now()
        data = {
            "topic":request.data['topic'], 
            "start_time":date.strftime('yyyy-MM-ddTHH:mm:ssZ'), 
            "timezone":request.data['timezone'], 
            "duration":request.data['duration']
        }
        response = requests.post(api_url+'users/me/meetings', headers=headers, json=data)
        meet_detail = response.text
        detail = json.loads(meet_detail)
        if serializer_class.is_valid(raise_exception=True):
                serializer_class.save(
                    topic=request.data['topic'],
                    start_time=request.data['start_time'],
                    duration=request.data['duration'],
                    timezone = request.data['timezone'],
                    url=detail['join_url'],
                    meeting_id=detail['id'],
                    passcode=detail['password'],
                    
                )
           
        return Response(serializer_class.data)
    
    # def get(self, request):
    #     access_token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
    #     headers = {
    #         'Authorization': 'Bearer ' + access_token,
    #         'Content-Type': 'application/json'
    #     }
    #     params = {
    #         'type': 'scheduled',
    #         'page_size': 30
    #     }
    #     response = requests.get(api_url+'users/me/meetings', headers=headers, params=params)
    #     meetings = response.json()
    #     data = meetings['meetings']
    #     for meeting_data in data:
    #         meeting = CreateMeeting.objects.create(
    #             meeting_id=meeting_data['id'],
    #             topic=meeting_data["topic"],
    #             start_time=meeting_data["start_time"],
    #             duration=meeting_data["duration"],
    #             timezone=meeting_data["timezone"],
    #             url=meeting_data["join_url"]
    #         )
    #         meeting.save()
    #     queryset = CreateMeeting.objects.all()
    #     queryset = queryset()
    #     serializer = MeetingSerializer(queryset, many=True)
    #     print("🚀 ~ file: views.py:231 ~ data:", data)
    #     meet = json.dumps(list(data))
    #     print("🚀 ~ file: views.py:232 ~ meet:", meet)
    #     return JsonResponse(serializer.data)
    
    def get(self, request):
        access_token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        headers = {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        }
        params = {
            'type': 'scheduled',
            'page_size': 30
        }
        response = requests.get(api_url+'users/me/meetings', headers=headers, params=params)
        meetings = response.json()
        data = meetings['meetings']
        return Response(data)
    
class updatemeeting(APIView):
    
    def get(self, request, id):
        access_token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        meeting_id = CreateMeeting.objects.get(meeting_id=id)
        print("🚀 ~ file: views.py:235 ~ meeting_id:", meeting_id)
        # data = meeting_id[0].meeting_id
        # print("🚀 ~ file: views.py:248 ~ data:", data)
        headers = {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        }
        response = requests.get(api_url+'meetings/'+str(meeting_id), headers=headers)
        if response.status_code == 200:
            meeting_data = response.json()
            print("🚀 ~ file: views.py:255 ~ meeting_data:", meeting_data)
            return Response(meeting_data)
        
    
    def patch(self, request, id):
        access_token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        print("🚀 ~ file: views.py:266 ~ access_token:", access_token)
        meeting_id = self.get(request, id=id)
        print("🚀 ~ file: views.py:268 ~ meeting_id:", meeting_id)
        headers = {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        }
        response = requests.patch(api_url+'meetings/'+str(meeting_id), json=request.data, headers=headers)
        # meeting = requests.patch(url,json=request.data, headers=header)
        print("🚀 ~ file: views.py:274 ~ meeting:", response)
        # serializer_class = MeetingSerializer(meeting_id,data=request.data)
        # if serializer_class.is_valid(raise_exception=True):
        #     serializer_class.save()
        return Response(response)

        
    def delete(self, request, id):
        access_token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        print("🚀 ~ file: views.py:174 ~ access_token:", access_token)
        meeting_id = CreateMeeting.objects.filter(meeting_id=id)
        print("🚀 ~ file: views.py:281 ~ meeting_id:", meeting_id)
        headers = {
            'Authorization': 'Bearer ' + access_token
        }
        response = requests.delete(api_url+'meetings/'+str(meeting_id), headers=headers)
        meeting_id.delete()
        return HttpResponse(response)

'''-------------filtering---------------'''  
class MeetingList(APIView):
    # permission_classes = [IsAuthenticated, ]
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
    

'''-------------meeting detail---------------'''  

class MeetingLink(APIView):
    def get(self, request):
        queryset = CreateMeeting.objects.filter().latest('start_time')
        serializer_class = MeetingSerializer(queryset)
        return Response(serializer_class.data)
    
'''-------------profile---------------''' 


class Profile(APIView):
    def get(self, request):
        current_user = request.user
        if request.user.is_authenticated:
            serializer = ZoomUserSerializer(current_user)
            return Response(serializer.data)
        return Response("No user Found")