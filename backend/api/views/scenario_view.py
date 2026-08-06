from rest_framework import viewsets
from rest_framework.exceptions import ValidationError

from ..models import Room, Scenario 
from ..serializers import ScrollerScenarioSerializer, VerifierScenarioSerializer 

class ScenarioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Scenario.objects.all()

    def get_serializer_class(self):
        role = self.request.query_params.get("role")
        if role == "scroller":
            return ScrollerScenarioSerializer
        elif role == "verifier":
            return VerifierScenarioSerializer
        raise ValidationError({"role": "Must be 'scroller' or 'verifier'"})
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        room_id = self.request.query_params.get("room")
        if room_id and str(room_id).isdigit():
            room = Room.objects.filter(id=room_id).first()
            context["reveal_phase"] = bool(room and room.phase == "reveal")
        return context

    