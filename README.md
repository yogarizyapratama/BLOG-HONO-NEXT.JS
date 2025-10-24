# Full-Stack Blog Application

A modern full-stack web application built with **Next.js** (App Router), **Hono.js**, and **PostgreSQL**. This project demonstrates authentication, CRUD operations, modular architecture, and clean UI using DaisyUI.

## 🎯 Project Overview

This application is a complete blog platform where users can:
- Sign up and sign in securely with JWT authentication
- Create, read, update, and delete blog posts
- View paginated list of all posts
- Only edit/delete their own posts

## 🏗️ Architecture

```
project/
├── backend/          # Hono.js REST API
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── middlewares/
│   │   ├── db/       # Prisma client
│   │   └── utils/    # JWT utilities
│   └── prisma/       # Database schema
│
└── frontend/         # Next.js App Router
    ├── app/          # Pages and layouts
    ├── components/   # Reusable UI components
    └── lib/          # API client & context
```

## 🚀 Tech Stack

### Backend
- **Framework:** Hono.js v4.6+
- **Database:** PostgreSQL
- **ORM:** Prisma v6.1+
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Zod
- **Runtime:** Node.js with tsx

### Frontend
- **Framework:** Next.js v15.1+ (App Router)
- **UI Library:** React v19.0+
- **Styling:** Tailwind CSS v3.4+ with DaisyUI v4.12+
- **Language:** TypeScript
- **State Management:** React Context API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** v18 or higher
- **npm** or **yarn**
- **PostgreSQL** v14 or higher

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project
```

### 2. Setup PostgreSQL Database

Create a new PostgreSQL database:

```bash
createdb honoapp
```

Or using PostgreSQL CLI:
```sql
CREATE DATABASE honoapp;
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/honoapp?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
```

Initialize the database:
```bash
npm run db:generate
npm run db:push
```

Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:3001`

### 4. Setup Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🎮 Usage

1. **Open your browser** and navigate to `http://localhost:3000`

2. **Sign Up** for a new account at `/auth/signup`

3. **Sign In** with your credentials

4. **Create Posts** - Click "New Post" to create your first blog post

5. **View Posts** - Browse all posts at `/posts`

6. **Edit/Delete** - Click on your posts to view, edit, or delete them

## 📡 API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/signin` - Sign in with credentials
- `POST /auth/signout` - Sign out (client-side token removal)

### Posts (Protected)
- `GET /posts` - Get all posts with pagination
- `GET /posts/:id` - Get single post by ID
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post (author only)
- `DELETE /posts/:id` - Delete post (author only)

All post endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

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
}
```

## 🎨 Features

### ✅ Implemented Features

**Authentication & Authorization:**
- Secure user registration with email validation
- Password hashing with bcryptjs (10 salt rounds)
- JWT-based authentication (7-day expiration)
- Protected routes with middleware
- Author-only edit/delete permissions

**Blog Post Management:**
- Create posts with title and content
- View all posts with pagination (10 per page)
- View individual post details
- Edit own posts
- Delete own posts
- Display author information and timestamps

**User Interface:**
- Clean, modern design with DaisyUI
- Responsive layout (mobile-first)
- Loading states for async operations
- Error handling with user-friendly messages
- Form validation
- Conditional rendering based on auth state

**Developer Experience:**
- TypeScript for type safety
- Modular architecture
- Clean code structure
- Comprehensive error handling
- Environment variable configuration

## 🏛️ Architecture Highlights

### Backend (Hono.js)
- **Modular routing** - Separate route files for auth and posts
- **Middleware-based auth** - Reusable JWT verification
- **Prisma ORM** - Type-safe database queries
- **Input validation** - Zod schemas for request validation
- **Error handling** - Consistent error responses

### Frontend (Next.js)
- **App Router** - Modern Next.js routing with layouts
- **Component-based** - Reusable UI components
- **Context API** - Global authentication state
- **API abstraction** - Centralized API client
- **Client components** - Interactive features with React hooks

## 💡 Technical Decisions

### Why Hono.js?
- Lightweight and fast
- Excellent TypeScript support
- Simple API similar to Express
- Built-in middleware support
- Perfect for building REST APIs

### Why Next.js App Router?
- Modern routing paradigm
- Built-in layouts and loading states
- Better performance with React Server Components
- Improved data fetching patterns
- File-based routing

### Why DaisyUI?
- Beautiful components out of the box
- Built on Tailwind CSS
- Accessible and semantic HTML
- Extensive theme support
- Minimal custom CSS needed

### Why Prisma?
- Type-safe database queries
- Excellent developer experience
- Auto-completion and IntelliSense
- Easy schema management
- Migration support

### Why JWT?
- Stateless authentication
- Scalable (no server-side sessions)
- Works well with REST APIs
- Easy to implement

## 🧪 Testing the Application

### Manual Testing Checklist

**Authentication:**
- [ ] Sign up with new email
- [ ] Sign up with existing email (should fail)
- [ ] Sign up with weak password (should fail)
- [ ] Sign in with correct credentials
- [ ] Sign in with wrong credentials (should fail)
- [ ] Sign out and verify redirect

**Posts:**
- [ ] Create a new post
- [ ] View all posts with pagination
- [ ] Navigate between pages
- [ ] View post details
- [ ] Edit own post
- [ ] Delete own post
- [ ] Try to edit another user's post (should fail)

**UI/UX:**
- [ ] Check responsive design on mobile
- [ ] Verify loading states appear
- [ ] Verify error messages display
- [ ] Check form validations work

## 📚 Scripts Reference

### Backend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

### Frontend Scripts
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Run production build
npm run lint    # Run ESLint
```

## 🔒 Security Considerations

- **Passwords** are hashed with bcryptjs (never stored in plain text)
- **JWT tokens** expire after 7 days
- **SQL injection** prevented by Prisma ORM
- **XSS protection** via React's built-in escaping
- **CORS** configured for specific origins
- **Environment variables** for sensitive data

**Production recommendations:**
- Use httpOnly cookies instead of localStorage for tokens
- Implement refresh tokens
- Add rate limiting
- Use HTTPS only
- Enable CSRF protection
- Implement token blacklisting for logout
- Add input sanitization
- Set up proper CORS policies

## 🚧 Known Limitations

- Token stored in localStorage (use httpOnly cookies in production)
- No password reset functionality
- No email verification
- Basic text-only posts (no markdown or rich text)
- No image upload support
- No user profiles
- No post categories or tags
- No search functionality

## 🔮 Future Enhancements

- [ ] Markdown support for posts
- [ ] Image uploads
- [ ] User profiles with avatars
- [ ] Post categories and tags
- [ ] Search and filter functionality
- [ ] Comments system
- [ ] Like/favorite posts
- [ ] Draft posts
- [ ] Rich text editor
- [ ] Email notifications
- [ ] Social authentication (Google, GitHub)
- [ ] Dark mode
- [ ] API rate limiting
- [ ] Unit and integration tests

## 📝 License

This project is created for educational purposes.

## 👥 Contributing

This is a demo project. Feel free to fork and modify for your own use.

## 📧 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ using Next.js, Hono.js, PostgreSQL, and DaisyUI**
