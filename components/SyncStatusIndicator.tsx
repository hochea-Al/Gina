
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { CloudIcon, CloudOffIcon } from './icons';

const SyncStatusIndicator: React.FC = () => {
  const { isOnline, pendingSyncs } = useAppContext();

  const statusText = isOnline ? 'En ligne' : 'Hors ligne';
  const statusColor = isOnline ? 'text-green-500' : 'text-gray-500';

  return (
    <div className="flex items-center space-x-2">
      {pendingSyncs > 0 && (
        <div className="flex items-center text-sm font-medium text-amber-600 bg-amber-100 rounded-full px-2 py-1">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-amber-600 mr-2"></div>
          {pendingSyncs} en attente
        </div>
      )}
      <div className={`flex items-center text-sm font-semibold ${statusColor}`}>
        {isOnline ? (
          <CloudIcon className="h-5 w-5 mr-1" />
        ) : (
          <CloudOffIcon className="h-5 w-5 mr-1" />
        )}
        <span>{statusText}</span>
      </div>
    </div>
  );
};

export default SyncStatusIndicator;
