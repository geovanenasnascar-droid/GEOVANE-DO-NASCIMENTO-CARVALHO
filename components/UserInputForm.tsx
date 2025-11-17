import React, { useState } from 'react';
import type { UserData } from '../types';

interface UserInputFormProps {
  onSubmit: (data: UserData) => void;
  isLoading: boolean;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserData>({
    age: 30,
    gender: 'Male',
    weight: 80,
    height: 180,
    goal: 'Lose weight',
    activityLevel: 'Moderately active',
    difficulty: 'Beginner',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserData, string>> = {};
    if (formData.age <= 0 || formData.age > 120) newErrors.age = 'Idade deve ser um número válido.';
    if (formData.weight <= 0) newErrors.weight = 'Peso deve ser um número positivo.';
    if (formData.height <= 0) newErrors.height = 'Altura deve ser um número positivo.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value }));
  };

  const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors";
  const labelClass = "block mb-2 text-sm font-medium text-gray-400";
  
  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="age" className={labelClass}>Idade</label>
          <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} className={inputClass} required />
          {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
        </div>
        <div>
          <label htmlFor="gender" className={labelClass}>Gênero</label>
          <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
            <option value="Male">Masculino</option>
            <option value="Female">Feminino</option>
          </select>
        </div>
        <div>
          <label htmlFor="weight" className={labelClass}>Peso (kg)</label>
          <input type="number" name="weight" id="weight" value={formData.weight} onChange={handleChange} className={inputClass} required />
           {errors.weight && <p className="text-red-400 text-xs mt-1">{errors.weight}</p>}
        </div>
        <div>
          <label htmlFor="height" className={labelClass}>Altura (cm)</label>
          <input type="number" name="height" id="height" value={formData.height} onChange={handleChange} className={inputClass} required />
          {errors.height && <p className="text-red-400 text-xs mt-1">{errors.height}</p>}
        </div>
        <div>
          <label htmlFor="goal" className={labelClass}>Objetivo Principal</label>
          <select name="goal" id="goal" value={formData.goal} onChange={handleChange} className={inputClass}>
            <option value="Lose weight">Perder peso</option>
            <option value="Maintain weight">Manter peso</option>
            <option value="Gain muscle">Ganhar músculo</option>
          </select>
        </div>
        <div>
          <label htmlFor="difficulty" className={labelClass}>Nível de Dificuldade</label>
          <select name="difficulty" id="difficulty" value={formData.difficulty} onChange={handleChange} className={inputClass}>
            <option value="Beginner">Iniciante</option>
            <option value="Intermediate">Intermediário</option>
            <option value="Advanced">Avançado</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="activityLevel" className={labelClass}>Nível de Atividade Física</label>
          <select name="activityLevel" id="activityLevel" value={formData.activityLevel} onChange={handleChange} className={inputClass}>
            <option value="Sedentary">Sedentário</option>
            <option value="Lightly active">Levemente ativo</option>
            <option value="Moderately active">Moderadamente ativo</option>
            <option value="Very active">Muito ativo</option>
          </select>
        </div>
      </div>
      <div className="mt-8">
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? 'Gerando seu Plano...' : 'Gerar Plano de Treino e Dieta'}
        </button>
      </div>
    </form>
  );
};

export default UserInputForm;