import React, { useEffect, useState } from 'react';

export default function RightSidebar() {
  const [topRecipes, setTopRecipes] = useState([]);

  useEffect(() => {
    // Hardcode or fetch random data
    setTopRecipes([
      { id: 1, title: 'Famous Chili', like_count: 45 },
      { id: 2, title: 'Vegan Lasagna', like_count: 32 },
      { id: 3, title: 'Chocolate Cake', like_count: 27 }
    ]);
  }, []);

  return (
    <aside className="w-full bg-white p-6 border-l border-gray-300">
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        Trending Recipes
      </h2>
      
      <div className="space-y-2">
        {topRecipes.map(recipe => (
          <div
            key={recipe.id}
            className="flex items-center justify-between px-3 py-2 border border-gray-300 hover:border-black"
          >
            <span className="text-sm text-gray-800">{recipe.title}</span>
            <span className="text-xs text-gray-600">
              {recipe.like_count} likes
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
