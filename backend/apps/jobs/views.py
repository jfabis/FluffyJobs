from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Job, JobApplication, SavedJob
from .serializers import JobSerializer, SavedJobSerializer, SaveJobSerializer
import logging

logger = logging.getLogger(__name__)

class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.filter(is_active=True)
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def apply_for_job(request, job_id):
    return Response({'message': 'Application functionality coming soon'})

class SavedJobListView(generics.ListAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        logger.info(f'SavedJobListView called by user: {self.request.user}')
        logger.info(f'User authenticated: {self.request.user.is_authenticated}')
        logger.info(f'Authorization header: {self.request.META.get("HTTP_AUTHORIZATION", "Not found")}')
        
        if not self.request.user.is_authenticated:
            logger.error('User not authenticated in SavedJobListView')
            
        return SavedJob.objects.filter(user=self.request.user).order_by('-saved_at')

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def save_job(request):
    logger.info(f'Save job called by user: {request.user}')
    serializer = SaveJobSerializer(data=request.data)
    if serializer.is_valid():
        job_id = serializer.validated_data['job_id']
        job = Job.objects.get(id=job_id)

        saved_job, created = SavedJob.objects.get_or_create(
            user=request.user,
            job=job
        )

        if created:
            return Response({'message': 'Job saved successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Job already saved'}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def unsave_job(request, job_id):
    try:
        saved_job = SavedJob.objects.get(user=request.user, job_id=job_id)
        saved_job.delete()
        return Response({'message': 'Job removed from saved jobs'}, status=status.HTTP_200_OK)
    except SavedJob.DoesNotExist:
        return Response({'message': 'Job not found in saved jobs'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_saved_job(request, job_id):
    is_saved = SavedJob.objects.filter(user=request.user, job_id=job_id).exists()
    return Response({'is_saved': is_saved}, status=status.HTTP_200_OK)
