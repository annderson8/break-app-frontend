from django.urls import path
from .views import GenerateTokenView, GetPaymentTotalView, ProcessPaymentView,CreatePaymentIntentView,StripeWebhookView

app_name="payment"

urlpatterns = [
    path('get-payment-total', GetPaymentTotalView.as_view()),
    path('get-token', GenerateTokenView.as_view()),
    path('make-payment', ProcessPaymentView.as_view()),
    path('create-payment-intent', CreatePaymentIntentView.as_view()),
    path('stripe-webhook', StripeWebhookView, name='stripe-webhook'),
]