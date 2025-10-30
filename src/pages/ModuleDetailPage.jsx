import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Settings, Plus } from 'lucide-react';
import { getModuleById, addWeek } from '../api/moduleApi';
import ItemManager from '../components/ItemManager';

function ModuleDetailPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showItemManager, setShowItemManager] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showAddUnitForm, setShowAddUnitForm] = useState(false);
  const [newUnitData, setNewUnitData] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      const data = await getModuleById(moduleId);
      setModule(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching module:', error);
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    if (module.units && module.units.length > 0) {
      const firstUnit = module.units[0];
      if (firstUnit.items && firstUnit.items.length > 0) {
        const firstItem = firstUnit.items[0];
        navigate(`/modules/${moduleId}/learn/${firstUnit._id}/${firstItem._id}`);
      } else {
        alert('This unit has no content yet.');
      }
    } else {
      alert('This module has no content yet. Please check back later.');
    }
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();
    try {
      const newModule = await addWeek(moduleId, newUnitData);
      setModule(newModule);
      setNewUnitData({ title: '', description: '' });
      setShowAddUnitForm(false);
      
      // Auto-open the item manager for the new unit
      const newUnit = newModule.units[newModule.units.length - 1];
      setSelectedUnit(newUnit);
      setShowItemManager(true);
    } catch (error) {
      console.error('Error adding unit:', error);
      alert('Failed to create unit: ' + error.message);
    }
  };

  const handleManageItems = (unit) => {
    setSelectedUnit(unit);
    setShowItemManager(true);
  };

  const handleItemUpdated = async () => {
    // Refresh module data
    await fetchModule();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Module not found</div>
      </div>
    );
  }

  const moduleTitle = module.title || module.name;
  const totalWeeks = module.units?.length || 0;
  const totalItems = module.units?.reduce((sum, week) => sum + (week.items?.length || 0), 0) || 0;
  const totalAssessments = module.units?.reduce((sum, week) => 
    sum + (week.items?.filter(item => item.type === 'test' || item.type === 'quiz').length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/modules')}
          className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back to Modules
        </button>

        {/* Module Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div 
            className="h-56 bg-cover bg-center flex items-center justify-center relative"
            style={{ 
              backgroundImage: module.imageUrl ? `url(${module.imageUrl})` : 'none',
              backgroundColor: module.imageUrl ? 'transparent' : '#4F46E5'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <BookOpen className="w-24 h-24 text-white relative z-10" strokeWidth={1.5} />
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {moduleTitle}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {module.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-10 pb-8 border-b border-gray-200">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">{totalWeeks}</div>
                <div className="text-sm text-gray-600">Units</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">{totalItems}</div>
                <div className="text-sm text-gray-600">Learning Items</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">{totalAssessments}</div>
                <div className="text-sm text-gray-600">Assessments</div>
              </div>
            </div>

            {/* Start Learning Button */}
            <button
              onClick={handleGetStarted}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!module.units || module.units.length === 0}
            >
              {(!module.units || module.units.length === 0) ? 'No Content Available' : 'Start Learning'}
            </button>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
              <button
                onClick={() => setShowAddUnitForm(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Unit</span>
              </button>
            </div>

            {/* Add Unit Form */}
            {showAddUnitForm && (
              <form onSubmit={handleAddUnit} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-3">Create New Unit</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Title *</label>
                    <input
                      type="text"
                      value={newUnitData.title}
                      onChange={(e) => setNewUnitData({ ...newUnitData, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                      placeholder="e.g., Introduction to SEO"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={newUnitData.description}
                      onChange={(e) => setNewUnitData({ ...newUnitData, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Brief description of this unit"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Create Unit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddUnitForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Units List */}
            <div className="space-y-4">
              {module.units?.map((unit, index) => (
                <div key={unit._id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Unit {index + 1}: {unit.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{unit.description}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        {unit.items?.length || 0} items • {((unit.items?.length || 0) * 15)} min
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleManageItems(unit)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    title="Manage items in this unit"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Manage Items</span>
                  </button>
                </div>
              ))}

              {(!module.units || module.units.length === 0) && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="mb-2">No units created yet.</p>
                  <p className="text-sm">Click "Add Unit" above to create your first unit.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Item Manager Modal */}
        {showItemManager && selectedUnit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Manage Items in "{selectedUnit.title}"</h3>
                  <button
                    onClick={() => {
                      setShowItemManager(false);
                      setSelectedUnit(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <ItemManager
                  moduleId={moduleId}
                  unit={selectedUnit}
                  onItemUpdated={handleItemUpdated}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModuleDetailPage;