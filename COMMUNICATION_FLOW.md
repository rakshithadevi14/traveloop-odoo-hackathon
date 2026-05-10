# Traveloop - Frontend-Backend Communication Flow

## High-Level Communication Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
├─────────────────────────────────────────────────────────────────┤
│  Pages (React Components) → Services → Context → Components     │
│                              ↓                                   │
│                         Axios Instance                           │
│                        (with JWT token)                          │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP Request (JSON)
                               │ Authorization: Bearer TOKEN
                               ↓
                    ┌──────────────────────┐
                    │    NETWORK / API     │
                    │    (REST Endpoints)  │
                    └──────────────────────┘
                               ↓
┌──────────────────────────────┬──────────────────────────────────┐
│                    BACKEND (Node.js/Express)                     │
├─────────────────────────────────────────────────────────────────┤
│  Routes → Middleware (Auth, Validation) → Controllers → Services│
│                              ↓                                   │
│                         MongoDB (Mongoose)                       │
│                            Database                              │
└─────────────────────────────────────────────────────────────────┘
                               ↑
                    HTTP Response (JSON)
                               │
                        Status & Data
```

---

## Request-Response Cycle

### **1. Frontend Makes Request**

```javascript
// tripService.js (Frontend)
export const createTrip = async (tripData) => {
  try {
    const response = await axiosInstance.post("/api/trips", tripData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};
```

### **2. Axios Interceptor Adds JWT**

```javascript
// axiosConfig.js (Frontend)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Request Headers:
// POST /api/trips
// Content-Type: application/json
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **3. Backend Routes Request to Controller**

```javascript
// routes/trips/tripRoutes.js (Backend)
router.post(
  "/",
  authMiddleware, // Verify JWT
  validationMiddleware, // Validate input
  tripController.createTrip, // Handle request
);
```

### **4. Middleware Processes Request**

```javascript
// middleware/authMiddleware.js (Backend)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
```

### **5. Controller Processes Business Logic**

```javascript
// controllers/trips/tripController.js (Backend)
exports.createTrip = async (req, res) => {
  try {
    const { title, description, startDate, endDate, budget } = req.body;
    const userId = req.user.id; // From middleware

    const trip = new Trip({
      userId,
      title,
      description,
      startDate,
      endDate,
      budget,
      status: "planning",
    });

    const savedTrip = await trip.save();

    return res.status(201).json({
      success: true,
      data: savedTrip,
      message: "Trip created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
```

### **6. Frontend Receives Response**

```javascript
// Component using service
const TripForm = () => {
  const handleSubmit = async (formData) => {
    try {
      const newTrip = await createTrip(formData);

      // Update context
      updateTripContext(newTrip);

      // Show success
      showNotification("Trip created successfully!");

      // Navigate
      navigate(`/trips/${newTrip._id}`);
    } catch (error) {
      showError(error.message);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

---

## Communication Flow Examples

### **Example 1: User Login**

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND                                │
├─────────────────────────────────────────────────────────────┤
│ 1. Login.jsx: User enters email & password                 │
│ 2. Form submitted → authService.login(email, password)     │
│ 3. POST /api/auth/login with credentials                   │
│ 4. Headers added by Axios interceptor (no token yet)       │
│    Content-Type: application/json                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                             ↓
                   HTTP POST Request
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND                                │
├─────────────────────────────────────────────────────────────┤
│ 1. POST /api/auth/login routed to authController          │
│ 2. Extract { email, password } from req.body              │
│ 3. Find user by email in DB:                              │
│    User.findOne({ email })                                │
│ 4. Compare password with bcrypt:                          │
│    bcrypt.compare(password, user.password)                │
│ 5. Generate JWT tokens:                                   │
│    - accessToken (15 min)                                 │
│    - refreshToken (7 days)                                │
│ 6. Return response:                                       │
│    {                                                      │
│      success: true,                                       │
│      accessToken: "eyJhbG...",                           │
│      refreshToken: "dBx1O...",                           │
│      user: { id, email, name, role }                     │
│    }                                                      │
└─────────────────────────────────────────────────────────────┘
                             ↑
                   HTTP 200 Response
                             ↑
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND                                │
├─────────────────────────────────────────────────────────────┤
│ 1. Receive tokens in response                             │
│ 2. Save tokens:                                           │
│    - localStorage.setItem('auth_token', accessToken)     │
│    - localStorage.setItem('refresh_token', refreshToken) │
│ 3. Update AuthContext:                                   │
│    - setUser(userData)                                   │
│    - setIsAuthenticated(true)                            │
│ 4. All future requests auto-attach token via interceptor │
│ 5. Navigate to dashboard                                 │
└─────────────────────────────────────────────────────────────┘
```

---

### **Example 2: Fetching Trip with Itinerary**

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND                                │
├─────────────────────────────────────────────────────────────┤
│ 1. TripDetails page loads                                 │
│ 2. useEffect triggers:                                    │
│    getTripDetails(tripId)                                │
│ 3. GET /api/trips/:tripId                                │
│ 4. Axios adds Authorization header with JWT              │
│    GET /api/trips/abc123                                 │
│    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...│
│                                                             │
└─────────────────────────────────────────────────────────────┘
                             ↓
                   HTTP GET Request
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND                                │
├─────────────────────────────────────────────────────────────┤
│ 1. GET /api/trips/:tripId routed to tripController       │
│ 2. authMiddleware verifies JWT                           │
│    - Extracts userId from token                          │
│    - Attaches to req.user                                │
│ 3. tripController.getTripDetails() executes:            │
│    const trip = await Trip.findById(tripId)             │
│      .populate({                                        │
│        path: 'stops',                                   │
│        populate: {                                      │
│          path: 'activities'                             │
│        }                                                │
│      })                                                 │
│      .populate('notes')                                 │
│      .lean()                                            │
│                                                        │
│ 4. MongoDB returns populated document:                 │
│    {                                                   │
│      _id: 'abc123',                                    │
│      title: 'Europe Trip',                            │
│      stops: [                                         │
│        {                                              │
│          _id: 'stop1',                               │
│          city: 'Paris',                              │
│          activities: [                               │
│            { _id: 'act1', title: 'Eiffel Tower' }    │
│          ]                                           │
│        }                                            │
│      ],                                            │
│      notes: [...]                                  │
│    }                                              │
│                                                  │
│ 5. Response sent:                               │
│    200 OK {                                     │
│      success: true,                             │
│      data: { trip object }                      │
│    }                                            │
│                                                 │
└─────────────────────────────────────────────────────────────┘
                             ↑
                   HTTP 200 Response
                             ↑
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND                                │
├─────────────────────────────────────────────────────────────┤
│ 1. Response interceptor processes data                    │
│ 2. tripService.getTripDetails() returns data             │
│ 3. Component receives trip details                       │
│ 4. Update TripContext:                                  │
│    setCurrentTrip(tripData)                            │
│ 5. Component re-renders with:                         │
│    - Trip title, dates, budget                        │
│    - Days with cities                                │
│    - Activities per day                             │
│    - Notes                                          │
│ 6. Display timeline/map view                        │
└─────────────────────────────────────────────────────────────┘
```

---

### **Example 3: Handling Token Expiration**

```
User is on dashboard page
  ↓
Makes request → Axios adds 15-min old access token
  ↓
Backend receives request with expired token
  ↓
authMiddleware checks: jwt.verify(token)
  ↓
Error: "TokenExpiredError"
  ↓
Backend returns: 401 Unauthorized
  ↓
Frontend Axios interceptor catches 401
  ↓
Automatically sends refresh token:
  POST /api/auth/refresh
  { refreshToken: "dBx1O..." }
  ↓
Backend verifies refresh token
  ↓
Generates new access token
  ↓
Returns: { accessToken: "eyJhbG..." }
  ↓
Frontend saves new token:
  localStorage.setItem('auth_token', newToken)
  ↓
Axios retries original request with new token
  ↓
Request succeeds ✓
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ERROR SCENARIO                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Frontend sends invalid data                               │
│    ↓                                                       │
│ Backend validationMiddleware checks                       │
│    ↓                                                       │
│ Validation fails (e.g., email format)                    │
│    ↓                                                       │
│ Return 400 Bad Request:                                  │
│ {                                                        │
│   success: false,                                        │
│   error: 'Invalid email format'                         │
│ }                                                        │
│    ↓                                                       │
│ Frontend Axios interceptor catches error                │
│    ↓                                                       │
│ Throw error to component                                 │
│    ↓                                                       │
│ Component catch block:                                   │
│   showNotification(error.message, 'error')              │
│    ↓                                                       │
│ User sees: "Invalid email format"                       │
│                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## API Response Standard Format

### **Success Response**

```javascript
{
  success: true,
  statusCode: 200,
  message: "Operation successful",
  data: {
    // Actual data
  }
}
```

### **Error Response**

```javascript
{
  success: false,
  statusCode: 400,
  error: "Error message",
  details: { // Optional
    field: "error description"
  }
}
```

### **Paginated Response**

```javascript
{
  success: true,
  data: [ /* items */ ],
  pagination: {
    currentPage: 1,
    totalPages: 5,
    totalItems: 100,
    itemsPerPage: 20
  }
}
```

---

## Middleware Chain Diagram

```
HTTP Request
    ↓
┌─────────────────────────────────────────┐
│ 1. CORS Middleware                      │
│    - Check origin                       │
│    - Add CORS headers                   │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 2. Logger Middleware                    │
│    - Log request details                │
│    - Track execution time               │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 3. Body Parser Middleware               │
│    - Parse JSON body                    │
│    - Parse URL-encoded body             │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 4. Auth Middleware (if protected)       │
│    - Verify JWT                         │
│    - Attach user to request             │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 5. Validation Middleware                │
│    - Validate input schema              │
│    - Sanitize inputs                    │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 6. Route Handler                        │
│    - Execute controller logic           │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 7. Error Handling Middleware            │
│    - Catch errors                       │
│    - Format error response              │
└─────────────────────────────────────────┘
    ↓
HTTP Response
```

---

## State Update Flow

```
Backend sends trip data
    ↓
Frontend receives in service
    ↓
Service returns data to component
    ↓
Component dispatches Context action:
dispatch({ type: 'SET_TRIP', payload: tripData })
    ↓
TripContext reducer updates state:
state.currentTrip = tripData
state.isLoading = false
    ↓
All components subscribed to TripContext re-render
    ↓
UI displays updated trip information
```

---

## Real-time Updates with WebSockets

```
Frontend (Component A)
    ↓
User creates activity
    ↓
POST /api/trips/abc/activities
    ↓
Backend receives, saves to DB
    ↓
Backend emits WebSocket event:
socket.io.emit('activity:created', { activity })
    ↓
All connected clients with that trip receive:
activity:created event
    ↓
Frontend (Components B, C, D)
    ↓
Update context with new activity
    ↓
UI updates in real-time for all users
```

---

## Security in Communication

```
Frontend stores token
    ↓
Axios adds to Authorization header
    ↓
    Authorization: Bearer [JWT_TOKEN]
    ↓
HTTPS encryption ensures token safety
    ↓
Backend receives request
    ↓
Auth middleware verifies signature
    ↓
If signature valid → Request is from authenticated user
If signature invalid → Reject (401 Unauthorized)
    ↓
Even if token leaked, short expiration (15 min) limits damage
Refresh token (7 days) stored securely in HTTP-only cookie
```

---

## Summary

The communication follows a clean REST architecture:

1. **Frontend initiates** with a service call
2. **Axios intercepts** and adds auth token
3. **Backend receives** and processes through middleware chain
4. **Controller executes** business logic
5. **Database returns** data
6. **Response sent** back to frontend
7. **Frontend updates** context and UI
8. **User sees** the result

This ensures:

- ✅ Clean separation of concerns
- ✅ Secure authentication on each request
- ✅ Standardized error handling
- ✅ Automatic token refresh
- ✅ Real-time state synchronization
- ✅ Scalable architecture
