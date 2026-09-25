from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import UserProfile, UserRole
from clients.models import Client, Facility
from departments.models import Department
from tickets.models import Ticket, TicketStatus

class Command(BaseCommand):
    help = 'Seeds initial test data'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding modular test data...")

        # 1. Users
        users = [
            ('fm_rajesh', 'rajesh@urbanvault.in', UserRole.FACILITY_MANAGER),
            ('poc_electrical', 'elec@urbanvault.in', UserRole.DEPARTMENT_POC),
            ('poc_plumbing', 'plumb@urbanvault.in', UserRole.DEPARTMENT_POC),
            ('worker_amit', 'amit@urbanvault.in', UserRole.TECHNICIAN),
        ]
        created_users = {}
        for username, email, role in users:
            u, _ = User.objects.get_or_create(username=username, defaults={'email': email})
            u.set_password('pass1234')
            u.save()
            UserProfile.objects.get_or_create(user=u, defaults={'role': role})
            created_users[username] = u

        # 2. Clients
        client_alpha, _ = Client.objects.get_or_create(
            name="Alpha Corp", 
            defaults={'email': 'contact@alpha.com', 'office_name': 'Block 4, Wing A'}
        )
        client_beta, _ = Client.objects.get_or_create(
            name="Beta Solutions", 
            defaults={'email': 'info@beta.com', 'office_name': 'Block 2, Wing B'}
        )

        # 3. Departments
        dept_elec, _ = Department.objects.get_or_create(name='Electrical')
        dept_plumb, _ = Department.objects.get_or_create(name='Plumbing')
        dept_hvac, _ = Department.objects.get_or_create(name='HVAC')

        # 4. Facility
        facility, _ = Facility.objects.get_or_create(
            name="UrbanVault HSR Hub",
            defaults={'manager': created_users['fm_rajesh']}
        )

        # 5. Tickets
        sample_tickets = [
            ("AC Cooling down in Main Bay", "Conference room AC leaking water.", TicketStatus.OPEN, client_alpha, dept_hvac),
            ("Power Fluctuations Floor 3", "Workstation screens flickering.", TicketStatus.ASSIGNED, client_alpha, dept_elec),
            ("Restroom Tap Leakage", "Water dripping from faucet.", TicketStatus.IN_PROGRESS, client_beta, dept_plumb),
            ("Main Entrance Light Off", "Tube light replaced.", TicketStatus.RESOLVED, client_beta, dept_elec),
        ]

        for title, desc, status, c, d in sample_tickets:
            Ticket.objects.get_or_create(
                title=title,
                defaults={
                    'description': desc,
                    'status': status,
                    'client': c,
                    'facility': facility,
                    'facility_manager': created_users['fm_rajesh'],
                    'department': d,
                    'assigned_worker': created_users['worker_amit'] if status != TicketStatus.OPEN else None
                }
            )

        self.stdout.write(self.style.SUCCESS("Seeding Completed Successfully!"))