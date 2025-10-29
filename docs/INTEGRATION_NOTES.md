# Frontend-Backend Integration Notes

This document explains the integration setup between the frontend and backend of the ImpulsyIA project.

## Architecture

The integration uses a development proxy approach to connect the React frontend and FastAPI backend with minimal changes to the frontend code.

## Configuration

### Frontend (Vite)
- The `vite.config.ts` file includes a proxy configuration that forwards all `/api/*` requests to `http://localhost:8000` (the backend server)
- This allows frontend code to make API calls to `/api/...` endpoints without specifying the full backend URL

### Backend (FastAPI)
- The `src/web/app.py` file includes CORS middleware to allow requests from the frontend
- The middleware is configured to allow all origins during development

## API Endpoints

The frontend makes real API calls to these backend endpoints:
- `/api/auth/token` - Authentication
- `/api/chat/stream` - Chat functionality
- `/api/payments/webhook` - Payment processing

## Running the Application

1. **Backend**: `cd backend && python3 -m src.main` (runs on port 8000)
2. **Frontend**: `cd frontend && npm run dev` (runs on port 3000 with proxy to backend)

## Production Deployment

For production, you would typically use a reverse proxy (like Nginx) to achieve the same effect as the development proxy, routing API requests to the backend and serving frontend files directly.