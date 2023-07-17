from django.shortcuts import render
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.cart.models import Cart, CartItem
from apps.coupons.models import FixedPriceCoupon, PercentageCoupon
from apps.orders.models import Order, OrderItem
from apps.product.models import Product
from apps.shipping.models import Shipping
from django.core.mail import send_mail
from django.conf import settings

from django.views.decorators.csrf import csrf_exempt
import json
from django.http import HttpResponse

from django.contrib.auth import get_user_model
User = get_user_model()

import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY
endpoint_secret = settings.STRIPE_WEBHOOK_SECRET


class CreatePaymentIntentView(APIView):
    def post(self, request, format=None):
        user = self.request.user
        data = self.request.data

        tax = 0.1

        shipping_id = str(data['shipping_id'])
        coupon_name = str(data['coupon_name'])

        # # revisar si datos de shipping son validos
        # if not Shipping.objects.filter(id__iexact=shipping_id).exists():
        #     return Response(
        #         {'error': 'Invalid shipping option'},
        #         status=status.HTTP_404_NOT_FOUND
        #     )

        cart = Cart.objects.get(user=user)

        # revisar si usuario tiene items en carrito
        if not CartItem.objects.filter(cart=cart).exists():
            return Response(
                {'error': 'Need to have items in cart'},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_items = CartItem.objects.filter(cart=cart)

        # revisar si hay stock

        for cart_item in cart_items:
            if not Product.objects.filter(id=cart_item.product.id).exists():
                return Response(
                    {'error': 'Transaction failed, a proudct ID does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )
            if int(cart_item.count) > int(cart_item.product.quantity):
                return Response(
                    {'error': 'Not enough items in stock'},
                    status=status.HTTP_200_OK
                )

        total_amount = 0.0

        for cart_item in cart_items:
            total_amount += (float(cart_item.product.price)
                             * float(cart_item.count))

        # Cupones
        if coupon_name != '':
            if FixedPriceCoupon.objects.filter(name__iexact=coupon_name).exists():
                fixed_price_coupon = FixedPriceCoupon.objects.get(
                    name=coupon_name
                )
                discount_amount = float(fixed_price_coupon.discount_price)

                if discount_amount < total_amount:
                    total_amount -= discount_amount

            elif PercentageCoupon.objects.filter(name__iexact=coupon_name).exists():
                percentage_coupon = PercentageCoupon.objects.get(
                    name=coupon_name
                )
                discount_percentage = float(
                    percentage_coupon.discount_percentage)

                if discount_percentage > 1 and discount_percentage < 100:
                    total_amount -= (total_amount *
                                     (discount_percentage / 100))

        total_amount += (total_amount * tax)

        shipping_price = 0

        total_amount += float(shipping_price)
        total_amount = round(total_amount, 2)

        total_amount_cents = int(float(total_amount) * 100)

        print('⚠️  Valor a Pagar' + str(total_amount_cents))

        try:
            intent = stripe.PaymentIntent.create(
                amount=total_amount_cents,
                currency='aud',
                automatic_payment_methods={
                    'enabled': True,
                },
                metadata={
                    "user": user,
                    "shipping_price": shipping_price
                    },
            )
            return Response(
                {'client_secret': intent.client_secret},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': str(e)})



@csrf_exempt
def StripeWebhookView(request):
    payload = request.body
    event = None
    try:
        event = json.loads(payload)
    except Exception as e:
        print('⚠️  Webhook error while parsing basic request.' + str(e))
        return HttpResponse(status=400)
    if endpoint_secret:
        sig_header = request.headers.get('stripe-signature')
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except stripe.error.SignatureVerificationError as e:
            print('⚠️  Webhook signature verification failed.' + str(e))
            return HttpResponse(status=400)

    if event and event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        
        print('⚠️  payment_intent ****: ' + str(payment_intent))

        metadata = payment_intent['metadata']
        # user_id = metadata['user']
        user_id = 2
        user = User.objects.get(id=user_id)
        shipping_price = metadata['shipping_price']

        transaction_id=payment_intent['id'],
        amount=payment_intent['amount'],
        full_name = "Nombre completo"


        cart = Cart.objects.get(user=user)

        # revisar si usuario tiene items en carrito
        if not CartItem.objects.filter(cart=cart).exists():
            print('⚠️  Need to have items in cart.')
            return HttpResponse(status=400)

        cart_items = CartItem.objects.filter(cart=cart)

        # revisar si hay stock

        for cart_item in cart_items:
            if not Product.objects.filter(id=cart_item.product.id).exists():
                print('⚠️  Transaction failed, a proudct ID does not exist.')
                return HttpResponse(status=400)
            if int(cart_item.count) > int(cart_item.product.quantity):
                print('⚠️  Not enough items in stock')
                return HttpResponse(status=200)

        for cart_item in cart_items:
                update_product = Product.objects.get(id=cart_item.product.id)

                # encontrar cantidad despues de coompra
                quantity = int(update_product.quantity) - int(cart_item.count)

                # obtener cantidad de producto por vender
                sold = int(update_product.sold) + int(cart_item.count)

                # actualizar el producto
                Product.objects.filter(id=cart_item.product.id).update(
                    quantity=quantity, sold=sold
                )

            # crear orden
        try:
            order = Order.objects.create(
                user=user,
                transaction_id = transaction_id[0],
                amount = float(amount[0]/100),
                full_name = full_name,
                shipping_price=float(shipping_price)
            )
        except  Exception as e:
            print('⚠️  Transaction succeeded but failed to create the order')
            print(f'Error: {e}')
            return HttpResponse(status=500)


        for cart_item in cart_items:
            try:
                # get the product
                product = Product.objects.get(id=cart_item.product.id)

                # create an OrderItem for each item in the cart_item
                for _ in range(cart_item.count):
                    OrderItem.objects.create(
                        product=product,
                        order=order,
                        name=product.name,
                        price=cart_item.product.price,
                    )
            except Exception as e:
                print(f'⚠️  Transaction succeeded and order created, but failed to create an order item due to error: {e}')
                return HttpResponse(status=500)
        try:
            send_mail(
                    'Your Order Details',
                    'Hey ' + full_name + ','
                    + '\n\nWe recieved your order!'
                    + '\n\nGive us some time to process your order and ship it out to you.'
                    + '\n\nYou can go on your user dashboard to check the status of your order.'
                    + '\n\nSincerely,'
                    + '\nShop Time',
                    'mail@ninerogues.com',
                    [user.email],
                    fail_silently=False
                )
        except:
            print('⚠️  Transaction succeeded and order created, but failed to send email.')
            return HttpResponse(status=500)

        try:
                # Vaciar carrito de compras
                CartItem.objects.filter(cart=cart).delete()

                # Actualizar carrito
                Cart.objects.filter(user=user).update(total_items=0)
        except:
            print('⚠️  Transaction succeeded and order successful, but failed to clear cart.')
            return HttpResponse(status=500)

        return HttpResponse(status=200)
        
    elif event['type'] == 'payment_method.attached':
        payment_method = event['data']['object']

    # Passed signature verification
    return HttpResponse(status=200)


# Payment without secure key

# @csrf_exempt
# def StripeWebhookView(request):
#   payload = request.body
#   event = None

#   try:
#     event = stripe.Event.construct_from(
#       json.loads(payload), stripe.api_key
#     )
#   except ValueError as e:
#     # Invalid payload
#     return HttpResponse(status=400)

#   # Handle the event
#   if event.type == 'payment_intent.succeeded':
#     payment_intent = event.data.object # contains a stripe.PaymentIntent
#     # Then define and call a method to handle the successful payment intent.
#     # handle_payment_intent_succeeded(payment_intent)

#     print('Payment for {} succeeded'.format(payment_intent['amount']))

#   elif event.type == 'payment_method.attached':
#     payment_method = event.data.object # contains a stripe.PaymentMethod
#     # Then define and call a method to handle the successful attachment of a PaymentMethod.
#     # handle_payment_method_attached(payment_method)
#   # ... handle other event types
#   else:
#     print('Unhandled event type {}'.format(event.type))

#   return HttpResponse(status=200)



class GetPaymentTotalView(APIView):
    def get(self, request, format=None):
        user = self.request.user

        tax = 0.1

        coupon_name = request.query_params.get('coupon_name')
        coupon_name = str(coupon_name)

        try:
            cart = Cart.objects.get(user=user)

            # revisar si existen iitems
            if not CartItem.objects.filter(cart=cart).exists():
                return Response(
                    {'error': 'Need to have items in cart'},
                    status=status.HTTP_404_NOT_FOUND
                )

            cart_items = CartItem.objects.filter(cart=cart)

            for cart_item in cart_items:
                if not Product.objects.filter(id=cart_item.product.id).exists():
                    return Response(
                        {'error': 'A proudct with ID provided does not exist'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                if int(cart_item.count) > int(cart_item.product.quantity):
                    return Response(
                        {'error': 'Not enough items in stock'},
                        status=status.HTTP_200_OK
                    )

                total_amount = 0.0
                total_compare_amount = 0.0

                for cart_item in cart_items:
                    total_amount += (float(cart_item.product.price)
                                     * float(cart_item.count))
                    total_compare_amount += (float(cart_item.product.compare_price)
                                             * float(cart_item.count))

                total_compare_amount = round(total_compare_amount, 2)
                original_price = round(total_amount, 2)

                # Cupones

                total_after_coupon = 0.0

                if coupon_name != '':
                    # Revisar si cupon de precio fijo es valido
                    if FixedPriceCoupon.objects.filter(name__iexact=coupon_name).exists():
                        fixed_price_coupon = FixedPriceCoupon.objects.get(
                            name=coupon_name
                        )
                    discount_amount = float(fixed_price_coupon.discount_price)
                    if discount_amount < total_amount:
                        total_amount -= discount_amount
                        total_after_coupon = total_amount

                    elif PercentageCoupon.objects.filter(name__iexact=coupon_name).exists():
                        percentage_coupon = PercentageCoupon.objects.get(
                            name=coupon_name
                        )
                        discount_percentage = float(
                            percentage_coupon.discount_percentage)

                        if discount_percentage > 1 and discount_percentage < 100:
                            total_amount -= (total_amount *
                                             (discount_percentage / 100))
                            total_after_coupon = total_amount

                # Total despues del cupon
                total_after_coupon = round(total_after_coupon, 2)

                # Impuesto estimado
                estimated_tax = round(total_amount * tax, 2)

                total_amount += (total_amount * tax)

                shipping_cost = 0.0

                total_amount = round(total_amount, 2)

                return Response({
                    'original_price': f'{original_price:.2f}',
                    'total_after_coupon': f'{total_after_coupon:.2f}',
                    'total_amount': f'{total_amount:.2f}',
                    'total_compare_amount': f'{total_compare_amount:.2f}',
                    'estimated_tax': f'{estimated_tax:.2f}',
                    'shipping_cost': f'{shipping_cost:.2f}'
                },
                    status=status.HTTP_200_OK
                )

        except:
            return Response(
                {'error': 'Something went wrong when retrieving payment total information'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

