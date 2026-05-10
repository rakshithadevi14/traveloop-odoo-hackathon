# Traveloop - Production MERN Architecture

## Project Overview

Traveloop is a personalized travel planning platform where users can create multi-city trips, manage itineraries, estimate budgets, and share trips. Built with production-grade scalability and best practices.

---

## FRONTEND ARCHITECTURE

### **Frontend Directory Structure**

```
frontend/
├── public/                          # Static assets (favicon, manifest, etc.)
├── src/
│   ├── api/                        # API client setup and configuration
│   │   ├── axiosConfig.js          # Axios instance with interceptors
│   │   └── endpoints.js            # Centralized API endpoints
│   │
│   ├── assets/                     # Static content
│   │   ├── images/                 # Destination, activity images
│   │   └── icons/                  # SVG/PNG icons
│   │
│   ├── components/                 # Reusable React components
│   │   ├── common/                 # Shared UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Pagination.jsx
│   │   │
│   │   ├── dashboard/              # Dashboard-specific components
│   │   │   ├── StatCard.jsx
│   │   │   ├── UpcomingTripsCard.jsx
│   │   │   ├── QuickActions.jsx
│   │   │   └── ActivityFeed.jsx
│   │   │
│   │   ├── trips/                  # Trip management components
│   │   │   ├── TripCard.jsx
│   │   │   ├── TripForm.jsx
│   │   │   ├── TripList.jsx
│   │   │   ├── CitySearch.jsx
│   │   │   └── TripDetails.jsx
│   │   │
│   │   ├── itinerary/              # Itinerary builder components
│   │   │   ├── ItineraryDay.jsx
│   │   │   ├── ActivityCard.jsx
│   │   │   ├── TimelineView.jsx
│   │   │   ├── DragDropItinerary.jsx
│   │   │   └── MapView.jsx
│   │   │
│   │   ├── budget/                 # Budget tracking components
│   │   │   ├── BudgetBreakdown.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── BudgetChart.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   └── BudgetAnalysis.jsx
│   │   │
│   │   └── admin/                  # Admin-specific components
│   │       ├── UserManagement.jsx
│   │       ├── TripManagement.jsx
│   │       ├── AnalyticsDashboard.jsx
│   │       ├── DestinationManager.jsx
│   │       └── ActivityManager.jsx
│   │
│   ├── context/                    # State management
│   │   ├── AuthContext.jsx         # Auth state & methods
│   │   ├── TripContext.jsx         # Trip state & methods
│   │   ├── UserContext.jsx         # User data state
│   │   ├── NotificationContext.jsx # Toast/notifications
│   │   └── index.js               # Export all contexts
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.js              # Auth logic
│   │   ├── useTrips.js             # Trip operations
│   │   ├── useFetch.js             # Data fetching wrapper
│   │   ├── useLocalStorage.js      # Local storage management
│   │   ├── useDebounce.js          # Debounce for search
│   │   └── usePagination.js        # Pagination logic
│   │
│   ├── layouts/                    # Page layouts
│   │   ├── MainLayout.jsx          # Main user layout
│   │   ├── AdminLayout.jsx         # Admin dashboard layout
│   │   ├── AuthLayout.jsx          # Auth pages layout
│   │   └── BlankLayout.jsx         # 404, landing page layout
│   │
│   ├── pages/                      # Page components (Next.js-style)
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── Index.jsx           # Main dashboard
│   │   │   ├── Profile.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Notifications.jsx
│   │   │
│   │   ├── trips/
│   │   │   ├── Index.jsx           # All trips
│   │   │   ├── Create.jsx          # Create new trip
│   │   │   ├── [tripId].jsx        # Trip details
│   │   │   ├── [tripId]Itinerary.jsx
│   │   │   ├── [tripId]Budget.jsx
│   │   │   ├── [tripId]Checklist.jsx
│   │   │   ├── [tripId]Notes.jsx
│   │   │   └── Share.jsx           # Share/Public trips
│   │   │
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Users.jsx
│   │       ├── Trips.jsx
│   │       ├── Analytics.jsx
│   │       ├── Destinations.jsx
│   │       └── Activities.jsx
│   │
│   ├── routes/                     # Route configuration
│   │   ├── ProtectedRoute.jsx      # Auth-protected routes
│   │   ├── AdminRoute.jsx          # Admin-only routes
│   │   └── AppRoutes.jsx           # Central route config
│   │
│   ├── services/                   # Business logic layer
│   │   ├── authService.js          # Auth API calls
│   │   ├── tripService.js          # Trip operations
│   │   ├── itineraryService.js     # Itinerary operations
│   │   ├── activityService.js      # Activity operations
│   │   ├── budgetService.js        # Budget calculations
│   │   ├── uploadService.js        # File uploads
│   │   └── analyticsService.js     # Analytics data
│   │
│   ├── utils/                      # Utility functions
│   │   ├── validators.js           # Form/input validation
│   │   ├── formatters.js           # Date, currency formatting
│   │   ├── constants.js            # App constants
│   │   ├── errorHandler.js         # Error processing
│   │   ├── localStorage.js         # LocalStorage helpers
│   │   └── helpers.js              # General helpers
│   │
│   ├── styles/                     # Global styles
│   │   ├── globals.css             # Tailwind + global styles
│   │   ├── variables.css           # CSS variables
│   │   └── animations.css          # Custom animations
│   │
│   ├── data/                       # Static/mock data
│   │   ├── destinations.json       # Cities, countries
│   │   ├── activities.json         # Activity categories
│   │   ├── currencies.json         # Currency list
│   │   └── mockData.js             # For testing
│   │
│   ├── App.jsx                     # Root component
│   └── main.jsx                    # Vite entry point
│
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS config
├── postcss.config.js               # PostCSS config
├── .env.example                    # Environment variables template
└── package.json                    # Dependencies
```

