import { useState } from 'react'
import { ArrowLeft, Plus, X, FileText, Target } from 'lucide-react'

function ModuleDetailPage({ module, onBack, onAddLesson, onAddProject }) {
  const [activeTab, setActiveTab] = useState('lessons')
  const [showAddForm, setShowAddForm] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')

  const handleSubmit = () => {
    if (formTitle.trim()) {
      if (activeTab === 'lessons') {
        onAddLesson(module._id, { title: formTitle, description: formDescription })
      } else {
        onAddProject(module._id, { title: formTitle, description: formDescription })
      }
      setFormTitle('')
      setFormDescription('')
      setShowAddForm(false)
    }
  }

  return (
    <div>
      <button 
        onClick={onBack}
        className="text-blue-600 hover:text-blue-700 mb-6 flex items-center space-x-2 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Modules</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{module.name}</h2>
        
        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`pb-4 px-2 font-medium transition relative ${
              activeTab === 'lessons' 
                ? 'text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Lessons ({module.lessons.length})
            {activeTab === 'lessons' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-4 px-2 font-medium transition relative ${
              activeTab === 'projects' 
                ? 'text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Projects ({module.projects.length})
            {activeTab === 'projects' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="mb-6 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 flex items-center space-x-2 font-medium transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add {activeTab === 'lessons' ? 'Lesson' : 'Project'}</span>
        </button>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New {activeTab === 'lessons' ? 'Lesson' : 'Project'}
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              placeholder="Description (optional)"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition"
              >
                Save
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          {activeTab === 'lessons' && (
            <>
              {module.lessons.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No lessons yet. Add your first lesson above!</p>
                </div>
              ) : (
                module.lessons.map((lesson, index) => (
                  <div key={index} className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-blue-200 transition">
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">
                      {lesson.title || lesson}
                    </h4>
                    {lesson.description && (
                      <p className="text-gray-600 text-sm mt-2">{lesson.description}</p>
                    )}
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'projects' && (
            <>
              {module.projects.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No projects yet. Add your first project above!</p>
                </div>
              ) : (
                module.projects.map((project, index) => (
                  <div key={index} className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-blue-200 transition">
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">
                      {project.title || project}
                    </h4>
                    {project.description && (
                      <p className="text-gray-600 text-sm mt-2">{project.description}</p>
                    )}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModuleDetailPage