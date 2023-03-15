from django.urls import path
from .views import *

urlpatterns = [
    # path('register',RegisterApiView.as_view()),
    # path('login', LoginView.as_view(), name='login'),
    # path('createmeet', ZoomMeetings.as_view()),
    # path('updatemeet/<int:id>', ZoomMeetings.as_view()),
    # path('meeting', MeetingList.as_view()),
    # path('profile', Profile.as_view()), 
    path('code',ZoomUser.as_view()),
    path('tokens', ZoomToken.as_view()),
]