
import React, 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppContext } from '../contexts/AppContext';
import { MovementType } from '../types';

interface IFormInput {
  itemId: string;
  quantity: number;
  operator: string;
  destinationOrSource: string;
}

const StockMovementPage: React.FC = () => {
  const { type } = useParams<{ type: MovementType }>();
  const navigate = useNavigate();
  const { items, addStockMovement } = useAppContext();
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

  const isEntry = type === 'entry';
  const title = isEntry ? 'Enregistrer une Entrée' : 'Enregistrer une Sortie';
  const sourceLabel = isEntry ? 'Fournisseur' : 'Destination';
  const sourcePlaceholder = isEntry ? 'Nom du fournisseur' : 'ex: Chantier A, Lot 3';

  const onSubmit: SubmitHandler<IFormInput> = data => {
    addStockMovement({
      ...data,
      quantity: Number(data.quantity),
      type: type!,
    });
    navigate('/stock');
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="itemId" className="block text-sm font-medium text-gray-700">Article</label>
          <select
            id="itemId"
            {...register('itemId', { required: 'Article requis' })}
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sélectionner un article</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>{item.name} (En stock: {item.quantity})</option>
            ))}
          </select>
          {errors.itemId && <p className="text-red-500 text-xs mt-1">{errors.itemId.message}</p>}
        </div>
        
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantité</label>
          <input
            id="quantity"
            type="number"
            {...register('quantity', { required: 'Quantité requise', min: { value: 1, message: 'Doit être positif' } })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
        </div>

        <div>
          <label htmlFor="destinationOrSource" className="block text-sm font-medium text-gray-700">{sourceLabel}</label>
          <input
            id="destinationOrSource"
            type="text"
            placeholder={sourcePlaceholder}
            {...register('destinationOrSource', { required: `${sourceLabel} requis` })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.destinationOrSource && <p className="text-red-500 text-xs mt-1">{errors.destinationOrSource.message}</p>}
        </div>

        <div>
          <label htmlFor="operator" className="block text-sm font-medium text-gray-700">Opérateur</label>
          <input
            id="operator"
            type="text"
            placeholder="Votre nom"
            {...register('operator', { required: 'Opérateur requis' })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.operator && <p className="text-red-500 text-xs mt-1">{errors.operator.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Valider
        </button>
      </form>
    </div>
  );
};

export default StockMovementPage;
