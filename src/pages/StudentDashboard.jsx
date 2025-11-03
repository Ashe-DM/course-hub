// StudentDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, TrendingUp, Award, Calendar, Clock, 
  Flame, Star, ArrowRight, Play, ChevronRight
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useProgress } from '../context/ProgressContext';
import { getAllModules } from '../api/moduleApi';

function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getModuleProgress, completedItems } = useProgress();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gamification, setGamification] = useState({
    level: 5,
    currentPoints: 1450,
    nextLevelPoints: 2000,
    currentStreak: 7,
    longestStreak: 14,
    badges: 5,
    totalBadges: 24
  });
  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: 'SEO Research Presentation',
      module: 'Digital Marketing',
      date: 'Tomorrow, 10:00 AM',
      team: ['Alice', 'Bob', 'Charlie']
    },
    {
      id: 2,
      title: 'Content Marketing Project',
      module: 'Marketing Strategy',
      date: 'Friday, 2:00 PM',
      team: ['David', 'Emma']
    }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const modulesData = await getAllModules();
      setModules(modulesData);
      // TODO: Fetch gamification data from API
      // TODO: Fetch upcoming events from API
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getInProgressModules = () => {
    return modules
      .map(module => ({
        ...module,
        progress: getModuleProgress(module)
      }))
      .filter(module => module.progress > 0 && module.progress < 100)
      .slice(0, 3);
  };

  const getStats = () => {
    const startedModules = modules.filter(m => getModuleProgress(m) > 0).length;
    const completedModules = modules.filter(m => getModuleProgress(m) === 100).length;
    return {
      modules: startedModules,
      completedModules,
      lessons: completedItems.size,
      events: 5 // TODO: Get from API
    };
  };

  const progressPercentage = Math.round(
    (gamification.currentPoints / gamification.nextLevelPoints) * 100
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading your dashboard...</div>
      </div>
    );
  }

  const stats = getStats();
  const inProgressModules = getInProgressModules();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                {user?.avatar || user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {getGreeting()}, {user?.name}! 👋
                </h1>
                <p className="text-blue-100">
                  Ready to continue your learning journey?
                </p>
              </div>
            </div>
            
            {/* Level & Points */}
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">Level {gamification.level}</div>
              <div className="text-sm text-blue-100 mb-2">
                {gamification.currentPoints} / {gamification.nextLevelPoints} points
              </div>
              <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="mt-6 flex items-center gap-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
              <Flame className="w-6 h-6 text-orange-400" />
              <div>
                <div className="text-2xl font-bold">{gamification.currentStreak} days</div>
                <div className="text-sm text-blue-100">Current streak 🔥</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
              <Award className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold">{gamification.badges} / {gamification.totalBadges}</div>
                <div className="text-sm text-blue-100">Badges earned 🏆</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.modules}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Modules Started</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.lessons}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Lessons Completed</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {gamification.badges}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.events}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Events Attended</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Continue Learning - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Play className="w-7 h-7 text-blue-600" />
                Continue Learning
              </h2>
              <button
                onClick={() => navigate('/modules')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {inProgressModules.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Start Learning Today!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Explore our modules and begin your journey
                </p>
                <button
                  onClick={() => navigate('/modules')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Browse Modules
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {inProgressModules.map((module) => (
                  <div
                    key={module._id}
                    onClick={() => navigate(`/modules/${module._id}`)}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                          {module.title || module.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {module.description || 'Continue your progress'}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${module.progress}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {module.progress}%
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            
            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  Upcoming Events
                </h3>
                <button
                  onClick={() => navigate('/events')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-3">
                {upcomingEvents.slice(0, 2).map((event) => (
                  <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">
                          {event.title}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {event.module}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      {event.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3">Keep Learning! 🚀</h3>
              <p className="text-sm text-blue-100 mb-4">
                Consistency is key to achieving your goals. Keep up the great work!
              </p>
              <button
                onClick={() => navigate('/modules')}
                className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
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

export default StudentDashboard;