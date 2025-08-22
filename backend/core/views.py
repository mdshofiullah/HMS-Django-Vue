from django.shortcuts import render
from rest_framework import generics
from .models import Patient
from .serializers import PatientSerializer

# Create your views here.

class PatientListView(generics.ListAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
