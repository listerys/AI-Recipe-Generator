import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import { toast } from 'react-toastify';
import supabase from '../lib/supabaseClient';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { MdSave, MdShare } from 'react-icons/md';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RecipeGenerator() {
  const [ingredients, setIngredients] = useState('');
  const [time, setTime] = useState(15);
  const [servings, setServings] = useState(1);
  const [expertise, setExpertise] = useState('');
  const [caloriePref, setCaloriePref] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!ingredients || !time || !servings || !expertise || !caloriePref) {
      toast.error('Please fill all fields!');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/generateRecipe', {
        ingredients,
        time,
        servings,
        expertise,
        caloriePref
      });
      const aiRecipe = res.data;
      setGeneratedRecipe(aiRecipe);
      setIsSaved(false);
      toast.success('Recipe generated!');
    } catch (error) {
      console.error(error);
      toast.error('Error generating recipe');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!generatedRecipe) return;

    setSaveLoading(true);
    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error('No user found. Please log in.');
        setSaveLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from('recipes').insert([
        {
          user_id: user.id,
          title: generatedRecipe.recipeName || 'AI-Generated Recipe',
          description: generatedRecipe.ingredients || 'No ingredients found',
          steps: generatedRecipe.steps ? JSON.stringify(generatedRecipe.steps) : '[]',
          macros: generatedRecipe.macros ? JSON.stringify(generatedRecipe.macros) : '{}'
        }
      ]);

      if (insertError) {
        console.error('Error inserting recipe:', insertError);
        toast.error('Error saving recipe to database.');
      } else {
        toast.success('Recipe saved successfully!');
        setIsSaved(true);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error saving recipe');
    } finally {
      setSaveLoading(false);
    }
  }

  function handleShare() {
    if (!generatedRecipe) return;
    toast.info('Share functionality coming soon!');
  }

  const increaseServings = () => setServings(servings + 1);
  const decreaseServings = () => {
    if (servings > 1) setServings(servings - 1);
  };

  // Chart config
  const chartData =
    generatedRecipe && generatedRecipe.macros
      ? {
          labels: ['Protein', 'Carbs', 'Fat'],
          datasets: [
            {
              label: 'Macronutrients',
              data: [
                generatedRecipe.macros.protein,
                generatedRecipe.macros.carbohydrates,
                generatedRecipe.macros.fat
              ],
              backgroundColor: ['#333', '#555', '#777']
            }
          ]
        }
      : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Macros Chart',
        color: '#333'
      }
    },
    scales: {
      x: { grid: { color: '#e5e7eb' }, ticks: { color: '#333' } },
      y: { grid: { color: '#e5e7eb' }, ticks: { color: '#333' } }
    }
  };

  return (
    <div className="grid grid-cols-7 min-h-screen">
      {/* Left Sidebar */}
      <aside className="col-span-2 border-r border-gray-200 bg-white">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="col-span-3 bg-gray-50">
        {/* Header */}
        <header className="py-6 text-center border-b border-gray-200 bg-white">
          <h1 className="text-gray-900 text-3xl font-bold">AI Recipe Generator</h1>
        </header>

        <section className="p-8 max-w-3xl mx-auto space-y-8">
          {/* Generator Form Card */}
          <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Ingredients (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. tomato, basil, mozzarella"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Cooking Time (minutes)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="15"
                    value={time}
                    onChange={(e) => setTime(Number(e.target.value))}
                    className="w-full accent-gray-700"
                  />
                  <span className="text-sm text-gray-800 font-semibold">{time} min</span>
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Servings</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={decreaseServings}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-300 text-xl font-bold"
                  >
                    –
                  </button>
                  <span className="text-sm text-gray-900 font-semibold">{servings}</span>
                  <button
                    type="button"
                    onClick={increaseServings}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-300 text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Expertise Level</label>
                <select
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                >
                  <option value="">--Choose--</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">Calorie Preference</label>
                <select
                  value={caloriePref}
                  onChange={(e) => setCaloriePref(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                >
                  <option value="">--Choose--</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 text-white text-sm font-medium py-3 hover:bg-gray-700 transition-colors"
              >
                {loading ? 'Generating…' : 'Generate Recipe'}
              </button>
            </form>
          </div>

          {/* Generated Recipe Section */}
          {generatedRecipe && (
            <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {generatedRecipe.recipeName}
              </h2>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Ingredients</h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {generatedRecipe.ingredients}
                </p>
              </div>

              {/* Steps */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Steps</h3>
                {Array.isArray(generatedRecipe.steps) ? (
                  <ul className="list-disc ml-6 text-gray-700 space-y-2 text-sm">
                    {generatedRecipe.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No steps available.</p>
                )}
              </div>

              {/* Nutritional Info */}
              {generatedRecipe.macros && (
                <div className="mb-6 space-y-1 text-sm text-gray-700">
                  <p><strong>Calories:</strong> {generatedRecipe.macros.calories}</p>
                  <p><strong>Protein:</strong> {generatedRecipe.macros.protein}g</p>
                  <p><strong>Carbs:</strong> {generatedRecipe.macros.carbohydrates}g</p>
                  <p><strong>Fat:</strong> {generatedRecipe.macros.fat}g</p>
                </div>
              )}

              {/* Macro Chart */}
              {generatedRecipe.macros && chartData && (
                <div className="h-80 mb-6">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              )}

              {/* Save & Share Buttons */}
              <div className="border-t border-gray-100 pt-4 mt-4 flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white text-sm font-medium py-3 hover:bg-gray-700 transition-colors"
                >
                  <MdSave size={20} />
                  {saveLoading ? 'Saving…' : 'Save Recipe'}
                </button>

                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white text-sm font-medium py-3 hover:bg-gray-700 transition-colors"
                >
                  <MdShare size={20} />
                  Share Recipe
                </button>
              </div>

              {isSaved && (
                <p className="mt-4 text-green-700 text-center text-sm font-medium">Recipe Saved!</p>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Right Sidebar */}
      <aside className="col-span-2 border-l border-gray-200 bg-white">
        <RightSidebar />
      </aside>
    </div>
  );
}
