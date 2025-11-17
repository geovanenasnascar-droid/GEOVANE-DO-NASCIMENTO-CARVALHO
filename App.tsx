import React, { useState } from 'react';
import { UserData, FitnessPlan } from './types';
import { generatePlan, generateExerciseInstructions } from './services/geminiService';
import UserInputForm from './components/UserInputForm';
import PlanDisplay from './components/PlanDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ShareButton from './components/ShareButton';
import { DumbbellIcon, PdfIcon } from './components/icons';
import ExerciseModal from './components/ExerciseModal';

const App: React.FC = () => {
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<{ [day: string]: boolean }>({});

  // State for exercise instruction modal
  const [userDifficulty, setUserDifficulty] = useState<UserData['difficulty']>('Beginner');
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [exerciseInstructions, setExerciseInstructions] = useState<string | null>(null);
  const [isFetchingInstructions, setIsFetchingInstructions] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const handleGeneratePlan = async (userData: UserData) => {
    setIsLoading(true);
    setError(null);
    setPlan(null);
    setCompletedWorkouts({}); // Reset completion status on new plan
    setUserDifficulty(userData.difficulty); // Store user difficulty for instruction generation
    try {
      const result = await generatePlan(userData);
      setPlan(result);
    } catch (err) {
      setError('Falha ao gerar o plano. A IA pode estar ocupada, por favor, tente novamente mais tarde.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleWorkoutCompletion = (day: string) => {
    setCompletedWorkouts(prev => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleSelectExercise = async (exerciseName: string) => {
    setSelectedExercise(exerciseName);
    setIsFetchingInstructions(true);
    setExerciseInstructions(null);
    setModalError(null);
    try {
      const instructions = await generateExerciseInstructions(exerciseName, userDifficulty);
      setExerciseInstructions(instructions);
    } catch (err) {
      setModalError('Falha ao carregar as instruções. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setIsFetchingInstructions(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedExercise(null);
    setExerciseInstructions(null);
    setModalError(null);
  };


  const handleExportPdf = () => {
    const html2canvas = (window as any).html2canvas;
    const { jsPDF } = (window as any).jspdf;

    if (!html2canvas || !jsPDF) {
        setError("Não foi possível carregar a biblioteca de exportação de PDF. Tente recarregar a página.");
        return;
    }

    const input = document.getElementById('plan-to-export');
    if (!input) {
        setError("Não foi possível encontrar o conteúdo do plano para exportar.");
        return;
    }
    
    setIsExporting(true);

    html2canvas(input, { scale: 2, backgroundColor: '#111827' })
        .then((canvas: HTMLCanvasElement) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProps= pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }
            pdf.save('Jhon_Fit_Plano.pdf');
        })
        .catch((err: any) => {
            setError("Ocorreu um erro ao gerar o PDF.");
            console.error(err);
        })
        .finally(() => {
            setIsExporting(false);
        });
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-center space-x-4 mb-8">
          <DumbbellIcon className="w-12 h-12 text-yellow-400" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Jhon Fit
          </h1>
        </header>

        <main>
          <p className="text-center text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Seu coach pessoal de fitness e nutrição com IA. Preencha seus dados abaixo para obter um plano personalizado feito sob medida para você.
          </p>

          <UserInputForm onSubmit={handleGeneratePlan} isLoading={isLoading} />

          {error && (
            <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
              <p className="font-semibold">Ocorreu um Erro</p>
              <p>{error}</p>
            </div>
          )}

          {isLoading && <LoadingSpinner />}

          {plan && !isLoading && (
            <div className="mt-12 animate-fade-in">
               <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-yellow-400">Seu Plano de Fitness Personalizado</h2>
                <p className="text-gray-400 max-w-xl mx-auto">Aqui está o plano que a IA Jhon Fit criou para você. Lembre-se de consultar um profissional antes de começar.</p>
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                <ShareButton plan={plan} />
                <button
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-gray-700 text-yellow-400 font-semibold py-2 px-5 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
                  aria-label="Exportar para PDF"
                >
                  <PdfIcon className="w-5 h-5" />
                  {isExporting ? 'Exportando...' : 'Exportar PDF'}
                </button>
              </div>

              <PlanDisplay 
                plan={plan} 
                completedWorkouts={completedWorkouts} 
                onToggleComplete={handleToggleWorkoutCompletion}
                onSelectExercise={handleSelectExercise}
              />
            </div>
          )}
        </main>

        {selectedExercise && (
          <ExerciseModal
            exerciseName={selectedExercise}
            instructions={exerciseInstructions}
            isLoading={isFetchingInstructions}
            error={modalError}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default App;
