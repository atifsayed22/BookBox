# BookBox

A full-stack service booking platform built with the MERN stack. Vendors can list their services, customers can browse and book them, and vendors manage the entire booking lifecycle — from accepting requests to marking jobs as completed.

Think of it as a MakeMyTrip-style platform, but for local services like cleaning, repair, beauty, tutoring, and more.

---

## What It Does

- **Customers** browse available services, view details, and place bookings
- **Vendors** list their services, receive booking requests, and manage them through a status lifecycle
- **Both roles** sign up with email OTP verification and authenticate via JWT
- Booking status flows: `pending → accepted → completed` (or `rejected`)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, Axios, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Email | Nodemailer (Gmail SMTP) |

---

## Project Structure

```
BookBox/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # signup, verifyOTP, login, getMe
│   │   ├── serviceController.js   # CRUD + my-services
│   │   └── bookingController.js   # create, list, accept, reject, complete
│   ├── middleware/
│   │   └── auth.js                # JWT protect + vendorOnly + customerOnly guards
│   ├── models/
│   │   ├── User.js
│   │   ├── Service.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js                # /api/auth/*
│   │   ├── services.js            # /api/services/*
│   │   └── bookings.js            # /api/bookings/*
│   ├── utils/
│   │   └── sendEmail.js           # Nodemailer OTP email helper
│   ├── .env
│   ├── package.json
│   └── server.js                  # Express entry point
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js           # Axios instance — base URL + auth header interceptor
        ├── context/
        │   └── AuthContext.jsx    # Global user state, login/logout, session restore
        ├── components/
        │   ├── Navbar.jsx         # Role-aware navigation bar
        │   ├── ServiceCard.jsx    # Reusable service card for grids
        │   ├── StatusBadge.jsx    # Colored badge for booking status
        │   └── ProtectedRoute.jsx # Route guard by auth + role
        └── pages/
            ├── auth/
            │   ├── Signup.jsx     # Registration with role selector
            │   ├── VerifyOTP.jsx  # OTP input and verification
            │   └── Login.jsx      # Email + password login
            ├── customer/
            │   ├── BrowseServices.jsx   # Service grid with search and category filter
            │   ├── ServiceDetails.jsx   # Service detail + booking form
            │   └── MyBookings.jsx       # Customer's booking history
            └── vendor/
                ├── VendorDashboard.jsx  # Tabbed dashboard: services and bookings
                ├── CreateService.jsx    # Create or edit a service
                └── ManageBookings.jsx   # Accept, reject, complete bookings
```

---

## Database Schema

### User
```
name        String   required
email       String   unique, required
password    String   hashed with bcryptjs
phone       String   required
role        String   "customer" | "vendor"
isVerified  Boolean  default: false
otp         String   temporary, cleared after verification
otpExpiry   Date     10 minutes from signup
```

### Service
```
vendorId    ObjectId  ref: User
title       String
description String
category    String    e.g. Cleaning, Repair, Beauty
price       Number
duration    String    e.g. "2 hours"
location    String
isActive    Boolean   default: true (soft delete)
```

### Booking
```
serviceId   ObjectId  ref: Service
customerId  ObjectId  ref: User
vendorId    ObjectId  ref: User
serviceDate Date
quantity    Number    default: 1
totalAmount Number    price × quantity
status      String    "pending" | "accepted" | "rejected" | "completed"
```

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/signup` | Public | Register user, send OTP email |
| POST | `/verify-otp` | Public | Verify OTP, return JWT |
| POST | `/login` | Public | Login, return JWT |
| GET | `/me` | Protected | Get current user |

### Services — `/api/services`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | List all active services |
| GET | `/:id` | Public | Get single service |
| GET | `/my-services` | Vendor | Get vendor's own services |
| POST | `/` | Vendor | Create a service |
| PUT | `/:id` | Vendor | Update own service |
| DELETE | `/:id` | Vendor | Soft-delete own service |

### Bookings — `/api/bookings`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/create` | Customer | Create a booking |
| GET | `/my-bookings` | Customer | List customer's bookings |
| GET | `/received` | Vendor | List bookings received by vendor |
| PUT | `/:id/accept` | Vendor | Accept a pending booking |
| PUT | `/:id/reject` | Vendor | Reject a pending booking |
| PUT | `/:id/complete` | Vendor | Mark an accepted booking as completed |

---

## Frontend Pages

### Auth Flow
| Page | Route | Description |
|------|-------|-------------|
| Signup | `/signup` | Register with name, email, phone, password and role toggle (Customer / Vendor) |
| Verify OTP | `/verify-otp` | Enter the 6-digit OTP sent to email |
| Login | `/login` | Email + password login |

### Customer Pages
| Page | Route | Description |
|------|-------|-------------|
| Browse Services | `/` | 3-column service grid with category pills and search bar |
| Service Details | `/services/:id` | Full service info + booking form with date, quantity, and total calculation |
| My Bookings | `/my-bookings` | All bookings with status badges |

### Vendor Pages
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/vendor/dashboard` | Tabbed view — My Services tab and Bookings tab |
| Create / Edit Service | `/vendor/create` | Form to create a new service or edit an existing one |
| Manage Bookings | Inside dashboard | Accept, reject, or complete incoming bookings |

---

## Shared Components

**`Navbar`** — Sticky top nav. Shows different links based on role (guest / customer / vendor). Includes a hamburger menu for mobile.

**`ProtectedRoute`** — Wraps routes that require authentication. Redirects unauthenticated users to `/login` and wrong-role users to their home.

**`ServiceCard`** — Reusable card showing title, category, location, duration, price, and a View Details button. Used in BrowseServices and VendorDashboard.

**`StatusBadge`** — Colored pill badge for booking status:
- `pending` → orange
- `accepted` → green
- `rejected` → red
- `completed` → purple

**`AuthContext`** — React context providing `user`, `login(token, user)`, `logout()`, and `loading` state. Restores session from localStorage on mount by calling `/api/auth/me`.

**`axios.js`** — Pre-configured Axios instance. Automatically attaches the `Authorization: Bearer <token>` header to every request using a request interceptor.

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally
- A Gmail account with **2-Step Verification enabled** (for App Password)

### 1. Configure environment variables

Edit `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/BookBox
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000
```

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords → Generate. Remove all spaces from the generated password before pasting.

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Start the servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open `http://localhost:5173`

---

## Design System

| Token | Value |
|-------|-------|
| Primary blue | `#1a73e8` |
| Primary dark | `#1557b0` |
| Background | `#ffffff` |
| Card shadow | `shadow-sm` / `hover:shadow-md` |
| Border radius | `rounded-2xl` on cards |
| Grid | 1 col mobile → 2 col tablet → 3 col desktop |

---

## User Flow

```
Customer                          Vendor
───────                           ──────
Signup (role: customer)           Signup (role: vendor)
  ↓ OTP email                       ↓ OTP email
Verify OTP → Login                Verify OTP → Login
  ↓                                  ↓
Browse Services                   Vendor Dashboard
  ↓ View Details                    ↓ Create Service
Book Service                      Service goes live
  ↓                                  ↓
Booking created (pending)  ──→   Vendor sees booking
                                   ↓ Accept / Reject
Booking status updates             ↓ Mark Complete
```
