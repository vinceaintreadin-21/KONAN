from rest_framework import serializers 

from ..models import VerdictRecommendation 
from .validators import validate_confidence 

class VerdictRecommendationSerializer(serializers.ModelSerializer):

    class Meta:
        model = VerdictRecommendation 
        fields = [
            "id",
            "attempt",
            "recommended_by",
            "verdict",
            "primary_signal",
            "confidence"
        ]
        extra_kwargs = {
            "confidence":{
                "validators": [
                    validate_confidence
                ]
            }
        }

        