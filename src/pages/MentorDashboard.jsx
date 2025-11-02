import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Edit, Trash2, Users, BookOpen, TrendingUp,
  Eye, BarChart3, FileText, Video, CheckSquare, Award
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function MentorDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [myModules, setMyModules] = useState([]);
  const [stats, setStats] = useState({
    totalModules: 0,
    totalStudents: 0,
    totalLessons: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      // Fetch all modules
      const response = await axios.get(`${API_URL}/api/modules`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filter modules created by current user
      const myCreatedModules = response.data.filter(
        m => m.instructor?._id === user._id || m.instructor === user._id
      );

      setMyModules(myCreatedModules);

      // Calculate stats
      const totalLessons = myCreatedModules.reduce((sum, module) => {
        return sum + (module.units?.reduce((unitSum, unit) => 
          unitSum + (unit.items?.length || 0), 0) || 0);
      }, 0);

      const totalStudents = myCreatedModules.reduce((sum, module) => {
        return sum + (module.students?.length || 0);
      }, 0);

      const avgRating = myCreatedModules.length > 0
        ? myCreatedModules.reduce((sum, m) => sum + (m.rating || 0), 0) / myCreatedModules.length
        : 0;

      setStats({
        totalModules: myCreatedModules.length,
        totalStudents,
        totalLessons,
        avgRating: avgRating.toFixed(1)
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('Are you sure you want to delete this module? This cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/api/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Module deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting module:', error);
      alert(error.response?.data?.message || 'Failed to delete module');
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Content Creator Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, <strong>{user?.name}</strong>! Manage your courses and track student progress.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.totalModules}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">My Courses</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.totalStudents}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.totalLessons}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Lessons</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.avgRating}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/modules/create')}
            className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-all group"
          >
            <Plus className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Create New Course</h3>
            <p className="text-sm text-blue-100">
              Build a new module from scratch
            </p>
          </button>

          <button
            onClick={() => navigate('/modules')}
            className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all group"
          >
            <Eye className="w-8 h-8 mb-3 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Browse All Courses</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View all available modules
            </p>
          </button>

          <button
            onClick={() => navigate('/students')}
            className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all group"
          >
            <BarChart3 className="w-8 h-8 mb-3 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 transition-colors" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">View Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track student progress
            </p>
          </button>
        </div>

        {/* My Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h2>
            <button
              onClick={() => navigate('/modules/create')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Course
            </button>
          </div>

          {myModules.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No courses yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first course and start teaching!
              </p>
              <button
                onClick={() => navigate('/modules/create')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Create Your First Course
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myModules.map((module) => {
                const totalUnits = module.units?.length || 0;
                const totalItems = module.units?.reduce((sum, unit) => 
                  sum + (unit.items?.length || 0), 0) || 0;
                const studentCount = module.students?.length || 0;

                return (
                  <div
                    key={module._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                  >
                    <div className="flex items-start gap-6">
                      {/* Thumbnail */}
                      <div className="w-32 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        {module.imageUrl ? (
                          <img 
                            src={module.imageUrl} 
                            alt={module.title} 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <BookOpen className="w-12 h-12 text-white opacity-50" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                              {module.title || module.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {module.description || 'No description'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/modules/${module._id}/edit`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => navigate(`/modules/${module._id}`)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteModule(module._id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{totalUnits} units</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{totalItems} lessons</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{studentCount} students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span>{module.rating || 4.8}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MentorDashboard;