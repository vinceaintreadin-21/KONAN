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
        room = serializer.save(room_code=generate_room_code())

        Player.objects.create(
            room=room, 
            name=request.data.get("name", "Player A"),
            device_type="mobile",
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


    
    