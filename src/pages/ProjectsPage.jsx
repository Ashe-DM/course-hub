import { Target } from 'lucide-react'

function ProjectsPage({ modules }) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">All Projects</h2>
        <p className="text-gray-600">View all projects across your modules</p>
      </div>

      <div className="space-y-6">
        {modules.map(module => (
          <div key={module._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>{module.name}</span>
            </h3>
            {module.projects.length === 0 ? (
              <p className="text-gray-500 text-sm">No projects yet</p>
            ) : (
              <div className="space-y-3">
                {module.projects.map((project, index) => (
                  <div key={project._id || index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900">
                      {project.title || project}
                    </h4>
                    {project.description && (
                      <p className="text-gray-600 text-sm mt-2">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage