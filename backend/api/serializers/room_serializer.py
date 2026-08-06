from rest_framework import serializers

from ..models import Room 
from .player_serializer import PlayerSerializer

class RoomSerializer(serializers.ModelSerializer):
    """Serializers a Room instance"""

    players = PlayerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Room
        fields = [
            "id",
            "room_code",
            "phase",
            "current_scenario",
            "round_number",
            "players",
            "created_at"
        ]
        read_only_fields = [
            "room_code",
            "phase",
            "current_scenario",
            "round_number"
        ]
        