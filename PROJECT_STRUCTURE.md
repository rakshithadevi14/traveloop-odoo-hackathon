# Traveloop - Complete Project Structure

## Full Directory Tree

```
traveloop-odoo-hackathon/
│
├── LICENSE
├── README.md
├── ARCHITECTURE.md                    # ← You are here (Architecture & Design)
├── PROJECT_STRUCTURE.md               # ← Quick reference guide
│
├── frontend/                          # React + Vite Frontend
│   ├── public/
│   │   └── (favicon, manifest, robots.txt)
│   │
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosConfig.js
│   │   │   └── endpoints.js
│   │   │
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   └── Pagination.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── UpcomingTripsCard.jsx
│   │   │   │   ├── QuickActions.jsx
│   │   │   │   └── ActivityFeed.jsx
│   │   │   │
│   │   │   ├── trips/
│   │   │   │   ├── TripCard.jsx
│   │   │   │   ├── TripForm.jsx
│   │   │   │   ├── TripList.jsx
│   │   │   │   ├── CitySearch.jsx
│   │   │   │   └── TripDetails.jsx
│   │   │   │
│   │   │   ├── itinerary/
│   │   │   │   ├── ItineraryDay.jsx
│   │   │   │   ├── ActivityCard.jsx
│   │   │   │   ├── TimelineView.jsx
│   │   │   │   ├── DragDropItinerary.jsx
│   │   │   │   └── MapView.jsx
│   │   │   │
│   │   │   ├── budget/
│   │   │   │   ├── BudgetBreakdown.jsx
│   │   │   │   ├── ExpenseForm.jsx
│   │   │   │   ├── BudgetChart.jsx
│   │   │   │   ├── ExpenseList.jsx
│   │   │   │   └── BudgetAnalysis.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── UserManagement.jsx
│   │   │       ├── TripManagement.jsx
│   │   │       ├── AnalyticsDashboard.jsx
│   │   │       ├── DestinationManager.jsx
│   │   │       └── ActivityManager.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── TripContext.jsx
│   │   │   ├── UserContext.jsx
│   │   │   ├── NotificationContext.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useTrips.js
│   │   │   ├── useFetch.js
│   │   │   ├── useLocalStorage.js
│   │   │   ├── useDebounce.js
│   │   │   └── usePagination.js
│   │   │
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   └── BlankLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Signup.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── Index.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   └── Notifications.jsx
│   │   │   │
│   │   │   ├── trips/
│   │   │   │   ├── Index.jsx
│   │   │   │   ├── Create.jsx
│   │   │   │   ├── [tripId].jsx
│   │   │   │   ├── [tripId]Itinerary.jsx
│   │   │   │   ├── [tripId]Budget.jsx
│   │   │   │   ├── [tripId]Checklist.jsx
│   │   │   │   ├── [tripId]Notes.jsx
│   │   │   │   └── Share.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Users.jsx
│   │   │       ├── Trips.jsx
│   │   │       ├── Analytics.jsx
│   │   │       ├── Destinations.jsx
│   │   │       └── Activities.jsx
│   │   │
│   │   ├── routes/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   └── AppRoutes.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── tripService.js
│   │   │   ├── itineraryService.js
│   │   │   ├── activityService.js
│   │   │   ├── budgetService.js
│   │   │   ├── uploadService.js
│   │   │   └── analyticsService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   ├── constants.js
│   │   │   ├── errorHandler.js
│   │   │   ├── localStorage.js
│   │   │   └── helpers.js
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   ├── variables.css
│   │   │   └── animations.css
│   │   │
│   │   ├── data/
│   │   │   ├── destinations.json
│   │   │   ├── activities.json
│   │   │   ├── currencies.json
│   │   │   └── mockData.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── backend/                           # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── jwt.js
│   │   │   ├── multer.js
│   │   │   ├── env.js
│   │   │   └── constants.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth/
│   │   │   │   ├── authController.js
│   │   │   │   └── passwordController.js
│   │   │   │
│   │   │   ├── trips/
│   │   │   │   ├── tripController.js
│   │   │   │   ├── tripStopController.js
│   │   │   │   └── sharedTripController.js
│   │   │   │
│   │   │   ├── itinerary/
│   │   │   │   └── itineraryController.js
│   │   │   │
│   │   │   ├── activities/
│   │   │   │   └── activityController.js
│   │   │   │
│   │   │   ├── budget/
│   │   │   │   └── budgetController.js
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── adminController.js
│   │   │       ├── userManagementController.js
│   │   │       ├── analyticsController.js
│   │   │       └── destinationController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   ├── roleMiddleware.js
│   │   │   ├── validation.js
│   │   │   ├── logger.js
│   │   │   ├── corsMiddleware.js
│   │   │   └── requestLimiter.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Trip.js
│   │   │   ├── TripStop.js
│   │   │   ├── Activity.js
│   │   │   ├── Budget.js
│   │   │   ├── PackingItem.js
│   │   │   ├── Note.js
│   │   │   ├── SharedTrip.js
│   │   │   ├── Destination.js
│   │   │   └── Analytics.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth/
│   │   │   │   └── authRoutes.js
│   │   │   │
│   │   │   ├── trips/
│   │   │   │   ├── tripRoutes.js
│   │   │   │   └── sharedRoutes.js
│   │   │   │
│   │   │   ├── itinerary/
│   │   │   │   └── itineraryRoutes.js
│   │   │   │
│   │   │   ├── activities/
│   │   │   │   └── activityRoutes.js
│   │   │   │
│   │   │   ├── budget/
│   │   │   │   └── budgetRoutes.js
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   └── adminRoutes.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── tripService.js
│   │   │   ├── itineraryService.js
│   │   │   ├── activityService.js
│   │   │   ├── budgetService.js
│   │   │   ├── emailService.js
│   │   │   ├── cloudStorageService.js
│   │   │   └── analyticsService.js
│   │   │
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── tripValidator.js
│   │   │   ├── itineraryValidator.js
│   │   │   ├── activityValidator.js
│   │   │   ├── budgetValidator.js
│   │   │   └── commonValidator.js
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   ├── errorHandler.js
│   │   │   ├── jwt.js
│   │   │   ├── password.js
│   │   │   ├── response.js
│   │   │   ├── fileUpload.js
│   │   │   └── helpers.js
│   │   │
│   │   ├── uploads/
│   │   │   ├── profiles/
│   │   │   ├── trips/
│   │   │   └── activities/
│   │   │
│   │   ├── database/
│   │   │   ├── seed.js
│   │   │   └── migrations.js
│   │   │
│   │   ├── constants/
│   │   │   ├── tripStatus.js
│   │   │   ├── errorCodes.js
│   │   │   ├── userRoles.js
│   │   │   └── messages.js
│   │   │
│   │   └── app.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── server.js
│   └── package.json
│
├── database/
│   ├── schemas/                      # MongoDB schema documentation
│   ├── indexes.js                    # Database indexing strategy
│   └── seed-data/
│
├── docs/
│   ├── API.md                        # API Documentation
│   ├── DATABASE.md                   # Database documentation
│   ├── DEPLOYMENT.md                 # Deployment guide
│   └── CONTRIBUTING.md               # Contribution guidelines
│
└── assets/
    ├── wireframes/                   # UI/UX wireframes
    ├── mockups/                      # Design mockups
    └── design-system/                # Tailwind design tokens
```

