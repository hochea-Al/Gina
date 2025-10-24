
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { useAppContext } from '../contexts/AppContext';
import { RequisitionItem } from '../types';
import { PlusIcon } from '../components/icons';

interface IFormInput {
  siteManager: string;
  items: RequisitionItem[];
}

const CreateRequisitionPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, addRequisition } = useAppContext();
  const { register, control, handleSubmit, formState: { errors } } = useForm<IFormInput>({
    defaultValues: { items: [{ itemId: '', quantity: 1 }] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const onSubmit: SubmitHandler<IFormInput> = data => {
    addRequisition({
      ...data,
      items: data.items.map(item => ({ ...item, quantity: Number(item.quantity) }))
    });
    navigate('/requisitions');
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouvelle Demande d'Achat</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="siteManager" className="block text-sm font-medium text-gray-700">Chef de Site</label>
          <input
            id="siteManager"
            type="text"
            placeholder="Votre nom"
            {...register('siteManager', { required: 'Chef de site requis' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.siteManager && <p className="text-red-500 text-xs mt-1">{errors.siteManager.message}</p>}
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-800">Articles</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start space-x-2 mt-2 p-3 border rounded-md">
              <div className="flex-grow space-y-2">
                <select
                  {...register(`items.${index}.itemId`, { required: true })}
                  className="block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un article</option>
                  {items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                <input
                  type="number"
                  {...register(`items.${index}.quantity`, { required: true, min: 1 })}
                  defaultValue={1}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button type="button" onClick={() => remove(index)} className="mt-1 text-red-500 hover:text-red-700 p-2">
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ itemId: '', quantity: 1 })}
            className="mt-2 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Ajouter un article
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Soumettre la Demande
        </button>
      </form>
    </div>
  );
};

export default CreateRequisitionPage;
