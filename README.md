# Comment System Backend

A scalable RESTful API for a comment system built with TypeScript, Express, MongoDB, and JWT authentication.

## Features

- 🔐 JWT Authentication with HTTP-Only Cookies
- 💬 Comment CRUD operations
- 👍👎 Like/Dislike functionality
- 📄 Pagination and sorting
- 🔒 Role-based access control
- ⚡ TypeScript for type safety
- 🛡️ Security best practices (Helmet, CORS, Rate Limiting)
- 🚦 **Rate Limiting** - Protection against abuse and spam
- 🎯 Input validation with express-validator
- 🔄 Nested comments (replies)
- 🔴 **Real-time Updates** - WebSocket support with Socket.io for instant updates
- 🍪 **HTTP-Only Cookies** - Secure token storage protected against XSS attacks

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io for WebSocket connections
- **Security**: Helmet, CORS, bcryptjs

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd comment-system-backend
```

2. Install dependencies

```bash
npm install
```

3. Create environment file

```bash
cp .env.example .env
```

4. Configure your `.env` file with your MongoDB URI and JWT secret

## Environment Variables

**⚠️ IMPORTANT FOR EVALUATORS:** The `.env` file with working MongoDB Atlas credentials is included in the repository for evaluation purposes. You can use it directly or create your own.

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

**MongoDB Atlas Configuration:**

- Database is configured to accept connections from all IPs (0.0.0.0/0)
- This is for evaluation purposes only
- In production, restrict to specific IPs

**Security Note:** Never commit `.env` files to public repositories in real projects. This is done here specifically for project evaluation as requested.

## Development

Run the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Project Structure

```
src/
├── config/                  # Configuration files
│   ├── env.ts              # Environment variables
│   ├── db.ts               # MongoDB connection
│   └── socket.ts           # Socket.io configuration ✨ NEW
├── modules/                # Feature modules
│   ├── auth/               # Authentication module ✅
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.middleware.ts
│   │   ├── auth.validation.ts
│   │   └── auth.routes.ts
│   ├── users/              # User model ✅
│   │   └── user.model.ts
│   └── comments/           # Comments module ✅ (with WebSocket events)
│       ├── comment.model.ts
│       ├── comment.service.ts
│       ├── comment.controller.ts
│       ├── comment.validation.ts
│       └── comment.routes.ts
├── middlewares/            # Express middlewares
│   └── error.middleware.ts
├── utils/                  # Utility functions
│   ├── jwt.ts              # JWT helpers
│   └── AppError.ts         # Custom error class
├── app.ts                  # Express app setup
└── server.ts               # Server entry point with Socket.io
```

## API Endpoints

### Authentication ✅ COMPLETED

- `POST /api/auth/register` - Register new user (sets HTTP-only cookie)
- `POST /api/auth/login` - Login user (sets HTTP-only cookie)
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (clears cookie)

📖 See [AUTH_API.md](./AUTH_API.md) for detailed API documentation and testing guide.  
🍪 See [HTTP_COOKIE_AUTH.md](./HTTP_COOKIE_AUTH.md) for HTTP-only cookie implementation details.

### Comments ✅ COMPLETED

- `GET /api/comments` - Get all comments (pagination, sorting)
- `GET /api/comments/:id` - Get single comment
- `POST /api/comments` - Create comment (protected)
- `PUT /api/comments/:id` - Update comment (protected, author only)
- `DELETE /api/comments/:id` - Delete comment (protected, author only)
- `POST /api/comments/:id/like` - Like comment (protected)
- `POST /api/comments/:id/dislike` - Dislike comment (protected)
- `GET /api/comments/:id/replies` - Get comment replies

📖 See [COMMENTS_API.md](./COMMENTS_API.md) for detailed API documentation and testing guide.

### Rate Limiting ✅ COMPLETED

Intelligent rate limiting to protect against abuse:

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes (login/register)
- **Comment Creation**: 10 comments per 5 minutes
- **Vote Actions**: 30 likes/dislikes per 5 minutes
- **Modifications**: 20 updates/deletes per 10 minutes

📖 See [RATE_LIMITING.md](./RATE_LIMITING.md) for detailed documentation.  
🚀 See [RATE_LIMITING_QUICKSTART.md](./RATE_LIMITING_QUICKSTART.md) for quick testing guide.

### WebSocket Real-Time Updates ✅ COMPLETED

Real-time updates for all comment operations:

- **comment:created** - New comments and replies
- **comment:updated** - Comment edits
- **comment:deleted** - Comment deletions
- **comment:liked** - Like actions
- **comment:disliked** - Dislike actions

📖 See [WEBSOCKET_DOCUMENTATION.md](./WEBSOCKET_DOCUMENTATION.md) for complete WebSocket API documentation with client examples.

## Documentation

- [AUTH_API.md](./AUTH_API.md) - Authentication API endpoints
- [HTTP_COOKIE_AUTH.md](./HTTP_COOKIE_AUTH.md) - HTTP-only cookie authentication guide ✨
- [COMMENTS_API.md](./COMMENTS_API.md) - Comments API endpoints
- [VALIDATION.md](./VALIDATION.md) - Input validation rules
- [RATE_LIMITING.md](./RATE_LIMITING.md) - Rate limiting configuration
- [WEBSOCKET_DOCUMENTATION.md](./WEBSOCKET_DOCUMENTATION.md) - WebSocket real-time events ✨
- [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) - Postman collection guide
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Complete testing manual
- [WORKFLOW_GUIDE.md](./WORKFLOW_GUIDE.md) - Visual workflow diagrams

## License

ISC
