from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from .models import Task, User
from rest_framework.exceptions import PermissionDenied
from .serializers import TaskSerializer, UserSerializer
import jwt
from datetime import datetime, timedelta, timezone
from backend import settings
import os

def LandingPage(request):
    return render(request, 'index.html')

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response_data = serializer.data
        response_data.pop('password', None)

        return Response(response_data)
    
#not using
class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()
        

        if user is None:
            raise AuthenticationFailed("User not found")
        
        if not user.check_password(password):
            raise AuthenticationFailed("Inncorrect Password!")
        
        payload = {
            "id": user.id,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=60),
            "iat": datetime.now(timezone.utc)
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie(key='jwt')
        response.data = {
            "message": "Success"
        }
        return response

class UserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def Upload_profile_image(request):
    user = request.user

    if "profile_image" not in request.FILES:
        print("Error: No Image Provided")
        return Response({"error": "No image provided"}, status=400)

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