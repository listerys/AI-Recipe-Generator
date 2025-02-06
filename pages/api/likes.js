import supabase from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Example: handle toggling likes
    const { userId, recipeId } = req.body;
    if (!userId || !recipeId) {
      return res.status(400).json({ error: 'Missing userId or recipeId' });
    }

    // TODO: Insert or delete from "likes" table in Supabase
    // For now, just respond success
    return res.status(200).json({ message: 'Like toggled (stub)' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
