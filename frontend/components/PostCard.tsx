import { Post } from '@/lib/api';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{post.title}</h2>
        <p className="text-gray-600">
          {post.content.substring(0, 150)}
          {post.content.length > 150 ? '...' : ''}
        </p>
        <div className="text-sm text-gray-500 mt-2">
          <p>By {post.author.email}</p>
          <p>{formatDate(post.createdAt)}</p>
        </div>
        <div className="card-actions justify-end mt-4">
          <Link href={`/posts/${post.id}`} className="btn btn-primary btn-sm">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}
