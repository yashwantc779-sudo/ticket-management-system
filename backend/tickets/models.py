from django.db import models
from django.contrib.auth.models import User
from clients.models import Client, Facility
from departments.models import Department

class TicketStatus(models.TextChoices):
    OPEN = 'OPEN', 'Open'
    ASSIGNED = 'ASSIGNED', 'Assigned'
    IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
    RESOLVED = 'RESOLVED', 'Resolved'

class Ticket(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=TicketStatus.choices,
        default=TicketStatus.OPEN,
        db_index=True
    )
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='tickets')
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='tickets')
    facility_manager = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='fm_tickets'
    )
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='tickets')
    assigned_worker = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"#{self.id} - {self.title} [{self.status}]"

class TicketHistory(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='history')
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ticket #{self.ticket.id}: {self.action}"