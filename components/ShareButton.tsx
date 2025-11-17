import React, { useState } from 'react';
import type { FitnessPlan } from '../types';

interface ShareButtonProps {
  plan: FitnessPlan;
}

const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const formatPlanForSharing = (plan: FitnessPlan): string => {
  let shareText = "Meu plano de fitness personalizado do Jhon Fit! 💪\n\n";

  shareText += "---- 🍽️ PLANO DE DIETA ----\n";
  plan.dietPlan.forEach(day => {
    shareText += `\n**${day.day}:**\n`;
    day.meals.forEach(meal => {
      shareText += `- ${meal.name}: ${meal.description}\n`;
    });
  });

  shareText += "\n---- 🏋️ PLANO DE TREINO ----\n";
  plan.workoutPlan.forEach(day => {
    shareText += `\n**${day.day} (${day.focus}):**\n`;
    if (day.exercises.length > 0) {
      day.exercises.forEach(ex => {
        shareText += `- ${ex.name} (${ex.sets}x${ex.reps})\n`;
      });
    } else {
      shareText += "- Descanso\n";
    }
  });

  shareText += "\n\nGerado por Jhon Fit - Seu Treinador Fitness IA.";
  return shareText;
};

const ShareButton: React.FC<ShareButtonProps> = ({ plan }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const textToShare = formatPlanForSharing(plan);
    const shareData = {
      title: 'Meu Plano Jhon Fit',
      text: textToShare,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(textToShare);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      } catch (error) {
        console.error('Failed to copy:', error);
        alert('Falha ao copiar o plano. Por favor, tente manualmente.');
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 bg-gray-700 text-yellow-400 font-semibold py-2 px-5 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
        aria-label="Compartilhar Plano"
      >
        <ShareIcon className="w-5 h-5" />
        Compartilhar Plano
      </button>
      {copied && (
        <div className="absolute -top-10 bg-green-500 text-white text-sm py-1 px-3 rounded-md animate-fade-in-out" role="alert">
          Copiado!
        </div>
      )}
    </div>
  );
};

export default ShareButton;
