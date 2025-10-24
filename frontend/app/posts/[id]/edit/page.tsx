'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api, Post } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import PostForm from '@/components/PostForm';

export default function EditPostPage() {
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
      
      // Check if user is the author
      if (data.post.authorId !== user?.id) {
        setError('You can only edit your own posts');
        return;
      }
      
      setPost(data.post);
    } catch (err: any) {
      setError(err.message || 'Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (title: string, content: string) => {
    await api.updatePost(id, title, content);
    router.push(`/posts/${id}`);
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
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Edit Post</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <PostForm
            initialTitle={post.title}
            initialContent={post.content}
            onSubmit={handleSubmit}
            submitText="Update Post"
          />
        </div>
      </div>
    </div>
  );
}
