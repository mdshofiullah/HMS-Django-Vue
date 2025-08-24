# Hospital Management System (HMS)

A modern, responsive Hospital Management System built with Django REST Framework backend and Vue.js frontend with Tailwind CSS.

## Features

- **Role-Based Authentication**: Different access levels for Admin, Doctor, Lab Staff, and Patients
- **Patient Registration**: Admin/Doctors can register patients with auto-generated IDs
- **Patient Login**: Patients can login with their ID and phone number
- **Appointment Management**: Doctors can create and manage appointments
- **Prescription Management**: Doctors can create and manage prescriptions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with custom icons
- **JWT Authentication**: Secure token-based authentication

## Roles and Permissions

- **Admin**: Full system access, can create all types of users
- **Doctor**: Can manage appointments, prescriptions, and view patient data
- **Lab Staff**: Can view lab-related data and update test results
- **Patient**: Can view their medical history, appointments, and download reports

## Technology Stack

### Backend
- Django 4.2
- Django REST Framework
- Simple JWT for authentication
- SQLite (can be configured for PostgreSQL)

### Frontend
- Vue.js 3
- TypeScript
- Vite
- Tailwind CSS
- Font Awesome icons
- Axios for API calls

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
