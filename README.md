

A full-stack web application for managing the **North South University (NSU)** shuttle bus booking system.

Students can register/login using their NSU email, choose a predefined pickup stop (or select a custom location from a map), and book a shuttle ride for a specific date and time slot. Administrators can manage bookings, stops, and student data from an admin dashboard.

---
## Applications

![Uploa<img width="780" height="7349" alt="10-mobile-home" src="https://github.com/user-attachments/assets/05df5394-56f5-49c1-a6aa-f6186cee152d" />
<img width="1440" height="900" alt="09-admin" src="https://github.com/user-attachments/assets/2c7b91d8-44d9-49ab-a73a-dd5629d202de" />
<img width="1440" height="900" alt="08-profile" src="https://github.com/user-attachments/assets/85ad4265-36ca-4381-8b97-380a2e53c18d" />
<img width="1440" height="1119" alt="07-dashboard" src="https://github.com/user-attachments/assets/689bf6e4-6ff9-4147-b16c-5e0865b95fd5" />
<img width="1440" height="900" alt="06-login" src="https://github.com/user-attachments/assets/1e6abd8f-39df-4821-a129-68646c49ba4e" />
<img width="1440" height="1522" alt="05-contact" src="https://github.com/user-attachments/assets/91ca3812-bd62-4ee8-b4bf-fb78b0ced903" />
<img width="1440" height="2161" alt="04-about" src="https://github.com/user-attachments/assets/a9dae501-587c-4ac7-a353-dd93e9b693a4" />
<img width="1440" height="1787" alt="03-services" src="https://github.com/user-attachments/assets/34d52ca7-b914-45de-9ae8-5538cda670f1" />
<img width="1440" height="4878" alt="02-home-light" src="https://github.com/user-attachments/assets/f28bfe02-1771-4753-b7a1-3b05b0998d4b" />
ding 01-home-dark.png…]()
<img width="1440" height="4878" alt="01-home-dark" src="https://github.com/user-attachments/assets/ff860def-6762-4259-a325-8815f0e9a3ad" /># NSU Shuttle Bus Service



## ✨ Features

### Student
- Register & login using `@northsouth.edu` email
- Interactive map with **10+ predefined pickup stops** across Dhaka
- Select a **custom pickup location** by clicking anywhere on the map
- Book shuttles by **date + time slot** (7:00 AM – 7:00 PM)
- View, track, and cancel pending bookings
- Booking details modal on click
- Edit profile (name, student ID) and change password

### Admin
- Dashboard with overview stats (students, bookings, stops)
- Manage all bookings (confirm, complete, cancel)
- Search & filter bookings by name, email, stop, status, or date
- Add / update / delete shuttle stops
- View all registered students

### General UI
- Toast notifications for user actions
- Mobile-responsive layout with hamburger navigation
- Image slider showcasing the shuttle fleet
- Contact form that saves messages to the database
- Dark blue theme with monospace typography

---

## 🧰 Tech Stack

| Layer     | Technology |
|----------|------------|
| Frontend | React 18, React Router 6, Vite |
| Backend  | Node.js, Express |
| Database | SQLite3 (`better-sqlite3`) |
| Auth     | JWT + bcrypt |
| Maps     | Leaflet + React Leaflet |
| HTTP     | Axios |
| Font     | Roboto Mono |

---

## 📁 Project Structure
````
NSU-Shuttle-Bus-Service/
├── client/ # React frontend
│ ├── public/img/ # Static images (logo, shuttle photos)
│ └── src/
│ ├── components/ # Navbar, Footer, HeroHeader, ImageSlider,
│ │ # BookingCard, BookingForm, BookingModal,
│ │ # MapPicker, ProtectedRoute
│ ├── context/ # AuthContext, ToastContext
│ ├── pages/ # Home, Login, Services, About, Contact,
│ │ # Dashboard, Admin, Profile
│ ├── styles/ # Toast.css
│ ├── utils/ # api.js (Axios instance)
│ ├── App.jsx
│ └── App.css # Design tokens and global styles
│
├── server/ # Express backend
│ ├── db/
│ │ ├── database.js # SQLite schema
│ │ └── seed.js # Seed admin user + 10 Dhaka stops
│ ├── middleware/
│ │ └── auth.js # JWT auth + admin guard
│ ├── routes/
│ │ ├── auth.js # Register, login, profile, password
│ │ ├── bookings.js # CRUD bookings
│ │ ├── stops.js # CRUD stops
│ │ ├── admin.js # Stats + student list
│ │ └── contact.js # Contact form submissions
│ └── index.js # Express server entry point
│
└── package.json # Root scripts
````

