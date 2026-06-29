# Nabd Healthcare Frontend System

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![React Version](https://img.shields.io/badge/React-18.x-blue)
![Vite Version](https://img.shields.io/badge/Vite-5.x-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-cyan)

A modern, highly responsive frontend application for the Nabd Healthcare Medical OS. Built with React, Vite, and TailwindCSS, this SPA (Single Page Application) serves as the primary interface for Patients, Doctors, Verifiers, and Administrators.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [State Management](#state-management)
- [Routing & Security](#routing--security)
- [API Integration](#api-integration)
- [Configuration](#configuration)
- [Deployment Guide](#deployment-guide)
- [Tech Stack](#tech-stack)
- [How to Run Locally](#how-to-run-locally)
- [Production URLs](#production-urls)
- [License](#license)

---

## About the Project

The Nabd Frontend is designed to deliver a seamless, intuitive, and highly interactive user experience.

### Business Idea
To provide a unified digital platform where patients can effortlessly book appointments, doctors can manage their schedules and conduct clinical sessions, and administrators can verify medical credentials.

### Target Users & Roles
- **Patient**: Can search for doctors, book appointments, view medical history, prescriptions, and process payments.
- **Doctor**: Can manage their profile, define schedules, conduct active clinical sessions (incorporating an AI diagnostic terminal), and issue digital prescriptions.
- **Verifier**: An administrative role tasked with reviewing doctor applications, validating medical licenses, and monitoring system statistics.

### Current Implementation Status
Fully implemented. The frontend connects to the robust .NET Backend via Axios, utilizing JWT for authentication, Zustand for state management, and TailwindCSS for styling.

---

## Features

### Authentication & Onboarding
- **Multi-Role Login**: Unified login portal routing users based on their JWT role.
- **Registration**: Separate onboarding flows for Patients and Doctors.
- **Email Verification**: OTP-based verification for newly registered accounts.
- **Password Reset**: Secure forgot/reset password flows.

### Patient Module
- **Doctor Discovery**: Advanced search interface filtering by specialty, location, availability, and rating.
- **Booking Flow**: Multi-step booking wizard integrated with a calendar date-picker and time slot selection.
- **Medical Dashboard**: Centralized view of upcoming appointments, past medical history, and prescriptions.
- **Payment Integration**: Secure payment mock-ups and receipt generation for appointments.

### Doctor Module
- **Clinical Command Center (Dashboard)**: High-level overview of daily statistics, upcoming patients, and recent reviews.
- **Schedule Management**: Interactive calendar for defining available time blocks and managing consultation types.
- **Live Session Terminal**: A unique split-screen interface used during an active appointment. It contains:
  - **Medical Record Tab**: View patient's complete history.
  - **AI Diagnosis Tab**: Enter symptoms to get AI-powered condition predictions.
  - **Documentation Tab**: SOAP notes (Chief Complaint, HPI, Physical Exam).
  - **Prescription Tab**: Issue digital medications directly.
- **Patients List**: A CRM-like view of all patients treated by the doctor, utilizing detailed modals for medical records.

### Verifier Module
- **Application Queue**: Kanban-style or list view of pending doctor applications.
- **Verification Workflow**: Reviewing uploaded license documents and approving/rejecting accounts.
- **System Statistics**: High-level metrics showing active users, total appointments, and financial overviews.

---

## System Architecture

The frontend follows a **Feature-Sliced Design** (FSD) inspired architecture to ensure scalability and maintainability.

### Core Concepts
- **Features**: The application is divided into distinct feature modules (uth, patient, doctor, erifier). Each feature is self-contained with its own components, hooks, pages, and store.
- **Shared Components**: Reusable UI elements (buttons, inputs, loaders, modals) live in the global src/components directory.
- **API Layer**: Centralized API configuration using Axios instances with interceptors for token injection and refresh logic.

---

## Folder Structure

- src/api: Axios clients, interceptors, and service classes (uth.service.js, patient.service.js).
- src/assets: Static assets like images, icons, and fonts.
- src/components: Global, reusable UI components (e.g., layout, ui, common).
- src/features: Feature-specific modules.
  - /auth: Login, registration, OTP flows.
  - /patient: Patient dashboard, booking, search.
  - /doctor: Clinical session, schedule, patient CRM.
  - /verifier: Application review, statistics.
- src/hooks: Global custom React hooks.
- src/pages: Standalone pages (e.g., Landing page, 404 Not Found).
- src/providers: React Context providers (e.g., AppProvider, TokenRefreshProvider).
- src/stores: Global Zustand stores (e.g., uthStore, 
otificationsStore).
- src/styles: Global CSS (index.css) containing Tailwind directives and custom CSS variables.
- src/utils: Helper functions for formatting dates, handling tokens, and parsing errors.

---

## State Management

State is managed using **Zustand**, a small, fast, and scalable bearbones state-management solution.
- uthStore: Manages user session, JWT tokens, and role information.
- Feature-specific stores (e.g., ookingStore, patientsStore) handle complex domain state without polluting the global scope.

---

## Routing & Security

Routing is handled by eact-router-dom using the modern createBrowserRouter API.

### Protected Routes
A custom <ProtectedRoute> component wraps sensitive routes. It checks the user's role against an allowed array (oles={['doctor']}). If the user is unauthenticated, they are redirected to /auth/login. If they lack the required role, they are redirected to /unauthorized.

### Lazy Loading
All feature pages are lazily loaded using React.lazy() and wrapped in a <Suspense> boundary to optimize the initial bundle size and improve load times.

---

## API Integration

All API calls flow through centralized Axios instances defined in src/api/client.js.

### Interceptors
- **Request Interceptor**: Injects the Authorization: Bearer <token> header on every outgoing request.
- **Response Interceptor**: Catches 401 Unauthorized responses. If the access token has expired, it automatically calls the refresh token endpoint, updates the tokens in uthStore, and retries the failed request seamlessly.

---

## Configuration

Environment variables dictate the application's behavior. Configuration is stored in .env files (e.g., .env.development, .env.production).

### Key Variables
- VITE_API_BASE_URL: The root URL of the Nabd .NET Backend (e.g., https://api.nabdhealth.me/api).
- VITE_APP_ENV: Deployment environment (development vs production).

---

## Deployment Guide

The frontend is optimized for deployment on modern static hosting platforms like Vercel, Netlify, or standard Nginx/Apache servers.

### Build Process
1. Run 
pm install to install dependencies.
2. Run 
pm run build to generate the production bundle.
3. Vite will output the optimized static assets into the dist/ directory.

### Hosting (e.g., Vercel)
- The project includes a ercel.json file configured for SPA routing ("rewrites": [{"source": "/(.*)", "destination": "/index.html"}]), ensuring deep links work correctly without 404 errors.

---

## Tech Stack

- **Core**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM 6
- **State Management**: Zustand
- **Styling**: TailwindCSS 3 + Custom CSS Modules
- **Icons**: React Icons (FontAwesome/Heroicons)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form (where applicable)

---

## How to Run Locally

1. **Clone the repository**: git clone https://github.com/nabd-healthcare/nabd-frontend.git
2. **Navigate to the project**: cd Nabd.Frontend
3. **Install Dependencies**: 
pm install
4. **Configure Environment**: Create a .env file based on .env.example and set VITE_API_BASE_URL.
5. **Start Dev Server**: 
pm run dev
6. **Open Browser**: Navigate to http://localhost:5173

---

## License

This project is licensed under the MIT License.
