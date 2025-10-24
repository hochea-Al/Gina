import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ProjectStatus } from '../types';

const ProjectStatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  const statusConfig = {
    draft: { text: 'Brouillon', color: 'bg-gray-200 text-gray-800' },
    in_progress: { text: 'En cours', color: 'bg-blue-200 text-blue-800' },
    completed: { text: 'Terminé', color: 'bg-green-200 text-green-800' },
    on_hold: { text: 'En pause', color: 'bg-yellow-200 text-yellow-800' },
    cancelled: { text: 'Annulé', color: 'bg-red-200 text-red-800' },
  };
  const config = statusConfig[status] || statusConfig.draft;
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>{config.text}</span>;
};

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, movements, items, formatCurrency } = useAppContext();
  const project = getProjectById(id!);

  const materialCosts = useMemo(() => {
    if (!project) return { total: 0, details: [] };

    const projectMovements = movements.filter(m =>
      m.type === 'exit' &&
      (m.destinationOrSource.toLowerCase().includes(project.name.toLowerCase()) || m.destinationOrSource.toLowerCase().includes(project.reference.toLowerCase()))
    );

    let totalCost = 0;
    const costDetails = projectMovements.map(movement => {
      const item = items.find(i => i.id === movement.itemId);
      if (!item) return null;
      const cost = movement.quantity * item.unitCost;
      totalCost += cost;
      return {
        ...movement,
        itemName: item.name,
        itemCost: cost,
      };
    }).filter((detail): detail is NonNullable<typeof detail> => detail !== null);

    return { total: totalCost, details: costDetails };
  }, [project, movements, items]);

  if (!project) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold text-red-500">Projet non trouvé</h1>
        <Link to="/projects" className="text-blue-600 hover:underline mt-4 inline-block">Retour à la liste des projets</Link>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-full">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
                <p className="text-sm text-gray-500">{project.reference}</p>
            </div>
            <ProjectStatusBadge status={project.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-2">Informations Client</h3>
            <p><strong>Client:</strong> {project.clientName}</p>
            <p><strong>Adresse:</strong> {project.address}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-2">Dates & Budget</h3>
            <p><strong>Début:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
            <p><strong>Fin:</strong> {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Budget:</strong> {project.budget ? formatCurrency(project.budget) : 'N/A'}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">Coûts Matériels</h2>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(materialCosts.total)}</p>
        </div>
        <ul className="divide-y divide-gray-200">
          {materialCosts.details.length > 0 ? materialCosts.details.map((detail) => (
            <li key={detail.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{detail.itemName}</p>
                <p className="text-sm text-gray-500">
                    {detail.quantity} unités le {new Date(detail.timestamp).toLocaleDateString()}
                </p>
              </div>
              <p className="font-semibold text-gray-800">{formatCurrency(detail.itemCost)}</p>
            </li>
          )) : (
            <li className="p-4 text-center text-gray-500">Aucune consommation de matériel enregistrée pour ce projet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProjectDetailPage;