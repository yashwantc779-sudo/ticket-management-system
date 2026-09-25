from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, FacilityViewSet

router = DefaultRouter()
router.register(r'facilities', FacilityViewSet, basename='facility')
router.register(r'', ClientViewSet, basename='client')

urlpatterns = router.urls