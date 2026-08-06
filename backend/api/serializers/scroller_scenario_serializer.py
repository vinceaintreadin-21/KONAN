from rest_framework import serializers

#import Scenario Model
from ..models import Scenario 

class ScrollerScenarioSerializer(serializers.ModelSerializer):
    """Content only; no tool payloards or ground truth should be revealed"""

    class Meta:
        model = Scenario
        fields = [
            "id",
            "image_url",
            "caption",
            "account_name",
            "handle",
            "follower_count",
            "verified_badge",
        ]