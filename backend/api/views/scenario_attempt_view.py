from rest_framework import status, viewsets 
from rest_framework.response import Response 
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from ..models import ScenarioAttempt
from ..scoring import compute_scoring 
from ..serializers import ScenarioAttemptSerializer 

def broadcast_room_update(room_id, event_name, payload):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"room_{room_id}",
        {
             "type": "room_event",
             "message": {
                "event": event_name,
                **payload,
             }
        }
    )

class ScenarioAttemptViewSet(viewsets.ModelViewSet):
    queryset = ScenarioAttempt.objects.all()
    serializer_class = ScenarioAttemptSerializer 

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attempt = serializer.save()

        self._apply_scoring(attempt)

        room = attempt.room
        room.phase = "verification"
        room.save(update_fields=["phase"])

        broadcast_room_update(
            room_id=room.id,
            event_name="phase_changed",
            payload={
                "phase": room.phase
            }
        )

        return Response(
            ScenarioAttemptSerializer(attempt).data, 
            status=status.HTTP_201_CREATED
        )
    def perform_update(self, serializer):
        attempt = serializer.save()

        # apply score
        self._apply_scoring(attempt)

        # transition to reveal
        room = attempt.room
        room.phase = "reveal"
        room.save(update_fields=["phase"])

        broadcast_room_update(
            room_id=room.id,
            event_name="phase_changed",
            payload={
                "phase": room.phase
            }
        )
    
    def _apply_scoring(self, attempt):
        recommendation = attempt.recommendations.first()
        scoring = compute_scoring(
            verdict_chosen=attempt.verdict_chosen,
            correct_verdict=attempt.scenario.correct_verdict,
            tools_used=attempt.tools_used,
            checklist={
                "checklist_account_name": attempt.checklist_account_name,
                "checklist_account_age": attempt.checklist_account_age,
                "checklist_post_type": attempt.checklist_post_type,
                "checklist_claim": attempt.checklist_claim,
                "checklist_anomalies": attempt.checklist_anomalies,
            },
            confidence=attempt.confidence,
            followed_recommendation=attempt.followed_recommendation,
            recommended_verdict=recommendation.verdict if recommendation else None,
        )
        attempt.is_correct = scoring["is_correct"]
        attempt.score_scroller = scoring["score_scroller"]
        attempt.score_verifier = scoring["score_verifier"]
        attempt.save(update_fields=["is_correct", "score_scroller", "score_verifier"])
        return attempt

