from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import render
import os

from .models import Task, User
from .serializers import TaskSerializer, UserSerializer
from backend import settings


def LandingPage(request):
    return render(request, 'index.html')


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        refresh_token = response.data.pop('refresh')
        
        response.set_cookie(
            'refresh_token',
            refresh_token,
            max_age=60 * 60 * 24 * 7,
            httponly=True,
            secure=True,
            samesite='Strict',
        )
        
        return response
    

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"error": "No refresh token found"}, status=400)
        
        request.data._mutable = True
        
        request.data["refresh"] = refresh_token

        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logged out"})
        response.delete_cookie("refresh_token")
        return response


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response_data = serializer.data
        response_data.pop('password', None)

        return Response(response_data)


class UserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def Upload_profile_image(request):
    user = request.user

    if "profile_image" not in request.FILES:
]        return Response({"error": "No image provided"}, status=400)

    image = request.FILES["profile_image"]

    if not image.name.lower().endswith(('jpg', 'jpeg', 'png')):
        return Response({"error": "Invalid image format. Only JPG, JPEG, PNG are allowed."}, status=400)

    image_directory = os.path.join(settings.MEDIA_ROOT, "profile_images")
    os.makedirs(image_directory, exist_ok=True)

    file_path = os.path.join(image_directory, f"{user.id}_{image.name}")

    with open(file_path, "wb+") as destination:
        for chunk in image.chunks():
            destination.write(chunk)

    user.profile_image = f"/profile_images/{user.id}_{image.name}"
    user.save()

    return Response({"profile_image": f"{settings.MEDIA_URL}{user.profile_image}"}, status=200)


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            raise PermissionDenied("You are not authorized to view this page.")

        users = User.objects.exclude(id=request.user.id)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class AdminUserTaskDetailView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id') 
        if self.request.user.is_staff and user_id:
            return Task.objects.filter(user__id=user_id)


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user, pk=self.kwargs['pk'])
    
    def perform_update(self, serializer):
        serializer.save(user=self.request.user)