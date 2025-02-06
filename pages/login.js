import React, { useState } from 'react';
import { toast } from 'react-toastify';
import supabase from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      toast.error('Please fill all fields');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success('Login successful!');
    router.push('/feed');
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side: Bold gradient with a welcome message */}
      <div className="flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-500">
        <h1 className="text-white text-5xl font-extrabold tracking-wide">
          Welcome Back!
        </h1>
      </div>

      {/* Right side: Form */}
      <div className="flex items-center justify-center bg-white">
        <form onSubmit={handleLogin} className="w-full max-w-lg p-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Login</h2>

          <div className="mb-6">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="yourname@example.com"
              className="w-full border border-gray-400 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full border border-gray-400 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white text-lg font-semibold rounded-md py-3 hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>

          <p className="mt-6 text-center text-gray-600 text-lg">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-600 underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
