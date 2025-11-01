import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Map, TrendingUp, Clock, Award, Users, ChevronRight,
  CheckCircle, Lock, BookOpen, Star
} from 'lucide-react';

function RoadmapsPage() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from API when backend ready
    // For now, using mock data
    const mockRoadmaps = [
      {
        _id: '1',
        title: 'Digital Marketing Master',
        description: 'Complete path from beginner to advanced digital marketing professional',
        imageUrl: '',
        category: 'Marketing',
        difficulty: 'beginner',
        totalDuration: '3 months',
        prerequisites: 'None',
        enrolledStudents: 1234,
        steps: [
          {
            title: 'Fundamentals',
            description: 'Learn the basics of digital marketing',
            modules: ['Digital Marketing Seminar', 'SEM (SEO & SEA)'],
            order: 0,
            estimatedTime: '2 weeks',
            isOptional: false
          },
          {
            title: 'Advanced Strategies',
            description: 'Master advanced marketing techniques',
            modules: ['Digital Marketing Softwares', 'Content Marketing'],
            order: 1,
            estimatedTime: '3 weeks',
            isOptional: false
          },
          {
            title: 'Specialization',
            description: 'Choose your specialty',
            modules: ['Social Media Marketing', 'Email Marketing'],
            order: 2,
            estimatedTime: '2 weeks',
            isOptional: true
          }
        ],
        outcomes: [
          'Create comprehensive marketing strategies',
          'Master SEO and SEM techniques',
          'Run successful ad campaigns',
          'Analyze marketing metrics'
        ]
      },
      {
        _id: '2',
        title: 'Data Science Professional',
        description: 'From data basics to machine learning mastery',
        imageUrl: '',
        category: 'Data Science',
        difficulty: 'intermediate',
        totalDuration: '6 months',
        prerequisites: 'Basic programming knowledge',
        enrolledStudents: 856,
        steps: [
          {
            title: 'Data Fundamentals',
            description: 'Learn data analysis basics',
            modules: ['Big Data', 'Data Analytics'],
            order: 0,
            estimatedTime: '3 weeks',
            isOptional: false
          },
          {
            title: 'Machine Learning',
            description: 'Build ML models',
            modules: ['ML Basics', 'Deep Learning'],
            order: 1,
            estimatedTime: '4 weeks',
            isOptional: false
          }
        ],
        outcomes: [
          'Analyze large datasets',
          'Build predictive models',
          'Deploy ML solutions',
          'Visualize data insights'
        ]
      },
      {
        _id: '3',
        title: 'Project Manager Pro',
        description: 'Lead successful projects from start to finish',
        imageUrl: '',
        category: 'Management',
        difficulty: 'intermediate',
        totalDuration: '2 months',
        prerequisites: 'Some work experience',
        enrolledStudents: 567,
        steps: [
          {
            title: 'PM Foundations',
            description: 'Core project management skills',
            modules: ['Digital Project Management', 'Agile Methods'],
            order: 0,
            estimatedTime: '2 weeks',
            isOptional: false
          }
        ],
        outcomes: [
          'Plan and execute projects',
          'Manage teams effectively',
          'Handle project risks',
          'Deliver on time and budget'
        ]
      }
    ];

    setRoadmaps(mockRoadmaps);
    setLoading(false);
  }, []);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      intermediate: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      advanced: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    };
    return colors[difficulty] || colors.beginner;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Marketing: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      'Data Science': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      Management: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    };
    return colors[category] || colors.Marketing;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading roadmaps...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Learning Roadmaps</h1>
          <p className="text-blue-100 text-lg">
            Structured paths to master your chosen field
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {roadmaps.map((roadmap) => (
            <RoadmapCard 
              key={roadmap._id} 
              roadmap={roadmap}
              getDifficultyColor={getDifficultyColor}
              getCategoryColor={getCategoryColor}
              navigate={navigate}
            />
          ))}
        </div>

        {/* No Roadmaps */}
        {roadmaps.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
            <Map className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No roadmaps available yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Learning paths are coming soon!
            </p>
            <button
              onClick={() => navigate('/modules')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Modules
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Roadmap Card Component
function RoadmapCard({ roadmap, getDifficultyColor, getCategoryColor, navigate }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(roadmap.category)}`}>
                {roadmap.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getDifficultyColor(roadmap.difficulty)}`}>
                {roadmap.difficulty}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {roadmap.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {roadmap.description}
            </p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{roadmap.totalDuration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{roadmap.steps.length} steps</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{roadmap.enrolledStudents} enrolled</span>
          </div>
        </div>

        {/* Learning Path Steps */}
        <div className="space-y-3 mb-6">
          {roadmap.steps.slice(0, expanded ? undefined : 2).map((step, index) => (
            <div key={index} className="relative pl-8 pb-4 border-l-2 border-blue-200 dark:border-blue-800 last:border-0 last:pb-0">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full border-2 border-white dark:border-gray-800"></div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {step.title}
                {step.isOptional && (
                  <span className="ml-2 text-xs text-gray-500 font-normal">(Optional)</span>
                )}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {step.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{step.estimatedTime}</span>
                <span>•</span>
                <span>{step.modules.length} modules</span>
              </div>
            </div>
          ))}
        </div>

        {roadmap.steps.length > 2 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            {expanded ? 'Show less' : `Show ${roadmap.steps.length - 2} more steps`}
          </button>
        )}

        {/* What You'll Learn */}
        {expanded && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              What You'll Learn
            </h4>
            <ul className="space-y-2">
              {roadmap.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prerequisites */}
        {roadmap.prerequisites && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
              Prerequisites
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {roadmap.prerequisites}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => {
            // TODO: Navigate to roadmap detail or first module
            alert('Roadmap enrollment coming soon! For now, browse individual modules.');
            navigate('/modules');
          }}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          Start Learning Path
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default RoadmapsPage;