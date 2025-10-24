import { Hono } from 'hono';
import { prisma } from '../db/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { z } from 'zod';

const auth = new Hono();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /auth/signup
auth.post('/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return c.json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /auth/signin
auth.post('/signin', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = signinSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return c.json({
      message: 'Signed in successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    console.error('Signin error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /auth/signout
auth.post('/signout', async (c) => {
  // Since we're using JWT, signout is handled client-side by removing the token
  // This endpoint is here for consistency and future enhancements (e.g., token blacklisting)
  return c.json({ message: 'Signed out successfully' });
});

export default auth;
