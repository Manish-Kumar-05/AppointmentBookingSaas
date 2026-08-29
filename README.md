# Hurry — Appointment Booking SaaS

**Hurry** is a full-stack appointment booking SaaS platform that allows organizations to manage their services, availability, bookings, and customer appointments from a centralized system.

The platform also integrates with **Google Calendar** and uses background job processing for tasks such as sending emails and handling asynchronous operations.

## Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Access and refresh tokens
* Secure cookie-based token handling
* Protected API routes
* Password hashing with bcrypt

### Organization Management

* Create and manage organizations
* Organization-specific services and availability
* Public organization booking pages
* Organization slug-based booking URLs

### Service Management

* Create services
* Update services
* Delete services
* Configure service duration and details

### Availability Management

* Configure working days
* Set start and end times
* Day-based availability
* Automatic slot generation based on availability

### Appointment Booking

* Customers can view available slots
* Book appointments for available services
* Booking management
* Prevention of invalid/unavailable bookings

### Google Calendar Integration

* Google OAuth authentication
* Connect Google Calendar
* Calendar-based appointment integration
* Automatic handling of calendar events

### Email & Background Jobs

* Email/OTP functionality
* BullMQ-based background jobs
* Redis-backed job queues
* Separate workers for email and meeting-related tasks

### Frontend

* Modern responsive UI
* Authentication state management with Redux Toolkit
* Form handling with React Hook Form
* API communication using Axios
* Type-safe TypeScript implementation

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Redux Toolkit
* React Hook Form
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* TypeScript
* Zod
* JWT
* bcrypt
* Nodemailer

### Database

* PostgreSQL
* Prisma ORM

### Background Processing

* Redis
* BullMQ
* ioredis

### Integrations

* Google OAuth
* Google Calendar API

### Deployment

* Vercel — Frontend
* Render — Backend
* Neon — PostgreSQL

---

## Architecture

```text
                    ┌─────────────────────┐
                    │      Customer       │
                    │                     │
                    │   Booking Website   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Next.js Frontend  │
                    │      TypeScript     │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │      TypeScript     │
                    └──────┬───────┬──────┘
                           │       │
                 ┌─────────┘       └──────────┐
                 ▼                            ▼
        ┌─────────────────┐          ┌─────────────────┐
        │   PostgreSQL    │          │  Redis + BullMQ │
        │     Prisma      │          │     Queues      │
        └─────────────────┘          └────────┬────────┘
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │     Workers     │
                                      │ Email / Meeting │
                                      └─────────────────┘

                           │
                           ▼
                  ┌──────────────────┐
                  │ Google Calendar  │
                  │   OAuth + API    │
                  └──────────────────┘
```

---

## Project Structure

```text
Hurry/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── schemas/
│   │   ├── workers/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── index.ts
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## Core Modules

```text
Authentication
      │
      ▼
Organization
      │
      ├──── Services
      │
      ├──── Availability
      │
      ▼
     Slots
      │
      ▼
   Booking
      │
      ├──── Email
      │
      ├──── Google Calendar
      │
      └──── Meeting/Background Jobs
```

---

## API Modules

The backend API is organized into separate modules:

```text
/api/v1
│
├── /auth
├── /organization
├── /service
├── /availability
├── /slot
├── /booking
└── /google
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Hurry.git

cd Hurry
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=4000

DATABASE_URL="your_postgresql_connection_string"

JWT_ACCESS_TOKEN_SECRET="your_access_token_secret"
JWT_REFRESH_TOKEN_SECRET="your_refresh_token_secret"

JWT_ACCESS_TOKEN_EXPIRY="15m"
JWT_REFRESH_TOKEN_EXPIRY="7d"

REDIS_URL="your_redis_url"

CORS_ORIGINS="http://localhost:3000"

EMAIL_FROM="your_email"
SMTP_HOST="your_smtp_host"
SMTP_PORT="your_smtp_port"
SMTP_USER="your_smtp_user"
SMTP_PASSWORD="your_smtp_password"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_REDIRECT_URI="your_google_redirect_uri"
```

### 3. Setup Prisma

```bash
npx prisma generate
```

For local development:

```bash
npx prisma db push
```

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:4000
```

---

### 4. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_BACKEND_API_URL="http://localhost:4000/api/v1"
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Environment Variables

Never commit `.env` or `.env.local` files to GitHub.

Add them to `.gitignore`:

```gitignore
node_modules/
.env
.env.local
.env.*.local
.next/
dist/
```

---

## Booking Flow

The basic appointment flow is:

```text
Organization
     │
     ▼
Create Service
     │
     ▼
Set Availability
     │
     ▼
Generate Available Slots
     │
     ▼
Customer Opens Public Booking Page
     │
     ▼
Select Service
     │
     ▼
Select Available Slot
     │
     ▼
Create Booking
     │
     ├──────────────► Email Notification
     │
     └──────────────► Google Calendar Event
```

---

## Authentication Flow

```text
User
 │
 ▼
Login / Register
 │
 ▼
Backend Authentication
 │
 ▼
JWT Access Token
 │
 ▼
Authenticated API Requests
 │
 ▼
Access Token Expired
 │
 ▼
Refresh Token
 │
 ▼
New Access Token
```

---

## Background Job Processing

Hurry uses **Redis + BullMQ** to handle tasks asynchronously.

Example:

```text
Booking Created
      │
      ▼
Add Job to Queue
      │
      ▼
Redis
      │
      ▼
BullMQ Worker
      │
      ├── Email Worker
      │
      └── Meeting Worker
```

This prevents long-running tasks from blocking the main API request.

---

## Google Calendar Integration

Hurry supports Google Calendar integration using OAuth 2.0.

The integration allows the application to:

1. Connect a user's Google account.
2. Request the required Calendar permissions.
3. Access the user's calendar.
4. Create calendar events for appointments.

---

## Deployment

The application can be deployed using:

```text
Frontend  → Vercel
Backend   → Render
Database  → Neon PostgreSQL
Redis     → Redis provider
```

Production environment variables must be configured separately on each deployment platform.

---

## Future Improvements

Planned improvements may include:

* Payment integration
* Recurring appointments
* Multiple staff members
* Staff-specific availability
* Timezone support
* Appointment cancellation/rescheduling
* SMS notifications
* Email templates
* Admin dashboard
* Analytics
* Subscription plans
* SaaS billing
* Rate limiting
* Advanced role-based access control
* Automated reminders

---

## Why Hurry?

Hurry is designed around the idea of making appointment scheduling simple for both businesses and their customers.

Instead of manually managing appointments through calls, messages, or spreadsheets, organizations can:

```text
Manage Services
       +
Manage Availability
       +
Accept Online Bookings
       +
Sync With Calendar
       +
Automate Notifications
       =
Centralized Appointment Management
```

---

## Learning & Engineering Focus

This project was built to practice and demonstrate real-world full-stack development concepts, including:

* REST API design
* Authentication and authorization
* Database design
* Prisma ORM
* PostgreSQL
* TypeScript
* Next.js
* State management
* Form validation
* OAuth 2.0
* Background job processing
* Redis
* Queue-based architecture
* API integration
* Deployment
* Environment configuration

---

## License

This project is currently intended for learning and portfolio purposes.

```
```
