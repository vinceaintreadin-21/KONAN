from django.db import models
 
from .choices import VERDICT_CHOICES
 
 
class VerdictRecommendation(models.Model):
    attempt = models.ForeignKey(
        "api.ScenarioAttempt",
        on_delete=models.CASCADE,
        related_name="recommendations",
    )
    recommended_by = models.ForeignKey(
        "api.Player",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="recommendations",
    )
    verdict = models.CharField(max_length=20, choices=VERDICT_CHOICES)
    primary_signal = models.TextField()
    confidence = models.PositiveSmallIntegerField()  # 1-5
 
    def __str__(self):
        return f"Recommendation for attempt {self.attempt_id}: {self.verdict}"