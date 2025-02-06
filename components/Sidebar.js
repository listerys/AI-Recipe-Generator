import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';
import {
  HomeIcon,
  BookOpenIcon,
  SparklesIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const router = useRouter();
  const { pathname } = router;

  const linkClasses = (path) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 p-3 rounded-xl ${
      isActive ? 'bg-gray-50 text-gray-900 font-medium' : 'hover:bg-gray-50 text-gray-600'
    }`;
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <nav className="p-6">
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-4">
          <Link href="/my-recipes" className={linkClasses('/my-recipes')}>
            <BookOpenIcon className="w-5 h-5" />
            <span>My Recipes</span>
          </Link>
          <Link href="/recipe-generator" className={linkClasses('/recipe-generator')}>
            <SparklesIcon className="w-5 h-5" />
            <span>Generator</span>
          </Link>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
