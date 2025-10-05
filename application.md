# Church Portal Application Architecture Guide

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Frontend-Backend Communication](#frontend-backend-communication)
4. [Key Files Explained](#key-files-explained)
5. [Authentication Flow](#authentication-flow)
6. [API Communication](#api-communication)
7. [Data Flow Examples](#data-flow-examples)
8. [Error Handling](#error-handling)
9. [Development Setup](#development-setup)

## Overview

The Church Portal is a full-stack web application built with:
- **Frontend**: React + TypeScript + Material-UI
- **Backend**: Node.js + Express.js + MongoDB
- **Communication**: HTTP REST API with JSON data exchange

The application allows church administrators to manage members, services, attendance, and church days.

## Project Structure

```
church_portal/
├── backend/                 # Node.js/Express backend
│   ├── controllers/         # Business logic handlers
│   ├── models/             # Database schemas (Mongoose)
│   ├── routes/             # API endpoint definitions
│   ├── middleware/         # Authentication & error handling
│   ├── utils/              # Helper functions
│   └── app.js              # Main server file
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── services/       # API communication layer
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main React component
│   └── package.json
└── application.md          # This file
```

## Frontend-Backend Communication

### How It Works

1. **User Interaction**: User clicks a button or submits a form in the React frontend
2. **API Call**: Frontend makes an HTTP request to the backend API
3. **Backend Processing**: Backend processes the request, interacts with the database
4. **Response**: Backend sends a JSON response back to the frontend
5. **UI Update**: Frontend updates the user interface based on the response

### Communication Flow Diagram

```
[React Frontend] ←→ [Express Backend] ←→ [MongoDB Database]
     ↓                    ↓                    ↓
  User Interface    Business Logic      Data Storage
  (Components)      (Controllers)       (Collections)
```

## Key Files Explained

### Backend Files

#### 1. `backend/app.js` - Main Server File
**Purpose**: Entry point of the backend application

**Key Responsibilities**:
- Sets up Express server
- Configures middleware (CORS, authentication, etc.)
- Defines API routes
- Connects to MongoDB database

**Important Sections**:
```javascript
// CORS Configuration - Allows frontend to communicate with backend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/member', memberRouter);
app.use('/api/v1/services', serviceRouter);
// ... other routes
```

#### 2. `backend/controllers/` - Business Logic
**Purpose**: Handle the actual business logic for each feature

**Example**: `backend/controllers/membershipController.js`
```javascript
const createMember = async (req, res) => {
  // Add the owner field from the authenticated user
  const memberData = {
    ...req.body,
    owner: req.user.userId,  // Automatically set from authentication
  };
  
  const member = await Member.create(memberData);
  res.status(StatusCodes.OK).send({ msg: "Member created successfully", member });
};
```

#### 3. `backend/models/` - Database Schemas
**Purpose**: Define the structure of data stored in MongoDB

**Example**: `backend/models/Member.js`
```javascript
const MemberSchema = mongoose.Schema({
  surname: { type: String, required: true },
  other_names: { type: String, required: true },
  email: { type: String, required: true },
  // ... other fields
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});
```

#### 4. `backend/routes/` - API Endpoints
**Purpose**: Define the URL paths and connect them to controllers

**Example**: `backend/routes/memberRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const { createMember, getAllMembers } = require('../controllers/membershipController');

router.route('/').post(createMember).get(getAllMembers);
// POST /api/v1/member - Create new member
// GET /api/v1/member - Get all members
```

### Frontend Files

#### 1. `frontend/src/services/api.ts` - API Communication Layer
**Purpose**: Centralized place for all API calls to the backend

**Key Features**:
- Axios configuration with base URL
- Authentication handling
- Error handling
- Type-safe API calls

```typescript
// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // Important for cookie-based authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Member management API calls
export const memberAPI = {
  getAllMembers: async () => {
    try {
      const response = await api.get('/member');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to fetch members');
    }
  },
  
  createMember: async (memberData: any) => {
    try {
      const response = await api.post('/member', memberData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.msg || 'Failed to create member');
    }
  },
};
```

#### 2. `frontend/src/types/` - TypeScript Definitions
**Purpose**: Define the shape of data structures used throughout the application

**Example**: `frontend/src/types/auth.ts`
```typescript
export interface User {
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  msg: string;
}
```

#### 3. `frontend/src/pages/` - Main Application Pages
**Purpose**: Main screens of the application that use API services

**Example**: `frontend/src/pages/Dashboard.tsx`
```typescript
const Dashboard: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  
  const loadMembers = async () => {
    try {
      const membersData = await memberAPI.getAllMembers();
      setMembers(membersData.members || []);
    } catch (err: any) {
      setError('Failed to load members');
    }
  };
  
  // ... rest of component
};
```

#### 4. `frontend/src/components/` - Reusable UI Components
**Purpose**: Modular components that can be reused across different pages

**Example**: `frontend/src/components/AddMemberModal.tsx`
```typescript
const AddMemberModal: React.FC<AddMemberModalProps> = ({ open, onClose, onMemberAdded }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await memberAPI.createMember(formData);
      onMemberAdded(); // Notify parent component
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  // ... rest of component
};
```

## Authentication Flow

### How Authentication Works

1. **Login Process**:
   ```
   User enters credentials → Frontend sends POST /api/v1/auth/login → 
   Backend validates → Backend creates JWT token → 
   Backend sets HTTP-only cookie → Frontend receives user data
   ```

2. **Protected Routes**:
   ```
   Frontend makes API call → Backend middleware checks JWT token → 
   If valid: Process request → If invalid: Return 401 error
   ```

3. **Logout Process**:
   ```
   User clicks logout → Frontend calls DELETE /api/v1/auth/logout → 
   Backend clears cookie → Frontend redirects to login page
   ```

### Authentication Files

#### Backend Authentication
- `backend/middleware/authentication.js` - JWT token validation
- `backend/controllers/authController.js` - Login/logout logic
- `backend/utils/jwt.js` - JWT token creation and validation

#### Frontend Authentication
- `frontend/src/services/api.ts` - Login/logout API calls
- `frontend/src/pages/Login.tsx` - Login form
- `frontend/src/components/Layout.tsx` - Authentication state management

## API Communication

### HTTP Methods Used

- **GET**: Retrieve data (e.g., get all members)
- **POST**: Create new data (e.g., create new member)
- **PATCH**: Update existing data (e.g., update member info)
- **DELETE**: Remove data (e.g., delete member)

### API Endpoints Structure

```
Base URL: http://localhost:5000/api/v1

Authentication:
POST   /auth/login          - User login
POST   /auth/register       - User registration
DELETE /auth/logout         - User logout

Members:
GET    /member              - Get all members
POST   /member              - Create new member
GET    /member/:id          - Get specific member
PATCH  /member/:id          - Update member
DELETE /member/:id          - Delete member

Services:
GET    /services            - Get all services
POST   /services            - Create new service
DELETE /services/:id        - Delete service

Attendance:
GET    /attendance          - Get all attendance records
POST   /attendance          - Create attendance record
DELETE /attendance/:id      - Delete attendance record

Church Days:
GET    /churchday           - Get all church days
POST   /churchday           - Create new church day
DELETE /churchday/:id       - Delete church day
```

## Data Flow Examples

### Example 1: Adding a New Member

1. **User Action**: User clicks "Add Member" button
2. **Frontend**: Opens `AddMemberModal` component
3. **User Input**: User fills out member form
4. **Form Submission**: 
   ```typescript
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     try {
       await memberAPI.createMember(formData);
       onMemberAdded(); // Refresh member list
       onClose(); // Close modal
     } catch (err) {
       setError(err.message);
     }
   };
   ```
5. **API Call**: `POST /api/v1/member` with member data
6. **Backend Processing**:
   ```javascript
   const createMember = async (req, res) => {
     const memberData = {
       ...req.body,
       owner: req.user.userId, // Auto-set from authentication
     };
     const member = await Member.create(memberData);
     res.status(200).send({ msg: "Member created successfully", member });
   };
   ```
7. **Database**: New member document saved to MongoDB
8. **Response**: Backend sends success response
9. **Frontend Update**: Member list refreshes, modal closes

### Example 2: Loading Members on Dashboard

1. **Page Load**: Dashboard component mounts
2. **useEffect Hook**: Triggers `loadMembers()` function
3. **API Call**: `GET /api/v1/member`
4. **Backend**: Queries MongoDB for all members
5. **Response**: Returns array of member objects
6. **State Update**: `setMembers(membersData.members)`
7. **UI Render**: Members displayed in the Recent Members section

## Error Handling

### Backend Error Handling

```javascript
// In controllers
try {
  const member = await Member.create(memberData);
  res.status(200).send({ msg: "Member created successfully", member });
} catch (error) {
  throw new CustomError.NotFoundError("Member creation failed");
}

// Global error handler in middleware/error-handler.js
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode).json({ msg: err.message });
};
```

### Frontend Error Handling

```typescript
// In API service
try {
  const response = await api.get('/member');
  return response.data;
} catch (error: any) {
  throw new Error(error.response?.data?.msg || 'Failed to fetch members');
}

// In components
const loadMembers = async () => {
  try {
    setLoading(true);
    setError(null);
    const membersData = await memberAPI.getAllMembers();
    setMembers(membersData.members || []);
  } catch (err: any) {
    console.error('Failed to load members:', err);
    setError('Failed to load members. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
Create `backend/.env` file:
```
MONGO_URI=mongodb://localhost:27017/church_portal
JWT_SECRET=your_super_secret_jwt_key
JWT_LIFETIME=1d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## Key Concepts for Beginners

### 1. **Separation of Concerns**
- **Frontend**: Handles user interface and user interactions
- **Backend**: Handles business logic, data validation, and database operations
- **Database**: Stores and retrieves data

### 2. **API as a Contract**
- The API endpoints serve as a contract between frontend and backend
- Both sides must agree on the data format and endpoint structure
- Changes to the API require updates to both frontend and backend

### 3. **State Management**
- Frontend uses React state to manage UI data
- Backend doesn't maintain state between requests (stateless)
- Database persists data between sessions

### 4. **Authentication & Authorization**
- Authentication: Verifying who the user is
- Authorization: Determining what the user can do
- JWT tokens provide secure, stateless authentication

### 5. **Error Handling**
- Always handle errors gracefully
- Provide meaningful error messages to users
- Log errors for debugging purposes

## Common Issues and Solutions

### CORS Errors
**Problem**: "Access to XMLHttpRequest has been blocked by CORS policy"
**Solution**: Ensure CORS is properly configured in `backend/app.js`

### Authentication Errors
**Problem**: "401 Unauthorized" errors
**Solution**: Check if user is logged in and JWT token is valid

### Network Errors
**Problem**: "Failed to fetch" errors
**Solution**: Ensure backend server is running on the correct port

### Data Format Errors
**Problem**: Frontend and backend expect different data formats
**Solution**: Ensure TypeScript interfaces match backend schemas

## Best Practices

1. **Always validate data** on both frontend and backend
2. **Use TypeScript** for type safety
3. **Handle errors gracefully** with user-friendly messages
4. **Keep API calls centralized** in service files
5. **Use consistent naming conventions** across the application
6. **Test API endpoints** before implementing frontend features
7. **Document API changes** when modifying backend endpoints

This architecture provides a solid foundation for building scalable, maintainable web applications with clear separation between frontend and backend concerns.