---

## Directory Purposes at a Glance

### **Frontend Structure**

| Directory     | Purpose                                                          |
| ------------- | ---------------------------------------------------------------- |
| `api/`        | Centralized API client with Axios configuration and interceptors |
| `assets/`     | Static images, icons, and media files                            |
| `components/` | Reusable React components organized by feature                   |
| `context/`    | Global state management (Auth, Trips, User, Notifications)       |
| `hooks/`      | Custom React hooks for logic reuse (useAuth, useTrips, etc.)     |
| `layouts/`    | Page layout wrappers (MainLayout, AdminLayout, etc.)             |
| `pages/`      | Full page components (matches routes structure)                  |
| `routes/`     | Route definitions and protected/admin route wrappers             |
| `services/`   | Business logic layer - API calls and data processing             |
| `utils/`      | Helper functions, validators, formatters, constants              |
| `styles/`     | Global CSS, Tailwind config, animations                          |
| `data/`       | Static JSON data (destinations, activities, mock data)           |
| `public/`     | Static files served directly (favicon, manifest)                 |

### **Backend Structure**

| Directory      | Purpose                                                       |
| -------------- | ------------------------------------------------------------- |
| `config/`      | Configuration files (DB, JWT, Multer, environment)            |
| `controllers/` | Request handlers that process business logic                  |
| `middleware/`  | Express middleware (auth, validation, error handling)         |
| `models/`      | Mongoose schemas for MongoDB collections                      |
| `routes/`      | Express route handlers (maps URLs to controllers)             |
| `services/`    | Business logic layer (auth, trips, emails, storage)           |
| `validators/`  | Input validation schemas and functions                        |
| `utils/`       | Utility functions (logger, JWT, password, response formatter) |
| `uploads/`     | Local storage for uploaded files (profile pics, trip images)  |
| `database/`    | Database seeding and migration scripts                        |
| `constants/`   | Application constants (roles, statuses, error codes)          |

