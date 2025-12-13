# 🚀 Portfolio Backend API

RESTful API backend for the portfolio admin dashboard built with Express.js and MongoDB.

## ✨ Features

- 🔐 **JWT Authentication** - Secure admin authentication
- 📁 **Projects Management** - CRUD operations for portfolio projects
- 💬 **Testimonials** - Manage client testimonials
- 🛡️ **Security** - Rate limiting, CORS, input validation
- 📊 **Analytics** - Dashboard statistics and metrics

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 🚦 Quick Start

### Installation
```bash
npm install
```

### Environment Setup
Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
```

### Start Development Server
```bash
npm run dev
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login admin
- `GET /api/auth/profile` - Get profile (protected)

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (protected)
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Testimonials
- `GET /api/testimonials` - Get testimonials
- `POST /api/testimonials` - Create testimonial (protected)
- `PUT /api/testimonials/:id` - Update testimonial (protected)
- `DELETE /api/testimonials/:id` - Delete testimonial (protected)

## 📁 Project Structure

```
portfollio-backend/
├── controllers/          # Route handlers
├── middleware/           # Custom middleware
├── models/              # MongoDB models
├── routes/              # API routes
├── utils/               # Utility functions
├── index.js             # App entry point
└── package.json
```

## 🔧 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

---

**Frontend Repository**: [Portfolio Design](../portfollio-design)

Built with ❤️ using Node.js and Express

- Node.js 16+ 
- MongoDB 4.4+ (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - **Local MongoDB**: Install and start MongoDB locally
   - **MongoDB Atlas**: Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)

3. **Environment Variables**
   Create a `.env` file in the backend root:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/portfollio
   # For MongoDB Atlas: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfollio
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   JWT_EXPIRES_IN=24h
   
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   
   # Security
   BCRYPT_SALT_ROUNDS=12
   ```

3. **Start the Server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Verify Installation**
   - Open `http://localhost:5000/api/health` - you should see a health check response
   - Check console for MongoDB connection confirmation

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Create Admin Account
First, register an admin account:

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@portfolio.com",
  "password": "SecurePass123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@portfolio.com",
  "password": "SecurePass123"
}
```

#### Get Current User Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@portfolio.com"
}
```

#### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "SecurePass123",
  "newPassword": "NewSecurePass456"
}
```

### Projects API

#### Get All Projects (Public)
```http
GET /api/projects?page=1&limit=10&featured=true&year=2024&tech=React&search=portfolio&sortBy=createdAt&sortOrder=desc
```

#### Get Projects by Technology (Public)
```http
GET /api/projects/technology/React?page=1&limit=10
```

#### Get Projects by Year (Public)
```http
GET /api/projects/year/2024?page=1&limit=10
```

#### Get Project Statistics (Public)
```http
GET /api/projects/statistics
```

#### Get Single Project (Public)
```http
GET /api/projects/:id
```

#### Create Project (Protected)
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Awesome Project",
  "subtitle": "Full Stack Application",
  "description": "A detailed description of the project...",
  "technologies": ["React", "Node.js", "MongoDB"],
  "year": 2024,
  "featured": true,
  "status": "published",
  "thumbnailUrl": "https://example.com/image.jpg",
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/user/project"
}
```

