from rest_framework import serializers


# Example serializer - customize as needed
class ExampleSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100)
    created_at = serializers.DateTimeField(read_only=True)
