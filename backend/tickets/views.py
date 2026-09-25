from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.contrib.auth.models import User

from .models import Ticket, TicketHistory
from .serializers import TicketSerializer
from clients.models import Client, Facility
from clients.serializers import ClientSerializer, FacilitySerializer
from departments.models import Department
from departments.serializers import DepartmentSerializer
from accounts.serializers import UserSerializer
from notifications.tasks import send_ticket_notification

class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = {
        'client__id': ['exact'],
        'client__name': ['icontains'],
        'department__id': ['exact'],
        'facility_manager__id': ['exact'],
        'status': ['exact'],
    }
    search_fields = ['title', 'description', 'client__name']
    ordering_fields = ['created_at']
    ordering = ['created_at']

    def get_queryset(self):
        # Database Query Optimization
        return Ticket.objects.select_related(
            'client', 'facility', 'facility_manager', 'department', 'assigned_worker'
        ).prefetch_related('history').all()

    def perform_create(self, serializer):
        with transaction.atomic():
            facility = serializer.validated_data.get('facility')
            fm = facility.manager if facility else None
            ticket = serializer.save(facility_manager=fm)

            user = self.request.user if self.request.user.is_authenticated else None
            TicketHistory.objects.create(
                ticket=ticket,
                performed_by=user,
                action=f"Ticket created for Client '{ticket.client.name}'"
            )

            send_ticket_notification.delay(ticket.id)

    def perform_update(self, serializer):
        with transaction.atomic():
            old_status = serializer.instance.status
            ticket = serializer.save()
            new_status = ticket.status

            action = f"Status changed from {old_status} to {new_status}"
            if 'assigned_worker' in serializer.validated_data:
                worker = serializer.validated_data['assigned_worker']
                action += f" | Worker Assigned: {worker.username if worker else 'None'}"

            user = self.request.user if self.request.user.is_authenticated else None
            TicketHistory.objects.create(
                ticket=ticket,
                performed_by=user,
                action=action
            )

class MetaDataView(APIView):
   
    def get(self, request):
        return Response({
            'clients': ClientSerializer(Client.objects.all(), many=True).data,
            'departments': DepartmentSerializer(Department.objects.all(), many=True).data,
            'facilities': FacilitySerializer(Facility.objects.all(), many=True).data,
            'users': UserSerializer(User.objects.select_related('profile').all(), many=True).data,
        })