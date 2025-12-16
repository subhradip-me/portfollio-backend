# Portfolio Backend API Documentation

## API Endpoints Summary

All endpoints return JSON responses with a `success` field indicating the operation status. Error responses include an `error` field with the error message.

### Authentication Endpoints ✅

| Method | Endpoint | Access | Description | Validation |
|--------|----------|--------|-------------|-------------|
| `POST` | `/api/auth/register` | Public | Register admin account | `validateRegister` |
| `POST` | `/api/auth/login` | Public | Login admin and get JWT token | `validateLogin` |
| `GET` | `/api/auth/me` | Protected | Get current user profile | Auth required |
| `PUT` | `/api/auth/profile` | Protected | Update user profile | `validateUpdateProfile` |
| `PUT` | `/api/auth/change-password` | Protected | Change password | `validateChangePassword` |

#### Additional Auth Features:
- Rate limiting on auth endpoints (5 requests per 15 minutes)
- JWT token authentication
- Password hashing with bcrypt
- User role management (admin)
- Account activation status checking

---

### Projects Endpoints ✅

| Method | Endpoint | Access | Description | Validation |
|--------|----------|--------|-------------|-------------|
| `GET` | `/api/projects` | Public | Get all projects with pagination, filtering | Query params |
| `POST` | `/api/projects` | Protected (Admin) | Create new project | `validateProject` |
| `GET` | `/api/projects/:id` | Public | Get single project by ID | - |
| `PUT` | `/api/projects/:id` | Protected (Admin) | Update project | `validateProject` |
| `PATCH` | `/api/projects/:id/toggle-featured` | Protected (Admin) | Toggle featured status | - |
| `DELETE` | `/api/projects/:id` | Protected (Admin) | Delete project | - |
| `GET` | `/api/projects/technology/:tech` | Public | Get projects by technology | - |
| `GET` | `/api/projects/year/:year` | Public | Get projects by year | - |
| `GET` | `/api/projects/statistics` | Public | Get project statistics | - |

#### Project Features:
- **Pagination**: `page`, `limit` query parameters
- **Filtering**: `featured`, `year`, `tech`, `status`, `search`
- **Sorting**: `sortBy`, `sortOrder` query parameters
- **Status Management**: draft, published, archived
- **View Counting**: Automatic view increment for published projects
- **Technology Filtering**: Case-insensitive regex search
- **Year Filtering**: Projects by completion year
- **Featured Toggle**: Admin can toggle featured status
- **Statistics**: Comprehensive project analytics

---

### Testimonials Endpoints ✅

| Method | Endpoint | Access | Description | Validation |
|--------|----------|--------|-------------|-------------|
| `GET` | `/api/testimonials/featured` | Public | Get featured testimonials | - |
| `GET` | `/api/testimonials` | Protected (Admin) | Get all testimonials | Query params |
| `POST` | `/api/testimonials` | Protected (Admin) | Create testimonial | `validateTestimonial` |
| `GET` | `/api/testimonials/:id` | Public | Get single testimonial | - |
| `PUT` | `/api/testimonials/:id` | Protected (Admin) | Update testimonial | `validateTestimonial` |
| `PATCH` | `/api/testimonials/:id/approve` | Protected (Admin) | Approve testimonial | - |
| `DELETE` | `/api/testimonials/:id` | Protected (Admin) | Delete testimonial | - |
| `GET` | `/api/testimonials/rating/:rating` | Public | Get testimonials by rating | - |
| `GET` | `/api/testimonials/statistics` | Protected (Admin) | Get testimonial statistics | - |

#### Testimonial Features:
- **Status Management**: pending, approved, rejected
- **Rating System**: 1-5 star ratings with validation
- **Featured System**: Admin can toggle featured status
- **Company Filtering**: Filter by company name
- **Rating Filtering**: Filter by minimum rating
- **Approval Workflow**: Admin approval required for public display
- **Pagination**: Full pagination support
- **Statistics**: Comprehensive analytics including rating distribution

---

## Security Features ✅

### Rate Limiting
- **Global Rate Limit**: 100 requests per 15 minutes per IP
- **Auth Rate Limit**: 5 requests per 15 minutes per IP for login/register

### Authentication & Authorization
- **JWT Tokens**: 24-hour expiration (configurable)
- **Role-based Access**: Admin role required for protected endpoints
- **Password Security**: bcrypt hashing with 12 salt rounds
- **Token Validation**: Middleware validates JWT and user status

### Input Validation
- **Express Validator**: Comprehensive validation for all input data
- **Sanitization**: Automatic email normalization, string trimming
- **Type Validation**: Strict type checking for ratings, booleans, etc.

### Security Headers
- **Helmet.js**: Security headers including CSP
- **CORS**: Configurable allowed origins (development/production)

---

## Data Models ✅

### Project Model
```javascript
{
  title: String (required, 2-200 chars),
  subtitle: String (optional, max 200 chars),
  description: String (optional, max 1000 chars),
  technologies: [String] (max 50 chars each),
  year: String (4-digit year),
  featured: Boolean (default: false),
  thumbnailUrl: String (valid URL),
  liveUrl: String (valid URL),
  githubUrl: String (valid URL),
  status: String (draft|published|archived),
  viewCount: Number (auto-increment),
  tags: [String] (lowercase),
  createdBy: ObjectId (User ref),
  updatedBy: ObjectId (User ref),
  timestamps: true
}
```

### Testimonial Model
```javascript
{
  name: String (required, 2-100 chars),
  position: String (optional, max 100 chars),
  company: String (optional, max 100 chars),
  message: String (required, 10-1000 chars),
  rating: Number (required, 1-5 integer),
  featured: Boolean (default: false),
  avatarUrl: String (valid URL),
  status: String (pending|approved|rejected),
  projectId: ObjectId (Project ref, optional),
  email: String (valid email, optional),
  website: String (valid URL, optional),
  location: String (max 100 chars),
  verified: Boolean (default: false),
  createdBy: ObjectId (User ref),
  updatedBy: ObjectId (User ref),
  timestamps: true
}
```

---

## Error Handling ✅

### Global Error Handler
- Centralized error handling with stack traces in development
- Consistent error response format
- HTTP status code management

### Validation Errors
- Detailed validation error messages
- Field-specific error reporting
- 400 status code for validation failures

### Authentication Errors
- 401 for invalid/missing tokens
- 403 for insufficient permissions
- Account status checking

---

## Environment Configuration

Required environment variables:
```
NODE_ENV=development|production
PORT=5000
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h
MONGODB_URI=your-mongodb-connection-string
```

---

## Response Format Examples

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { // for paginated endpoints
    "page": 1,
    "pages": 10,
    "total": 100,
    "limit": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ // for validation errors
    {
      "field": "email",
      "message": "Email must be valid"
    }
  ]
}
```

## Status: ✅ ALL ENDPOINTS IMPLEMENTED AND WORKING

All requested API endpoints have been successfully implemented with:
- ✅ Complete CRUD operations
- ✅ Proper authentication and authorization
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ Pagination and filtering
- ✅ Security best practices
- ✅ Comprehensive documentation
