import Link from 'next/link';

export default function Home() {
  return (
    <div className="hero min-h-[calc(100vh-200px)] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome Yoga Blog</h1>
          <p className="py-6">
            A modern blog application
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signin" className="btn btn-primary">
              Get Started
            </Link>
            <Link href="/posts" className="btn btn-outline">
              View Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
