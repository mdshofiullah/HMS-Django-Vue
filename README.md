# HMS-Django-Vue
Features
User Management: Role-based access (Doctors, Patients, Lab Staff, Admins)

Department Management: Organize hospital departments

Appointment Scheduling: Book and manage appointments

Prescription Management: Create and track prescriptions

Responsive Design: Works on desktop, tablet, and mobile

Modern UI: Clean, professional interface with custom icons

JWT Authentication: Secure token-based authentication

Prerequisites
Python 3.8+

Node.js 16+

npm or yarn

SQLite (default) or PostgreSQL

Installation & Setup
Backend (Django)
Navigate to the backend directory:

bash
cd backend
Create a virtual environment:

bash
python -m venv venv
Activate the virtual environment:

Windows:

bash
venv\Scripts\activate
macOS/Linux:

bash
source venv/bin/activate
Install Python dependencies:

bash
pip install -r requirements.txt
Apply database migrations:

bash
python manage.py makemigrations
python manage.py migrate
Create a superuser:

bash
python manage.py createsuperuser
Run the development server:

bash
python manage.py runserver
The backend API will be available at http://localhost:8000

Frontend (Vue.js)
Navigate to the frontend directory:

bash
cd frontend/hms-frontend
Install Node.js dependencies:

bash
npm install
Start the development server:

bash
npm run dev
The frontend will be available at http://localhost:3000

Usage
Open your browser and navigate to http://localhost:3000

Register a new account or use the admin account created earlier

Explore the different features based on your role:

Admin: Full access to all features

Doctor: Manage appointments and prescriptions

Patient: Book appointments and view prescriptions

Lab Staff: Access lab-related features

API Endpoints
GET /api/departments/ - List all departments

GET /api/doctors/ - List all doctors

GET /api/patients/ - List all patients

GET /api/appointments/ - List all appointments

GET /api/prescriptions/ - List all prescriptions

POST /api/register/ - Register a new user

POST /api/login/ - Login and get JWT tokens

Building for Production
Backend
Set DEBUG = False in backend/hms/settings.py

Configure your production database

Collect static files:

bash
python manage.py collectstatic
Frontend
Build the production bundle:

bash
npm run build
The built files will be in the dist directory

Technologies Used
Backend
Django 4.2

Django REST Framework

Simple JWT for authentication

SQLite (can be configured for PostgreSQL)

Frontend
Vue.js 3

TypeScript

Vite

Tailwind CSS

Font Awesome icons

Axios for API calls

Contributing
Fork the repository

Create a feature branch

Make your changes

Add tests if applicable

Submit a pull request

License
This project is licensed under the MIT License.

Support
For support, please open an issue in the GitHub repository or contact the development team.

Acknowledgments
Icons by Font Awesome

UI components inspired by Tailwind UI

Django REST Framework for the robust API structure
