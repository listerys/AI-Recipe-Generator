import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import supabase from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function RecipeCard({
  recipe,
  expandable = false,
  onLikeSuccess = () => {},
  onCommentSuccess = () => {}
}) {
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');

  const router = useRouter();
  const { title, description, created_at, likeCount, comments } = recipe;

  // The user that posted it => from "profiles (full_name)"
  const ownerName = recipe.profiles?.full_name || 'Unknown User';

  // If macros/steps are strings, parse them
  let macros = {};
  let steps = [];
  try {
    macros = typeof recipe.macros === 'string' ? JSON.parse(recipe.macros) : recipe.macros;
    steps = typeof recipe.steps === 'string' ? JSON.parse(recipe.steps) : recipe.steps;
  } catch (err) {
    console.error('Error parsing macros/steps:', err);
  }

  // Like Handler
  async function handleLike() {
    // 1) Get the currently logged-in user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      alert('You must be logged in to like a recipe.');
      router.push('/login');
      return;
    }

    // 2) Insert a like row
    const { error: likeError } = await supabase.from('likes').insert([
      {
        user_id: user.id,
        recipe_id: recipe.id
      }
    ]);

    if (likeError) {
      // Possibly the user already liked it or there's an error
      console.error('Error liking recipe:', likeError);
      alert('Error liking recipe (maybe already liked).');
      return;
    }

    // 3) Refresh the feed or recipe data
    onLikeSuccess();
  }

  // Comment Handler
  async function handleAddComment(e) {
    e.preventDefault();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      alert('You must be logged in to comment.');
      router.push('/login');
      return;
    }

    if (!commentText.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    const { error: commentError } = await supabase.from('comments').insert([
      {
        user_id: user.id,
        recipe_id: recipe.id,
        content: commentText.trim(),
      }
    ]);

    if (commentError) {
      console.error('Error adding comment:', commentError);
      alert('Error adding comment.');
      return;
    }

    setCommentText('');
    onCommentSuccess();
  }

  return (
    <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      {/* Poster & Title Row */}
      <div className="flex items-start justify-between">
        <div>
          {/* Owner's Name */}
          <span className="block text-sm text-gray-500">
            Shared by {ownerName}
          </span>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Created At */}
        <span className="text-xs text-gray-400 ml-2">
          {new Date(created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Like Count & Like Button */}
      <div className="mt-4 flex items-center gap-4">
        <div className="text-sm text-gray-600">
          Likes: <span className="font-medium text-gray-800">{likeCount}</span>
        </div>
        <button
          onClick={handleLike}
          className="text-sm text-gray-500 border border-gray-200 px-2 py-1 rounded hover:bg-gray-50"
        >
          Like
        </button>
      </div>

      {/* If not expandable, just show macros inline, or skip. */}
      {!expandable && macros.calories && (
        <div className="mt-4 flex gap-4">
          <MacroPill label="Calories" value={macros.calories} unit="kcal" />
          <MacroPill label="Protein" value={macros.protein} unit="g" />
        </div>
      )}

      {/* Expandable Section */}
      {expandable && (
        <>
          {/* Toggle Content */}
          <div className={`mt-4 ${expanded ? 'block' : 'hidden'}`}>
            {/* Instructions */}
            {steps && steps.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Instructions</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition */}
            {macros && (macros.protein || macros.carbohydrates || macros.fat) && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Nutrition</h4>
                <div className="grid grid-cols-2 gap-3">
                  <MacroPill fullWidth label="Protein" value={macros.protein} unit="g" />
                  <MacroPill fullWidth label="Carbohydrates" value={macros.carbohydrates} unit="g" />
                  <MacroPill fullWidth label="Fat" value={macros.fat} unit="g" />
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              <h4 className="font-medium text-gray-900 mb-3">Comments</h4>

              {comments && comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="text-sm text-gray-700">
                      <span className="font-semibold">
                        {comment.profiles?.full_name || 'User'}:
                      </span>{' '}
                      {comment.content}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
              )}

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:border-gray-500 rounded"
                />
                <button
                  type="submit"
                  className="text-sm bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  Post
                </button>
              </form>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
          >
            {expanded ? (
              <>
                <ChevronUpIcon className="w-4 h-4" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-4 h-4" />
                Expand
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}

/** 
 * Pill component reused for macros 
 */
const MacroPill = ({ label, value, unit, fullWidth }) => (
  <div className={`${fullWidth ? 'w-full' : 'inline-flex'} p-3 bg-gray-50 rounded-lg`}>
    <span className="text-gray-500 text-xs">{label}</span>
    <div className="text-base font-medium text-gray-900 mt-1">
      {value || '0'}
      <span className="text-xs text-gray-400 ml-1">{unit}</span>
    </div>
  </div>
);
