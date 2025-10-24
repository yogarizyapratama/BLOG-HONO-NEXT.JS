'use client';

import { useState, useEffect } from 'react';
import { api, Post } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (user) {
      loadPosts();
    }
  }, [page, user, authLoading]);

  const loadPosts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await api.getPosts(page, 10);
      setPosts(data.posts);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || (isLoading && posts.length === 0)) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">All Posts</h1>
        <Link href="/posts/new" className="btn btn-primary">
          Create New Post
        </Link>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {posts.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <p className="text-xl mb-4">No posts yet</p>
          <Link href="/posts/new" className="btn btn-primary">
            Create the first post
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1 || isLoading}
                >
                  «
                </button>
                <button className="join-item btn">
                  Page {page} of {totalPages}
                </button>
                <button
                  className="join-item btn"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages || isLoading}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
