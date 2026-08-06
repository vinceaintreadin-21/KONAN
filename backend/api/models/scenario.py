from django.db import models 
from .choices import * 

class Scenario(models.Model):
    #Classification fields
    account_profile = models.CharField(max_length=20, choices=ACCOUNT_PROFILE_CHOICES)
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES)
    claim_category = models.CharField(max_length=30, choices=CLAIM_CATEGORY_CHOICES)
    fabrication_type = models.CharField(max_length=30, choices=FABRICATION_TYPE_CHOICES)
    deception_sophistication = models.CharField(
        max_length=20, choices=DECEPTION_SOPHISTICATION_CHOICES
    )

    #Post Contents
    image_url = models.URLField()
    caption = models.TextField()
    account_name = models.CharField(max_length=50)
    handle = models.CharField(max_length=50)
    follower_count = models.PositiveIntegerField()
    verified_badge = models.BooleanField(default=False)
    account_created_days_ago = models.PositiveIntegerField()

    #Tool Payloads
    account_history = models.JSONField()
    domain_authority = models.JSONField()
    image_metadata = models.JSONField()
    whois = models.JSONField()
    cross_source = models.JSONField()
    keyword_search = models.JSONField()

    #Ground Truth
    correct_verdict = models.CharField(max_length=20, choices=VERDICT_CHOICES)
    ground_truth_explanation = models.TextField()
    primary_verification_signal = models.TextField()

    def __str__(self):
        return f"Scenario #{self.pk} ({self.handle})"
    
