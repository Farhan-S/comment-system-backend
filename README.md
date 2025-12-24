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
├── config/              # Configuration files
│   ├── env.ts          # Environment variables
│   └── db.ts           # MongoDB connection
├── modules/            # Feature modules
│   ├── auth/           # Authentication module ✅
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.middleware.ts
│   │   └── auth.routes.ts
│   ├── users/          # User model ✅
│   │   └── user.model.ts
│   └── comments/       # Comments module (coming soon)
├── middlewares/        # Express middlewares
│   └── error.middleware.ts
├── utils/              # Utility functions
│   ├── jwt.ts          # JWT helpers
│   └── AppError.ts     # Custom error class
├── app.ts              # Express app setup
└── server.ts           # Server entry point
```

## API Endpoints

### Authentication ✅ COMPLETED

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

📖 See [AUTH_API.md](./AUTH_API.md) for detailed API documentation and testing guide.

- `POST /api/auth/login` - Login user

### Comments

- `GET /api/comments` - Get all comments (with pagination/sorting)
- `POST /api/comments` - Create new comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like a comment
- `POST /api/comments/:id/dislike` - Dislike a comment

## License

ISC
