from django.urls import path
from .views import GetPlaceView

urlpatterns = [
    path('get-place-options', GetPlaceView.as_view()),
]