---

## Key Architectural Decisions

### **Separation of Concerns**

- **Controllers**: Handle HTTP requests/responses only
- **Services**: Contain business logic and database operations
- **Middleware**: Handle cross-cutting concerns (auth, validation, logging)
- **Routes**: Define URL patterns and HTTP methods

### **State Management (Frontend)**

- **Context API**: Used for global state (auth, trips, user)
- **Local State**: Component-level state for UI interactions
- **Local Storage**: Persist auth tokens across sessions

### **API Communication**

- **Centralized Axios Instance**: Auto-attach JWT, handle errors
- **Service Layer**: Encapsulate all API calls
- **Error Handling**: Centralized error interceptor

### **Authentication Flow**

- **JWT Tokens**: Short-lived access + long-lived refresh tokens
- **Protected Routes**: Check auth before rendering
- **Role-Based Access**: Admin-only routes

---

## Component Responsibility Matrix

### **Frontend Layers**

```
Pages (UI + Navigation)
    ↓
Components (Reusable UI)
    ↓
Services (API calls)
    ↓
Context (State management)
    ↓
Hooks (Logic reuse)
    ↓
Utils (Helpers)
```

### **Backend Layers**

```
Routes (URL → Controller)
    ↓
Middleware (Validation, Auth)
    ↓
Controllers (Request handling)
    ↓
Services (Business logic)
    ↓
Models (Database)
    ↓
Utils (Helpers)
```

---

## Data Flow Examples

### **Create Trip**

```
Frontend: TripForm.jsx → tripService.createTrip() → POST /api/trips
Backend: POST /api/trips → authMiddleware → tripController.createTrip()
         → tripService.createTrip() → Trip.create() → Response
Frontend: Receives trip data → Updates TripContext → Redirect to details
```

### **Fetch Trip with Itinerary**

```
Frontend: useEffect → tripService.getTripDetails(tripId)
Backend: GET /api/trips/:tripId → authMiddleware → tripController.getTripDetails()
         → Mongoose populate(stops, activities) → Response with full itinerary
Frontend: Updates TripContext → Re-render ItineraryView
```

### **Admin Analytics**

```
Frontend: AdminDashboard.jsx → analyticsService.getAnalytics()
Backend: GET /api/admin/analytics → adminMiddleware → analyticsController
         → Query aggregations → Return stats
Frontend: Display with Recharts graphs
```

---

## Environment Variables

### **Frontend (.env)**

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_JWT_TOKEN_KEY=auth_token
VITE_APP_NAME=Traveloop
```

### **Backend (.env)**

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/traveloop
JWT_SECRET=your_super_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRATION=15m
MULTER_UPLOAD_PATH=./src/uploads
```

---

## Ready for Next Phase

✅ **Structure Complete**: All directories created
✅ **Architecture Documented**: Clear separation of concerns
✅ **Scalable Design**: Ready for feature implementation
✅ **Best Practices**: Follows MERN standards

**Next Steps**: Initialize npm projects and install dependencies
