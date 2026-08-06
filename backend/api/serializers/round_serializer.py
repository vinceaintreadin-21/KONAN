from rest_framework import serializers

from ..models import Round


class RoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = [
            "id", "room", "round_number", "is_solo",
            "scroller_player", "verifier_player",
            "highest_error_verdict_type", "most_used_tool",
            "least_used_tool", "avg_description_accuracy",
        ]