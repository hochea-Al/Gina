import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppContext } from '../contexts/AppContext';
import { ToolCondition } from '../types';

interface IFormInput {
  name: string;
  assetTag: string;
  category: string;
  purchaseDate: string;
  condition: ToolCondition;
}

const AddToolPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTool } = useAppContext();
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = data => {
    addTool({
      ...data,
      purchaseDate: new Date(data.purchaseDate).getTime(),
      status: 'available', // Newly added tools are available by default
    });
    navigate('/tools');
  };
  
  const conditionOptions: ToolCondition[] = ['new', 'good', 'fair', 'poor'];
  const conditionLabels: Record<ToolCondition, string> = {
      new: 'Neuf',
      good: 'Bon',
      fair: 'Moyen',
      poor: 'Mauvais'
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ajouter un Nouvel Outil</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom de l'outil</label>
          <input id="name" type="text" {...register('name', { required: 'Le nom est requis' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="assetTag" className="block text-sm font-medium text-gray-700">N° de série / Tag</label>
          <input id="assetTag" type="text" {...register('assetTag', { required: 'Le tag est requis' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
          {errors.assetTag && <p className="text-red-500 text-xs mt-1">{errors.assetTag.message}</p>}
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Catégorie</label>
          <input id="category" type="text" {...register('category', { required: 'La catégorie est requise' })} placeholder="ex: Électroportatif, Main, Mesure" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>
        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">Date d'achat</label>
          <input id="purchaseDate" type="date" {...register('purchaseDate', { required: "La date d'achat est requise" })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
          {errors.purchaseDate && <p className="text-red-500 text-xs mt-1">{errors.purchaseDate.message}</p>}
        </div>
         <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
          <select id="condition" {...register('condition', { required: 'La condition est requise' })} className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm">
            {conditionOptions.map(opt => (
                <option key={opt} value={opt}>{conditionLabels[opt]}</option>
            ))}
          </select>
          {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Ajouter l'Outil
        </button>
      </form>
    </div>
  );
};

export default AddToolPage;