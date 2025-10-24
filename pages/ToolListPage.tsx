import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Tool, ToolStatus } from '../types';
import { PlusIcon } from '../components/icons';

const ToolStatusBadge: React.FC<{ status: ToolStatus }> = ({ status }) => {
  const statusConfig = {
    available: { text: 'Disponible', color: 'bg-green-100 text-green-800' },
    in_use: { text: 'En utilisation', color: 'bg-blue-100 text-blue-800' },
    in_maintenance: { text: 'En maintenance', color: 'bg-yellow-100 text-yellow-800' },
    lost: { text: 'Perdu', color: 'bg-red-100 text-red-800' },
  };
  const config = statusConfig[status] || { text: 'Inconnu', color: 'bg-gray-100 text-gray-800' };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>{config.text}</span>;
};

const ToolListPage: React.FC = () => {
  const { tools } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.assetTag.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="p-4 space-y-4">
      <input
        type="text"
        placeholder="Rechercher un outil..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {filteredTools.length > 0 ? filteredTools.map((tool: Tool) => (
            <li key={tool.id}>
              <Link to={`/tools/${tool.id}`} className="block p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{tool.name}</p>
                    <p className="text-sm text-gray-500">Tag: {tool.assetTag}</p>
                  </div>
                  <ToolStatusBadge status={tool.status} />
                </div>
              </Link>
            </li>
          )) : (
            <li className="p-4 text-center text-gray-500">Aucun outil trouvé.</li>
          )}
        </ul>
      </div>
      <button
        onClick={() => navigate('/tools/new')}
        className="fixed bottom-20 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        aria-label="Nouvel outil"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ToolListPage;