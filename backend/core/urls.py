from django.urls import path
from .views import (
    DepartmentListView, DepartmentDetailView,
    DoctorListView, DoctorDetailView,
    PatientListView, PatientDetailView,
    AppointmentListView, AppointmentDetailView,
    PrescriptionListView, PrescriptionDetailView,
    RegisterView, LoginView, UserProfileView,
    DoctorOnlyView, PatientOnlyView,
    MyAppointmentsView, MyPrescriptionsView
)

urlpatterns = [
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
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('doctor-dashboard/', DoctorOnlyView.as_view(), name='doctor-dashboard'),
    path('patient-dashboard/', PatientOnlyView.as_view(), name='patient-dashboard'),
    path('my-appointments/', MyAppointmentsView.as_view(), name='my-appointments'),
    path('my-prescriptions/', MyPrescriptionsView.as_view(), name='my-prescriptions'),
]