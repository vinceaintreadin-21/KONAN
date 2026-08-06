from rest_framework.routers import DefaultRouter

from . import views 

router = DefaultRouter()

router.register(r"scenarios", views.ScenarioViewSet, basename="scenario")
router.register(r"rooms", views.RoomViewSet, basename="room")
router.register(r"players", views.PlayerViewSet, basename="player")
router.register(r"rounds", views.RoundViewSet, basename="round")
router.register(r"attempts", views.ScenarioAttemptViewSet, basename="attempt")
router.register(r"recommendations", views.VerdictRecommendationViewSet, basename="recommendation")

urlpatterns = router.urls

