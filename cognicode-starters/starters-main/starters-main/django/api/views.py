from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
def api_root(request):
    """
    API Root endpoint - returns available endpoints
    """
    return Response({
        'message': 'Welcome to the Django API',
        'endpoints': {
            'health': '/api/health/',
            'admin': '/admin/',
        }
    })


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint
    """
    return Response({
        'status': 'healthy',
        'message': 'API is running'
    }, status=status.HTTP_200_OK)
