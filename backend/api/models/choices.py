VERDICT_CHOICES = [
    ("verified", "Verified"),
    ("misleading", "Misleading"),
    ("fabricated", "Fabricated"),
]

ACCOUNT_PROFILE_CHOICES = [
    ("new", "New"),
    ("established", "Established"),
    ("hijacked", "Hijacked"),
]

CONTENT_TYPE_CHOICES = [
    ("image", "Image"),
    ("video", "Video"),
    ("text_headline", "Text Headline"),
    ("composite", "Composite"),
]

CLAIM_CATEGORY_CHOICES = [
    ("health_science", "Health / Science"),
    ("finance_markets", "Finance / Markets"),
    ("politics_elections", "Politics / Elections"),
    ("environment_climate", "Environment / Climate"),
    ("community_local", "Community / Local"),
]

FABRICATION_TYPE_CHOICES = [
    ("ai_generated", "AI Generated"),
    ("outdated_recontextualized", "Outdated / Recontextualized"),
    ("edited_authentic", "Edited Authentic"),
    ("invented_narrative", "Invented Narrative"),
    ("authentic", "Authentic"),
]

DECEPTION_SOPHISTICATION_CHOICES = [
    ("novice", "Novice"),
    ("intermediate", "Intermediate"),
    ("advanced", "Advanced"),
]

PHASE_CHOICES = [
    ("hold", "Hold"),
    ("description", "Description"),
    ("verification", "Verification"),
    ("verdict", "Verdict"),
    ("decision", "Decision"),
    ("reveal", "Reveal"),
]

DEVICE_TYPE_CHOICES = [
    ("mobile", "Mobile (Scroller)"),
    ("desktop", "Desktop (Verifier)"),
]

TOOL_CHOICES = [
    ("account_history", "Account History"),
    ("domain_authority", "Domain Authority"),
    ("image_metadata", "Image Metadata"),
    ("whois", "WHOIS"),
    ("cross_source", "Cross Source"),
    ("keyword_search", "Keyword Search"),
]