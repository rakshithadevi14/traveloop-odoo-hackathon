# Traveloop - Quick Start Guide

## 🎯 What You Have

✅ Complete production-grade MERN architecture
✅ Organized folder structure (frontend + backend)
✅ Clear separation of concerns
✅ Security patterns established
✅ Database schema documented
✅ API endpoints defined
✅ Development roadmap created

## ⚡ What to Do Next

### **Step 1: Initialize Frontend** (30 minutes)

#### 1.1 Navigate to frontend

```bash
cd frontend
npm init -y
```

#### 1.2 Install core dependencies

```bash
npm install react react-dom react-router-dom axios
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer
npm install -D @tailwindcss/forms lucide-react recharts socket.io-client
```

#### 1.3 Setup Tailwind CSS

```bash
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### 1.4 Create frontend scripts in package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src"
  }
}
```

#### 1.5 Create `.env.example`

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_JWT_TOKEN_KEY=auth_token
VITE_APP_NAME=Traveloop
```

---

### **Step 2: Initialize Backend** (30 minutes)

#### 2.1 Navigate to backend

```bash
cd backend
npm init -y
```

#### 2.2 Install core dependencies

```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv cors helmet express-rate-limit joi multer
npm install -D nodemon jest supertest @types/express
```

#### 2.3 Create backend scripts in package.json

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

#### 2.4 Create `.env.example`

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/traveloop
JWT_SECRET=your-super-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRATION=15m
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
MULTER_UPLOAD_PATH=./src/uploads
```

---

### **Step 3: Create Base Configuration Files**

#### 3.1 Frontend - Create `src/api/axiosConfig.js`

```javascript
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(import.meta.env.VITE_JWT_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
      localStorage.removeItem(import.meta.env.VITE_JWT_TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
```

#### 3.2 Backend - Create `src/config/database.js`

```javascript
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
```

#### 3.3 Backend - Create `src/config/jwt.js`

```javascript
import jwt from "jsonwebtoken";

const generateAccessToken = (userId, email, role) => {
  return jwt.sign({ userId, email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export { generateAccessToken, generateRefreshToken, verifyAccessToken };
```

---

### **Step 4: Create Entry Points**

#### 4.1 Frontend - Create `src/App.jsx`

```javascript
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>{/* Routes will go here */}</Routes>
    </Router>
  );
}

export default App;
```

#### 4.1 Frontend - Create `src/main.jsx`

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

#### 4.2 Backend - Create `src/app.js`

```javascript
import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Routes will go here

export default app;
```

#### 4.3 Backend - Create `server.js`

```javascript
import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### **Step 5: Create Global Styles**

#### 5.1 Frontend - Create `src/styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --danger: #ef4444;
  --success: #10b981;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Source Sans Pro", sans-serif;
}

.container {
  @apply max-w-7xl mx-auto px-4;
}
```

---

### **Step 6: Test Setup**

#### 6.1 Frontend - Run development server

```bash
cd frontend
npm run dev
# Should start on http://localhost:5173
```

#### 6.2 Backend - Run development server

```bash
cd backend
npm run dev
# Should start on http://localhost:5000
```

#### 6.3 Test health endpoint

```bash
curl http://localhost:5000/api/health
# Should return: {"status":"OK","message":"Server is running"}
```

---

### **Step 7: Version Control**

#### 7.1 Initialize git (if not already done)

```bash
cd ../..
git init
git add .
git commit -m "Initial: Production MERN architecture setup"
```

#### 7.2 Create branches for features

```bash
git checkout -b feature/auth
```

---

## 📖 Documentation Reference

Before you start coding, familiarize yourself with these files:

1. **ARCHITECTURE.md** - Complete architecture guide
   - Read for: Detailed architecture, folder purposes, relationships

2. **PROJECT_STRUCTURE.md** - Quick reference
   - Read for: Directory purposes, quick lookup

3. **COMMUNICATION_FLOW.md** - How frontend-backend communicate
   - Read for: Request/response flow, examples, patterns

4. **DEVELOPMENT_ROADMAP.md** - 13-week implementation plan
   - Read for: What to build next, dependencies, milestones

5. **API_ENDPOINTS.md** - Complete API reference
   - Read for: All endpoints, request/response formats

6. **ARCHITECTURE_SUMMARY.md** - Design decisions
   - Read for: Why decisions were made, best practices

---

## 🔄 Recommended Implementation Order

### **Week 1-2: Authentication**

```
1. Create User model
2. Implement signup/login endpoints
3. Create auth middleware
4. Build frontend auth pages
5. Setup AuthContext
```

### **Week 2-3: Core Trip Features**

```
1. Create Trip model
2. Build trip CRUD endpoints
3. Create TripContext
4. Build My Trips page
5. Build Create Trip form
```

### **Week 3-4: Itinerary**

```
1. Create TripStop model
2. Create Activity model
3. Build itinerary endpoints
4. Build itinerary builder UI
5. Add drag-drop functionality
```

### **Week 4-5: Budget**

```
1. Create Budget/Expense models
2. Build budget endpoints
3. Build expense form
4. Create budget charts
5. Add category breakdown
```

See **DEVELOPMENT_ROADMAP.md** for complete 13-week plan.

---

## 🛠️ Common Commands

### **Frontend**

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Install new dependency
npm install package-name
npm install -D dev-package-name
```

