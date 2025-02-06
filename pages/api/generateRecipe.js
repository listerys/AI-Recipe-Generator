// pages/api/generateRecipe.js

import { generateRecipeViaLlama } from '../../utils/llamaApi';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ingredients, time, servings, expertise, caloriePref } = req.body;

  // Basic validation
  if (!ingredients || !time || !servings || !expertise || !caloriePref) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const recipe = await generateRecipeViaLlama({ ingredients, time, servings, expertise, caloriePref });
  if (!recipe) {
    return res.status(500).json({ error: 'AI generation failed' });
  }

  return res.status(200).json(recipe);
}
