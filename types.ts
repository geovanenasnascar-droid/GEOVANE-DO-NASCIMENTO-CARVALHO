export interface UserData {
  age: number;
  gender: 'Male' | 'Female';
  weight: number;
  height: number;
  goal: 'Lose weight' | 'Maintain weight' | 'Gain muscle';
  activityLevel: 'Sedentary' | 'Lightly active' | 'Moderately active' | 'Very active';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Meal {
  name: string;
  description: string;
}

export interface DailyDiet {
  day: string;
  meals: Meal[];
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

export interface DailyWorkout {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface FitnessPlan {
  dietPlan: DailyDiet[];
  workoutPlan: DailyWorkout[];
}