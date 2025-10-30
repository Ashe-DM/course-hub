import ModuleCard from '../components/ModuleCard'
import { Search, BookOpen, FileText } from 'lucide-react'

function ModulesPage({ modules, setSelectedModule, setCurrentPage, searchTerm, setSearchTerm }) {
  // Safety check - ensure modules is an array
  const moduleList = Array.isArray(modules) ? modules : []
  
  const filteredModules = moduleList.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalUnits = moduleList.reduce((sum, module) => sum + (module.units?.length || 0), 0)
  const totalArticles = moduleList.reduce((sum, module) => 
    sum + (module.units?.reduce((s, u) => s + (u.items?.length || 0), 0) || 0), 0
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Digital Marketing Hub</h2>
        <nav className="space-y-4">
          <div className="text-blue-600 font-medium">Dashboard</div>
          <div className="text-gray-700">My Modules</div>
          <div className="text-gray-700">All Content</div>
        </nav>
        
        {/* Database section in sidebar */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Database</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>ares</div>
            <div>digital marketing</div>
            <div>Updated recently</div>
            <div>Updated recently</div>
          </div>
        </div>

        {/* Additional sidebar content from your screenshot */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Database</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="font-medium">0.0 mills</div>
            <div>0.5 mills</div>
            <div>0.8 mills</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Modules</h2>
          <p className="text-gray-600">Digital Marketing courses and content</p>
        </div>

        {!searchTerm && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Modules</p>
                  <p className="text-2xl font-bold text-gray-900">{modules.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Units</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUnits}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Articles</p>
                  <p className="text-2xl font-bold text-gray-900">{totalArticles}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {searchTerm && (
          <div className="mb-4 text-sm text-gray-600">
            Found {filteredModules.length} result{filteredModules.length !== 1 ? 's' : ''} for "{searchTerm}"
          </div>
        )}
        
        {filteredModules.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No modules found</h3>
            <p className="text-gray-500 mb-4">Try a different search term</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map(module => (
              <ModuleCard 
                key={module._id}
                module={module}
                onClick={() => {
                  setSelectedModule(module)
                  setCurrentPage('moduleDetail')
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ModulesPage