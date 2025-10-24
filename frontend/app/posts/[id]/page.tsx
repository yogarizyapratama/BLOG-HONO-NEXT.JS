'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api, Post } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (user && id) {
      loadPost();
    }
  }, [id, user, authLoading]);

  const loadPost = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await api.getPost(id);
      setPost(data.post);
    } catch (err: any) {
      setError(err.message || 'Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.deletePost(id);
      router.push('/posts');
    } catch (err: any) {
      setError(err.message || 'Failed to delete post');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-xl mb-4">Post not found</p>
        <Link href="/posts" className="btn btn-primary">
          Back to Posts
        </Link>
      </div>
    );
  }

  const isAuthor = user?.id === post.authorId;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/posts" className="btn btn-ghost btn-sm">
          ← Back to Posts
        </Link>
      </div>

      <article className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-start">
            <h1 className="card-title text-4xl">{post.title}</h1>
            {isAuthor && (
              <div className="flex gap-2">
                <Link
                  href={`/posts/${post.id}/edit`}
                  className="btn btn-primary btn-sm"
                >
                  Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-error btn-sm">
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500 mt-2">
            <p>By {post.author.email}</p>
            <p>Published on {formatDate(post.createdAt)}</p>
            {post.updatedAt !== post.createdAt && (
              <p>Updated on {formatDate(post.updatedAt)}</p>
            )}
          </div>

          <div className="divider"></div>

          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-lg">{post.content}</p>
          </div>
        </div>
      </article>
    </div>
  );
}
