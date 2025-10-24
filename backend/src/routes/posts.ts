import { Hono } from 'hono';
import { prisma } from '../db/prisma';
import { authMiddleware } from '../middlewares/auth';
import { z } from 'zod';
import { JWTPayload } from '../utils/jwt';

type Variables = {
  user: JWTPayload;
};

const posts = new Hono<{ Variables: Variables }>();

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
});

// GET /posts - List all posts with pagination
posts.get('/', authMiddleware, async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const skip = (page - 1) * limit;

    const [postsList, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
      prisma.post.count(),
    ]);

    return c.json({
      posts: postsList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /posts/:id - Get single post
posts.get('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    return c.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /posts - Create new post
posts.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as JWTPayload;
    const body = await c.req.json();
    const { title, content } = createPostSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: user.userId,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return c.json({ message: 'Post created successfully', post }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    console.error('Create post error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// PUT /posts/:id - Update post
posts.put('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as JWTPayload;
    const id = c.req.param('id');
    const body = await c.req.json();
    const data = updatePostSchema.parse(body);

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return c.json({ error: 'Post not found' }, 404);
    }

    if (existingPost.authorId !== user.userId) {
      return c.json({ error: 'Forbidden - You can only edit your own posts' }, 403);
    }

    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return c.json({ message: 'Post updated successfully', post });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    console.error('Update post error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// DELETE /posts/:id - Delete post
posts.delete('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as JWTPayload;
    const id = c.req.param('id');

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return c.json({ error: 'Post not found' }, 404);
    }

    if (existingPost.authorId !== user.userId) {
      return c.json({ error: 'Forbidden - You can only delete your own posts' }, 403);
    }

    await prisma.post.delete({
      where: { id },
    });

    return c.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default posts;
