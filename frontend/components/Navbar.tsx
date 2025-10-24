'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, signout } = useAuth();
  const router = useRouter();

  const handleSignout = () => {
    signout();
    router.push('/auth/signin');
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          📝 YOGA BLOG
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/posts">Posts</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link href="/posts/new">New Post</Link>
              </li>
              <li>
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost">
                    {user.email}
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <button onClick={handleSignout}>Sign Out</button>
                    </li>
                  </ul>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/auth/signin">Sign In</Link>
              </li>
              <li>
                <Link href="/auth/signup">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
