import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ToolStatus, ToolCondition } from '../types';

const ToolStatusBadge: React.FC<{ status: ToolStatus }> = ({ status }) => {
  const statusConfig = {
    available: { text: 'Disponible', color: 'bg-green-100 text-green-800' },
    in_use: { text: 'En utilisation', color: 'bg-blue-100 text-blue-800' },
    in_maintenance: { text: 'En maintenance', color: 'bg-yellow-100 text-yellow-800' },
    lost: { text: 'Perdu', color: 'bg-red-100 text-red-800' },
  };
  const config = statusConfig[status] || { text: 'Inconnu', color: 'bg-gray-100 text-gray-800' };
  return <span className={`px-2 py-1 text-sm font-semibold rounded-full ${config.color}`}>{config.text}</span>;
};

const ToolDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getToolById, updateTool, employees, getEmployeeById } = useAppContext();
    const tool = getToolById(id!);

    const [assignee, setAssignee] = useState(tool?.assignedTo || '');

    if (!tool) {
        return (
          <div className="p-4 text-center">
            <h1 className="text-xl font-bold text-red-500">Outil non trouvé</h1>
            <Link to="/tools" className="text-blue-600 hover:underline mt-4 inline-block">Retour à la liste</Link>
          </div>
        );
    }

    const handleStatusChange = (newStatus: ToolStatus) => {
        let updates: Partial<Omit<typeof tool, 'id'>> = { status: newStatus };
        if (newStatus === 'available' || newStatus === 'lost') {
            updates.assignedTo = undefined;
        }
        if (newStatus === 'in_maintenance') {
            updates.lastMaintenanceDate = Date.now();
        }
        updateTool(tool.id, updates);
    };

    const handleAssign = () => {
        if(assignee) {
            updateTool(tool.id, { status: 'in_use', assignedTo: assignee });
        }
    };
    
    const conditionLabels: Record<ToolCondition, string> = {
      new: 'Neuf',
      good: 'Bon',
      fair: 'Moyen',
      poor: 'Mauvais'
    };

    const assignedEmployee = tool.assignedTo ? getEmployeeById(tool.assignedTo) : null;

    return (
        <div className="p-4 space-y-6 bg-gray-50 min-h-full">
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{tool.name}</h1>
                        <p className="text-sm text-gray-500">Tag: {tool.assetTag}</p>
                    </div>
                    <ToolStatusBadge status={tool.status} />
                </div>
                {assignedEmployee && (
                    <p className="mt-2 text-md text-gray-700">Assigné à: <span className="font-semibold">{assignedEmployee.name}</span></p>
                )}
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-2">Détails</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><strong>Catégorie:</strong> {tool.category}</p>
                    {/* FIX: Corrected the corrupted line below to display tool condition. */}
                    <p><strong>Condition:</strong> {conditionLabels[tool.condition]}</p>
                    <p><strong>Acheté le:</strong> {new Date(tool.purchaseDate).toLocaleDateString()}</p>
                    {tool.lastMaintenanceDate && (
                        <p><strong>Dernière maintenance:</strong> {new Date(tool.lastMaintenanceDate).toLocaleDateString()}</p>
                    )}
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-2">Actions</h3>
                {tool.status === 'available' && (
                    <div className="space-y-2">
                        <select value={assignee} onChange={e => setAssignee(e.target.value)} className="w-full p-2 border rounded-md">
                            <option value="">Sélectionner un employé</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                        <button onClick={handleAssign} disabled={!assignee} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                            Assigner
                        </button>
                    </div>
                )}
                 {tool.status === 'in_use' && (
                    <button onClick={() => handleStatusChange('available')} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">
                        Retourner au stock
                    </button>
                 )}
                 {(tool.status === 'available' || tool.status === 'in_use') && (
                     <button onClick={() => handleStatusChange('in_maintenance')} className="mt-2 w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600">
                        Mettre en maintenance
                    </button>
                 )}
                 {tool.status === 'in_maintenance' && (
                     <button onClick={() => handleStatusChange('available')} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">
                        Terminer la maintenance
                    </button>
                 )}
                 {tool.status !== 'lost' && (
                    <button onClick={() => handleStatusChange('lost')} className="mt-2 w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                        Déclarer perdu
                    </button>
                 )}
            </div>
        </div>
    );
};

// FIX: Add missing default export.
export default ToolDetailPage;