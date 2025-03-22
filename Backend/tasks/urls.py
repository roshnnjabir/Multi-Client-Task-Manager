from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView, RegisterView, UserView, TaskListCreateView, TaskDetailView, AdminDashboardView, Upload_profile_image
from django.conf.urls.static import static
from backend import settings

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserView.as_view(), name='user_profile'),
    path('upload_profile_image/', Upload_profile_image, name='user_profile'),
    path('admindashboard/', AdminDashboardView.as_view(), name='admindashboard'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('tasks/', TaskListCreateView.as_view(), name='tasks'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task_detail'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)