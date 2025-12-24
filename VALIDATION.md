# Data Validation Strategy

## Overview

We use **multiple layers of validation** for robust data integrity:

1. **Middleware Validation** (express-validator) ✅ Recommended
2. **Mongoose Schema Validation** (database level)
3. **Service Layer Validation** (business logic)

---

## 1. Middleware Validation with `express-validator`

### Location
`src/modules/auth/auth.validation.ts`

### How it Works

Validation middleware runs **before** the controller, checking data and returning errors immediately.

```typescript
// Example: Registration validation
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  
  handleValidationErrors, // Catches and formats errors
];
```

### Usage in Routes
```typescript
router.post('/register', registerValidation, authController.register);
```

### Benefits
✅ Runs before controller logic  
✅ Clean, declarative syntax  
✅ Automatic error formatting  
✅ Built-in sanitization  
✅ Chainable validators  

---

## 2. Mongoose Schema Validation

### Location
`src/modules/users/user.model.ts`

### How it Works

Database-level validation runs when saving documents.

```typescript
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
});
```

### Benefits
✅ Last line of defense  
✅ Enforces data integrity at database level  
✅ Automatic when using Mongoose  

---

## 3. Validation Flow

```
Request
  ↓
[Middleware Validation] ← express-validator checks
  ↓ (if valid)
[Controller] ← No validation needed, data is clean
  ↓
[Service Layer] ← Business logic (e.g., "email already exists")
  ↓
[Mongoose Model] ← Schema validation (backup)
  ↓
Database
```

---

## 4. Error Response Format

When validation fails, the API returns:

```json
{
  "status": "error",
  "message": "Name is required, Please provide a valid email"
}
```

---

## 5. Available Validators (express-validator)

### String Validators
- `notEmpty()` - Must not be empty
- `isLength({ min, max })` - Check length
- `matches(regex)` - Regex pattern
- `isEmail()` - Valid email format
- `isAlphanumeric()` - Only letters and numbers
- `trim()` - Remove whitespace

### Number Validators
- `isInt()` - Must be integer
- `isFloat()` - Must be float
- `min(value)` - Minimum value
- `max(value)` - Maximum value

### Sanitizers
- `trim()` - Remove leading/trailing spaces
- `escape()` - HTML escape
- `normalizeEmail()` - Lowercase and trim email
- `toInt()` - Convert to integer
- `toLowerCase()` - Convert to lowercase

---

## 6. Current Validation Rules

### Registration
| Field | Rules |
|-------|-------|
| name | Required, 2-50 chars, letters and spaces only |
| email | Required, valid email format, normalized |
| password | Required, min 6 chars, must have uppercase, lowercase, and number |

### Login
| Field | Rules |
|-------|-------|
| email | Required, valid email format |
| password | Required |

---

## 7. Adding New Validation

### Step 1: Create validation in `*.validation.ts`
```typescript
export const updateProfileValidation = [
  body('name').optional().isLength({ min: 2, max: 50 }),
  body('bio').optional().isLength({ max: 200 }),
  handleValidationErrors,
];
```

### Step 2: Apply to route
```typescript
router.put('/profile', authenticate, updateProfileValidation, controller.update);
```

### Step 3: Controller receives clean data
```typescript
async update(req: Request, res: Response) {
  const { name, bio } = req.body; // Already validated!
  // ... your logic
}
```

---

## 8. Best Practices

✅ **DO:**
- Use middleware validation for all user input
- Provide clear, user-friendly error messages
- Sanitize data (trim, normalize)
- Keep validation rules with routes
- Use schema validation as backup

❌ **DON'T:**
- Validate in multiple places (duplication)
- Trust client-side validation alone
- Return technical error messages to users
- Skip validation on "trusted" inputs

---

## 9. Custom Validators

You can create custom validators:

```typescript
body('username').custom(async (value) => {
  const user = await User.findOne({ username: value });
  if (user) {
    throw new Error('Username already taken');
  }
  return true;
});
```

---

## Summary

Our validation strategy:
1. **express-validator** → Catches bad input early ✅
2. **Mongoose schema** → Last line of defense ✅
3. **Service layer** → Business rules (e.g., duplicates) ✅

This multi-layered approach ensures data quality and security! 🔒
