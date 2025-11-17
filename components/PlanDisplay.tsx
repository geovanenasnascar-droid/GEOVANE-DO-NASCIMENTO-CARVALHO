import React from 'react';
import type { FitnessPlan } from '../types';
import { CheckCircleIcon, CheckIcon } from './icons';

interface PlanDisplayProps {
  plan: FitnessPlan;
  completedWorkouts: { [day: string]: boolean };
  onToggleComplete: (day: string) => void;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, completedWorkouts, onToggleComplete }) => {
  return (
    <div className="space-y-10 md:space-y-12" id="plan-to-export">
      {/* Diet Plan Section */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-center text-yellow-400 border-b-2 border-yellow-400/30 pb-2">Plano de Dieta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plan.dietPlan.map((dailyDiet) => (
            <div key={dailyDiet.day} className="bg-gray-800 p-4 sm:p-5 rounded-lg shadow-md border border-gray-700 transition-transform transform hover:scale-105 hover:border-yellow-500">
              <h4 className="text-lg sm:text-xl font-semibold text-white mb-3">{dailyDiet.day}</h4>
              <ul className="space-y-3">
                {dailyDiet.meals.map((meal) => (
                  <li key={meal.name}>
                    <p className="font-bold text-yellow-500">{meal.name}</p>
                    <p className="text-gray-400 text-sm">{meal.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Workout Plan Section */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-center text-yellow-400 border-b-2 border-yellow-400/30 pb-2">Plano de Treino</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plan.workoutPlan.map((dailyWorkout) => {
            const isCompleted = completedWorkouts[dailyWorkout.day];
            const isRestDay = dailyWorkout.exercises.length === 0;
            return (
              <div 
                key={dailyWorkout.day} 
                className={`flex flex-col bg-gray-800 p-4 sm:p-5 rounded-lg shadow-md border transition-all duration-300 ${
                  isCompleted ? 'border-green-500 opacity-90' : 'border-gray-700 hover:border-yellow-500'
                }`}
              >
                <div className="flex-grow">
                  <h4 className="text-lg sm:text-xl font-semibold text-white mb-1">{dailyWorkout.day}</h4>
                  <p className="text-yellow-500 font-medium mb-3">{dailyWorkout.focus}</p>
                  {isRestDay ? (
                    <p className="text-gray-400">Descanso</p>
                  ) : (
                    <ul className="space-y-2">
                      {dailyWorkout.exercises.map((exercise) => (
                        <li key={exercise.name} className="flex justify-between items-baseline gap-2">
                          <span className="flex-1 text-gray-300">{exercise.name}</span>
                          <span className="flex-shrink-0 text-gray-400 text-sm font-mono bg-gray-700 px-2 py-1 rounded">{exercise.sets}x{exercise.reps}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {!isRestDay && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <button 
                      onClick={() => onToggleComplete(dailyWorkout.day)}
                      className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 rounded-md transition-colors duration-200 ${
                        isCompleted
                          ? 'bg-green-600/20 text-green-400 hover:bg-green-600/40'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {isCompleted ? <CheckCircleIcon className="w-5 h-5" /> : <CheckIcon className="w-5 h-5" />}
                      {isCompleted ? 'Concluído' : 'Marcar como Concluído'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlanDisplay;