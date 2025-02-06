import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Replace with your desired redirect path
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-500">
      {/* Bouncing Dots Loader */}
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-white rounded-full animate-bounce" />
        <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-75" />
        <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-150" />
      </div>

      {/* Loading Text */}
      <p className="mt-4 text-white font-semibold text-lg">
        Just a moment, sending you to login…
      </p>
    </div>
  );
}
