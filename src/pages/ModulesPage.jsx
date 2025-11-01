import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Filter, Grid, List, Star, Clock, 
  TrendingUp, Search, X, Play, CheckCircle,
  Users, Award
} from 'lucide-react';
import { getAllModules } from '../api/moduleApi';
import { useProgress } from '../context/ProgressContext';
import { useUser } from '../context/UserContext';

function ModulesPage() {
  const navigate = useNavigate();
  const { getModuleProgress } = useProgress();
  const { user } = useUser();
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'newest', 'progress'

  const categories = [
    { id: 'all', name: 'All Courses', count: 0 },
    { id: 'marketing', name: 'Marketing', count: 0 },
    { id: 'development', name: 'Development', count: 0 },
    { id: 'design', name: 'Design', count: 0 },
    { id: 'business', name: 'Business', count: 0 }
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    filterAndSortModules();
  }, [modules, searchTerm, selectedCategory, selectedLevel, sortBy]);

  const loadModules = async () => {
    try {
      setLoading(true);
      const data = await getAllModules();
      const modulesWithProgress = data.map(module => ({
        ...module,
        progress: getModuleProgress(module),
        category: module.category?.toLowerCase() || 'marketing',
        level: module.level || 'beginner',
        students: module.students?.length || Math.floor(Math.random() * 5000) + 100,
        rating: module.rating || 4.8
      }));
      setModules(modulesWithProgress);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortModules = () => {
    let filtered = [...modules];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(module =>
        (module.title || module.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(module => 
        module.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(module => 
        module.level?.toLowerCase() === selectedLevel.toLowerCase()
      );
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'progress':
        filtered.sort((a, b) => b.progress - a.progress);
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.students - a.students);
        break;
    }

    setFilteredModules(filtered);
  };

  const getCategoryColor = (category) => {
    const colors = {
      marketing: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      development: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      design: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      business: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
    };
    return colors[category?.toLowerCase()] || colors.marketing;
  };

  const getLevelColor = (level) => {
    const colors = {
      beginner: 'text-green-600 dark:text-green-400',
      intermediate: 'text-yellow-600 dark:text-yellow-400',
      advanced: 'text-red-600 dark:text-red-400'
    };
    return colors[level?.toLowerCase()] || colors.beginner;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading modules...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Explore Modules</h1>
          <p className="text-blue-100 text-lg">
            Discover courses tailored to your learning goals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Filters Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search modules..."
                className="w-full pl-12 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:text-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              >
                {levels.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="progress">My Progress</option>
              </select>

              {/* View Toggle */}
              <div className="flex bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                >
                  <Grid className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                >
                  <List className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {searchTerm && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-2">
                  Search: "{searchTerm}"
                  <X className="w-4 h-4 cursor-pointer" onClick={() => setSearchTerm('')} />
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-2">
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <X className="w-4 h-4 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                </span>
              )}
              {selectedLevel !== 'all' && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-2">
                  {levels.find(l => l.id === selectedLevel)?.name}
                  <X className="w-4 h-4 cursor-pointer" onClick={() => setSelectedLevel('all')} />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredModules.length}</span> module{filteredModules.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Modules Grid/List */}
        {filteredModules.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No modules found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLevel('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredModules.map((module) => (
              <ModuleCard 
                key={module._id} 
                module={module} 
                viewMode={viewMode}
                getCategoryColor={getCategoryColor}
                getLevelColor={getLevelColor}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Module Card Component
function ModuleCard({ module, viewMode, getCategoryColor, getLevelColor, navigate }) {
  const isGrid = viewMode === 'grid';

  if (isGrid) {
    return (
      <div
        onClick={() => navigate(`/modules/${module._id}`)}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
      >
        {/* Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
          {module.imageUrl ? (
            <img src={module.imageUrl} alt={module.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="w-16 h-16 text-white opacity-50" />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(module.category)}`}>
              {module.category?.charAt(0).toUpperCase() + module.category?.slice(1)}
            </span>
          </div>
          {module.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${module.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {module.title || module.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {module.description || 'No description available'}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-gray-900 dark:text-white">{module.rating}</span>
              <span>({module.students})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{module.totalMinutes || 120} min</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className={`text-sm font-semibold capitalize ${getLevelColor(module.level)}`}>
              {module.level || 'Beginner'}
            </span>
            {module.progress > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {module.progress}% Complete
                </span>
                <Play className="w-5 h-5 text-blue-600" />
              </div>
            ) : (
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Start Learning
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div
      onClick={() => navigate(`/modules/${module._id}`)}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex gap-6"
    >
      {/* Thumbnail */}
      <div className="relative w-48 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden flex-shrink-0">
        {module.imageUrl ? (
          <img src={module.imageUrl} alt={module.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen className="w-12 h-12 text-white opacity-50" />
          </div>
        )}
        {module.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
            <div 
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${module.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(module.category)}`}>
                {module.category?.charAt(0).toUpperCase() + module.category?.slice(1)}
              </span>
              <span className={`text-xs font-semibold capitalize ${getLevelColor(module.level)}`}>
                {module.level || 'Beginner'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
              {module.title || module.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {module.description || 'No description available'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-gray-900 dark:text-white">{module.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{module.students} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{module.totalMinutes || 120} min</span>
            </div>
          </div>

          {module.progress > 0 ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {module.progress}% Complete
              </span>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2">
                Continue
                <Play className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Start Learning
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModulesPage;