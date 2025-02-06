// utils/llamaApi.js
import axios from 'axios';

export async function generateRecipeViaLlama({ ingredients, time, servings, expertise, caloriePref }) {
  try {
    // Updated prompt with instructions to include missing/additional ingredients
    const userPrompt = `
      You are a helpful AI that always responds in JSON format ONLY — no markdown, no code fences.
      Generate a complete recipe using:
      - Provided ingredients: ${ingredients}
      - Cooking time: ${time} minutes
      - Servings: ${servings}
      - Expertise level: ${expertise}
      - Calorie preference: ${caloriePref}
      
      Note: The provided ingredients list might be incomplete. Please include any missing or additional ingredients necessary to make a complete recipe.
      
      The JSON must use this structure:
      {
        "recipeName": "string",
        "ingredients": "string", // complete list of ingredients as a string,
        "steps": ["step1", "step2", ...],
        "macros": {
          "calories": number,
          "protein": number,
          "fat": number,
          "carbohydrates": number
        }
      }
    `;

    const requestBody = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a helpful recipe AI. Output JSON only.' },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7
    };

    const response = await axios.post(
      process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions',
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let aiMessage = response.data?.choices?.[0]?.message?.content;
    if (!aiMessage) {
      throw new Error('No AI response content returned.');
    }

    const codeBlockRegex = /```json([\s\S]*?)```/i;
    const match = aiMessage.match(codeBlockRegex);
    if (match && match[1]) {
      aiMessage = match[1].trim();
    } else {
      aiMessage = aiMessage.replace(/```(\w+)?/g, '').replace(/```/g, '').trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(aiMessage);
    } catch (parseErr) {
      console.error('AI response was not valid JSON:', aiMessage);
      return {
        recipeName: 'Untitled',
        ingredients: 'Ingredients not provided.',
        steps: [aiMessage],
        macros: {}
      };
    }

    const finalRecipe = {
      recipeName: parsed.recipeName ?? 'Untitled',
      ingredients: parsed.ingredients ?? 'Ingredients not provided.',
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      macros: {
        calories: parsed?.macros?.calories ?? 0,
        protein: parsed?.macros?.protein ?? 0,
        fat: parsed?.macros?.fat ?? 0,
        carbohydrates: parsed?.macros?.carbohydrates ?? 0
      }
    };

    return finalRecipe;
  } catch (error) {
    console.error('Error calling Llama AI:', error);
    return null;
  }
}
