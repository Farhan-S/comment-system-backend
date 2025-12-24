# Comment System Backend

A scalable RESTful API for a comment system built with TypeScript, Express, MongoDB, and JWT authentication.

## Features

- 🔐 JWT Authentication
- 💬 Comment CRUD operations
- 👍👎 Like/Dislike functionality
- 📄 Pagination and sorting
- 🔒 Role-based access control
- ⚡ TypeScript for type safety
- 🛡️ Security best practices (Helmet, CORS, Rate Limiting)
- 🚦 **Rate Limiting** - Protection against abuse and spam
- 🎯 Input validation with express-validator
- 🔄 Nested comments (replies)

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
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

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/comment-system
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

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
│   └── db.ts               # MongoDB connection
├── modules/                # Feature modules
│   ├── auth/               # Authentication module ✅
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.middleware.ts
│   │   ├── auth.validation.ts
│   │   └── auth.routes.ts
│   ├── users/              # User model ✅
│   │   └── user.model.ts
│   └── comments/           # Comments module ✅
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
└── server.ts               # Server entry point
```

## API Endpoints

### Authentication ✅ COMPLETED

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

📖 See [AUTH_API.md](./AUTH_API.md) for detailed API documentation and testing guide.

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

## Documentation

- [AUTH_API.md](./AUTH_API.md) - Authentication API endpoints
- [COMMENTS_API.md](./COMMENTS_API.md) - Comments API endpoints
- [VALIDATION.md](./VALIDATION.md) - Input validation rules
- [RATE_LIMITING.md](./RATE_LIMITING.md) - Rate limiting configuration
- [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) - Postman collection guide
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Complete testing manual
- [WORKFLOW_GUIDE.md](./WORKFLOW_GUIDE.md) - Visual workflow diagrams

## License

ISC
