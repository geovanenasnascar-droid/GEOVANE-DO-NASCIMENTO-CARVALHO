import React from 'react';
import { CloseIcon } from './icons';

interface ExerciseModalProps {
  exerciseName: string | null;
  instructions: string | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({ exerciseName, instructions, isLoading, error, onClose }) => {
  if (!exerciseName) {
    return null;
  }

  // Handle ESC key press to close modal
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in-fast" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-modal-title"
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative transform transition-all animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-full p-1"
          aria-label="Fechar modal"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 id="exercise-modal-title" className="text-2xl font-bold text-yellow-400 mb-4 pr-8">{exerciseName}</h2>
        
        {isLoading && (
          <div className="flex justify-center items-center h-48">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="sr-only">Carregando instruções...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-300 bg-red-900/50 border border-red-700 p-3 rounded-lg" role="alert">
            <p className="font-semibold">Ocorreu um Erro</p>
            <p>{error}</p>
          </div>
        )}

        {instructions && (
          <div className="text-gray-300 max-h-[60vh] overflow-y-auto pr-2 space-y-4" style={{ whiteSpace: 'pre-wrap' }}>
            {instructions}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseModal;
