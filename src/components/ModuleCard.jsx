import { FileText, Target } from 'lucide-react'

function ModuleCard({ module, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-200 overflow-hidden group"
    >
      {/* Colored header bar */}
      <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition">
          {module.name}
        </h3>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <FileText className="w-4 h-4" />
            <span>{module.lessons.length} lessons</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span>{module.projects.length} projects</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModuleCard