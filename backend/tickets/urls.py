from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, MetaDataView

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('meta/', MetaDataView.as_view(), name='metadata'),
    path('', include(router.urls)),
]