from rest_framework import serializers

def validate_1_to_5(value):
    if not 1 <= value <= 5:
        raise serializers.ValidationError("Value must be between 1 and 5.")
    return value

def validate_confidence(value):
    if not 1 <= value <= 5:
        raise serializers.ValidationError("Confidence must be between 1 and 5.")
    return value