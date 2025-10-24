
import React from 'react';
import SyncStatusIndicator from './SyncStatusIndicator';
import { GINAIcon } from './icons';
import { useAppContext } from '../contexts/AppContext';

const Header: React.FC = () => {
  const { currency, setCurrency } = useAppContext();
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 h-16 flex items-center justify-between px-4">
      <div className="flex items-center space-x-2">
        <GINAIcon className="h-8 w-8 text-blue-600"/>
        <h1 className="text-xl font-bold text-gray-800">GINA Services</h1>
      </div>
      <div className="flex items-center space-x-4">
        <select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value as 'CDF' | 'USD')}
          className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
        >
          <option value="CDF">CDF</option>
          <option value="USD">USD</option>
        </select>
        <SyncStatusIndicator />
      </div>
    </header>
  );
};

export default Header;