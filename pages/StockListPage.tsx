
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

const StockListPage: React.FC = () => {
  const { items } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.odooRef.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <input
        type="text"
        placeholder="Rechercher un article..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {filteredItems.map(item => (
            <li key={item.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">Réf: {item.odooRef}</p>
              </div>
              <div className={`font-bold text-lg ${item.quantity < 50 ? 'text-red-500' : 'text-gray-800'}`}>
                {item.quantity}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StockListPage;
