# Traveloop - API Endpoints Reference

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.traveloop.com/api
```

## Authentication Header

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

---

## Authentication Endpoints

### **1. Signup**

```
POST /auth/signup
Body: {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
}
Response: {
  success: true,
  accessToken: string,
  refreshToken: string,
  user: { id, email, firstName, lastName, role }
}
```

### **2. Login**

```
POST /auth/login
Body: {
  email: string,
  password: string
}
Response: {
  success: true,
  accessToken: string,
  refreshToken: string,
  user: { id, email, firstName, lastName, role }
}
```

### **3. Refresh Token**

```
POST /auth/refresh
Body: {
  refreshToken: string
}
Response: {
  success: true,
  accessToken: string
}
```

### **4. Logout**

```
POST /auth/logout
Headers: Authorization required
Response: {
  success: true,
  message: "Logged out successfully"
}
```

### **5. Forgot Password**

```
POST /auth/forgot-password
Body: {
  email: string
}
Response: {
  success: true,
  message: "Reset link sent to email"
}
```

### **6. Reset Password**

```
POST /auth/reset-password/:token
Body: {
  password: string,
  confirmPassword: string
}
Response: {
  success: true,
  message: "Password reset successfully"
}
```

---

## User Endpoints

### **1. Get Profile**

```
GET /users/profile
Headers: Authorization required
Response: {
  success: true,
  data: { id, email, firstName, lastName, bio, profilePicture, role }
}
```

### **2. Update Profile**

```
PUT /users/profile
Headers: Authorization required
Body: {
  firstName: string,
  lastName: string,
  bio: string
}
Response: {
  success: true,
  data: { /* updated user */ }
}
```

### **3. Upload Profile Picture**

```
POST /users/upload-profile-picture
Headers: Authorization required
Content-Type: multipart/form-data
Body: FormData with file
Response: {
  success: true,
  profilePicture: string (URL)
}
```

### **4. Change Password**

```
POST /users/change-password
Headers: Authorization required
Body: {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
}
Response: {
  success: true,
  message: "Password changed successfully"
}
```

### **5. Delete Account**

```
DELETE /users/account
Headers: Authorization required
Response: {
  success: true,
  message: "Account deleted successfully"
}
```

---

## Trip Endpoints

### **1. Create Trip**

```
POST /trips
Headers: Authorization required
Body: {
  title: string,
  description: string,
  startDate: date,
  endDate: date,
  budget: number,
  currency: string,
  coverImage: file (optional)
}
Response: {
  success: true,
  data: { _id, title, userId, status, ... }
}
```

### **2. Get All Trips**

```
GET /trips?page=1&limit=20&status=planning&sortBy=createdAt
Headers: Authorization required
Response: {
  success: true,
  data: [ { trip1 }, { trip2 } ],
  pagination: { currentPage, totalPages, totalItems }
}
```

### **3. Get Trip Details**

```
GET /trips/:tripId
Headers: Authorization required
Response: {
  success: true,
  data: {
    _id, title, description, startDate, endDate,
    stops: [ { _id, city, activities: [] } ],
    notes: [ { _id, title, content } ],
    budget: { totalBudget, totalSpent, expenses: [] }
  }
}
```

### **4. Update Trip**

```
PUT /trips/:tripId
Headers: Authorization required
Body: {
  title: string,
  description: string,
  startDate: date,
  endDate: date,
  budget: number
}
Response: {
  success: true,
  data: { /* updated trip */ }
}
```

### **5. Delete Trip**

```
DELETE /trips/:tripId
Headers: Authorization required
Response: {
  success: true,
  message: "Trip deleted successfully"
}
```

### **6. Add Collaborator**

```
POST /trips/:tripId/collaborators
Headers: Authorization required
Body: {
  email: string
}
Response: {
  success: true,
  data: { _id, collaborators: [{ id, email, name }] }
}
```

### **7. Remove Collaborator**

```
DELETE /trips/:tripId/collaborators/:collaboratorId
Headers: Authorization required
Response: {
  success: true,
  message: "Collaborator removed"
}
```

---

## Trip Stops (Days) Endpoints

### **1. Create Stop**

```
POST /trips/:tripId/stops
Headers: Authorization required
Body: {
  city: string,
  country: string,
  dayNumber: number,
  startDate: date,
  endDate: date,
  accommodation: {
    name: string,
    address: string,
    cost: number,
    checkinTime: time,
    checkoutTime: time
  }
}
Response: {
  success: true,
  data: { /* new stop */ }
}
```

### **2. Get All Stops**

```
GET /trips/:tripId/stops
Headers: Authorization required
Response: {
  success: true,
  data: [ { stop1 }, { stop2 } ]
}
```

### **3. Update Stop**

```
PUT /trips/:tripId/stops/:stopId
Headers: Authorization required
Body: { city, country, startDate, endDate, accommodation }
Response: {
  success: true,
  data: { /* updated stop */ }
}
```

### **4. Delete Stop**

```
DELETE /trips/:tripId/stops/:stopId
Headers: Authorization required
Response: {
  success: true,
  message: "Stop deleted"
}
```

---

## Activity Endpoints

### **1. Create Activity**

```
POST /trips/:tripId/stops/:stopId/activities
Headers: Authorization required
Body: {
  title: string,
  description: string,
  category: string,
  startTime: time,
  endTime: time,
  location: {
    latitude: number,
    longitude: number,
    address: string
  },
  cost: number,
  image: file (optional)
}
Response: {
  success: true,
  data: { /* new activity */ }
}
```

### **2. Get Activities (by Stop)**

```
GET /trips/:tripId/stops/:stopId/activities
Headers: Authorization required
Response: {
  success: true,
  data: [ { activity1 }, { activity2 } ]
}
```

### **3. Update Activity**

```
PUT /trips/:tripId/activities/:activityId
Headers: Authorization required
Body: { title, description, category, startTime, endTime, cost, location }
Response: {
  success: true,
  data: { /* updated activity */ }
}
```

### **4. Delete Activity**

```
DELETE /trips/:tripId/activities/:activityId
Headers: Authorization required
Response: {
  success: true,
  message: "Activity deleted"
}
```

### **5. Reorder Activities**

```
POST /trips/:tripId/stops/:stopId/reorder-activities
Headers: Authorization required
Body: {
  activities: [
    { _id: "id1", order: 1 },
    { _id: "id2", order: 2 }
  ]
}
Response: {
  success: true,
  data: { /* reordered activities */ }
}
```

---

## Budget Endpoints

### **1. Create Expense**

```
POST /trips/:tripId/budget/expenses
Headers: Authorization required
Body: {
  category: string,
  description: string,
  amount: number,
  currency: string,
  date: date,
  paymentMethod: string
}
Response: {
  success: true,
  data: { /* new expense */ }
}
```

### **2. Get Budget Details**

```
GET /trips/:tripId/budget
Headers: Authorization required
Response: {
  success: true,
  data: {
    totalBudget: number,
    totalSpent: number,
    expenses: [ { category, amount, date } ],
    byCategory: { food: 100, flight: 500 }
  }
}
```

### **3. Update Expense**

```
PUT /trips/:tripId/budget/expenses/:expenseId
Headers: Authorization required
Body: { category, description, amount, date, paymentMethod }
Response: {
  success: true,
  data: { /* updated expense */ }
}
```

### **4. Delete Expense**

```
DELETE /trips/:tripId/budget/expenses/:expenseId
Headers: Authorization required
Response: {
  success: true,
  message: "Expense deleted"
}
```

### **5. Get Budget Summary**

```
GET /trips/:tripId/budget/summary
Headers: Authorization required
Response: {
  success: true,
  data: {
    totalBudget: 5000,
    spent: 2500,
    remaining: 2500,
    percentUsed: 50,
    byCategory: { food: 500, accommodation: 1500, activities: 500 }
  }
}
```

---

## Packing Checklist Endpoints

### **1. Create Checklist**

```
POST /trips/:tripId/checklist
Headers: Authorization required
Body: {
  items: [
    { name: string, category: string }
  ]
}
Response: {
  success: true,
  data: { /* checklist */ }
}
```

### **2. Get Checklist**

```
GET /trips/:tripId/checklist
Headers: Authorization required
Response: {
  success: true,
  data: {
    items: [ { _id, name, category, isPacked } ]
  }
}
```

### **3. Add Item**

```
POST /trips/:tripId/checklist/items
Headers: Authorization required
Body: {
  name: string,
  category: string
}
Response: {
  success: true,
  data: { /* new item */ }
}
```

### **4. Toggle Item**

```
PATCH /trips/:tripId/checklist/items/:itemId
Headers: Authorization required
Body: {
  isPacked: boolean
}
Response: {
  success: true,
  data: { /* updated item */ }
}
```

### **5. Delete Item**

```
DELETE /trips/:tripId/checklist/items/:itemId
Headers: Authorization required
Response: {
  success: true,
  message: "Item deleted"
}
```

---

## Notes Endpoints

### **1. Create Note**

```
POST /trips/:tripId/notes
Headers: Authorization required
Body: {
  title: string,
  content: string,
  tags: [string],
  stopId: string (optional)
}
Response: {
  success: true,
  data: { /* new note */ }
}
```

### **2. Get All Notes**

```
GET /trips/:tripId/notes?tags=food&isPinned=true
Headers: Authorization required
Response: {
  success: true,
  data: [ { note1 }, { note2 } ]
}
```

### **3. Get Note**

```
GET /trips/:tripId/notes/:noteId
Headers: Authorization required
Response: {
  success: true,
  data: { _id, title, content, tags, createdAt }
}
```

### **4. Update Note**

```
PUT /trips/:tripId/notes/:noteId
Headers: Authorization required
Body: { title, content, tags }
Response: {
  success: true,
  data: { /* updated note */ }
}
```

### **5. Delete Note**

```
DELETE /trips/:tripId/notes/:noteId
Headers: Authorization required
Response: {
  success: true,
  message: "Note deleted"
}
```

### **6. Pin/Unpin Note**

```
PATCH /trips/:tripId/notes/:noteId/pin
Headers: Authorization required
Body: {
  isPinned: boolean
}
Response: {
  success: true,
  data: { /* updated note */ }
}
```

---

## Shared Trip Endpoints

### **1. Create Share Link**

```
POST /trips/:tripId/share
Headers: Authorization required
Body: {
  expiresIn: number (days)
}
Response: {
  success: true,
  data: {
    shareToken: string,
    shareUrl: string,
    expiresAt: date
  }
}
```

### **2. Get Shared Trip (Public)**

```
GET /shared-trips/:shareToken
Response: {
  success: true,
  data: {
    trip: { title, description, startDate, endDate },
    stops: [ { city, activities } ],
    isPublic: true
  }
}
```

### **3. Get Share Links**

```
GET /trips/:tripId/shares
Headers: Authorization required
Response: {
  success: true,
  data: [ { shareToken, shareUrl, expiresAt, viewCount } ]
}
```

### **4. Delete Share Link**

```
DELETE /trips/:tripId/shares/:shareToken
Headers: Authorization required
Response: {
  success: true,
  message: "Share link deleted"
}
```

---

## Admin Endpoints

### **1. Get Analytics Dashboard**

```
GET /admin/analytics
Headers: Authorization required (Admin only)
Response: {
  success: true,
  data: {
    totalUsers: number,
    totalTrips: number,
    activeUsers: number,
    revenue: number,
    topDestinations: [{ city, count }],
    userGrowth: [{ date, count }]
  }
}
```

### **2. Get All Users**

```
GET /admin/users?page=1&limit=20&role=user&sortBy=createdAt
Headers: Authorization required (Admin only)
Response: {
  success: true,
  data: [ { user1 }, { user2 } ],
  pagination: { currentPage, totalPages }
}
```

### **3. Update User Role**

```
PUT /admin/users/:userId/role
Headers: Authorization required (Admin only)
Body: {
  role: "user" | "admin"
}
Response: {
  success: true,
  data: { /* updated user */ }
}
```

### **4. Ban/Unban User**

```
PATCH /admin/users/:userId/status
Headers: Authorization required (Admin only)
Body: {
  status: "active" | "banned"
}
Response: {
  success: true,
  message: "User status updated"
}
```

### **5. Get All Trips (Admin)**

```
GET /admin/trips?page=1&limit=20&status=planning
Headers: Authorization required (Admin only)
Response: {
  success: true,
  data: [ { trip1 }, { trip2 } ]
}
```

### **6. Delete Trip (Admin)**

```
DELETE /admin/trips/:tripId
Headers: Authorization required (Admin only)
Response: {
  success: true,
  message: "Trip deleted"
}
```

### **7. Featured Destinations**

```
GET /admin/destinations

