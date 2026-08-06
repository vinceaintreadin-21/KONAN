from rest_framework import status, viewsets 
from rest_framework.response import Response 

from ..models import ScenarioAttempt
from ..scoring import compute_scoring 
from ..serializers import ScenarioAttemptSerializer 

class ScenarioAttemptViewSet(viewsets.ModelViewSet):
    queryset = ScenarioAttempt.objects.all()
    serializer_class = ScenarioAttemptSerializer 

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attempt = serializer.save()

        self._apply_scoring(attempt)

        return Response(
            ScenarioAttemptSerializer(attempt).data, 
            status=status.HTTP_201_CREATED
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