### **Frontend Key Concepts**

**API Layer** (`api/`)

- Centralized Axios configuration with interceptors
- Auto-attach JWT tokens to requests
- Global error handling
- Request/response logging

**State Management** (`context/`)

- Auth context: User login, token, user data
- Trip context: Current trip, trips list
- User context: User profile, preferences
- Notification context: Toast messages

**Custom Hooks** (`hooks/`)

- Encapsulate API calls with loading/error states
- Reusable logic across components
- Reduce component complexity

**Protected Routes** (`routes/`)

- Check JWT token before rendering
- Redirect unauthenticated users to login
- Role-based access (user vs admin)

---

## BACKEND ARCHITECTURE

### **Backend Directory Structure**

```
backend/
├── src/
│   ├── config/                     # Configuration files
│   │   ├── database.js             # MongoDB connection
│   │   ├── jwt.js                  # JWT secrets & settings
│   │   ├── multer.js               # File upload config
│   │   ├── env.js                  # Environment validation
│   │   └── constants.js            # Constants
│   │
│   ├── controllers/                # Request handlers (MVC)
│   │   ├── auth/
│   │   │   ├── authController.js   # Login, signup, refresh
│   │   │   └── passwordController.js
│   │   │
│   │   ├── trips/
│   │   │   ├── tripController.js   # Create, read, update, delete trips
│   │   │   ├── tripStopController.js
│   │   │   └── sharedTripController.js
│   │   │
│   │   ├── itinerary/
│   │   │   └── itineraryController.js
│   │   │
│   │   ├── activities/
│   │   │   └── activityController.js
│   │   │
│   │   ├── budget/
│   │   │   └── budgetController.js
│   │   │
│   │   └── admin/
│   │       ├── adminController.js
│   │       ├── userManagementController.js
│   │       ├── analyticsController.js
│   │       └── destinationController.js
│   │
│   ├── middleware/                 # Express middleware
│   │   ├── authMiddleware.js       # JWT verification
│   │   ├── errorHandler.js         # Global error handling
│   │   ├── roleMiddleware.js       # Role-based access control
│   │   ├── validation.js           # Request validation
│   │   ├── logger.js               # Request logging
│   │   ├── corsMiddleware.js       # CORS setup
│   │   └── requestLimiter.js       # Rate limiting
│   │
│   ├── models/                     # Mongoose schemas
│   │   ├── User.js                 # User collection
│   │   ├── Trip.js                 # Trip collection
│   │   ├── TripStop.js             # Stop/day collection
│   │   ├── Activity.js             # Activity collection
│   │   ├── Budget.js               # Budget/expense tracking
│   │   ├── PackingItem.js          # Packing checklist
│   │   ├── Note.js                 # Trip notes/journal
│   │   ├── SharedTrip.js           # Shared trip metadata
│   │   ├── Destination.js          # Destination info
│   │   └── Analytics.js            # User analytics
│   │
│   ├── routes/                     # Express route handlers
│   │   ├── auth/
│   │   │   └── authRoutes.js       # /auth endpoints
│   │   │
│   │   ├── trips/
│   │   │   ├── tripRoutes.js       # /trips endpoints
│   │   │   └── sharedRoutes.js     # /shared-trips endpoints
│   │   │
│   │   ├── itinerary/
│   │   │   └── itineraryRoutes.js  # /itinerary endpoints
│   │   │
│   │   ├── activities/
│   │   │   └── activityRoutes.js   # /activities endpoints
│   │   │
│   │   ├── budget/
│   │   │   └── budgetRoutes.js     # /budget endpoints
│   │   │
│   │   ├── admin/
│   │   │   └── adminRoutes.js      # /admin endpoints
│   │   │
│   │   └── index.js                # Register all routes
│   │
│   ├── services/                   # Business logic layer
│   │   ├── authService.js          # Auth logic
│   │   ├── tripService.js          # Trip operations
│   │   ├── itineraryService.js
│   │   ├── activityService.js
│   │   ├── budgetService.js
│   │   ├── emailService.js         # Email sending
│   │   ├── cloudStorageService.js  # AWS S3/similar
│   │   └── analyticsService.js
│   │
│   ├── validators/                 # Input validation
│   │   ├── authValidator.js
│   │   ├── tripValidator.js
│   │   ├── itineraryValidator.js
│   │   ├── activityValidator.js
│   │   ├── budgetValidator.js
│   │   └── commonValidator.js
│   │
│   ├── utils/                      # Utility functions
│   │   ├── logger.js               # Logging utility
│   │   ├── errorHandler.js         # Custom error classes
│   │   ├── jwt.js                  # JWT generation/verification
│   │   ├── password.js             # Password hashing
│   │   ├── response.js             # Standard response format
│   │   ├── fileUpload.js           # File handling
│   │   └── helpers.js              # General helpers
│   │
│   ├── uploads/                    # Uploaded files storage
│   │   ├── profiles/               # User profile pictures
│   │   ├── trips/                  # Trip images
│   │   └── activities/             # Activity images
│   │
│   ├── database/                   # Database setup
│   │   ├── seed.js                 # Database seeding
│   │   └── migrations.js           # Schema migrations
│   │
│   ├── constants/                  # Application constants
│   │   ├── tripStatus.js
│   │   ├── errorCodes.js
│   │   ├── userRoles.js
│   │   └── messages.js
│   │
│   └── app.js                      # Express app setup
│
├── .env.example                    # Environment template
├── server.js                       # Entry point (starts app.js)
├── package.json
└── .gitignore
```

