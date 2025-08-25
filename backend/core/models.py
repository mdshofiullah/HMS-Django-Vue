from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = (
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
        ('lab', 'Lab Staff'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='patient')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.username} ({self.role})"

class Department(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    head_of_department = models.ForeignKey(
        'Doctor', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='headed_departments'
    )
    
    def __str__(self):
        return self.name

class Doctor(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='doctor_profile'
    )
    department = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE, 
        related_name='department_doctors'
    )
    specialization = models.CharField(max_length=100, blank=True)
    license_number = models.CharField(max_length=50, blank=True)
    years_of_experience = models.IntegerField(default=0)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    def __str__(self):
        return f"Dr. {self.user.first_name} {self.user.last_name}"

class Patient(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='patient_profile'
    )
    patient_id = models.CharField(max_length=10, unique=True, default=uuid.uuid4().hex[:10].upper())
    date_of_birth = models.DateField(null=True, blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    address = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=15, blank=True)
    medical_history = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} (ID: {self.patient_id})"
    
    def save(self, *args, **kwargs):
        if not self.patient_id:
            self.patient_id = uuid.uuid4().hex[:10].upper()
        super().save(*args, **kwargs)

class LabStaff(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='lab_profile'
    )
    department = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE, 
        related_name='department_lab_staff'
    )
    license_number = models.CharField(max_length=50, blank=True)
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateField()
    time = models.TimeField()
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='scheduled')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Appointment: {self.patient} with {self.doctor} on {self.date}"

class Prescription(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='prescriptions')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='prescriptions')
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='prescription', null=True, blank=True)
    medication = models.TextField()
    dosage = models.CharField(max_length=100)
    instructions = models.TextField(blank=True)
    date_prescribed = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Prescription for {self.patient} by {self.doctor}"

class LabTest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='lab_tests')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='lab_tests', null=True, blank=True)
    lab_staff = models.ForeignKey(LabStaff, on_delete=models.CASCADE, related_name='lab_tests', null=True, blank=True)
    test_name = models.CharField(max_length=200)
    test_description = models.TextField(blank=True)
    test_date = models.DateField()
    result = models.TextField(blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Lab Test: {self.test_name} for {self.patient}"

class Billing(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='bills')
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='bill', null=True, blank=True)
    lab_test = models.ForeignKey(LabTest, on_delete=models.CASCADE, related_name='bill', null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    date_issued = models.DateTimeField(auto_now_add=True)
    date_paid = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Bill #{self.id} for {self.patient} - {self.amount}"