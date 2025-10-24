import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Project, ProjectStatus } from '../types';
import { PlusIcon } from '../components/icons';

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

const ProjectListPage: React.FC = () => {
  const { projects } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project: Project) => (
            <Link to={`/projects/${project.id}`} key={project.id} className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-gray-800">{project.name}</h2>
                  <p className="text-sm text-gray-500">{project.reference}</p>
                </div>
                <ProjectStatusBadge status={project.status} />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Client:</strong> {project.clientName}</p>
                <p><strong>Adresse:</strong> {project.address}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Aucun projet</h3>
          <p className="text-gray-500 mt-2">Commencez par créer votre premier projet.</p>
        </div>
      )}
      <button
        onClick={() => navigate('/projects/new')}
        className="fixed bottom-20 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        aria-label="Nouveau projet"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ProjectListPage;
