from django.db import models
 
from .choices import DEVICE_TYPE_CHOICES
 
 
class Player(models.Model):
    room = models.ForeignKey(
        "api.Room", on_delete=models.CASCADE, related_name="players"
    )
    name = models.CharField(max_length=100)
    device_type = models.CharField(max_length=10, choices=DEVICE_TYPE_CHOICES)
    score = models.PositiveIntegerField(default=0)
 
    def __str__(self):
        return f"{self.name} ({self.room.room_code})"