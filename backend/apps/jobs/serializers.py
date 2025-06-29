from rest_framework import serializers
from .models import Job, SavedJob

class JobSerializer(serializers.ModelSerializer):
    is_saved = serializers.SerializerMethodField()
    requirements = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'company', 'description', 'requirements',
            'job_type', 'salary_min', 'salary_max', 'location',
            'is_premium', 'created_at', 'is_saved'
        ]

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False

    def get_requirements(self, obj):
        if isinstance(obj.requirements, str):
            return [req.strip() for req in obj.requirements.split(',') if req.strip()]
        return obj.requirements if obj.requirements else []

class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)

    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'saved_at']
        read_only_fields = ['saved_at']

class SaveJobSerializer(serializers.Serializer):
    job_id = serializers.IntegerField()

    def validate_job_id(self, value):
        try:
            job = Job.objects.get(id=value)
            return value
        except Job.DoesNotExist:
            raise serializers.ValidationError("Job not found or inactive")
