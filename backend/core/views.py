from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Department, Doctor, Patient, LabStaff, Appointment, Prescription, LabTest, Billing
from .serializers import (
    DepartmentSerializer, DoctorSerializer, PatientSerializer, LabStaffSerializer,
    AppointmentSerializer, PrescriptionSerializer, LabTestSerializer, BillingSerializer,
    RegisterSerializer, UserSerializer, PatientLoginSerializer
)
from django.contrib.auth import get_user_model
from .permissions import IsDoctor, IsPatient, IsLab, IsAdmin

User = get_user_model()

# Dashboard Statistics View
class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        stats = {}
        
        if user.role == 'admin':
            recent_appointments = Appointment.objects.order_by('-created_at')[:5]
            stats = {
                'total_patients': Patient.objects.count(),
                'total_doctors': Doctor.objects.count(),
                'total_appointments': Appointment.objects.count(),
                'total_departments': Department.objects.count(),
                # 'recent_appointments': Appointment.objects.order_by('-created_at')[:5],
                'recent_appointments': len(recent_appointments),
                'pending_bills': Billing.objects.filter(status='pending').count(),
            }
        elif user.role == 'doctor':
            doctor = Doctor.objects.get(user=user)
            stats = {
                'total_patients': Patient.objects.count(),
                'my_appointments': Appointment.objects.filter(doctor=doctor).count(),
                'today_appointments': Appointment.objects.filter(doctor=doctor, date=date.today()).count(),
                'my_prescriptions': Prescription.objects.filter(doctor=doctor).count(),
                'pending_lab_tests': LabTest.objects.filter(doctor=doctor, status='pending').count()
            }
        elif user.role == 'patient':
            patient = Patient.objects.get(user=user)
            stats = {
                'my_appointments': Appointment.objects.filter(patient=patient).count(),
                'my_prescriptions': Prescription.objects.filter(patient=patient).count(),
                'my_lab_tests': LabTest.objects.filter(patient=patient).count(),
                'pending_bills': Billing.objects.filter(patient=patient, status='pending').count(),
            }
        elif user.role == 'lab':
            lab_staff = LabStaff.objects.get(user=user)
            stats = {
                'total_tests': LabTest.objects.count(),
                'my_tests': LabTest.objects.filter(lab_staff=lab_staff).count(),
                'pending_tests': LabTest.objects.filter(status='pending').count(),
                'completed_tests': LabTest.objects.filter(status='completed').count(),
            }
        
        return Response(stats)

# User Management Views
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

# Department Views
class DepartmentListView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

# Doctor Views
class DoctorListView(generics.ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]

class DoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]

# Patient Views
class PatientListView(generics.ListAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

class PatientDetailView(generics.RetrieveUpdateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

# Appointment Views
class AppointmentListView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Appointment.objects.all()
        elif user.role == 'doctor':
            doctor = Doctor.objects.get(user=user)
            return Appointment.objects.filter(doctor=doctor)
        elif user.role == 'patient':
            patient = Patient.objects.get(user=user)
            return Appointment.objects.filter(patient=patient)
        return Appointment.objects.none()

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

# Prescription Views
class PrescriptionListView(generics.ListCreateAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Prescription.objects.all()
        elif user.role == 'doctor':
            doctor = Doctor.objects.get(user=user)
            return Prescription.objects.filter(doctor=doctor)
        elif user.role == 'patient':
            patient = Patient.objects.get(user=user)
            return Prescription.objects.filter(patient=patient)
        return Prescription.objects.none()

class PrescriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

# Lab Test Views
class LabTestListView(generics.ListCreateAPIView):
    serializer_class = LabTestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return LabTest.objects.all()
        elif user.role == 'doctor':
            doctor = Doctor.objects.get(user=user)
            return LabTest.objects.filter(doctor=doctor)
        elif user.role == 'patient':
            patient = Patient.objects.get(user=user)
            return LabTest.objects.filter(patient=patient)
        elif user.role == 'lab':
            lab_staff = LabStaff.objects.get(user=user)
            return LabTest.objects.filter(lab_staff=lab_staff)
        return LabTest.objects.none()

class LabTestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LabTest.objects.all()
    serializer_class = LabTestSerializer
    permission_classes = [permissions.IsAuthenticated]

# Billing Views
class BillingListView(generics.ListCreateAPIView):
    serializer_class = BillingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Billing.objects.all()
        elif user.role == 'patient':
            patient = Patient.objects.get(user=user)
            return Billing.objects.filter(patient=patient)
        return Billing.objects.none()

class BillingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Billing.objects.all()
    serializer_class = BillingSerializer
    permission_classes = [permissions.IsAuthenticated]

# Authentication Views
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=400)

class PatientLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PatientLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response(serializer.errors, status=400)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user