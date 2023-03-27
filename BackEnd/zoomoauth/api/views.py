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
        print("🚀 ~ file: views.py:100 ~ userinfo:", userinfo)
        data = json.loads(userinfo)
        userdetail = data['users']
        first = userdetail[0]['first_name']
        print("🚀 ~ file: views.py:105 ~ first:", first)
        last = userdetail[0]['last_name']
        print("🚀 ~ file: views.py:107 ~ last:", last)
        id = userdetail[0]['id']
        print("🚀 ~ file: views.py:109 ~ id:", id)
        self.email = userdetail[0]['email']
        print("🚀 ~ file: views.py:111 ~ email:", self.email)
        if serializer_class.is_valid(raise_exception=False):
            try:
                serializer_class.save(
                    first_name=userdetail[0]['first_name'],
                    last_name=userdetail[0]['last_name'],
                    userid=id,
                    email=self.email
                )
            except KeyError as e:
                print(f"Error: {e}")
        print(">>>>>>>>>",serializer_class.data)
        return response
    
'''-------------get tokens from frontend---------------'''
    
class getTokens(APIView):
    def post(self, request, *args, **kwargs):
        access1 = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        print("🚀 ~ file: views.py:127 ~ access1:", access1)
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
        print("🚀 ~ file: views.py:79 ~ tokens:", tokens)
        if serializer_class.is_valid():
            try:
                serializer_class.save(
                    accesstoken=tokens['access_token'],
                    refreshtoken=tokens['refresh_token']
                )
            except KeyError as e:
                print(f"Error: {e}")
        print("============", tokens)
        return Response(tokens)
    
'''-------------zoom CRUD---------------'''

api_url = "https://api.zoom.us/v2/"
class ZoomMeetings(APIView):

    def post(self, request):
        serializer_class = MeetingSerializer(data=request.data)
        access_token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        print("🚀 ~ file: views.py:174 ~ access_token:", access_token)
        headers = {
            'Authorization': 'Bearer ' + access_token
        }
        date = datetime.datetime.now()
        data = {
            "topic":request.data['topic'], 
            "start_time":date.strftime('yyyy-MM-ddTHH:mm:ssZ'), 
            "timezone":request.data['timezone'], 
            "duration":request.data['duration'],
            # "agenda": request.data['agenda']
        }
        response = requests.post(api_url+'users/me/meetings', headers=headers, json=data)
        meet_detail = response.text
        detail = json.loads(meet_detail)
        print("🚀 ~ file: views.py:189 ~ detail:", detail)
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
    
    def get(self, request):
        access_token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        print("🚀 ~ file: views.py:174 ~ access_token:", access_token)
        user_id = Zoomuser.objects.get()
        print("🚀 ~ file: views.py:208 ~ userid:", user_id)
        headers = {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        }

        params = {
            'type': 'scheduled',
            'page_size': 30
        }

        response = requests.get(api_url+'users/me/meetings', headers=headers, params=params)
        print("🚀 ~ file: views.py:220 ~ response:", response)
        meetings = response.json()
        print("🚀 ~ file: views.py:222 ~ meetings:", meetings)
        data = meetings['meetings']
        return Response(data)
    
class updatemeeting(APIView):
    
    def get_object(self, request, id):
        access_token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        print("🚀 ~ file: views.py:174 ~ access_token:", access_token)
        meeting_id = CreateMeeting.objects.get(mid=id)
        headers = {
            'Authorization': 'Bearer ' + access_token
        }
        response = requests.get(api_url+'meetings/'+str(meeting_id), headers=headers)
        if response.status_code == 200:
            meeting_data = response.json()
            print("🚀 ~ file: views.py:237 ~ meeting_data:", meeting_data)
            return Response(meeting_data)
        return HttpResponse(response)

    def patch(self, request, id):
        access_token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        print("🚀 ~ file: views.py:174 ~ access_token:", access_token)
        meeting_id = self.get_object(id)
        # meeting_id = CreateMeeting.objects.get(mid=id)
        print("🚀 ~ file: views.py:232 ~ meeting_id:", meeting_id)
        date = datetime.datetime.now()
        url = 'https://api.zoom.us/v2/meetings/'+str(meeting_id)
        header = {'authorization': 'Bearer '+ access_token}
        meeting = requests.patch(url,json=request.data, headers=header)
        print("🚀 ~ file: views.py:237 ~ meeting:", meeting)
        serializer_class = MeetingSerializer(meeting_id,data=request.data)
        if serializer_class.is_valid(raise_exception=True):
            serializer_class.save()
            return Response(serializer_class.data)
        else :
            return Response("No data", serializer_class.error)
        
    def delete(self, request, meeting_id):
        access_token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
        print("🚀 ~ file: views.py:174 ~ access_token:", access_token)
        headers = {
            'Authorization': 'Bearer ' + access_token
        }
        response = requests.delete(api_url+'meetings/'+meeting_id, headers=headers)
        return response

    # def get(self, request, user_id):
    #     access_token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
    #     print("🚀 ~ file: views.py:174 ~ access_token:", access_token)
    #     headers = {
    #         'Authorization': 'Bearer ' + access_token
    #     }
    #     response = requests.get(api_url+'users/'+user_id, headers=headers)
    #     return response

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