from django.db import models
from .choices import *  

class Room(models.Model):
    room_code = models.CharField(max_length=16, unique=True)
    phase = models.CharField(max_length=20, choices=PHASE_CHOICES, default="hold")
    
    current_scenario = models.ForeignKey(
        "api.Scenario",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="rooms",
    )
    round_number = models.PositiveSmallIntegerField(default=1)
 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    def __str__(self):
        return self.room_code