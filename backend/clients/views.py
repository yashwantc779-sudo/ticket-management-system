from rest_framework import viewsets
from .models import Client, Facility
from .serializers import ClientSerializer, FacilitySerializer

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.select_related('manager').all()
    serializer_class = FacilitySerializer