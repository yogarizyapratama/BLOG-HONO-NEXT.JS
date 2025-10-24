'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import PostForm from '@/components/PostForm';
import { useEffect } from 'react';

export default function NewPostPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading]);

  const handleSubmit = async (title: string, content: string) => {
    await api.createPost(title, content);
    router.push('/posts');
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Create New Post</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <PostForm onSubmit={handleSubmit} submitText="Create Post" />
        </div>
      </div>
    </div>
  );
}
