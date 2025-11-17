
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-12">
      <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-400">Jhon Fit está preparando seu plano...</p>
    </div>
  );
};

export default LoadingSpinner;
