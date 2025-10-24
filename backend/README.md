# Hono.js Backend API

A RESTful API built with Hono.js, PostgreSQL, and Prisma ORM. This backend provides authentication and CRUD operations for posts.

## 🚀 Tech Stack

- **Framework:** Hono.js v4.6+
- **Database:** PostgreSQL
- **ORM:** Prisma v6.1+
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** Zod
- **Language:** TypeScript

## 📁 Folder Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── db/
│   │   └── prisma.ts          # Prisma client instance
│   ├── middlewares/
│   │   └── auth.ts            # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.ts            # Authentication routes
│   │   └── posts.ts           # Posts CRUD routes
│   ├── utils/
│   │   └── jwt.ts             # JWT utilities
│   └── index.ts               # Main application entry
├── .env.example               # Environment variables template
├── package.json
└── tsconfig.json
```

## 🛠️ Installation

1. **Clone the repository and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your database connection:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/honoapp?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3001
   ```

4. **Setup PostgreSQL database:**
   
   Make sure PostgreSQL is installed and running. Create a database:
   ```bash
   createdb honoapp
   ```

5. **Run Prisma migrations:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

## 🚀 Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3001`

## 📡 API Endpoints

### Authentication

#### POST `/auth/signup`
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/auth/signin`
Sign in with existing credentials.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Signed in successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/auth/signout`
Sign out (client-side token removal).

**Response:**
```json
{
  "message": "Signed out successfully"
}
```

### Posts (All routes require Authorization header)

**Authorization Header:**
```
Authorization: Bearer <jwt-token>
```

#### GET `/posts`
Get all posts with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "posts": [
    {
      "id": "post-id",
      "title": "Post Title",
      "content": "Post content...",
      "authorId": "user-id",
      "author": {
        "id": "user-id",
        "email": "user@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### GET `/posts/:id`
Get a single post by ID.

**Response:**
```json
{
  "post": {
    "id": "post-id",
    "title": "Post Title",
    "content": "Post content...",
    "authorId": "user-id",
    "author": {
      "id": "user-id",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/posts`
Create a new post.

**Request:**
```json
{
  "title": "My New Post",
  "content": "This is the content of my post..."
}
```

**Response:**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": "post-id",
    "title": "My New Post",
    "content": "This is the content of my post...",
    "authorId": "user-id",
    "author": {
      "id": "user-id",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT `/posts/:id`
Update an existing post (only author can update).

**Request:**
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Response:**
```json
{
  "message": "Post updated successfully",
  "post": {
    "id": "post-id",
    "title": "Updated Title",
    "content": "Updated content...",
    "authorId": "user-id",
    "author": {
      "id": "user-id",
      "email": "user@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### DELETE `/posts/:id`
Delete a post (only author can delete).

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

## 🔒 Authentication & Authorization

- JWT tokens expire after 7 days
- All `/posts` endpoints require valid JWT token in Authorization header
- Users can only edit/delete their own posts
- Password hashing uses bcrypt with salt rounds of 10

## 🗄️ Database Schema

### Users Table
```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  posts        Post[]
}
```

### Posts Table
```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
}
```

## 🧪 Additional Scripts

**Generate Prisma Client:**
```bash
npm run db:generate
```

**Push schema changes:**
```bash
npm run db:push
```

**Run migrations:**
```bash
npm run db:migrate
```

**Open Prisma Studio (Database GUI):**
```bash
npm run db:studio
```

## 💡 Technical Choices

1. **Hono.js:** Chosen for its lightweight nature, excellent TypeScript support, and high performance. It's perfect for building fast REST APIs.

2. **Prisma ORM:** Provides type-safe database queries, excellent developer experience with auto-completion, and easy schema management.

3. **JWT Authentication:** Stateless authentication that scales well and doesn't require server-side session storage.

4. **Zod Validation:** Runtime type validation that complements TypeScript's compile-time checks, ensuring data integrity.

5. **bcryptjs:** Industry-standard password hashing for secure credential storage.

6. **Modular Architecture:** Separated routes, middlewares, and utilities for better maintainability and testability.

## 📝 Notes

- Make sure PostgreSQL is running before starting the application
- Change the `JWT_SECRET` in production to a strong, random string
- The API uses CORS configured for `localhost:3000` (frontend) and `localhost:3001` (backend)
- All timestamps are in ISO 8601 format
