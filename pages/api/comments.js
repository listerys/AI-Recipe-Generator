import supabase from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Example: create a comment
    const { userId, recipeId, comment } = req.body;
    if (!userId || !recipeId || !comment) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // TODO: Insert comment into "comments" table
    // For now, just respond success
    return res.status(200).json({ message: 'Comment posted (stub)' });
  }

  if (req.method === 'GET') {
    // Example: fetch comments by recipeId
    const { recipeId } = req.query;
    if (!recipeId) {
      return res.status(400).json({ error: 'Missing recipeId' });
    }

    // TODO: Query "comments" table
    // For now, respond with sample data
    return res.status(200).json([
      { id: 1, userId: 123, content: 'This is a sample comment' }
    ]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