PUT /admin/destinations/:destinationId
Headers: Authorization required (Admin only)
Body: { isFeatured: boolean }

POST /admin/destinations
Headers: Authorization required (Admin only)
Body: { city, country, description, image, attractions }
```

---

## Error Responses

### **400 Bad Request**

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

### **401 Unauthorized**

```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

### **403 Forbidden**

```json
{
  "success": false,
  "error": "Access denied. Admin privileges required."
}
```

### **404 Not Found**

```json
{
  "success": false,
  "error": "Trip not found"
}
```

### **409 Conflict**

```json
{
  "success": false,
  "error": "Email already exists"
}
```

### **500 Internal Server Error**

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

**Limits per IP:**

- General endpoints: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- File uploads: 10 requests per hour

**Response Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
```

---

## API Documentation Tools

**Recommended Tools:**

- Swagger/OpenAPI: `swagger-ui-express`
- Postman: Import collection
- Documentation: TypeDoc or JSDoc

**Endpoint Documentation Path:**

```
/api-docs (Swagger UI)
/api/documentation (HTML docs)
```

---

## Pagination

**All list endpoints support:**

```
GET /resource?page=1&limit=20&sortBy=createdAt&order=desc
```

**Response Format:**

```json
{
  "success": true,
  "data": [
    /* items */
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Caching Headers

**For static data:**

```
Cache-Control: public, max-age=3600
ETag: "33a64df551"
```

**For API responses:**

```
Cache-Control: no-cache, must-revalidate
```
