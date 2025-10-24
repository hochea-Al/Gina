import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppContext } from '../contexts/AppContext';
import { Project, ProjectStatus } from '../types';

interface IFormInput {
  name: string;
  reference: string;
  clientName: string;
  address: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  budget?: number;
}

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { addProject, currency } = useAppContext();
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({
    defaultValues: {
      status: 'draft',
    }
  });

  const onSubmit: SubmitHandler<IFormInput> = data => {
    addProject({
      ...data,
      startDate: new Date(data.startDate).getTime(),
      endDate: data.endDate ? new Date(data.endDate).getTime() : undefined,
      budget: data.budget ? Number(data.budget) : undefined,
    });
    navigate('/projects');
  };

  const statusOptions: ProjectStatus[] = ['draft', 'in_progress', 'on_hold', 'completed', 'cancelled'];
  const statusLabels: Record<ProjectStatus, string> = {
    draft: 'Brouillon',
    in_progress: 'En cours',
    on_hold: 'En pause',
    completed: 'Terminé',
    cancelled: 'Annulé',
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouveau Projet / Chantier</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du projet</label>
          <input id="name" type="text" {...register('name', { required: 'Le nom est requis' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700">Référence</label>
          <input id="reference" type="text" {...register('reference', { required: 'La référence est requise' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
          {errors.reference && <p className="text-red-500 text-xs mt-1">{errors.reference.message}</p>}
        </div>
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Nom du client</label>
          <input id="clientName" type="text" {...register('clientName', { required: 'Le client est requis' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
          {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName.message}</p>}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
          <input id="address" type="text" {...register('address', { required: "L'adresse est requise" })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Date de début</label>
            <input id="startDate" type="date" {...register('startDate', { required: 'La date de début est requise' })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Date de fin (optionnel)</label>
            <input id="endDate" type="date" {...register('endDate')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut</label>
          <select
            id="status"
            {...register('status', { required: 'Le statut est requis' })}
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{statusLabels[status]}</option>
            ))}
          </select>
          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
        </div>
        
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget (optionnel, en {currency})</label>
          <input id="budget" type="number" step="any" {...register('budget')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder={`ex: ${currency === 'CDF' ? 420000000 : 150000}`} />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Créer le Projet
        </button>
      </form>
    </div>
  );
};

export default CreateProjectPage;