#### Update Project (Protected)
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Project Title",
  "featured": false,
  "technologies": ["React", "Node.js", "PostgreSQL"]
}
```

#### Toggle Featured Status (Protected)
```http
PATCH /api/projects/:id/toggle-featured
Authorization: Bearer <token>
```

#### Delete Project (Protected)
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

### Testimonials API

#### Get Featured Testimonials (Public)
```http
GET /api/testimonials/featured?page=1&limit=10
```

#### Get Testimonials by Rating (Public)
```http
GET /api/testimonials/rating/5?page=1&limit=10
```

#### Get Testimonials by Company (Public)
```http
GET /api/testimonials/companies
```

#### Get All Testimonials (Protected)
```http
GET /api/testimonials?page=1&limit=10&status=approved&rating=5&search=excellent
Authorization: Bearer <token>
```

#### Get Single Testimonial (Public)
```http
GET /api/testimonials/:id
```

#### Create Testimonial (Protected)
```http
POST /api/testimonials
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "position": "CEO",
  "company": "TechCorp",
  "message": "Outstanding work! Highly recommended.",
  "rating": 5,
  "featured": true,
  "status": "approved",
  "avatarUrl": "https://example.com/avatar.jpg",
  "linkedinUrl": "https://linkedin.com/in/johndoe"
}
```

#### Update Testimonial (Protected)
```http
PUT /api/testimonials/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Updated testimonial message",
  "rating": 4,
  "status": "approved"
}
```

#### Approve Testimonial (Protected)
```http
PATCH /api/testimonials/:id/approve
Authorization: Bearer <token>
```

#### Delete Testimonial (Protected)
```http
DELETE /api/testimonials/:id
Authorization: Bearer <token>
```

#### Get Testimonial Statistics (Protected)
```http
GET /api/testimonials/statistics
Authorization: Bearer <token>
```

### Health Check
```http
GET /api/health
```

## Database Schema

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['admin'], default: 'admin'),
  lastLogin: Date,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

#### Projects Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  subtitle: String,
  description: String (required),
  technologies: [String] (required),
  year: Number (required),
  featured: Boolean (default: false),
  status: String (enum: ['draft', 'published'], default: 'published'),
  thumbnailUrl: String,
  liveUrl: String,
  githubUrl: String,
  views: Number (default: 0),
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

#### Testimonials Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  position: String,
  company: String,
  message: String (required),
  rating: Number (1-5, required),
  featured: Boolean (default: false),
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  avatarUrl: String,
  linkedinUrl: String,
  createdBy: ObjectId (ref: 'User'),
  approvedBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes (general), 5 requests per 15 minutes (auth)
- **CORS**: Configured for development (localhost) and production domains
- **Helmet**: Security headers, XSS protection, and content security policy
- **JWT Tokens**: Secure authentication with configurable expiration and refresh
- **Password Hashing**: bcrypt with configurable salt rounds (default: 12)
- **Input Validation**: Comprehensive validation using express-validator and Mongoose schemas
- **Async Error Handling**: Proper error handling with express-async-handler
- **Role-Based Access**: Admin-only routes and user management

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Human-readable error message",
  "code": "MACHINE_READABLE_ERROR_CODE",
  "details": ["Additional validation errors if any"]
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Development

### Project Structure
```
backend/
├── index.js                 # Main server file
├── config/                  # Configuration files
│   └── database.js         # MongoDB connection setup
├── models/                  # Mongoose data models
│   ├── User.js             # User schema and model
│   ├── Project.js          # Project schema and model
│   └── Testimonial.js      # Testimonial schema and model
├── controllers/             # Business logic controllers
│   ├── authController.js   # Authentication logic
│   ├── projectController.js # Projects CRUD operations
│   └── testimonialController.js # Testimonials management
├── middleware/              # Express middleware
│   ├── auth.js             # JWT authentication middleware
│   └── validation.js       # Input validation rules
├── routes/                  # API route definitions
│   ├── auth.js             # Authentication routes
│   ├── projects.js         # Projects API routes
│   └── testimonials.js     # Testimonials API routes
├── uploads/                 # File upload directory
├── .env                     # Environment variables
├── .env.example            # Environment template
└── package.json            # Dependencies and scripts
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

### Adding New Features

1. **New Model**: Create Mongoose schema in `models/`
2. **New Controller**: Add business logic in `controllers/`
3. **New Routes**: Define API endpoints in `routes/`
4. **Middleware**: Add reusable middleware to `middleware/`
5. **Validation**: Add validation rules in `middleware/validation.js`
6. **Database Migrations**: Use Mongoose schema updates for data migrations

## Production Deployment

1. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfollio
   JWT_SECRET=your-super-secure-production-secret-minimum-32-chars
   JWT_EXPIRES_IN=24h
   BCRYPT_SALT_ROUNDS=12
   ```

2. **Security Considerations**
   - Use strong MongoDB connection strings with authentication
   - Generate secure JWT secrets (minimum 32 characters)
   - Enable HTTPS in production
   - Configure proper CORS origins for your frontend domain
   - Set up proper logging and monitoring
   - Use MongoDB Atlas or properly secured MongoDB instances
   - Enable MongoDB authentication and SSL/TLS

3. **Database Considerations**
   - Set up MongoDB replica sets for high availability
   - Configure proper database indexes for performance
   - Set up regular database backups
   - Monitor database performance and optimize queries

4. **Process Management**
   Consider using PM2 for production:
   ```bash
   npm install -g pm2
   pm2 start index.js --name portfolio-api
   pm2 startup
   pm2 save
   ```

## Connecting to Frontend

Update your React frontend to use the backend API:

```javascript
const API_BASE = 'http://localhost:5000/api';

// Example: Fetch projects
const fetchProjects = async () => {
  const response = await fetch(`${API_BASE}/projects`);
  const data = await response.json();
  return data.projects;
};

// Example: Login
const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};
```

## License

MIT License - feel free to use for personal and commercial projects.
