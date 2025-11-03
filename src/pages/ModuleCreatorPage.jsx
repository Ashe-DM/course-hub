// ModuleCreatorPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Plus, Trash2, Edit, ChevronDown, ChevronUp,
  BookOpen, Video, FileText, CheckSquare, Code, GripVertical
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { createModule, getModuleById, updateModule, addUnit } from '../api/moduleApi';
import RichTextEditor from '../components/RichTextEditor';
import AdvancedEditorWrapper from '../components/AdvancedEditorWrapper';

function ModuleCreatorPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user, isMentor, isAdmin } = useUser();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState([0]);

  // Module data
  const [moduleData, setModuleData] = useState({
    title: '',
    description: '',
    category: 'Digital Marketing',
    imageUrl: '',
    totalMinutes: 0,
    units: []
  });

  // Current editing state
  const [editingItem, setEditingItem] = useState(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [currentUnitIndex, setCurrentUnitIndex] = useState(null);

  // Item form data
  const [itemFormData, setItemFormData] = useState({
    type: 'reading',
    title: '',
    duration: '',
    content: '',
    videoUrl: '',
    questions: []
  });

  // Check permissions
  useEffect(() => {
    if (!isMentor() && !isAdmin()) {
      alert('You need mentor or admin privileges to create modules');
      navigate('/dashboard');
      return;
    }

    if (moduleId) {
      loadModule();
    }
  }, [moduleId]);

  const loadModule = async () => {
    try {
      setLoading(true);
      const data = await getModuleById(moduleId);
      setModuleData(data);
    } catch (error) {
      console.error('Error loading module:', error);
      alert('Failed to load module');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveModule = async () => {
    if (!moduleData.title) {
      alert('Please enter a module title');
      return;
    }

    try {
      setSaving(true);
      if (moduleId) {
        // Update existing module
        await updateModule(moduleId, moduleData);
        alert('Module updated successfully!');
      } else {
        // Create new module
        const newModule = await createModule(moduleData);
        alert('Module created successfully!');
        navigate(`/modules/${newModule._id}/edit`);
      }
    } catch (error) {
      console.error('Error saving module:', error);
      alert('Failed to save module: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleAddUnit = () => {
    const newUnit = {
      title: `Unit ${moduleData.units.length + 1}`,
      description: '',
      items: [],
      order: moduleData.units.length
    };
    setModuleData({
      ...moduleData,
      units: [...moduleData.units, newUnit]
    });
    setExpandedUnits([...expandedUnits, moduleData.units.length]);
  };

  const handleDeleteUnit = (unitIndex) => {
    if (!confirm('Delete this unit and all its items?')) return;
    const newUnits = moduleData.units.filter((_, i) => i !== unitIndex);
    setModuleData({ ...moduleData, units: newUnits });
  };

  const handleUpdateUnit = (unitIndex, field, value) => {
    const newUnits = [...moduleData.units];
    newUnits[unitIndex][field] = value;
    setModuleData({ ...moduleData, units: newUnits });
  };

  const handleAddItem = (unitIndex) => {
    setCurrentUnitIndex(unitIndex);
    setEditingItem(null);
    setItemFormData({
      type: 'reading',
      title: '',
      duration: '',
      content: '',
      videoUrl: '',
      questions: []
    });
    setShowItemForm(true);
  };

  const handleEditItem = (unitIndex, itemIndex) => {
    const item = moduleData.units[unitIndex].items[itemIndex];
    setCurrentUnitIndex(unitIndex);
    setEditingItem({ unitIndex, itemIndex });
    setItemFormData(item);
    setShowItemForm(true);
  };

  const handleSaveItem = () => {
    if (!itemFormData.title) {
      alert('Please enter an item title');
      return;
    }

    const newUnits = [...moduleData.units];
    
    if (editingItem !== null) {
      // Update existing item
      newUnits[editingItem.unitIndex].items[editingItem.itemIndex] = itemFormData;
    } else {
      // Add new item
      newUnits[currentUnitIndex].items.push({
        ...itemFormData,
        order: newUnits[currentUnitIndex].items.length
      });
    }

    setModuleData({ ...moduleData, units: newUnits });
    setShowItemForm(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (unitIndex, itemIndex) => {
    if (!confirm('Delete this item?')) return;
    const newUnits = [...moduleData.units];
    newUnits[unitIndex].items.splice(itemIndex, 1);
    setModuleData({ ...moduleData, units: newUnits });
  };

  const handleAddQuestion = () => {
    setItemFormData({
      ...itemFormData,
      questions: [
        ...itemFormData.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        }
      ]
    });
  };

  const handleUpdateQuestion = (qIndex, field, value) => {
    const newQuestions = [...itemFormData.questions];
    newQuestions[qIndex][field] = value;
    setItemFormData({ ...itemFormData, questions: newQuestions });
  };

  const handleDeleteQuestion = (qIndex) => {
    const newQuestions = itemFormData.questions.filter((_, i) => i !== qIndex);
    setItemFormData({ ...itemFormData, questions: newQuestions });
  };

  const toggleUnit = (index) => {
    setExpandedUnits(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'video': return Video;
      case 'quiz': return CheckSquare;
      case 'lab': return Code;
      case 'reading':
      case 'article':
      default: return FileText;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/modules')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Modules</span>
            </button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {moduleId ? 'Edit Module' : 'Create New Module'}
            </h1>
          </div>
          <button
            onClick={handleSaveModule}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-semibold"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Module'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Module Info Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Module Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Module Title *
              </label>
              <input
                type="text"
                value={moduleData.title}
                onChange={(e) => setModuleData({ ...moduleData, title: e.target.value })}
                placeholder="e.g., Digital Marketing Fundamentals"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={moduleData.category}
                onChange={(e) => setModuleData({ ...moduleData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option>Digital Marketing</option>
                <option>Project Management</option>
                <option>Data Science</option>
                <option>Development</option>
                <option>Design</option>
                <option>Business</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={moduleData.description}
                onChange={(e) => setModuleData({ ...moduleData, description: e.target.value })}
                placeholder="Brief description of what students will learn"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Cover Image URL (optional)
              </label>
              <input
                type="url"
                value={moduleData.imageUrl}
                onChange={(e) => setModuleData({ ...moduleData, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                value={moduleData.totalMinutes}
                onChange={(e) => setModuleData({ ...moduleData, totalMinutes: parseInt(e.target.value) || 0 })}
                placeholder="120"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Units Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Course Content</h2>
            <button
              onClick={handleAddUnit}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Unit
            </button>
          </div>

          {moduleData.units.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">No units yet. Start by adding your first unit!</p>
              <button
                onClick={handleAddUnit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Add First Unit
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {moduleData.units.map((unit, unitIndex) => (
                <div key={unitIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  {/* Unit Header */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleUnit(unitIndex)}
                        className="text-gray-600 dark:text-gray-400"
                      >
                        {expandedUnits.includes(unitIndex) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={unit.title}
                          onChange={(e) => handleUpdateUnit(unitIndex, 'title', e.target.value)}
                          placeholder="Unit title"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={unit.description}
                          onChange={(e) => handleUpdateUnit(unitIndex, 'description', e.target.value)}
                          placeholder="Unit description (optional)"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteUnit(unitIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Unit Items */}
                  {expandedUnits.includes(unitIndex) && (
                    <div className="p-4">
                      <div className="space-y-2 mb-4">
                        {unit.items.map((item, itemIndex) => {
                          const ItemIcon = getItemIcon(item.type);
                          return (
                            <div
                              key={itemIndex}
                              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                            >
                              <GripVertical className="w-4 h-4 text-gray-400" />
                              <ItemIcon className="w-5 h-5 text-blue-600" />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">{item.title}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                  {item.type} {item.duration && `• ${item.duration}`}
                                </div>
                              </div>
                              <button
                                onClick={() => handleEditItem(unitIndex, itemIndex)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(unitIndex, itemIndex)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => handleAddItem(unitIndex)}
                        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <Plus className="w-5 h-5 inline-block mr-2" />
                        Add Lesson
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Item Form Modal */}
      {showItemForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full my-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Lesson' : 'Add New Lesson'}
              </h3>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Type & Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Lesson Type *
                    </label>
                    <select
                      value={itemFormData.type}
                      onChange={(e) => setItemFormData({ ...itemFormData, type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="reading">Reading</option>
                      <option value="video">Video</option>
                      <option value="article">Article</option>
                      <option value="quiz">Quiz</option>
                      <option value="lab">Lab/Exercise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={itemFormData.duration}
                      onChange={(e) => setItemFormData({ ...itemFormData, duration: e.target.value })}
                      placeholder="e.g., 15 min"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    value={itemFormData.title}
                    onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                    placeholder="e.g., Introduction to SEO"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Video URL */}
                {itemFormData.type === 'video' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Video URL (YouTube/Vimeo embed)
                    </label>
                    <input
                      type="url"
                      value={itemFormData.videoUrl}
                      onChange={(e) => setItemFormData({ ...itemFormData, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {/* Content */}
                {(itemFormData.type === 'reading' || itemFormData.type === 'article' || itemFormData.type === 'lab') && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content
                    </label>
                    <AdvancedEditorWrapper
                      content={itemFormData.content}
                      onChange={(content) => setItemFormData({ ...itemFormData, content })}
                    />
                  </div>
                )}

                {/* Quiz Questions */}
                {itemFormData.type === 'quiz' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Quiz Questions
                      </label>
                      <button
                        onClick={handleAddQuestion}
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                      >
                        Add Question
                      </button>
                    </div>
                    <div className="space-y-4">
                      {itemFormData.questions.map((q, qIndex) => (
                        <div key={qIndex} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Question {qIndex + 1}
                            </span>
                            <button
                              onClick={() => handleDeleteQuestion(qIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={q.question}
                            onChange={(e) => handleUpdateQuestion(qIndex, 'question', e.target.value)}
                            placeholder="Enter question"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-3"
                          />
                          <div className="space-y-2 mb-3">
                            {q.options.map((opt, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  checked={q.correctAnswer === oIndex}
                                  onChange={() => handleUpdateQuestion(qIndex, 'correctAnswer', oIndex)}
                                  className="w-4 h-4"
                                />
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const newOptions = [...q.options];
                                    newOptions[oIndex] = e.target.value;
                                    handleUpdateQuestion(qIndex, 'options', newOptions);
                                  }}
                                  placeholder={`Option ${oIndex + 1}`}
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                              </div>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={q.explanation}
                            onChange={(e) => handleUpdateQuestion(qIndex, 'explanation', e.target.value)}
                            placeholder="Explanation (optional)"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={() => {
                  setShowItemForm(false);
                  setEditingItem(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                {editingItem ? 'Update Lesson' : 'Add Lesson'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModuleCreatorPage;