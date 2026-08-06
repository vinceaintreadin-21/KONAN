from rest_framework import serializers

#import Scenario Model
from ..models import Scenario 

REVEAL_FIELDS =  [
    "correct_verdict",
    "ground_truth_explanation",
    "primary_verification_signal",
    
]

class VerifierScenarioSerializer(serializers.ModelSerializer):
    """Payloads only; Ground truth hidden unless room in reveal phase"""

    class Meta: 
        model = Scenario 
        fields = [
            "id",
            "account_name",
            "handle",
            "account_created_days_ago",
            "account_history",
            "domain_authority",
            "image_metadata",
            "whois",
            "cross_source",
            "keyword_search",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if self.context.get("reveal_phase"):
            for field in REVEAL_FIELDS:
                data[field] = getattr(instance, field)
        return data