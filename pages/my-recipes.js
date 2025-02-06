import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import RecipeCard from '../components/RecipeCard';
import { toast } from 'react-toastify';

export default function MyRecipes() {
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  async function fetchMyRecipes() {
    setLoading(true);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error getting user:', userError);
      setLoading(false);
      return;
    }
    if (!user) {
      toast.error('You must be logged in to view your recipes.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('recipes')
      .select(`
        id,
        title,
        description,
        steps,
        macros,
        created_at
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user recipes:', error);
    } else {
      setMyRecipes(data || []);
    }
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-7 min-h-screen">
      {/* Left Sidebar */}
      <aside className="col-span-2 border-r border-gray-300 bg-white">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="col-span-3 p-6">
      <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            My Recipes
            <span className="text-gray-400 ml-2 text-xl font-normal">
              ({myRecipes.length})
            </span>
          </h1>

          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : myRecipes.length > 0 ? (
            <div className="grid gap-6">
              {myRecipes.map((r) => (
                <RecipeCard key={r.id} recipe={r} expandable={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">📭 No recipes found</div>
              <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition">
                Create First Recipe
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="col-span-2 border-l border-gray-300 bg-white">
        <RightSidebar />
      </aside>
    </div>
  );
}
