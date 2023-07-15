from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem
from .serializers import OrderItemSerializer
from apps.product.models import Product
from apps.product.serializers import ProductSerializer
from apps.place.serializers import PlaceSerializer


class ListOrdersView(APIView):
    def get(self, request, format=None):
        user = self.request.user
        try:
            orders = Order.objects.order_by('-date_issued').filter(user=user)
            result = []

            for order in orders:
                item = {}
                item['id'] = order.id
                item['status'] = order.status
                item['transaction_id'] = order.transaction_id
                item['amount'] = order.amount
                item['shipping_price'] = order.shipping_price
                item['date_issued'] = order.date_issued

                item['order_items'] = []

                order_items = OrderItem.objects.order_by(
                    '-date_added').filter(order=order)

                for order_item in order_items:
                    sub_item = {}

                    product = Product.objects.get(id=order_item.product.id)
                    product = ProductSerializer(product)

                    place = PlaceSerializer(order_item.place)

                    sub_item['id'] = order_item.id
                    sub_item['product'] = product.data
                    sub_item['name'] = order_item.name
                    sub_item['price'] = order_item.price
                    sub_item['place'] = place.data
                    sub_item['date_delivery'] = order_item.date_delivery
                    sub_item['time_delivery'] = order_item.time_delivery
                    sub_item['date_added'] = order_item.date_added

                    item['order_items'].append(sub_item)

                result.append(item)

            return Response(
                {'orders': result},
                status=status.HTTP_200_OK
            )
        except Exception as e:  # Capture the exception to help with debugging
            return Response(
                {'error': f'Something went wrong when retrieving orders: {e}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ListOrderDetailView(APIView):
    def get(self, request, transactionId, format=None):
        user = self.request.user

        try:
            if Order.objects.filter(user=user, transaction_id=transactionId).exists():
                order = Order.objects.get(
                    user=user, transaction_id=transactionId)
                result = {}
                result['status'] = order.status
                result['transaction_id'] = order.transaction_id
                result['amount'] = order.amount
                result['full_name'] = order.full_name
                result['shipping_price'] = order.shipping_price
                result['date_issued'] = order.date_issued

                order_items = OrderItem.objects.order_by(
                    '-date_added').filter(order=order)
                result['order_items'] = []

                for order_item in order_items:
                    sub_item = {}
                    sub_item['id'] = order_item.id
                    sub_item['product'] = order_item.product
                    sub_item['name'] = order_item.name
                    sub_item['price'] = order_item.price
                    sub_item['place'] = order_item.place
                    sub_item['date_delivery'] = order_item.date_delivery
                    sub_item['time_delivery'] = order_item.time_delivery
                    sub_item['date_added'] = order_item.date_added

                    result['order_items'].append(sub_item)
                return Response(
                    {'order': result},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'error': 'Order with this transaction ID does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving order detail'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UpdateItemView(APIView):
    def put(self, request, format=None):
        user = self.request.user
        data = request.data

        print("entra a view" + str(data))
        try:
            # Aquí asumimos que recibimos el 'id' del OrderItem que se desea actualizar
            order_item = OrderItem.objects.get(id=data['order_id'])
        except:
            return Response(
                {'error': 'Something went wrong when updating item'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Actualizamos el OrderItem utilizando un serializador
        serializer = OrderItemSerializer(order_item, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'order': serializer.data}, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)  # <-- Agrega esta línea
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)