# Backend (Django)
FROM python:3.12 AS backend

WORKDIR /app/backend

COPY backend/ /app/backend/
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Frontend (Vue)
FROM node:22 AS frontend

WORKDIR /app/frontend

COPY frontend/ /app/frontend/
RUN npm install -g npm@latest
RUN npm install
RUN npm run build

# Final image
FROM python:3.12

WORKDIR /app

COPY --from=backend /app/backend /app/backend
COPY --from=frontend /app/frontend/dist /app/backend/static  # Make sure STATIC_ROOT is set to /app/backend/static in Django settings

EXPOSE 8000

CMD ["python", "backend/manage.py", "runserver", "0.0.0.0:8000"]