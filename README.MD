# Church Portal - Full Stack Application

A comprehensive church management system with a Node.js/Express backend and React frontend.

## ��� Project Structure

```
church_portal/
├── backend/                 # Node.js/Express API Server
│   ├── app.js              # Main server file
│   ├── package.json        # Backend dependencies
│   ├── .env                # Environment variables
│   ├── controllers/        # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── errors/             # Error handling
│   └── db/                 # Database connection
├── frontend/               # React Frontend (Coming Soon)
│   └── (To be created)
└── README.md               # This file
```

## ��� Quick Start

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup (Coming Soon)

The frontend will be built using React with TypeScript and will be located in the `frontend/` directory.

## ��� API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/verify-email` - Email verification
- `POST /api/v1/auth/forgot-password` - Password reset
- `POST /api/v1/auth/reset-password` - Password reset confirmation

### Member Management (Admin only)
- `GET /api/v1/member` - Get all members
- `POST /api/v1/member` - Create new member
- `GET /api/v1/member/:id` - Get specific member
- `PATCH /api/v1/member/:id` - Update member
- `DELETE /api/v1/member/:id` - Delete member

### Service Management (Admin only)
- `GET /api/v1/services` - Get all services
- `POST /api/v1/services` - Create new service
- `GET /api/v1/services/:id` - Get specific service
- `PATCH /api/v1/services/:id` - Update service
- `DELETE /api/v1/services/:id` - Delete service

### Attendance Management (Admin only)
- `GET /api/v1/attendance` - Get all attendance records
- `POST /api/v1/attendance` - Record attendance
- `DELETE /api/v1/attendance/:id` - Delete attendance record

### Church Day Management (Admin only)
- `GET /api/v1/churchday` - Get all church days
- `POST /api/v1/churchday` - Create church day
- `GET /api/v1/churchday/:id` - Get specific church day
- `PATCH /api/v1/churchday/:id` - Update church day
- `DELETE /api/v1/churchday/:id` - Delete church day

## ���️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with refresh tokens
- **Security**: Helmet, CORS, XSS protection, rate limiting
- **Email**: Nodemailer for verification and password reset

### Frontend (Planned)
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand or Redux Toolkit
- **UI Library**: Material-UI or Ant Design
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS

## ��� Development Status

### ✅ Completed
- [x] Backend API development
- [x] Database models and schemas
- [x] Authentication system
- [x] Member management
- [x] Service management
- [x] Attendance tracking
- [x] Church day management
- [x] API testing and validation
- [x] Project structure reorganization

### ��� In Progress
- [ ] Frontend development setup
- [ ] React application initialization
- [ ] Authentication pages
- [ ] Dashboard implementation

### ��� Planned
- [ ] Member management UI
- [ ] Service scheduling interface
- [ ] Attendance recording system
- [ ] Reports and analytics
- [ ] Responsive design
- [ ] Testing and deployment

## ��� Development Commands

### Backend
```bash
cd backend
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run tests (when implemented)
```

### Frontend (Coming Soon)
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
```

## ��� Documentation

- **Backend API**: See `backend/README.MD` for detailed API documentation
- **Task List**: See `backend/task.md` for complete development checklist
- **Database Schema**: See `backend/models/` for data models

## ��� Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ��� License

This project is licensed under the ISC License.

---

**Note**: This project is currently in active development. The backend is fully functional, and frontend development is beginning.
