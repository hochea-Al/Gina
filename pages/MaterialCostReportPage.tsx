
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';

const MaterialCostReportPage: React.FC = () => {
  const { movements, items, formatCurrency } = useAppContext();
  const [chantierLot, setChantierLot] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const exitMovements = movements.filter(m => m.type === 'exit');

  const filteredMovements = useMemo(() => {
    return exitMovements.filter(m => {
      const movementDate = new Date(m.timestamp);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && movementDate < start) return false;
      if (end && movementDate > end) return false;
      if (chantierLot && !m.destinationOrSource.toLowerCase().includes(chantierLot.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [exitMovements, chantierLot, startDate, endDate]);

  const costsByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    let totalCost = 0;

    for (const movement of filteredMovements) {
      const item = items.find(i => i.id === movement.itemId);
      if (item) {
        const cost = movement.quantity * item.unitCost;
        totalCost += cost;
        categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + cost);
      }
    }
    return { categories: Array.from(categoryMap.entries()), total: totalCost };
  }, [filteredMovements, items]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Rapport de Coût Matériel</h1>
      
      <div className="p-4 bg-white rounded-lg shadow-sm space-y-4 md:flex md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Filtrer par chantier/lot..."
          value={chantierLot}
          onChange={e => setChantierLot(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="p-6 bg-blue-600 text-white rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold">Coût Matériel Total</h2>
        <p className="text-4xl font-bold">{formatCurrency(costsByCategory.total)}</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="p-4 text-lg font-semibold border-b">Détails par Catégorie</h3>
        <ul className="divide-y divide-gray-200">
          {costsByCategory.categories.length > 0 ? costsByCategory.categories
            .sort((a,b) => b[1] - a[1])
            .map(([category, cost]) => (
            <li key={category} className="p-4 flex justify-between items-center">
              <p className="font-semibold text-gray-800">{category}</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(cost)}</p>
            </li>
          )) : (
            <li className="p-4 text-center text-gray-500">Aucune donnée pour les filtres sélectionnés.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MaterialCostReportPage;