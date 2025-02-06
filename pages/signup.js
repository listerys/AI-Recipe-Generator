import React, { useState } from 'react';
import { toast } from 'react-toastify';
import supabase from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error('Please fill all fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success('Signup successful! You can now log in.');
    router.push('/login');
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side: Form */}
      <div className="flex items-center justify-center bg-white">
        <form onSubmit={handleSignup} className="w-full max-w-lg p-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Create Account</h1>

          <div className="mb-6">
            <label htmlFor="fullName" className="block text-lg font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              className="w-full border border-gray-400 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="w-full border border-gray-400 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              className="w-full border border-gray-400 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter your password"
              className="w-full border border-gray-400 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white text-lg font-semibold rounded-md py-3 hover:bg-green-700 transition-colors"
          >
            {loading ? 'Signing up…' : 'Sign Up'}
          </button>

          <p className="mt-6 text-center text-gray-600 text-lg">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 underline">
              Log in
            </a>
          </p>
        </form>
      </div>

      {/* Right side: Bold gradient with an illustration placeholder */}
      <div className="flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-500">
        <h2 className="text-white text-5xl font-extrabold tracking-wide">
          Join Our Community
        </h2>
      </div>
    </div>
  );
}
