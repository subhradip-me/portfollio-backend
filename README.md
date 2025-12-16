# 🚀 Portfolio Backend API

Production-ready RESTful API backend for the portfolio admin dashboard built with Express.js and MongoDB.

## 🌐 Live API
**Production URL**: https://portfollio-backend-2-85n5.onrender.com/api
**Health Check**: https://portfollio-backend-2-85n5.onrender.com/api/health

## ✨ Features

- 🔐 **JWT Authentication** - Secure admin authentication with bcrypt
- 📁 **Projects Management** - Full CRUD operations for portfolio projects
- 💬 **Testimonials** - Complete testimonials management system
- 🛡️ **Security** - Rate limiting, CORS, Helmet security headers, input validation
- 📊 **Dashboard Analytics** - Project and testimonial statistics
- 🚀 **Production Ready** - Deployed on Render with MongoDB Atlas

## 🛠️ Tech Stack

- **Express.js 5.2.1** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose 8.8.3** - MongoDB ODM
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing and security

## � Production Environment

**Currently Deployed**: ✅ Render Platform
- **API URL**: https://portfollio-backend-2-85n5.onrender.com/api
- **Database**: MongoDB Atlas
- **Authentication**: JWT with 24h expiration
- **Security**: CORS configured for frontend domains, rate limiting, helmet security

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=secure-production-secret
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=12
```

### CORS Configuration
Production domains whitelisted:
- `https://www.subhradip.me`
- `https://subhradip.me`
- `https://portfollio-design.vercel.app`

## 🚦 Local Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Environment Setup
Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://your-atlas-connection-string
JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=12
```

### Start Development Server
```bash
npm run dev
```

### Verify Setup
- Health check: http://localhost:5000/api/health
- Check console for MongoDB connection confirmation

## 📚 API Endpoints

### Base URL
- **Production**: https://portfollio-backend-2-85n5.onrender.com/api
- **Development**: http://localhost:5000/api

### Health Check
- `GET /api/health` - API health status and database connection

### Authentication
- `POST /api/auth/register` - Register admin account
- `POST /api/auth/login` - Login admin and get JWT token
- `GET /api/auth/me` - Get current user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Projects
- `GET /api/projects` - Get all projects (public with pagination, filtering)
- `POST /api/projects` - Create new project (protected)
- `GET /api/projects/:id` - Get single project by ID (public)
- `PUT /api/projects/:id` - Update project (protected)
- `PATCH /api/projects/:id/toggle-featured` - Toggle featured status (protected)
- `DELETE /api/projects/:id` - Delete project (protected)
- `GET /api/projects/technology/:tech` - Get projects by technology (public)
- `GET /api/projects/year/:year` - Get projects by year (public)
- `GET /api/projects/statistics` - Get project statistics (public)

### Testimonials
- `GET /api/testimonials/featured` - Get featured testimonials (public)
- `GET /api/testimonials` - Get all testimonials (protected, admin only)
- `POST /api/testimonials` - Create testimonial (protected)
- `GET /api/testimonials/:id` - Get single testimonial (public)
- `PUT /api/testimonials/:id` - Update testimonial (protected)
- `PATCH /api/testimonials/:id/approve` - Approve testimonial (protected)
- `DELETE /api/testimonials/:id` - Delete testimonial (protected)
- `GET /api/testimonials/rating/:rating` - Get testimonials by rating (public)
- `GET /api/testimonials/statistics` - Get testimonial statistics (protected)

## 📁 Project Structure

```
portfollio-backend/
├── index.js                    # Main server file with Express setup
├── config/                     # Configuration files
│   └── database.js            # MongoDB connection setup
├── controllers/                # Route handlers and business logic
│   ├── authController.js      # Authentication & user management
│   ├── projectController.js   # Projects CRUD operations
│   └── testimonialController.js # Testimonials management
├── middleware/                 # Custom Express middleware
│   ├── auth.js                # JWT authentication middleware
│   └── validation.js          # Input validation rules
├── models/                     # Mongoose data models
│   ├── User.js                # User schema (admin accounts)
│   ├── Project.js             # Project schema with validations
│   └── Testimonial.js         # Testimonial schema
├── routes/                     # API route definitions
│   ├── auth.js                # Authentication routes
│   ├── projects.js            # Projects API routes
│   └── testimonials.js        # Testimonials API routes
├── uploads/                    # File upload directory
├── .env                        # Environment variables
└── package.json               # Dependencies and scripts
```

## 🚀 Deployment Guide

### Current Production Status
✅ **Deployed on Render**: https://portfollio-backend-2-85n5.onrender.com/api
✅ **Database**: MongoDB Atlas
✅ **Security**: Production-ready with CORS, rate limiting, and JWT

### Deploy to Render (Current Setup)

1. **Prerequisites**
   - MongoDB Atlas cluster (free tier)
   - GitHub repository
   - Render account

2. **Render Configuration**
   - Service Type: Web Service
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfollio
   JWT_SECRET=your-super-secure-production-secret-minimum-32-chars
   JWT_EXPIRES_IN=24h
   BCRYPT_SALT_ROUNDS=12
   ```

