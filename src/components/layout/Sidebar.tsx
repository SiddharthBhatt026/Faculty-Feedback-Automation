import React from 'react';
import { LayoutDashboard, FileText, BarChart3, CheckSquare, MessageSquare, Settings, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  isActive = false, 
  onClick 
}) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`
          w-full flex items-center py-2 px-4 rounded-md text-sm font-medium transition-colors
          ${isActive 
            ? 'bg-blue-50 text-blue-700' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </button>
    </li>
  );
};

interface SidebarProps {
  onItemClick: (item: string) => void;
  activeItem: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick, activeItem }) => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const isFaculty = currentUser?.role === 'faculty';
  const isStudent = currentUser?.role === 'student';

  return (
    <aside className="hidden sm:block w-64 bg-white h-screen border-r border-gray-200 sticky top-16 pt-6">
      <nav className="px-3">
        <ul className="space-y-1">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            isActive={activeItem === 'dashboard'}
            onClick={() => onItemClick('dashboard')}
          />
          
          {(isAdmin || isFaculty) && (
            <SidebarItem
              icon={<FileText size={20} />}
              label="Feedback Forms"
              isActive={activeItem === 'forms'}
              onClick={() => onItemClick('forms')}
            />
          )}
          
          {isStudent && (
            <SidebarItem
              icon={<MessageSquare size={20} />}
              label="Submit Feedback"
              isActive={activeItem === 'submit'}
              onClick={() => onItemClick('submit')}
            />
          )}
          
          {(isAdmin || isFaculty) && (
            <SidebarItem
              icon={<BarChart3 size={20} />}
              label="Analytics"
              isActive={activeItem === 'analytics'}
              onClick={() => onItemClick('analytics')}
            />
          )}
          
          {(isAdmin || isFaculty) && (
            <SidebarItem
              icon={<CheckSquare size={20} />}
              label="Action Items"
              isActive={activeItem === 'actions'}
              onClick={() => onItemClick('actions')}
            />
          )}
        </ul>
        
        {isAdmin && (
          <>
            <div className="mt-8 mb-4 px-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Administration
              </p>
            </div>
            <ul className="space-y-1">
              <SidebarItem
                icon={<Users size={20} />}
                label="Users"
                isActive={activeItem === 'users'}
                onClick={() => onItemClick('users')}
              />
              <SidebarItem
                icon={<Settings size={20} />}
                label="Settings"
                isActive={activeItem === 'settings'}
                onClick={() => onItemClick('settings')}
              />
            </ul>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;