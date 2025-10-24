# Next.js Frontend

A modern full-stack blog application frontend built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, and DaisyUI.

## 🚀 Tech Stack

- **Framework:** Next.js v15.1+ (App Router)
- **UI Library:** React v19.0+
- **Styling:** Tailwind CSS v3.4+ with DaisyUI v4.12+
- **Language:** TypeScript
- **State Management:** React Context API
- **HTTP Client:** Fetch API

## 📁 Folder Structure

```
frontend/
├── app/
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx       # Sign in page
│   │   └── signup/
│   │       └── page.tsx       # Sign up page
│   ├── posts/
│   │   ├── [id]/
│   │   │   ├── page.tsx       # Post detail page
│   │   │   └── edit/
│   │   │       └── page.tsx   # Edit post page
│   │   ├── new/
│   │   │   └── page.tsx       # Create new post page
│   │   └── page.tsx           # Posts listing page
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/
│   ├── Navbar.tsx             # Navigation bar
│   ├── PostCard.tsx           # Post card component
│   └── PostForm.tsx           # Post form component
├── lib/
│   ├── api.ts                 # API client
│   └── AuthContext.tsx        # Authentication context
├── .env.example               # Environment variables template
├── next.config.ts             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── package.json
└── tsconfig.json
```

## 🛠️ Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

## 🚀 Running the Application

**Development mode:**
```bash
npm run dev
```

The application will start on `http://localhost:3000`

**Production build:**
```bash
npm run build
npm start
```

## 📄 Pages & Routes

### Authentication
- **`/auth/signin`** - Sign in to existing account
- **`/auth/signup`** - Create new account

### Posts Management
- **`/`** - Home page with welcome message
- **`/posts`** - List all posts with pagination (protected)
- **`/posts/[id]`** - View single post details (protected)
- **`/posts/new`** - Create new post (protected)
- **`/posts/[id]/edit`** - Edit existing post (protected, author only)

## 🎨 UI Components

### Reusable Components

1. **Navbar**
   - Responsive navigation bar
   - Shows different options based on auth state
   - User dropdown menu with sign out option

2. **PostCard**
   - Displays post preview
   - Shows title, excerpt, author, and date
   - "Read More" button

3. **PostForm**
   - Reusable form for creating/editing posts
   - Title and content fields
   - Loading and error states
   - Customizable submit button text

### DaisyUI Components Used
- `navbar` - Navigation
- `card` - Content containers
- `button` - Actions
- `input` / `textarea` - Form fields
- `alert` - Error/success messages
- `loading` - Loading spinners
- `dropdown` - User menu
- `hero` - Landing page hero section
- `pagination` (join) - Page navigation

## 🔐 Authentication Flow

1. **Sign Up:**
   - User provides email and password (min 6 characters)
   - Password confirmation validation
   - JWT token stored in localStorage
   - Auto-redirect to posts page

2. **Sign In:**
   - User provides credentials
   - JWT token received and stored
   - User info stored in localStorage
   - Auto-redirect to posts page

3. **Sign Out:**
   - Clear token and user data
   - Redirect to sign in page

4. **Protected Routes:**
   - All `/posts` routes require authentication
   - Auto-redirect to sign in if not authenticated
   - Edit/delete only available to post author

## 🔧 API Integration

The app communicates with the Hono.js backend via the API client (`lib/api.ts`):

### API Methods

```typescript
// Authentication
api.signup(email, password)
api.signin(email, password)
api.signout()

// Posts
api.getPosts(page, limit)      // Get paginated posts
api.getPost(id)                 // Get single post
api.createPost(title, content)  // Create new post
api.updatePost(id, title, content)  // Update post
api.deletePost(id)              // Delete post
```

### Authentication Header
All protected endpoints automatically include:
```
Authorization: Bearer <jwt-token>
```

## 🎨 Styling & Theme

- **Tailwind CSS** for utility-first styling
- **DaisyUI** theme: `cupcake` (light theme)
- Responsive design with mobile-first approach
- Clean, modern UI with consistent spacing

### Customizing Theme
Edit `tailwind.config.js` to change DaisyUI theme:
```javascript
daisyui: {
  themes: ['light', 'dark', 'cupcake'],
}
```

Then update `app/layout.tsx`:
```tsx
<html lang="en" data-theme="cupcake">
```

## 💡 Technical Choices

1. **Next.js App Router:** Latest routing paradigm with better performance, built-in layouts, and improved data fetching.

2. **React 19:** Latest React version with improved performance and new features.

3. **DaisyUI:** Component library built on Tailwind that provides beautiful, accessible components out of the box.

4. **Context API:** Lightweight state management for authentication state without additional dependencies.

5. **TypeScript:** Type safety throughout the application for better developer experience and fewer runtime errors.

6. **localStorage:** Simple token storage solution suitable for this demo. In production, consider httpOnly cookies.

7. **Client Components:** Used `'use client'` where needed for interactive features while keeping the app router benefits.

## 🔄 State Management

### Authentication Context
- Global user state
- Token management
- Loading states
- Sign in/up/out methods

### Local Component State
- Form inputs
- Loading indicators
- Error messages
- Pagination

## 📱 Features

✅ User authentication (signup, signin, signout)
✅ Create new blog posts
✅ View all posts with pagination
✅ View individual post details
✅ Edit own posts
✅ Delete own posts
✅ Responsive design
✅ Loading states
✅ Error handling
✅ Form validation
✅ Protected routes
✅ Author-only edit/delete

## 🧪 Development Notes

- The app expects the backend API to run on `http://localhost:3001`
- Authentication token expires after 7 days (backend setting)
- Pagination defaults to 10 posts per page
- All dates are formatted to local timezone

## 🚨 Important Notes

- Make sure the backend API is running before starting the frontend
- Update `NEXT_PUBLIC_API_URL` if backend runs on different port
- In production, use secure token storage (httpOnly cookies)
- Add proper error boundaries for production use
- Consider adding form libraries like React Hook Form for complex forms
- Add validation library like Zod for client-side validation

## 🔮 Future Enhancements

- Add markdown support for post content
- Image upload functionality
- User profiles
- Post categories/tags
- Search functionality
- Comments system
- Like/favorite posts
- Dark mode toggle
- Rich text editor
- Social sharing
