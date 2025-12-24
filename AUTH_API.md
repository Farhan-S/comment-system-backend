# Authentication Module - Testing Guide

## Prerequisites

Make sure MongoDB is running. You can either:

- Install MongoDB locally
- Use MongoDB Atlas (cloud)

Update your `.env` file with the correct MongoDB connection string.

## API Endpoints

### 1. Register a New User

**Endpoint:** `POST /api/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

**Error Response (400):**

```json
{
  "status": "error",
  "message": "Email already registered"
}
```

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

**Error Response (401):**

```json
{
  "status": "error",
  "message": "Invalid email or password"
}
```

### 3. Get Current User (Protected Route)

**Endpoint:** `GET /api/auth/me`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Response (401):**

```json
{
  "status": "error",
  "message": "No token provided. Please authenticate."
}
```

## Testing with cURL

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing with Postman

1. Create a new request
2. Set the method and URL as shown above
3. For POST requests: Go to Body → raw → JSON, then paste the request body
4. For protected routes: Go to Headers → Add `Authorization: Bearer YOUR_TOKEN`

## Validation Rules

- **Name**: Required, 2-50 characters
- **Email**: Required, must be valid email format, unique
- **Password**: Required, minimum 6 characters
- Passwords are hashed using bcrypt before storing
- JWT tokens expire after 7 days (configurable in .env)
