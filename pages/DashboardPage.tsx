
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { CubeIcon, PlusIcon, ClipboardListIcon, ClockIcon, ChartBarIcon, BriefcaseIcon, WrenchScrewdriverIcon, ChartPieIcon } from '../components/icons';

const DashboardPage: React.FC = () => {
  const { items, requisitions, projects, tools } = useAppContext();
  const lowStockItems = items.filter(item => item.quantity < 50).length;
  const pendingRequisitions = requisitions.filter(r => r.status !== 'approved' && r.status !== 'rejected').length;
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const toolsInUse = tools.filter(t => t.status === 'in_use').length;
  const toolsInMaintenance = tools.filter(t => t.status === 'in_maintenance').length;


  const quickActions = [
    { label: 'Entrée Stock', path: '/stock-movement/entry', icon: PlusIcon },
    { label: 'Sortie Stock', path: '/stock-movement/exit', icon: PlusIcon },
    { label: 'Nouvel Outil', path: '/tools/new', icon: WrenchScrewdriverIcon },
    { label: 'Nouveau Projet', path: '/projects/new', icon: BriefcaseIcon },
    { label: 'Demande Achat', path: '/requisitions/new', icon: ClipboardListIcon },
  ];

  const infoCards = [
    { label: 'Projets en cours', value: activeProjects, path: '/projects', color: 'bg-blue-500' },
    { label: 'Demandes en attente', value: pendingRequisitions, path: '/requisitions', color: 'bg-amber-500' },
    { label: 'Stock Faible', value: lowStockItems, path: '/stock', color: 'bg-red-500' },
    { label: 'Outils en Utilisation', value: toolsInUse, path: '/tools', color: 'bg-green-500' },
    { label: 'Outils en Maintenance', value: toolsInMaintenance, path: '/tools', color: 'bg-orange-500' },
  ];

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {infoCards.map(card => (
          <Link to={card.path} key={card.label} className={`p-4 rounded-lg shadow-sm text-white ${card.color}`}>
            <div className="text-3xl font-bold">{card.value}</div>
            <div className="text-sm font-medium">{card.label}</div>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Actions Rapides</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {quickActions.map(action => (
            <Link to={action.path} key={action.label} className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
              <action.icon className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-semibold text-gray-800 text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
       <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Rapports</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <Link to="/costs" className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
              <ChartBarIcon className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="text-md font-semibold text-gray-800">Coût Matériel Chantier</h3>
                <p className="text-sm text-gray-500">Consulter les coûts par lot</p>
              </div>
            </Link>
            <Link to="/reports" className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
              <CubeIcon className="h-8 w-8 text-indigo-600 mr-4" />
              <div>
                <h3 className="text-md font-semibold text-gray-800">Inventaire Détaillé</h3>
                <p className="text-sm text-gray-500">Filtrer par stock et catégorie</p>
              </div>
            </Link>
            <Link to="/stock-visualization" className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
              <ChartPieIcon className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <h3 className="text-md font-semibold text-gray-800">Visualisation du Stock</h3>
                <p className="text-sm text-gray-500">Voir la répartition par catégorie</p>
              </div>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;