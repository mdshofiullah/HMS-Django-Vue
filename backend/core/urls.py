from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    DashboardStatsView,
    UserListView, UserDetailView,
    DepartmentListView, DepartmentDetailView,
    DoctorListView, DoctorDetailView,
    PatientListView, PatientDetailView,
    AppointmentListView, AppointmentDetailView,
    PrescriptionListView, PrescriptionDetailView,
    LabTestListView, LabTestDetailView,
    BillingListView, BillingDetailView,
    RegisterView, LoginView, PatientLoginView, UserProfileView
)

urlpatterns = [
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    
    path('departments/', DepartmentListView.as_view(), name='department-list'),
    path('departments/<int:pk>/', DepartmentDetailView.as_view(), name='department-detail'),
    
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),
    path('doctors/<int:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),
    
    path('patients/', PatientListView.as_view(), name='patient-list'),
    path('patients/<int:pk>/', PatientDetailView.as_view(), name='patient-detail'),
    
    path('appointments/', AppointmentListView.as_view(), name='appointment-list'),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
    
    path('prescriptions/', PrescriptionListView.as_view(), name='prescription-list'),
    path('prescriptions/<int:pk>/', PrescriptionDetailView.as_view(), name='prescription-detail'),
    
    path('lab-tests/', LabTestListView.as_view(), name='labtest-list'),
    path('lab-tests/<int:pk>/', LabTestDetailView.as_view(), name='labtest-detail'),
    
    path('bills/', BillingListView.as_view(), name='billing-list'),
    path('bills/<int:pk>/', BillingDetailView.as_view(), name='billing-detail'),
    
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('login/patient/', PatientLoginView.as_view(), name='patient-login'),
    path('profile/', UserProfileView.as_view(), name='profile'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),      # POST -> {"username","password"} => {"access","refresh"}
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),    # POST -> {"refresh": "..."} => {"access": "..."}
]