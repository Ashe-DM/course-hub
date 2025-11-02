import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Play, CheckCircle, Lock, Star, Clock, 
  Users, Award, BookOpen, Video, FileText, Code, CheckSquare,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { getModuleById, enrollUser } from '../api/moduleApi';
import { useProgress } from '../context/ProgressContext';
import { useUser } from '../context/UserContext';

function ModuleDetailPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user, isMentor, isAdmin } = useUser();
  const { getModuleProgress, isCompleted, loadModuleProgress } = useProgress();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState([0]); // First unit expanded by default

  useEffect(() => {
    loadModule();
  }, [moduleId]);

  const loadModule = async () => {
    try {
      setLoading(true);
      const data = await getModuleById(moduleId);
      setModule(data);
      await loadModuleProgress(moduleId);
    } catch (error) {
      console.error('Error loading module:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await enrollUser(moduleId);
      await loadModule(); // Reload to get updated enrollment status
      alert('Successfully enrolled! You can now start learning.');
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const toggleUnit = (index) => {
    setExpandedUnits(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'video': return Video;
      case 'article':
      case 'reading': return FileText;
      case 'quiz':
      case 'test': return CheckSquare;
      case 'lab': return Code;
      default: return BookOpen;
    }
  };

  const startLearning = (unitId, itemId) => {
    navigate(`/modules/${moduleId}/learn/${unitId}/${itemId}`);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'digital marketing': 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      'project management': 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      'data science': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      'legal': 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    };
    return colors[category?.toLowerCase()] || 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading module...</div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Module not found</h2>
        <button
          onClick={() => navigate('/modules')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Modules
        </button>
      </div>
    );
  }

  const progress = getModuleProgress(module);
  const totalItems = module.units?.reduce((sum, unit) => sum + (unit.items?.length || 0), 0) || 0;
  const completedCount = module.units?.reduce(
    (sum, unit) => sum + (unit.items?.filter(item => isCompleted(item._id)).length || 0),
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Button */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <button
            onClick={() => navigate('/modules')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Modules</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Side - Module Info */}
            <div className="flex-1">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getCategoryColor(module.category)}`}>
                {module.category || 'Digital Marketing'}
              </span>
              <h1 className="text-4xl font-bold mb-4">
                {module.title || module.name}
              </h1>
              <p className="text-lg text-blue-100 mb-6">
                {module.description || 'No description available'}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{module.rating || 4.8}</span>
                  <span className="text-blue-200">({module.students?.length || Math.floor(Math.random() * 5000)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{module.totalMinutes || 120} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{totalItems} lessons</span>
                </div>
              </div>

              {/* Progress Bar (if enrolled) */}
              {progress > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Your Progress</span>
                    <span className="text-sm font-semibold">{progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-blue-100 mt-2">
                    {completedCount} of {totalItems} lessons completed
                  </p>
                </div>
              )}
            </div>

            {/* Right Side - Action Card */}
            <div className="w-full lg:w-96 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl">
              {/* Module Image */}
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {module.imageUrl ? (
                  <img src={module.imageUrl} alt={module.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-16 h-16 text-white opacity-50" />
                )}
              </div>

              {/* Action Button */}
              {progress > 0 ? (
                <button
                  onClick={() => {
                    // Find first incomplete item
                    for (const unit of module.units || []) {
                      const incompleteItem = unit.items?.find(item => !isCompleted(item._id));
                      if (incompleteItem) {
                        startLearning(unit._id, incompleteItem._id);
                        return;
                      }
                    }
                    // If all complete, start from beginning
                    if (module.units?.[0]?.items?.[0]) {
                      startLearning(module.units[0]._id, module.units[0].items[0]._id);
                    }
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 mb-4"
                >
                  <Play className="w-5 h-5" />
                  Continue Learning
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 mb-4 disabled:bg-blue-300"
                >
                  {enrolling ? 'Enrolling...' : 'Start Learning'}
                </button>
              )}

              {/* Course Includes */}
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <h3 className="font-semibold text-gray-900 dark:text-white">This course includes:</h3>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span>Video lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Reading materials</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                  <span>Quizzes and assessments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Content</h2>

        <div className="space-y-4">
          {module.units?.map((unit, unitIndex) => {
            const isExpanded = expandedUnits.includes(unitIndex);
            const unitCompleted = unit.items?.every(item => isCompleted(item._id)) || false;
            const unitProgress = unit.items?.length 
              ? Math.round((unit.items.filter(item => isCompleted(item._id)).length / unit.items.length) * 100)
              : 0;

            return (
              <div key={unit._id || unitIndex} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                {/* Unit Header */}
                <button
                  onClick={() => toggleUnit(unitIndex)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      {unitCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {unitIndex + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {unit.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {unit.items?.length || 0} lessons • {unitProgress}% complete
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {/* Unit Items */}
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    {unit.items?.map((item, itemIndex) => {
                      const ItemIcon = getItemIcon(item.type);
                      const itemCompleted = isCompleted(item._id);
                      const isLocked = progress === 0; // Lock if not enrolled

                      return (
                        <div
                          key={item._id || itemIndex}
                          onClick={() => !isLocked && startLearning(unit._id, item._id)}
                          className={`px-6 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                        >
                          <div className={`w-6 h-6 flex items-center justify-center ${itemCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                            {itemCompleted ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : isLocked ? (
                              <Lock className="w-5 h-5" />
                            ) : (
                              <ItemIcon className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <span className="capitalize">{item.type}</span>
                              {item.duration && (
                                <>
                                  <span>•</span>
                                  <span>{item.duration}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {!isLocked && (
                            <Play className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {(!module.units || module.units.length === 0) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No content available yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This module doesn't have any lessons yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModuleDetailPage;