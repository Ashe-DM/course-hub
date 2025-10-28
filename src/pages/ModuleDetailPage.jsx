import { useState } from 'react'
import { ArrowLeft, BookOpen, FileText, HelpCircle, Plus } from 'lucide-react'

function ModuleDetailPage({ module, onBack, onAddUnit, onSelectUnit }) {
  const [showAddUnitForm, setShowAddUnitForm] = useState(false)
  const [unitTitle, setUnitTitle] = useState('')
  const [unitDescription, setUnitDescription] = useState('')

  const handleAddUnit = () => {
    if (unitTitle.trim()) {
      onAddUnit(module._id, {
        title: unitTitle,
        description: unitDescription
      })
      setUnitTitle('')
      setUnitDescription('')
      setShowAddUnitForm(false)
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{module.name}</h2>
        <p className="text-gray-600">{module.description}</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Units</h3>
        <button
          onClick={() => setShowAddUnitForm(!showAddUnitForm)}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 flex items-center space-x-2 font-medium transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Unit</span>
        </button>
      </div>

      {showAddUnitForm && (
        <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Add New Unit</h4>
          <input
            type="text"
            placeholder="Unit title"
            value={unitTitle}
            onChange={(e) => setUnitTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Unit description"
            value={unitDescription}
            onChange={(e) => setUnitDescription(e.target.value)}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex space-x-3">
            <button
              onClick={handleAddUnit}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setShowAddUnitForm(false)}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {module.units?.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No units yet. Add your first unit above!</p>
          </div>
        ) : (
          module.units?.map((unit) => (
            <div
              key={unit._id}
              onClick={() => onSelectUnit(unit)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer group"
            >
              <h4 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600">
                {unit.title}
              </h4>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{unit.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>{unit.articles?.length || 0} articles</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HelpCircle className="w-4 h-4" />
                  <span>{unit.quizzes?.length || 0} quizzes</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ModuleDetailPage