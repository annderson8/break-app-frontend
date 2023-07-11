from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Place
from .serializers import PlaceSerializer


class GetPlaceView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        if Place.objects.all().exists():
            place_options = Place.objects.order_by('name').all()
            place_options = PlaceSerializer(place_options, many=True)

            return Response(
                {'place_options': place_options.data},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'No shipping options available'},
                status=status.HTTP_404_NOT_FOUND
            )