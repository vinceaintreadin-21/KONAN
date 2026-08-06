from rest_framework import viewsets 

from ..models import VerdictRecommendation
from ..serializers import VerdictRecommendationSerializer 

class VerdictRecommendationViewSet(viewsets.ModelViewSet):
    queryset = VerdictRecommendation.objects.all()
    serializer_class = VerdictRecommendationSerializer
    