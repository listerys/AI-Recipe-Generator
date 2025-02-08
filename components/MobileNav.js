// components/MobileNav.js
import Link from 'next/link';
import { BookOpenIcon, SparklesIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import supabase from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function MobileNav() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-4 md:hidden z-50">
      <Link href="/my-recipes" className="flex flex-col items-center">
        <BookOpenIcon className="w-6 h-6" />
        <span className="text-xs">My Recipes</span>
      </Link>
      <Link href="/recipe-generator" className="flex flex-col items-center">
        <SparklesIcon className="w-6 h-6" />
        <span className="text-xs">Generator</span>
      </Link>
      <button onClick={handleLogout} className="flex flex-col items-center">
        <ArrowRightOnRectangleIcon className="w-6 h-6" />
        <span className="text-xs">Log Out</span>
      </button>
    </nav>
  );
}
