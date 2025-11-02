import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BookOpen, TrendingUp, Activity, Settings as SettingsIcon,
  Crown, Award, Shield, AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    mentors: 0,
    admins: 0,
    recentUsers: 0,
    totalModules: 0,
    totalLessons: 0,
    activeStudents: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      // Fetch user stats
      const userStatsResponse = await axios.get(`${API_URL}/api/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch modules
      const modulesResponse = await axios.get(`${API_URL}/api/modules`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const totalLessons = modulesResponse.data.reduce((sum, module) => {
        return sum + (module.units?.reduce((unitSum, unit) => 
          unitSum + (unit.items?.length || 0), 0) || 0);
      }, 0);

      setStats({
        ...userStatsResponse.data,
        totalModules: modulesResponse.data.length,
        totalLessons,
        activeStudents: Math.floor(userStatsResponse.data.students * 0.7) // Mock: 70% active
      });

      // Mock recent activity
      setRecentActivity([
        {
          id: 1,
          type: 'user',
          message: 'New user registered',
          user: 'John Doe',
          time: '5 minutes ago',
          icon: Users,
          color: 'text-blue-600'
        },
        {
          id: 2,
          type: 'module',
          message: 'New course created',
          user: 'Mentor Alice',
          time: '1 hour ago',
          icon: BookOpen,
          color: 'text-green-600'
        },
        {
          id: 3,
          type: 'complete',
          message: 'Module completed',
          user: 'Student Bob',
          time: '2 hours ago',
          icon: CheckCircle,
          color: 'text-purple-600'
        }
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const platformHealth = {
    status: 'Healthy',
    uptime: '99.9%',
    responseTime: '45ms',
    issues: 0
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
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, <strong>{user?.name}</strong>! Monitor platform health and manage users.
          </p>
        </div>

        {/* Platform Health */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-6 h-6" />
                <h2 className="text-xl font-bold">Platform Status</h2>
              </div>
              <p className="text-green-100 text-sm">All systems operational</p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <div className="text-2xl font-bold">{platformHealth.uptime}</div>
                <div className="text-sm text-green-100">Uptime</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{platformHealth.responseTime}</div>
                <div className="text-sm text-green-100">Response Time</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{platformHealth.issues}</div>
                <div className="text-sm text-green-100">Active Issues</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.totalUsers}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            <div className="text-xs text-green-600 mt-2">
              +{stats.recentUsers} this week
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.totalModules}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Courses</div>
            <div className="text-xs text-gray-500 mt-2">
              {stats.totalLessons} total lessons
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.activeStudents}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Students</div>
            <div className="text-xs text-purple-600 mt-2">
              {Math.round((stats.activeStudents / stats.students) * 100)}% of total
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.mentors}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Mentors</div>
            <div className="text-xs text-gray-500 mt-2">
              {stats.admins} admins
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                User Breakdown
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900 dark:text-white">Students</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.students}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round((stats.students / stats.totalUsers) * 100)}% of users
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-900 dark:text-white">Mentors</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.mentors}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round((stats.mentors / stats.totalUsers) * 100)}% of users
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-gray-900 dark:text-white">Admins</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.admins}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round((stats.admins / stats.totalUsers) * 100)}% of users
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Admin Actions
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/settings')}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 transition-all group"
                >
                  <SettingsIcon className="w-8 h-8 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors" />
                  <span className="font-semibold text-gray-900 dark:text-white">Manage Users</span>
                </button>

                <button
                  onClick={() => navigate('/modules')}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 transition-all group"
                >
                  <BookOpen className="w-8 h-8 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 transition-colors" />
                  <span className="font-semibold text-gray-900 dark:text-white">View Courses</span>
                </button>

                <button
                  onClick={() => navigate('/students')}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 transition-all group"
                >
                  <Activity className="w-8 h-8 text-gray-600 dark:text-gray-400 group-hover:text-green-600 transition-colors" />
                  <span className="font-semibold text-gray-900 dark:text-white">Analytics</span>
                </button>

                <button
                  onClick={() => navigate('/modules/create')}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-orange-500 transition-all group"
                >
                  <Shield className="w-8 h-8 text-gray-600 dark:text-gray-400 group-hover:text-orange-600 transition-colors" />
                  <span className="font-semibold text-gray-900 dark:text-white">Create Course</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className={`p-2 bg-white dark:bg-gray-800 rounded-lg ${activity.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                        {activity.message}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.user}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate('/students')}
              className="w-full mt-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              View All Activity →
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                Administrator Access
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                You have full access to all platform features. Use your privileges responsibly and always follow data protection guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;