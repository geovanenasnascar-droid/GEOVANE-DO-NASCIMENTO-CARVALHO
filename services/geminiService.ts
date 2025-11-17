import { GoogleGenAI, Type } from "@google/genai";
import type { UserData, FitnessPlan } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fitnessPlanSchema = {
  type: Type.OBJECT,
  properties: {
    dietPlan: {
      type: Type.ARRAY,
      description: "A 7-day diet plan.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING, description: "Day of the week (e.g., Monday)." },
          meals: {
            type: Type.ARRAY,
            description: "List of meals for the day.",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Meal name (e.g., Breakfast, Lunch)." },
                description: { type: Type.STRING, description: "Description of the food and portion sizes." },
              },
              required: ["name", "description"],
            },
          },
        },
        required: ["day", "meals"],
      },
    },
    workoutPlan: {
      type: Type.ARRAY,
      description: "A 7-day workout plan.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING, description: "Day of the week (e.g., Monday)." },
          focus: { type: Type.STRING, description: "Main muscle group or workout type for the day (e.g., Chest & Triceps, Rest)." },
          exercises: {
            type: Type.ARRAY,
            description: "List of exercises for the day. Should be empty if it's a rest day.",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Name of the exercise." },
                sets: { type: Type.STRING, description: "Number of sets (e.g., '3-4')." },
                reps: { type: Type.STRING, description: "Number of repetitions per set (e.g., '8-12')." },
              },
              required: ["name", "sets", "reps"],
            },
          },
        },
        required: ["day", "focus", "exercises"],
      },
    },
  },
  required: ["dietPlan", "workoutPlan"],
};


export const generatePlan = async (userData: UserData): Promise<FitnessPlan> => {
  const prompt = `
    Act as an expert fitness coach and nutritionist named 'Jhon Fit'.
    Based on the following user data, create a comprehensive and detailed 7-day diet and workout plan.

    User Data:
    - Age: ${userData.age}
    - Gender: ${userData.gender}
    - Weight: ${userData.weight} kg
    - Height: ${userData.height} cm
    - Goal: ${userData.goal}
    - Activity Level: ${userData.activityLevel}
    - Difficulty Level: ${userData.difficulty}

    Instructions:
    1.  The diet should be balanced, healthy, and tailored to the user's goal. Provide specific food items and reasonable portion sizes for each meal.
    2.  The workout plan should be effective and safe, tailored to the user's selected difficulty level (${userData.difficulty}). Beginners should have simpler exercises and lower volume, while advanced users should have more complex movements and higher intensity/volume.
    3.  Include a mix of strength training and cardiovascular exercise. Clearly specify exercises, sets, and reps.
    4.  Include at least one rest day in the workout plan.
    5.  The language must be in Brazilian Portuguese (pt-BR).
    6.  Provide the response in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: fitnessPlanSchema,
        temperature: 0.7,
      },
    });
    
    const jsonText = response.text.trim();
    const plan: FitnessPlan = JSON.parse(jsonText);
    return plan;
  } catch (error) {
    console.error("Error generating plan with Gemini:", error);
    throw new Error("Failed to parse fitness plan from Gemini response.");
  }
};