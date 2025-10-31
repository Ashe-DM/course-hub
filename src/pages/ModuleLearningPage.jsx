import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, FileText, Video, ClipboardCheck } from 'lucide-react';
import { getModuleById } from '../api/moduleApi';
import { useProgress } from '../context/ProgressContext';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import RichTextEditor from '../components/RichTextEditor';

function ModuleLearningPage() {
  const { moduleId, weekId, itemId, unitId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  
  const { isCompleted, markComplete, loadModuleProgress } = useProgress();
  
  // Use weekId if available, otherwise unitId
  const activeUnitId = weekId || unitId;

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  useEffect(() => {
    if (module && activeUnitId && itemId) {
      updateCurrentContent();
    }
  }, [module, activeUnitId, itemId]);

  const fetchModule = async () => {
    try {
      const data = await getModuleById(moduleId);
      setModule(data);
      
      // Auto-expand all weeks by default
      const expanded = {};
      data.units?.forEach(week => {
        expanded[week._id] = true;
      });
      setExpandedWeeks(expanded);
      
      // Load progress for this module
      await loadModuleProgress(moduleId);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching module:', error);
      setLoading(false);
    }
  };

  const updateCurrentContent = () => {
    const week = module.units?.find(w => w._id === activeUnitId);
    const item = week?.items?.find(i => i._id === itemId);
    
    setCurrentWeek(week);
    setCurrentItem(item);
  };

  const toggleWeek = (weekId) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));
  };

  const handleItemClick = (weekId, itemId) => {
    navigate(`/modules/${moduleId}/learn/${weekId}/${itemId}`);
  };

  const getItemIcon = (type) => {
    switch(type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'test':
      case 'quiz': return <ClipboardCheck className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleMarkComplete = async () => {
    if (currentItem && currentWeek) {
      await markComplete(moduleId, currentWeek._id, currentItem._id);
      handleNextItem();
    }
  };

  const handleNextItem = () => {
    if (!module || !currentWeek || !currentItem) return;

    const currentItemIndex = currentWeek.items.findIndex(i => i._id === itemId);
    
    if (currentItemIndex < currentWeek.items.length - 1) {
      const nextItem = currentWeek.items[currentItemIndex + 1];
      navigate(`/modules/${moduleId}/learn/${currentWeek._id}/${nextItem._id}`);
      return;
    }

    const currentWeekIndex = module.units.findIndex(w => w._id === currentWeek._id);
    if (currentWeekIndex < module.units.length - 1) {
      const nextWeek = module.units[currentWeekIndex + 1];
      if (nextWeek.items && nextWeek.items.length > 0) {
        navigate(`/modules/${moduleId}/learn/${nextWeek._id}/${nextWeek.items[0]._id}`);
      }
    } else {
      // Completed all items
      alert('Congratulations! You\'ve completed all items in this module!');
      navigate(`/modules/${moduleId}`);
    }
  };

  const handlePreviousItem = () => {
    if (!module || !currentWeek || !currentItem) return;

    const currentItemIndex = currentWeek.items.findIndex(i => i._id === itemId);
    
    if (currentItemIndex > 0) {
      const prevItem = currentWeek.items[currentItemIndex - 1];
      navigate(`/modules/${moduleId}/learn/${currentWeek._id}/${prevItem._id}`);
      return;
    }

    const currentWeekIndex = module.units.findIndex(w => w._id === currentWeek._id);
    if (currentWeekIndex > 0) {
      const prevWeek = module.units[currentWeekIndex - 1];
      if (prevWeek.items && prevWeek.items.length > 0) {
        const lastItem = prevWeek.items[prevWeek.items.length - 1];
        navigate(`/modules/${moduleId}/learn/${prevWeek._id}/${lastItem._id}`);
      }
    }
  };

  const getCompletedCount = (weekId) => {
    const week = module?.units?.find(w => w._id === weekId);
    if (!week) return 0;
    return week.items.filter(item => isCompleted(item._id)).length;
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const isFirstItem = module?.units?.findIndex(w => w._id === currentWeek?._id) === 0 &&
    currentWeek?.items?.findIndex(i => i._id === itemId) === 0;
  const isLastItem = module?.units?.findIndex(w => w._id === currentWeek?._id) === module.units.length - 1 &&
    currentWeek?.items?.findIndex(i => i._id === itemId) === currentWeek.items.length - 1;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => navigate(`/modules/${moduleId}`)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to overview
          </button>
        </div>

        {/* Weeks */}
        <div className="p-4">
          {module?.units?.map((week, weekIndex) => {
            const completedCount = getCompletedCount(week._id);
            const totalCount = week.items?.length || 0;
            
            return (
              <div key={week._id} className="mb-4">
                <button
                  onClick={() => toggleWeek(week._id)}
                  className="w-full flex items-start justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-gray-900">UNIT {weekIndex + 1}</div>
                    <div className="text-sm text-gray-700 mt-1">{week.title}</div>
                    {totalCount > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {completedCount}/{totalCount} completed
                      </div>
                    )}
                  </div>
                  {expandedWeeks[week._id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {expandedWeeks[week._id] && (
                  <div className="ml-4 mt-2 space-y-1">
                    {week.items?.map((item, itemIndex) => (
                      <button
                        key={item._id}
                        onClick={() => handleItemClick(week._id, item._id)}
                        className={`w-full flex items-center gap-3 p-2 rounded text-sm transition-colors ${
                          item._id === itemId
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-gray-400">{weekIndex + 1}.{itemIndex + 1}</span>
                        {getItemIcon(item.type)}
                        <span className="flex-1 text-left">{item.title}</span>
                        {isCompleted(item._id) && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {currentItem && currentWeek ? (
            <>
              {/* Progress indicator */}
              <div className="mb-6 text-sm text-gray-600">
                Unit {module.units.findIndex(w => w._id === currentWeek._id) + 1} • 
                Item {currentWeek.items.findIndex(i => i._id === itemId) + 1} of {currentWeek.items.length}
              </div>

              {/* Item content */}
              <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  {getItemIcon(currentItem.type)}
                  <span className="capitalize">{currentItem.type}</span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  {currentItem.title}
                </h1>

                {/* Render content based on type */}
                {(currentItem.type === 'article' || currentItem.type === 'reading' || currentItem.type === 'lab') && (
                  <div className="prose max-w-none">
                    {currentItem.content ? (
                      <RichTextEditor
                        value={currentItem.content} 
                        readOnly={true}
                      />
                    ) : (
                      <p className="text-gray-500">No content available for this item.</p>
                    )}
                  </div>
                )}

                {currentItem.type === 'video' && (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    {currentItem.videoUrl ? (
                      <iframe
                        src={currentItem.videoUrl}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                        title={currentItem.title}
                      />
                    ) : (
                      <div className="text-gray-500">Video URL not available</div>
                    )}
                  </div>
                )}

                {(currentItem.type === 'test' || currentItem.type === 'quiz') && (
                  <div className="space-y-4">
                    <p className="text-gray-600">Quiz functionality coming soon!</p>
                    {/* Add your quiz component here */}
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePreviousItem}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isFirstItem}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <button
                  onClick={handleMarkComplete}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  {isLastItem ? 'Complete Module' : 'Mark as complete & Next'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600 py-12">
              <p>Select an item from the sidebar to begin learning</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModuleLearningPage;