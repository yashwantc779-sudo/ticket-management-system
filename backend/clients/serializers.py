from rest_framework import serializers
from .models import Client, Facility

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class FacilitySerializer(serializers.ModelSerializer):
    manager_name = serializers.CharField(source='manager.username', read_only=True)

    class Meta:
        model = Facility
        fields = ['id', 'name', 'manager', 'manager_name']