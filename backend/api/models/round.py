from django.db import models 

class Round(models.Model):
    room = models.ForeignKey(
        "api.Room", on_delete=models.CASCADE, related_name="rounds"
    )
    round_number = models.PositiveSmallIntegerField()
    is_solo = models.BooleanField(default=False)

    scroller_player = models.ForeignKey(
        "api.Player", on_delete=models.SET_NULL, null=True, related_name="scroller_rounds"
    )
    verifier_player = models.ForeignKey(
        "api.Player", on_delete=models.SET_NULL, null=True, related_name="verifier_rounds"
    )

    #Round summary fields
    highest_error_verdict_type = models.CharField(
        max_length=20, null=True, blank=True
    )
    most_used_tool = models.CharField(max_length=30, null=True, blank=True)
    least_used_tool = models.CharField(max_length=30, null=True, blank=True)
    avg_description_accuracy = models.FloatField(null=True, blank=True)

    class Meta:
        unique_together = ('room', 'round_number')
    
    def __str__(self):
        return f"Round {self.round_number} ({self.room.room_code})"