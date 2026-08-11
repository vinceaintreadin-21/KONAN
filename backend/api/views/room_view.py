from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import Player, Room 
from ..serializers import PlayerSerializer, RoomSerializer 
from .helpers import generate_room_code

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        from ..models import Scenario
        import random
        scenarios = list(Scenario.objects.all())
        scenario = random.choice(scenarios) if scenarios else None

        room = serializer.save(
            room_code=generate_room_code(), 
            current_scenario=scenario,
        ) 

        Player.objects.create(
            room=room,
            device_type="mobile",
            name=request.data.get("name", "Player A"),
        )

        return Response(
            RoomSerializer(room).data, 
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=["post"])
    def join(self, request):
        room = Room.objects.filter(room_code=request.data.get("room_code", "")).first()

        if room is None:
            return Response ({
                "detail": "Room not found."
            }, status=status.HTTP_404_NOT_FOUND)
        if room.players.count() >= 2:
           return Response ({
                "detail": "Room is full."
           }, status=status.HTTP_400_BAD_REQUEST)

        player = Player.objects.create(
            room=room, 
            name=request.data.get("name", "Player B"),
            device_type="desktop",
        ) 

        return Response(
            PlayerSerializer(player).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=["post"])
    def next_round(self, request, pk=None):
        room = self.get_object()

        from ..models import Scenario 

        #get scenario IDs already played
        played_ids = list(room.attempts.values_list("scenario_id", flat=True))

        #get new scenario that hasn't been played yet
        remaining = Scenario.objects.exclude(id__in=played_ids)
        if not remaining.exists():
            return Response({
                "detail": "No scenarios left. Game over."
            }, status=status.HTTP_400_BAD_REQUEST)

        import random 

        next_scenario = random.choice(list(remaining))

        room.round_number += 1
        room.current_scenario = next_scenario 
        room.phase = "hold"
        room.save(update_fields=["round_number", "current_scenario", "phase"])

        return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            


    
    