---

## ✅ Prerequisites
- Node.js **18+**
- npm

---

## 🚀 Getting Started

### 1) Clone the repository
```bash
git clone https://github.com/your-username/NSU-Shuttle-Bus-Service.git
cd NSU-Shuttle-Bus-Service
```

### 2) Install dependencies (root + client + server)
````
npm run install-all
````

### 3) Seed the database
````
npm run seed
````
This creates:

Admin login: admin@northsouth.edu

Password: admin123

And seeds 10 predefined pickup stops:
```
Mirpur 10

Dhanmondi 27

Gulshan 1

Uttara Sector 3

Banani Chairmanbari

Mohakhali Bus Stand

Farmgate

Motijheel

Bashundhara Gate

NSU Campus
````

### 4) Run development servers (client + server)
````
npm run dev
````
URLs
````
Frontend: http://localhost:5180

Backend: http://localhost:3001
````
🏗️ Production Build
````
cd client && npm run build
````
The built frontend in client/dist is automatically served by Express when:
````
NODE_ENV=production
````



## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|-------:|----------|------|-------------|
| POST   | `/api/auth/register` | — | Register with NSU email |
| POST   | `/api/auth/login` | — | Login |
| GET    | `/api/auth/me` | ✅ Required | Get current user |
| PATCH  | `/api/auth/profile` | ✅ Required | Update name + student ID |
| PATCH  | `/api/auth/password` | ✅ Required | Change password |
| GET    | `/api/stops` | ✅ Required | List all stops |
| POST   | `/api/stops` | ✅ Admin | Add a stop |
| PUT    | `/api/stops/:id` | ✅ Admin | Update a stop |
| DELETE | `/api/stops/:id` | ✅ Admin | Delete a stop |
| GET    | `/api/bookings` | ✅ Required | List bookings |
| POST   | `/api/bookings` | ✅ Required | Create a booking |
| PATCH  | `/api/bookings/:id` | ✅ Required | Update booking status |
| GET    | `/api/admin/stats` | ✅ Admin | Dashboard statistics |
| GET    | `/api/admin/students` | ✅ Admin | List all students |
| POST   | `/api/contact` | — | Submit contact form message |

---

## 🗄️ Database Schema (SQLite)

### `users`
Stores student and admin accounts.

| Column | Type | Notes |
|--------|------|------|
| id | INTEGER | Primary key |
| name | TEXT | Full name |
| email | TEXT | Unique, must be `@northsouth.edu` |
| student_id | TEXT | Optional, 7 digits |
| password_hash | TEXT | bcrypt hash |
| role | TEXT | `student` or `admin` |
| created_at | DATETIME | Auto-generated |

### `stops`
Predefined pickup locations.

| Column | Type | Notes |
|--------|------|------|
| id | INTEGER | Primary key |
| name | TEXT | Stop name |
| lat | REAL | Latitude |
| lng | REAL | Longitude |
| area_name | TEXT | Area / district |

### `bookings`
Shuttle ride bookings.

| Column | Type | Notes |
|--------|------|------|
| id | INTEGER | Primary key |
| user_id | INTEGER | FK → `users` |
| stop_id | INTEGER | FK → `stops` (nullable) |
| custom_lat | REAL | Custom pickup latitude (nullable) |
| custom_lng | REAL | Custom pickup longitude (nullable) |
| custom_address | TEXT | Custom pickup description (nullable) |
| booking_date | TEXT | Ride date |
| time_slot | TEXT | Time slot (7:00 AM – 7:00 PM) |
| status | TEXT | `pending`, `confirmed`, `completed`, `cancelled` |
| created_at | DATETIME | Auto-generated |

### `contact_messages`
Contact form submissions.

| Column | Type | Notes |
|--------|------|------|
| id | INTEGER | Primary key |
| name | TEXT | Sender name |
| email | TEXT | Sender email |
| phone | TEXT | Optional |
| address | TEXT | Optional |
| message | TEXT | Message body |
| created_at | DATETIME | Auto-generated |

---

## 📜 Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start both client and server |
| `npm run client` | Start frontend only |
| `npm run server` | Start backend only |
| `npm run seed` | Seed database (admin + stops) |
| `npm run install-all` | Install dependencies for root, client, and server |
