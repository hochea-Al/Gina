import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CubeIcon, ClipboardListIcon, ClockIcon, ChartBarIcon, BriefcaseIcon, WrenchScrewdriverIcon } from './icons';

const BottomNav: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Accueil', icon: HomeIcon },
    { path: '/stock', label: 'Stock', icon: CubeIcon },
    { path: '/tools', label: 'Outils', icon: WrenchScrewdriverIcon },
    { path: '/projects', label: 'Projets', icon: BriefcaseIcon },
    { path: '/requisitions', label: 'Demandes', icon: ClipboardListIcon },
    { path: '/attendance', label: 'Pointage', icon: ClockIcon },
  ];

  const activeLinkClass = 'text-blue-600';
  const inactiveLinkClass = 'text-gray-500 hover:text-blue-500';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-md z-10">
      <div className="flex justify-around h-16">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full text-xs font-medium transition-colors duration-200 ${
                isActive ? activeLinkClass : inactiveLinkClass
              }`
            }
          >
            <Icon className="h-6 w-6 mb-1" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;