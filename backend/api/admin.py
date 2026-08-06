from django.contrib import admin

from .models import (
    Player, Room, Round, Scenario, ScenarioAttempt, VerdictRecommendation,
)

admin.site.register(Scenario)
admin.site.register(Room)
admin.site.register(Player)
admin.site.register(Round)
admin.site.register(ScenarioAttempt)
admin.site.register(VerdictRecommendation)
