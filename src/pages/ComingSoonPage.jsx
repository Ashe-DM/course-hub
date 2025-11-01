import { useNavigate } from 'react-router-dom';
import { 
  Rocket, ArrowLeft, Sparkles, Calendar, 
  MessageSquare, Users, Settings, Map 
} from 'lucide-react';

function ComingSoonPage({ title = 'Feature' }) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (title.toLowerCase()) {
      case 'roadmaps':
        return <Map className="w-24 h-24" />;
      case 'events':
        return <Calendar className="w-24 h-24" />;
      case 'messages':
        return <MessageSquare className="w-24 h-24" />;
      case 'students':
        return <Users className="w-24 h-24" />;
      case 'settings':
        return <Settings className="w-24 h-24" />;
      default:
        return <Rocket className="w-24 h-24" />;
    }
  };

  const getDescription = () => {
    switch (title.toLowerCase()) {
      case 'roadmaps':
        return 'Visualize your learning journey with personalized roadmaps';
      case 'events':
        return 'Join live sessions, webinars, and collaborative learning events';
      case 'messages':
        return 'Connect with mentors and peers through our messaging system';
      case 'students':
        return 'Manage and track student progress across all modules';
      case 'settings':
        return 'Customize your platform experience and preferences';
      default:
        return 'This feature is currently under development';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
          {/* Animated Icon */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8 rounded-full">
              {getIcon()}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            {title} 
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Coming Soon!
          </p>

          {/* Description */}
          <p className="text-gray-500 dark:text-gray-500 mb-8 max-w-md mx-auto">
            {getDescription()}
          </p>

          {/* Progress Indicator */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-3 max-w-xs mx-auto mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full animate-progress" style={{ width: '65%' }}></div>
          </div>

          {/* Status */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-semibold mb-8">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            In Development
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/modules')}
              className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
            >
              Browse Modules
            </button>
          </div>

          {/* Features Preview */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What's Coming
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Modern Interface
              </div>
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Real-time Updates
              </div>
              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Smart Features
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-8">
          Stay tuned! This feature will be available in the next update.
        </p>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 65%;
          }
        }
        .animate-progress {
          animation: progress 2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ComingSoonPage;