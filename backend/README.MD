
# Church Management API

A Node.js/Express backend API for church management with MongoDB, featuring authentication, member management, attendance tracking, and service scheduling.

## Quick Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (Atlas or local)

### Installation

1. **Clone and install**
```bash
git clone https://github.com/your-username/node_churchday.git
cd node_churchday
npm install
npm install axios  # Required for API testing
```

2. **Environment Configuration**
Create a `.env` file in the root directory with:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/church_portal
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters
JWT_LIFETIME=1d
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_FROM=noreply@yourchurch.com
```

3. **Run the Application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

4. **Test the API**
```bash
# Test server health
curl http://localhost:5000

# Test registration
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Admin","email":"admin@test.com","password":"password123"}'
```

### API Endpoints

**Authentication:**
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/verify-email` - Email verification
- `POST /api/v1/auth/forgot-password` - Password reset
- `POST /api/v1/auth/reset-password` - Password reset confirmation

**Member Management (Admin only):**
- `GET /api/v1/member` - Get all members
- `POST /api/v1/member` - Create new member
- `GET /api/v1/member/:id` - Get specific member
- `PATCH /api/v1/member/:id` - Update member
- `DELETE /api/v1/member/:id` - Delete member

**Service Management (Admin only):**
- `GET /api/v1/services` - Get all services
- `POST /api/v1/services` - Create new service
- `GET /api/v1/services/:id` - Get specific service
- `PATCH /api/v1/services/:id` - Update service
- `DELETE /api/v1/services/:id` - Delete service

**Attendance Management (Admin only):**
- `GET /api/v1/attendance` - Get all attendance records
- `POST /api/v1/attendance` - Record attendance
- `DELETE /api/v1/attendance/:id` - Delete attendance record

**Church Day Management (Admin only):**
- `GET /api/v1/churchday` - Get all church days
- `POST /api/v1/churchday` - Create church day
- `GET /api/v1/churchday/:id` - Get specific church day
- `PATCH /api/v1/churchday/:id` - Update church day
- `DELETE /api/v1/churchday/:id` - Delete church day
