from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, LoginView, UserView, LogoutView, TaskListCreateView, TaskDetailView, AdminDashboardView, Upload_profile_image
from django.conf.urls.static import static
from backend import settings

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    # path('login/', LoginView.as_view(), name='login'), dont need both either login or tokenrefresh
    path('profile/', UserView.as_view(), name='user_profile'),
    path('upload_profile_image/', Upload_profile_image, name='user_profile'),
    path('admindashboard/', AdminDashboardView.as_view(), name='admindashboard'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('tasks/', TaskListCreateView.as_view(), name='tasks'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task_detail'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)