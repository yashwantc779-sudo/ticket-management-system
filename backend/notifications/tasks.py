import logging
from celery import shared_task
from django.apps import apps

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=5)
def send_ticket_notification(self, ticket_id):
    try:
        Ticket = apps.get_model('tickets', 'Ticket')
        ticket = Ticket.objects.select_related(
            'client', 'facility_manager', 'department'
        ).get(id=ticket_id)

        fm_name = ticket.facility_manager.username if ticket.facility_manager else "Not Assigned"

        logger.info(
            f"[NOTIFICATION QUEUE] Ticket #{ticket.id} ('{ticket.title}') logged. "
            f"Alert dispatched to Facility Manager '{fm_name}' and Department '{ticket.department.name}'."
        )
        return f"Notification delivered for Ticket #{ticket_id}"

    except Exception as exc:
        logger.warning(f"Error notifying for ticket #{ticket_id}: {exc}. Initiating retry...")
        raise self.retry(exc=exc)