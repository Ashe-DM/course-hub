// NewSidebar.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Map, Calendar, MessageSquare, 
  Users, Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useUser } from '../context/UserContext';

function NewSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isMentor, isAdmin } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/dashboard',
      roles: ['student', 'mentor', 'admin']
    },
    { 
      id: 'modules', 
      label: 'Modules', 
      icon: BookOpen, 
      path: '/modules',
      roles: ['student', 'mentor', 'admin']
    },
    { 
      id: 'roadmaps', 
      label: 'Roadmaps', 
      icon: Map, 
      path: '/roadmaps',
      roles: ['student', 'mentor', 'admin']
    },
    { 
      id: 'events', 
      label: 'Events', 
      icon: Calendar, 
      path: '/events',
      roles: ['student', 'mentor', 'admin']
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: MessageSquare, 
      path: '/messages',
      roles: ['student', 'mentor', 'admin'],
      badge: 3 // Unread count
    },
    { 
      id: 'students', 
      label: 'Students', 
      icon: Users, 
      path: '/students',
      roles: ['mentor', 'admin']
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      path: '/settings',
      roles: ['admin']
    },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'student')
  );

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 h-screen border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300`}>
      
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">DM Hub</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Learning Platform</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              {!collapsed && (
                <span className="flex-1 text-left">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.avatar || user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role || 'Student'}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Sign Out' : ''}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full mt-2 flex items-center justify-center px-4 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default NewSidebar;