from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Department, Doctor, Patient, LabStaff, Appointment, Prescription, LabTest, Billing
import re

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'first_name', 'last_name', 'phone_number', 'profile_picture', 'is_active', 'created_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    phone_number = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'role', 'first_name', 'last_name', 'phone_number')

    def validate_phone_number(self, value):
        if value and not re.match(r'^\+?1?\d{9,15}$', value):
            raise serializers.ValidationError("Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
        return value

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data['role'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        
        # Create role-specific profile
        if user.role == 'patient':
            Patient.objects.create(user=user)
        elif user.role == 'doctor':
            Doctor.objects.create(user=user, department=None)
        elif user.role == 'lab':
            LabStaff.objects.create(user=user,  department=None)
            
        return user

class PatientLoginSerializer(serializers.Serializer):
    patient_id = serializers.CharField(max_length=10)
    phone_number = serializers.CharField(max_length=15)
    
    def validate(self, data):
        patient_id = data.get('patient_id')
        phone_number = data.get('phone_number')
        
        try:
            patient = Patient.objects.get(patient_id=patient_id, user__phone_number=phone_number)
            data['user'] = patient.user
        except Patient.DoesNotExist:
            raise serializers.ValidationError("Invalid patient ID or phone number")
        
        return data

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', write_only=True
    )
    
    class Meta:
        model = Doctor
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Patient
        fields = '__all__'

class LabStaffSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', write_only=True
    )
    
    class Meta:
        model = LabStaff
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True
    )
    doctor = DoctorSerializer(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), source='doctor', write_only=True
    )
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', write_only=True
    )
    
    class Meta:
        model = Appointment
        fields = '__all__'

class PrescriptionSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True
    )
    doctor = DoctorSerializer(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), source='doctor', write_only=True
    )
    appointment = AppointmentSerializer(read_only=True)
    appointment_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all(), source='appointment', write_only=True, required=False, allow_null=True
    )
    
    class Meta:
        model = Prescription
        fields = '__all__'

class LabTestSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True
    )
    doctor = DoctorSerializer(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(), source='doctor', write_only=True, required=False, allow_null=True
    )
    lab_staff = LabStaffSerializer(read_only=True)
    lab_staff_id = serializers.PrimaryKeyRelatedField(
        queryset=LabStaff.objects.all(), source='lab_staff', write_only=True, required=False, allow_null=True
    )
    
    class Meta:
        model = LabTest
        fields = '__all__'

class BillingSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), source='patient', write_only=True
    )
    appointment = AppointmentSerializer(read_only=True)
    appointment_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all(), source='appointment', write_only=True, required=False, allow_null=True
    )
    lab_test = LabTestSerializer(read_only=True)
    lab_test_id = serializers.PrimaryKeyRelatedField(
        queryset=LabTest.objects.all(), source='lab_test', write_only=True, required=False, allow_null=True
    )
    
    class Meta:
        model = Billing
        fields = '__all__'