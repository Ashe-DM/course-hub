import { Home, BookOpen, FileText, Lightbulb, LogOut } from 'lucide-react'
import { useUser } from '../context/UserContext';

function Sidebar({ currentPage, setCurrentPage }) {
  const { logout } = useUser();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'modules', label: 'My Modules', icon: BookOpen },
    { id: 'lessons', label: 'All Content', icon: FileText },
    { id: 'extra', label: 'Resources', icon: Lightbulb },
  ]

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-screen shadow-lg border-r border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Digital Marketing Hub</h1>
        </div>
      </div>

      <nav className="p-4 space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition ${
                currentPage === item.id 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
      <button 
        onClick={logout} 
        className="w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mt-4"
      >
        <LogOut className="w-5 h-5" />
        <span>Sign Out</span>
      </button>
    </div>
  )
}

export default Sidebar