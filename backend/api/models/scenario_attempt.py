from django.core.exceptions import ValidationError 
from django.db import models 

from .choices import VERDICT_CHOICES 

class ScenarioAttempt(models.Model):
    room = models.ForeignKey(
        "api.Room", on_delete=models.CASCADE, related_name="attempts"
    )
    round = models.ForeignKey(
        "api.Round",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="attempts",
    )
    scenario = models.ForeignKey(
        "api.Scenario", on_delete=models.CASCADE, related_name="attempts"
    )
 
    verdict_chosen = models.CharField(max_length=20, choices=VERDICT_CHOICES, null=True, blank=True)
    confidence = models.PositiveSmallIntegerField()  # 1-5
 
    # Description Checklist
    checklist_account_name = models.BooleanField(default=False)
    checklist_account_age = models.BooleanField(default=False)
    checklist_post_type = models.BooleanField(default=False)
    checklist_claim = models.BooleanField(default=False)
    checklist_anomalies = models.BooleanField(default=False)
 
    # Tools used — list of TOOL_CHOICES keys; 2-tool minimum enforced in clean()
    tools_used = models.JSONField(default=list)
 
    followed_recommendation = models.BooleanField(null=True, blank=True)
    is_correct = models.BooleanField(null=True, blank=True)
 
    # Description Accuracy (1-5 each)
    description_completeness = models.PositiveSmallIntegerField()
    description_precision = models.PositiveSmallIntegerField()
    description_neutrality = models.PositiveSmallIntegerField()
    description_anomaly_awareness = models.PositiveSmallIntegerField()
 
    score_scroller = models.PositiveIntegerField(null=True, blank=True)
    score_verifier = models.PositiveIntegerField(null=True, blank=True)
 
    class Meta:
        unique_together = ("room", "scenario")
 
    def clean(self):
        if self.verdict_chosen and isinstance(self.tools_used, list) and len(self.tools_used) < 2:
            raise ValidationError(
                {"tools_used": "At least 2 tools must be used per attempt."}
            )
 
    def __str__(self):
        return f"Attempt: {self.scenario_id} in {self.room.room_code}"
 