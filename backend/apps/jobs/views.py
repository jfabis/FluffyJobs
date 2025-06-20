from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Job, JobApplication

class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.filter(is_active=True)
    # serializer_class = JobSerializer  # Dodamy później
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    # serializer_class = JobSerializer  # Dodamy później
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def apply_for_job(request, job_id):
    return Response({'message': 'Application functionality coming soon'})