### **Backend Key Concepts**

**MVC Architecture**

- Models: Mongoose schemas define data structure
- Views: REST API responses (JSON)
- Controllers: Handle business logic and data flow

**Middleware Stack**

- CORS: Enable frontend-backend communication
- Authentication: JWT token verification
- Validation: Input sanitization and validation
- Error Handling: Centralized error processing
- Rate Limiting: Prevent abuse

**Services Layer**

- Encapsulate complex business logic
- Reusable across multiple controllers
- Testable and maintainable

---

## DATABASE SCHEMA

### **Collections Structure**

#### **1. Users**

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  profilePicture: String (URL),
  bio: String,
  role: "user" | "admin",
  isVerified: Boolean,
  verificationToken: String,
  resetPasswordToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **2. Trips**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  coverImage: String (URL),
  startDate: Date,
  endDate: Date,
  budget: Number,
  currency: String,
  status: "planning" | "ongoing" | "completed",
  isPublic: Boolean,
  collaborators: [ObjectId], // Other user IDs
  stops: [ObjectId] (ref: TripStop),
  activities: [ObjectId] (ref: Activity),
  notes: [ObjectId] (ref: Note),
  totalExpenses: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### **3. TripStops (Days/Cities)**

```javascript
{
  _id: ObjectId,
  tripId: ObjectId (ref: Trip),
  city: String,
  country: String,
  dayNumber: Number,
  startDate: Date,
  endDate: Date,
  accommodation: {
    name: String,
    address: String,
    cost: Number,
    checkinTime: String,
    checkoutTime: String
  },
  activities: [ObjectId] (ref: Activity),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **4. Activities**

```javascript
{
  _id: ObjectId,
  tripStopId: ObjectId (ref: TripStop),
  title: String,
  description: String,
  category: String, // "sightseeing", "dining", "adventure", etc.
  startTime: Time,
  endTime: Time,
  duration: Number,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  cost: Number,
  image: String (URL),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **5. Budget**

```javascript
{
  _id: ObjectId,
  tripId: ObjectId (ref: Trip),
  expenses: [{
    _id: ObjectId,
    category: String, // "flight", "hotel", "food", "activity"
    description: String,
    amount: Number,
    currency: String,
    date: Date,
    paymentMethod: String,
    createdAt: Date
  }],
  totalBudget: Number,
  totalSpent: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### **6. PackingItems**

```javascript
{
  _id: ObjectId,
  tripId: ObjectId (ref: Trip),
  items: [{
    _id: ObjectId,
    name: String,
    category: String, // "clothing", "documents", "electronics"
    isPacked: Boolean,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### **7. Notes**

```javascript
{
  _id: ObjectId,
  tripId: ObjectId (ref: Trip),
  tripStopId: ObjectId (ref: TripStop) (optional),
  title: String,
  content: String,
  tags: [String],
  isPinned: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### **8. SharedTrips**

```javascript
{
  _id: ObjectId,
  tripId: ObjectId (ref: Trip),
  sharedBy: ObjectId (ref: User),
  shareToken: String (unique),
  shareUrl: String,
  viewCount: Number,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### **9. Destinations** (Admin)

```javascript
{
  _id: ObjectId,
  city: String,
  country: String,
  description: String,
  image: String (URL),
  isFeatured: Boolean,
  popularity: Number,
  bestTimeToVisit: String,
  attractions: [String],
  createdAt: Date,
  updatedAt: Date
}
```

---

## COMMUNICATION FLOW

### **Frontend → Backend Communication**

```
User Action
    ↓
React Component
    ↓
Service Layer (e.g., tripService.js)
    ↓
API Call (Axios with interceptors)
    ↓
Attached JWT Token (if authenticated)
    ↓
Backend Middleware (validation, auth check)
    ↓
Express Routes
    ↓
Controllers
    ↓
Services (business logic)
    ↓
Mongoose Models (database)
    ↓
Response (JSON)
    ↓
Frontend State (Context API)
    ↓
Component Re-render
```

### **Example: Creating a Trip**

**Frontend:**

```
User fills trip form → Submit
→ tripService.createTrip(tripData)
→ Axios POST /api/trips
→ JWT token attached by interceptor
→ Context updates trips list
→ Redirect to trip details
```

**Backend:**

```
POST /api/trips
→ authMiddleware (verify JWT)
→ validationMiddleware (validate request)
→ tripController.createTrip()
→ tripService.createTrip(data)
→ Trip.create() (save to MongoDB)
→ Return { success: true, trip: {...} }
→ Frontend receives, updates context
```

---

## AUTHENTICATION FLOW

### **JWT-Based Authentication**

#### **Signup Process**

```
1. User enters email, password, name
2. Frontend: POST /api/auth/signup with data
3. Backend:
   - Validate input
   - Check if user exists
   - Hash password with bcrypt
   - Create user in DB
   - Generate JWT tokens (access + refresh)
   - Send verification email
4. Frontend stores tokens in localStorage
5. Redirect to dashboard
```

#### **Login Process**

```
1. User enters email, password
2. Frontend: POST /api/auth/login
3. Backend:
   - Find user by email
   - Compare passwords using bcrypt
   - Generate JWT tokens
   - Return tokens and user data
4. Frontend stores tokens (localStorage + state)
5. Set Authorization header for future requests
```

#### **JWT Token Structure**

```
Access Token (short-lived, ~15 minutes):
- header: { alg: "HS256", typ: "JWT" }
- payload: { userId, email, role, iat, exp }
- signature: HMAC-SHA256(secret)

Refresh Token (long-lived, ~7 days):
- Stored in HTTP-only cookie (secure)
- Used to generate new access tokens
```

#### **Protected Request Flow**

```
Frontend makes request
→ authMiddleware checks Authorization header
→ Extracts JWT token
→ Verifies signature and expiration
→ If valid: Attach userId to request, proceed
→ If invalid: Return 401 Unauthorized
→ Frontend intercepts 401, uses refresh token
→ Gets new access token
→ Retries original request
```

---

## DATABASE RELATIONSHIP FLOW

### **Hierarchical Structure**

```
User (1) ──────→ (Many) Trips
  └─> Profile
  └─> Email
  └─> Role

Trip (1) ──────→ (Many) TripStops (Days/Cities)
  ├─> Cover Image
  ├─> Status
  ├─> Budget
  └─> Collaborators (Many Users)

TripStop (1) ──────→ (Many) Activities
  ├─> Accommodation
  ├─> Day Number
  └─> Notes

Activity (1)
  ├─> Location (lat/long)
  ├─> Time Slot
  ├─> Category
  └─> Cost

Trip (1) ──────→ (1) Budget
  └─> Expenses Array

Trip (1) ──────→ (Many) Notes
  └─> Can link to specific TripStop

Trip (1) ──────→ (1) PackingChecklist
  └─> Items Array

Trip (1) ──────→ (1) SharedTrip
  └─> Share Token & URL
```

### **Query Example: Get Full Trip Itinerary**

```javascript
// Frontend requests trip details
GET /api/trips/:tripId

// Backend executes:
Trip.findById(tripId)
  .populate({
    path: 'stops',
    populate: {
      path: 'activities'
    }
  })
  .populate('notes')
  .populate('userId', 'firstName lastName profilePicture')
  .exec()

// Response includes:
{
  tripId,
  title,
  stops: [
    {
      stopId,
      city,
      activities: [
        { activityId, title, time, cost }
      ]
    }
  ],
  notes: [...],
  budget: {...}
}
```

---

## SCALABILITY & PERFORMANCE CONSIDERATIONS

### **Frontend Optimization**

- Code splitting with React.lazy()
- Virtualized lists for large datasets
- Image lazy loading
- Debounced search queries
- Request caching with Context API
- Offline support with IndexedDB

### **Backend Optimization**

- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching layer (Redis) for frequently accessed data
- Rate limiting to prevent abuse
- Compression middleware (gzip)
- Load balancing for multiple servers
- CDN for static assets and images

### **Security**

- HTTPS/TLS encryption
- CORS whitelisting
- SQL injection prevention (Mongoose)
- XSS protection (sanitize input)
- CSRF tokens for state-changing operations
- Secure password hashing (bcrypt)
- Environment variables for secrets
- API rate limiting
- JWT token expiration

---

## DEPLOYMENT ARCHITECTURE

### **Frontend**

- Build: `npm run build` → Vite optimized bundle
- Deploy: Vercel, Netlify, or AWS S3 + CloudFront
- Environment: `.env.production` with API base URL

### **Backend**

- Build: Docker containerization
- Deploy: AWS ECS, Heroku, DigitalOcean, or self-hosted
- Database: MongoDB Atlas (cloud) or self-hosted
- File Storage: AWS S3 for images and documents
- Environment: `.env` with DB URI, JWT secrets, etc.

---

## NEXT STEPS

1. **Initialize Project**: `npm init` for both frontend and backend
2. **Install Dependencies**: Add all required packages
3. **Setup Configurations**: Database connection, JWT setup, middleware
4. **Create Models**: Define MongoDB schemas
5. **Build Controllers**: Implement business logic
6. **Build Routes**: Create API endpoints
7. **Build Frontend Components**: Reusable UI components
8. **Setup Authentication**: JWT flow and protected routes
9. **Implement Features**: Trip management, budget, itinerary, etc.
10. **Testing**: Unit and integration tests
11. **Deployment**: CI/CD pipelines and production deployment

---

## File Size Reference

Each feature module should be reasonably sized:

- Controllers: 200-500 lines per file
- Services: 300-600 lines per file
- Routes: 100-200 lines per file
- Components: 200-400 lines per file
- Utils: 100-300 lines per file

This ensures maintainability and testability.
