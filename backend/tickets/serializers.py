from rest_framework import serializers
from .models import Ticket, TicketHistory, TicketStatus

class TicketHistorySerializer(serializers.ModelSerializer):
    performed_by_name = serializers.CharField(source='performed_by.username', read_only=True)

    class Meta:
        model = TicketHistory
        fields = ['id', 'action', 'performed_by_name', 'timestamp']

class TicketSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    facility_manager_name = serializers.CharField(source='facility_manager.username', read_only=True)
    assigned_worker_name = serializers.CharField(source='assigned_worker.username', read_only=True)
    history = TicketHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description', 'status',
            'client', 'client_name',
            'facility',
            'facility_manager', 'facility_manager_name',
            'department', 'department_name',
            'assigned_worker', 'assigned_worker_name',
            'history', 'created_at', 'updated_at'
        ]
        read_only_fields = ['facility_manager', 'created_at', 'updated_at']

    def validate_status(self, new_status):
        if not self.instance:
            return new_status

        current_status = self.instance.status
        allowed_transitions = {
            TicketStatus.OPEN: [TicketStatus.OPEN, TicketStatus.ASSIGNED],
            TicketStatus.ASSIGNED: [TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS],
            TicketStatus.IN_PROGRESS: [TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED],
            TicketStatus.RESOLVED: [TicketStatus.RESOLVED]
        }

        if new_status not in allowed_transitions.get(current_status, []):
            raise serializers.ValidationError(
                f"Invalid status transition from {current_status} to {new_status}."
            )
        return new_status