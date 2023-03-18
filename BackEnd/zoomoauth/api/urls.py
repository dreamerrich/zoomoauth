from django.urls import path
from .views import *

urlpatterns = [
    path('user',ZoomMeetings.as_view()),
    path('createmeet', ZoomMeetings.as_view()),
    path('updatemeet/<int:id>', ZoomMeetings.as_view()),
    path('meeting', MeetingList.as_view()),
    # path('profile', Profile.as_view()), 
    path('code',ZoomUser.as_view()),
    path('tokens', ZoomToken.as_view()),
]