### **Backend**

```bash
# Development
npm run dev

# Production
npm run start

# Tests
npm run test

# Install new dependency
npm install package-name
npm install -D dev-package-name
```

---

## 📋 Checklist for Getting Started

- [ ] Created all necessary folders (✅ Already done)
- [ ] Frontend: `npm install` and setup Tailwind
- [ ] Backend: `npm install` and setup MongoDB connection
- [ ] Created `.env` files in both frontend and backend
- [ ] Created base configuration files (Axios, JWT, DB)
- [ ] Created App.jsx and server.js entry points
- [ ] Setup global styles
- [ ] Tested both servers start successfully
- [ ] Tested health endpoint works
- [ ] Initialized git repository
- [ ] Read ARCHITECTURE.md completely
- [ ] Read DEVELOPMENT_ROADMAP.md for phase 1

---

## 🚀 Next Immediate Tasks

1. **Right Now**: Initialize npm projects in both folders
2. **Next 30 min**: Setup environment files
3. **Next 1 hour**: Create base configuration files
4. **Next 2 hours**: Create and test entry points
5. **Tomorrow**: Start Phase 1 - Authentication

---

## 💡 Pro Tips

### **Tip 1: Keep Dependencies Updated**

```bash
npm audit fix
npm outdated
```

### **Tip 2: Use Git Commits Often**

```bash
git add .
git commit -m "Feat: auth - implement signup endpoint"
```

### **Tip 3: Test As You Build**

- Frontend: Use browser dev tools
- Backend: Use Postman or curl

### **Tip 4: Read Error Messages Carefully**

Most errors are self-explanatory and tell you exactly what's wrong.

### **Tip 5: Document as You Code**

Add comments for complex logic.

---

## ⚠️ Common Pitfalls to Avoid

❌ **Don't**: Skip environment variable setup
✅ **Do**: Copy `.env.example` to `.env` immediately

❌ **Don't**: Push `.env` to git
✅ **Do**: Add `.env` to `.gitignore`

❌ **Don't**: Build everything before testing
✅ **Do**: Test each feature as you build it

❌ **Don't**: Use `var` in JavaScript
✅ **Do**: Use `const` and `let`

❌ **Don't**: Hardcode API URLs
✅ **Do**: Use environment variables

---

## 📞 Support References

**Getting stuck?**

1. Check **ARCHITECTURE.md** for design patterns
2. Check **API_ENDPOINTS.md** for endpoint structure
3. Check **COMMUNICATION_FLOW.md** for patterns
4. Check **DEVELOPMENT_ROADMAP.md** for what's next
5. Re-read the relevant documentation file

---

## 🎓 Learning Resources

- **Frontend**: React docs (react.dev), Vite docs
- **Backend**: Express docs, Mongoose docs
- **Database**: MongoDB docs
- **Authentication**: JWT.io, OWASP security

---

## ✨ You're Ready!

You now have:
✅ Complete architecture
✅ Organized folder structure
✅ Clear patterns to follow
✅ Comprehensive documentation
✅ Implementation roadmap

**Time to build! 🚀**

Start with Step 1 above and follow the checklist. Refer back to the documentation files whenever you need guidance.

Good luck with Traveloop! 🌍✈️
