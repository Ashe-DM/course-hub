import { Home, BookOpen, FileText, Lightbulb, Target } from 'lucide-react'

function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'modules', label: 'My Modules', icon: BookOpen },
    { id: 'lessons', label: 'Lessons', icon: FileText },
    { id: 'extra', label: 'Extra Learning', icon: Lightbulb },
    { id: 'projects', label: 'Projects', icon: Target },
  ]

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Course Hub</h1>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition ${
                currentPage === item.id 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar