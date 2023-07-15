from django.urls import path
from .views import ListOrdersView, ListOrderDetailView, UpdateItemView

app_name="orders"

urlpatterns = [
    path('get-orders', ListOrdersView.as_view()),
    path('get-order/<transactionId>', ListOrderDetailView.as_view()),
    path('update-data-order', UpdateItemView.as_view()),
]