3. **MongoDB Atlas Setup**
   - Create free cluster
   - Add database user with read/write permissions
   - Whitelist all IPs (0.0.0.0/0) for Render
   - Get connection string for MONGODB_URI

### Alternative Deployment Options

#### Railway
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

#### Vercel (Serverless)
```bash
npm install -g vercel
vercel --prod
```

## 🔧 Environment Variables

Required environment variables for deployment:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `super-secret-key` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |

## �🔧 Scripts

## 🔒 Security Features

### Production Security
- **Rate Limiting**: 100 requests/15min (general), 5 requests/15min (auth routes)
- **CORS**: Restricted to whitelisted frontend domains
- **Helmet**: Security headers, XSS protection, content security policy
- **JWT Authentication**: Secure tokens with configurable expiration
- **Password Security**: bcrypt hashing with salt rounds (12)
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Secure error responses without sensitive data exposure

### Environment Security
```env
# Strong JWT secret (production)
JWT_SECRET=minimum-32-character-super-secure-production-secret-key

# Secure MongoDB connection
MONGODB_URI=mongodb+srv://username:strong-password@cluster.mongodb.net/portfollio

# Production salt rounds
BCRYPT_SALT_ROUNDS=12
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "projects": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 25,
      "itemsPerPage": 5
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Resource not found",
  "code": "NOT_FOUND",
  "details": []
}
```

## 🔍 Troubleshooting

### MongoDB Connection Issues

**Error: `connect ECONNREFUSED 127.0.0.1:27017`**
- Solution: Set `MONGODB_URI` environment variable to MongoDB Atlas connection string
- Local MongoDB not available on hosting platforms like Render/Heroku

**Error: `MongoNetworkError`**
- Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)
- Verify connection string format and credentials

### CORS Errors

**Error: `blocked by CORS policy`**
- Ensure frontend domain is added to CORS origins in `index.js`
- Check environment variable `NODE_ENV` is set correctly

### Environment Variables

**Error: `JWT_SECRET is not defined`**
- Set all required environment variables in hosting platform dashboard
- Never commit `.env` files to repository

### Deployment Issues

**Build succeeds but crashes on start:**
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check server logs for specific error messages

---

## 📚 Additional Resources

- **Frontend Repository**: [portfollio-design](../portfollio-design)
- **Live Portfolio**: https://www.subhradip.me
- **API Documentation**: Available via endpoints above
- **MongoDB Atlas**: https://mongodb.com/atlas
- **Render Hosting**: https://render.com

## 📄 License

MIT License - Free to use for personal and commercial projects

---

**Built with ❤️ using Node.js, Express, and MongoDB**

*Production ready • Secure • Scalable • Modern*

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

## 🔗 Frontend Integration

### API Configuration
```javascript
// Frontend API configuration
const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://portfollio-backend-2-85n5.onrender.com/api'
    : 'http://localhost:5000/api',
  TIMEOUT: 10000
};

// Axios instance setup
import axios from 'axios';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Example API Calls
```javascript
// Fetch projects
const fetchProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data.projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Admin login
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Create project (protected)
const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data.project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};
```

## License

MIT License - feel free to use for personal and commercial projects.
