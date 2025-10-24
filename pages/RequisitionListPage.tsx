
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { PurchaseRequisition, RequisitionStatus } from '../types';
import { PlusIcon } from '../components/icons';

const RequisitionStatusBadge: React.FC<{ status: RequisitionStatus, odooStatus?: string }> = ({ status, odooStatus }) => {
  let text = '';
  let color = '';

  switch (status) {
    case 'pending':
      text = 'En attente de synchro';
      color = 'bg-amber-100 text-amber-800';
      break;
    case 'synced-waiting':
      text = odooStatus || 'Synchronisé';
      color = odooStatus === 'Approuvée' ? 'bg-green-100 text-green-800' : 
              odooStatus === 'Rejetée' ? 'bg-red-100 text-red-800' : 
              'bg-blue-100 text-blue-800';
      break;
    default:
      text = status;
      color = 'bg-gray-100 text-gray-800';
  }
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>{text}</span>;
};

const RequisitionListPage: React.FC = () => {
  const { requisitions } = useAppContext();
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredRequisitions = useMemo(() => {
    return requisitions
      .filter(req => {
        // Date filtering
        const requisitionDate = new Date(req.timestamp);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && requisitionDate < start) return false;
        if (end && requisitionDate > end) return false;

        // Status filtering
        if (filterStatus === 'all') return true;
        if (filterStatus === 'pending' && req.status === 'pending') return true;
        if (filterStatus === 'synced-waiting-odoo-pending' && req.status === 'synced-waiting' && req.odooStatus === 'En attente') return true;
        if (filterStatus === 'synced-waiting-odoo-approved' && req.status === 'synced-waiting' && req.odooStatus === 'Approuvée') return true;
        if (filterStatus === 'synced-waiting-odoo-rejected' && req.status === 'synced-waiting' && req.odooStatus === 'Rejetée') return true;
        
        return false;
      })
      .sort((a, b) => b.timestamp - a.timestamp); // Sort by date descending
  }, [requisitions, filterStatus, startDate, endDate]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Demandes d'Achat</h1>

      {/* Filter Section */}
      <div className="p-4 bg-white rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 sm:w-1/4">Statut:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-3/4 p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente de synchro</option>
            <option value="synced-waiting-odoo-pending">Synchronisé (En attente Odoo)</option>
            <option value="synced-waiting-odoo-approved">Approuvée</option>
            <option value="synced-waiting-odoo-rejected">Rejetée</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Date de début:</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">Date de fin:</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {filteredRequisitions.length > 0 ? filteredRequisitions
            .map((req: PurchaseRequisition) => (
              <li key={req.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">Demande #{req.id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(req.timestamp).toLocaleDateString()} par {req.siteManager}
                    </p>
                    <p className="text-sm text-gray-500">{req.items.length} article(s)</p>
                  </div>
                  <RequisitionStatusBadge status={req.status} odooStatus={req.odooStatus}/>
                </div>
              </li>
          )) : (
            <li className="p-4 text-center text-gray-500">Aucune demande d'achat ne correspond aux filtres.</li>
          )}
        </ul>
      </div>
      <button
        onClick={() => navigate('/requisitions/new')}
        className="fixed bottom-20 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        aria-label="Nouvelle demande"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default RequisitionListPage;
