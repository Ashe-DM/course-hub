// Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Target, CheckCircle, TrendingUp, PlayCircle } from 'lucide-react';
import { getAllModules } from '../api/moduleApi';
import { useProgress } from '../context/ProgressContext';
import { useUser } from '../context/UserContext';

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('in-progress');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getModuleProgress, getCompletedItemsCount, completedItems } = useProgress();
  const { user } = useUser();

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const data = await getAllModules();
      setModules(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching modules:', error);
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getModuleStats = (module) => {
    const progress = getModuleProgress(module);
    const totalWeeks = module.units?.length || 0;
    const totalItems = module.units?.reduce((sum, week) => sum + (week.items?.length || 0), 0) || 0;
    const completedCount = getCompletedItemsCount(module);

    return { progress, totalWeeks, totalItems, completedCount };
  };

  const getFilteredModules = () => {
    return modules.map(module => ({
      ...module,
      stats: getModuleStats(module)
    })).filter(module => {
      if (activeTab === 'in-progress') {
        return module.stats.progress > 0 && module.stats.progress < 100;
      } else {
        return module.stats.progress === 100;
      }
    });
  };

  const getTodaysGoals = () => {
    return [
      {
        id: 1,
        text: 'Return to Digital Marketing Hub',
        completed: false,
        icon: <BookOpen className="w-5 h-5" />
      },
      {
        id: 2,
        text: `Complete any 4 learning items · 0/4`,
        completed: false,
        icon: <Target className="w-5 h-5" />
      },
      {
        id: 3,
        text: 'Set up a learning plan',
        completed: false,
        icon: <CheckCircle className="w-5 h-5" />
      }
    ];
  };

  const handleContinueLearning = (module) => {
    // Find the first incomplete item
    for (const week of module.units || []) {
      for (const item of week.items || []) {
        if (!completedItems.has(item._id?.toString())) {
          navigate(`/modules/${module._id}/learn/${week._id}/${item._id}`);
          return;
        }
      }
    }
    // If all complete, go to module detail
    navigate(`/modules/${module._id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const todaysGoals = getTodaysGoals();
  const filteredModules = getFilteredModules();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.avatar || user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}, {user?.name || 'Guest'}
              </h1>
              <p className="text-gray-600 mt-1">
                Your career goal is to grow in your role as a{' '}
                <span className="font-semibold text-gray-900">{user?.careerGoal || 'Set your goal'}</span>
                {' '}
                <button className="text-blue-600 hover:underline ml-1">Edit goal</button>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('in-progress')}
                className={`pb-3 px-2 font-semibold transition-colors relative ${
                  activeTab === 'in-progress'
                    ? 'text-gray-900 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`pb-3 px-2 font-semibold transition-colors relative ${
                  activeTab === 'completed'
                    ? 'text-gray-900 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Completed
              </button>
            </div>

            {/* Modules List */}
            <div className="space-y-4">
              {filteredModules.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {activeTab === 'in-progress' 
                      ? 'No modules in progress'
                      : 'No completed modules yet'
                    }
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {activeTab === 'in-progress'
                      ? 'Start learning by exploring our available modules'
                      : 'Complete your first module to see it here'
                    }
                  </p>
                  <button
                    onClick={() => navigate('/modules')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Modules
                  </button>
                </div>
              ) : (
                filteredModules.map((module) => (
                  <div
                    key={module._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Module Image/Icon */}
                      <div className="w-full sm:w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-20 h-20 text-white" strokeWidth={1.5} />
                      </div>

                      {/* Module Content */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="text-sm text-gray-600 mb-1">
                              Course · {module.stats.progress}% complete
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {module.title || module.name}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                              {module.description}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${module.stats.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {module.stats.completedCount} of {module.stats.totalItems} items completed
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleContinueLearning(module)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                          >
                            {activeTab === 'completed' ? (
                              <>
                                <TrendingUp className="w-4 h-4" />
                                Review
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-4 h-4" />
                                Continue Learning
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => navigate(`/modules/${module._id}`)}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Today's Goals */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Today's goals</h3>
              <div className="space-y-3">
                {todaysGoals.map((goal) => (
                  <div key={goal.id} className="flex items-start gap-3">
                    <div className={`mt-0.5 ${goal.completed ? 'text-blue-600' : 'text-gray-300'}`}>
                      {goal.completed ? (
                        <CheckCircle className="w-5 h-5 fill-current" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-sm flex-1 ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                      {goal.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Modules Started</div>
                      <div className="text-xl font-bold text-gray-900">
                        {modules.filter(m => getModuleProgress(m) > 0).length}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Modules Completed</div>
                      <div className="text-xl font-bold text-gray-900">
                        {modules.filter(m => getModuleProgress(m) === 100).length}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total Items Done</div>
                      <div className="text-xl font-bold text-gray-900">
                        {completedItems.size}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Keep Learning!</h3>
              <p className="text-sm text-blue-100 mb-4">
                Consistency is key to achieving your goals
              </p>
              <button
                onClick={() => navigate('/modules')}
                className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Explore More Modules
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;