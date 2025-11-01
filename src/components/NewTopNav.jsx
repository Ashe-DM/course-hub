import { useState } from 'react';
import { Search, Bell, Moon, Sun, Globe, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function NewTopNav({ searchTerm, setSearchTerm }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      type: 'event',
      title: 'Upcoming Event Tomorrow',
      message: 'SEO Research Presentation at 10:00 AM',
      time: '5 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'badge',
      title: 'New Badge Earned! 🏆',
      message: 'You earned the "Week Warrior" badge',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'lesson',
      title: 'Module Updated',
      message: 'New lesson added to Digital Marketing',
      time: '3 hours ago',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-6 sticky top-0 z-40">
      <div className="flex-1 flex items-center justify-between max-w-full">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search modules, roadmaps, events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 ml-6">
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Language Selector */}
          <button
            className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Change Language"
          >
            <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Mark all read
                  </button>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                        notif.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                            {notif.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {notif.message}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {notif.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.avatar || user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.name || 'User'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role || 'Student'}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

export default NewTopNav;