from rest_framework import serializers 

from ..models import ScenarioAttempt 
from ..models.choices import TOOL_CHOICES 
from .validators import validate_1_to_5, validate_confidence 

class ScenarioAttemptSerializer(serializers.ModelSerializer):
    """Serializes a ScenarioAttempt instance"""

    class Meta: 
        model = ScenarioAttempt 
        fields = [
            "id",
            "room",
            "round",
            "scenario",
            "verdict_chosen",
            "confidence",
            "checklist_account_name",
            "checklist_account_age",
            "checklist_post_type",
            "checklist_claim",
            "checklist_anomalies",
            "tools_used",
            "followed_recommendation",
            "is_correct",
            "description_neutrality",
            "description_anomaly_awareness",
            "score_scroller",
            "score_verifier",
            "description_completeness",
            "description_precision"
        ]
        read_only_fields = [
            "is_correct",
            "score_scroller",
            "score_verifier"
        ]
        extra_kwargs = {
            "confidence": {
                "validators": [
                    validate_confidence
                ]
            },
            "description_completeness": {
                "validators": [
                    validate_1_to_5
                ]
            },
            "description_precision": {
                "validators": [
                    validate_1_to_5   
                ]
            },
            "description_neutrality" : {
                "validators": [
                    validate_1_to_5
                ]
            },
            "description_anomaly_awareness": {
                "validators": [
                    validate_1_to_5   
                ]
            }
        }
    
    def validate_tools_used(self, value):
        valid_keys = [key for key, _ in TOOL_CHOICES]
        unknown = set(value) - set(valid_keys)

        if unknown:
            raise serializers.ValidationError(f"Unknown tool keys: {sorted(unknown)}")
        if len(value) < 2: 
            raise serializers.ValidationError("At least 2 tools must be used.")
        return value
        