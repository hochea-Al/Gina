
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';

const InventoryReportPage: React.FC = () => {
  const { items, formatCurrency } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'low'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const uniqueCategories = useMemo(() => ['all', ...new Set(items.map(item => item.category))], [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const isLowStock = item.quantity < 50;
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
      
      if (filter === 'low' && !isLowStock) {
        return false;
      }
      return categoryMatch;
    });
  }, [items, filter, selectedCategory]);

  const totalStockValue = useMemo(() => 
    items.reduce((acc, item) => acc + item.quantity * item.unitCost, 0),
  [items]);

  const lowStockCount = useMemo(() => 
    items.filter(item => item.quantity < 50).length,
  [items]);

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold text-gray-800">Rapport d'Inventaire</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Valeur Totale du Stock</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalStockValue)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Articles Distincts</h3>
          <p className="text-2xl font-bold text-gray-900">{items.length}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Articles en Stock Faible</h3>
          <p className="text-2xl font-bold text-red-500">{lowStockCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white rounded-lg shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <span className="text-sm font-medium text-gray-700 mr-2">Filtres:</span>
            <button 
              onClick={() => setFilter('all')} 
              className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Tous
            </button>
            <button 
              onClick={() => setFilter('low')}
              className={`ml-2 px-3 py-1 text-sm rounded-full ${filter === 'low' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Stock Faible
            </button>
          </div>
          <select 
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'Toutes les catégories' : cat}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Items List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {filteredItems.length > 0 ? filteredItems.map(item => (
            <li key={item.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">Réf: {item.odooRef} | Cat: {item.category}</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(item.unitCost)}/unité - Valeur: {formatCurrency(item.quantity * item.unitCost)}
                </p>
              </div>
              <div className={`text-right font-bold text-lg ${item.quantity < 50 ? 'text-red-500' : 'text-gray-800'}`}>
                {item.quantity}
                <span className="block text-xs font-normal text-gray-500">en stock</span>
              </div>
            </li>
          )) : (
             <li className="p-4 text-center text-gray-500">Aucun article ne correspond aux filtres.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default InventoryReportPage;