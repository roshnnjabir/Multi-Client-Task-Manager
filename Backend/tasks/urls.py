from django.urls import path
from .views import CustomTokenObtainPairView, CustomTokenRefreshView, LogoutView, RegisterView, UserView, TaskListCreateView, TaskDetailView, AdminDashboardView, AdminUserTaskDetailView, Upload_profile_image
from django.conf.urls.static import static
from backend import settings

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserView.as_view(), name='user_profile'),
    path('upload_profile_image/', Upload_profile_image, name='user_profile'),
    path('admindashboard/', AdminDashboardView.as_view(), name='admindashboard'),
    path('adminusertasks/<int:user_id>/', AdminUserTaskDetailView.as_view(), name='admin_user_tasks'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('token/remove/', LogoutView.as_view(), name='token_remove'), # remove refresh token from httpOnly cookie
    path('tasks/', TaskListCreateView.as_view(), name='tasks'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task_detail'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)