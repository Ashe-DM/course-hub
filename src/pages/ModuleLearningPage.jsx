import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Lock,
  Play, BookOpen, FileText, Video as VideoIcon, CheckSquare
} from 'lucide-react';
import { getModuleById, markItemComplete } from '../api/moduleApi';
import { useProgress } from '../context/ProgressContext';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

function ModuleLearningPage() {
  const { moduleId, unitId, itemId } = useParams();
  const navigate = useNavigate();
  const { isCompleted, markComplete } = useProgress();
  const [module, setModule] = useState(null);
  const [currentUnit, setCurrentUnit] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    loadModuleAndItem();
  }, [moduleId, unitId, itemId]);

  const loadModuleAndItem = async () => {
    try {
      setLoading(true);
      const data = await getModuleById(moduleId);
      setModule(data);

      // Find current unit and item
      const unit = data.units?.find(u => u._id === unitId);
      const item = unit?.items?.find(i => i._id === itemId);

      setCurrentUnit(unit);
      setCurrentItem(item);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!currentItem || isCompleted(currentItem._id)) return;

    try {
      await markComplete(moduleId, unitId, itemId);
      // Move to next item automatically
      goToNext();
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  const goToPrevious = () => {
    const { prevUnit, prevItem } = findAdjacentItem('prev');
    if (prevUnit && prevItem) {
      navigate(`/modules/${moduleId}/learn/${prevUnit._id}/${prevItem._id}`);
    }
  };

  const goToNext = () => {
    const { nextUnit, nextItem } = findAdjacentItem('next');
    if (nextUnit && nextItem) {
      navigate(`/modules/${moduleId}/learn/${nextUnit._id}/${nextItem._id}`);
    } else {
      // Course complete!
      navigate(`/modules/${moduleId}`);
    }
  };

  const findAdjacentItem = (direction) => {
    if (!module || !currentUnit || !currentItem) return {};

    const unitIndex = module.units.findIndex(u => u._id === unitId);
    const itemIndex = currentUnit.items.findIndex(i => i._id === itemId);

    if (direction === 'next') {
      // Try next item in same unit
      if (itemIndex < currentUnit.items.length - 1) {
        return {
          nextUnit: currentUnit,
          nextItem: currentUnit.items[itemIndex + 1]
        };
      }
      // Try first item of next unit
      if (unitIndex < module.units.length - 1) {
        const nextUnit = module.units[unitIndex + 1];
        return {
          nextUnit,
          nextItem: nextUnit.items[0]
        };
      }
    } else {
      // Try previous item in same unit
      if (itemIndex > 0) {
        return {
          prevUnit: currentUnit,
          prevItem: currentUnit.items[itemIndex - 1]
        };
      }
      // Try last item of previous unit
      if (unitIndex > 0) {
        const prevUnit = module.units[unitIndex - 1];
        return {
          prevUnit,
          prevItem: prevUnit.items[prevUnit.items.length - 1]
        };
      }
    }

    return {};
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: answerIndex
    });
  };

  const submitQuiz = () => {
    if (!currentItem?.questions) return;

    let correct = 0;
    currentItem.questions.forEach((q, index) => {
      if (quizAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / currentItem.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    // Auto-complete if passed (>= 70%)
    if (score >= 70) {
      handleMarkComplete();
    }
  };

  const retryQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading lesson...</div>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lesson not found</h2>
        <button
          onClick={() => navigate(`/modules/${moduleId}`)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Module
        </button>
      </div>
    );
  }

  const { prevUnit, prevItem } = findAdjacentItem('prev');
  const { nextUnit, nextItem } = findAdjacentItem('next');
  const itemCompleted = isCompleted(currentItem._id);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar - Lesson List */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigate(`/modules/${moduleId}`)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Course</span>
          </button>
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2">
            {module?.title || module?.name}
          </h3>
        </div>

        {/* Units & Items */}
        <div className="p-4 space-y-4">
          {module?.units?.map((unit, unitIndex) => (
            <div key={unit._id} className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Unit {unitIndex + 1}: {unit.title}
              </h4>
              <div className="space-y-1">
                {unit.items?.map((item) => {
                  const isActive = item._id === itemId;
                  const completed = isCompleted(item._id);
                  const Icon = completed ? CheckCircle : (
                    item.type === 'video' ? VideoIcon :
                    item.type === 'quiz' ? CheckSquare :
                    item.type === 'reading' ? BookOpen : FileText
                  );

                  return (
                    <button
                      key={item._id}
                      onClick={() => navigate(`/modules/${moduleId}/learn/${unit._id}/${item._id}`)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${completed ? 'text-green-600' : ''}`} />
                      <span className="flex-1 text-left truncate">{item.title}</span>
                      {item.duration && (
                        <span className="text-xs text-gray-500">{item.duration}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPrevious}
              disabled={!prevItem}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">{currentItem.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {currentItem.type} • {currentItem.duration || 'Self-paced'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!itemCompleted && currentItem.type !== 'quiz' && (
              <button
                onClick={handleMarkComplete}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark Complete
              </button>
            )}
            <button
              onClick={goToNext}
              disabled={!nextItem}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Video Content */}
            {currentItem.type === 'video' && (
              <div className="bg-black rounded-xl overflow-hidden mb-8 aspect-video">
                {currentItem.videoUrl ? (
                  <iframe
                    src={currentItem.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <VideoIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No video URL provided</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reading/Article Content */}
            {(currentItem.type === 'reading' || currentItem.type === 'article' || currentItem.type === 'lab') && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                {currentItem.content ? (
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw, rehypeHighlight]}
                      remarkPlugins={[remarkGfm]}
                    >
                      {currentItem.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No content available</p>
                  </div>
                )}
              </div>
            )}

            {/* Quiz Content */}
            {currentItem.type === 'quiz' && currentItem.questions && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Quiz: {currentItem.title}
                </h2>

                {!quizSubmitted ? (
                  <div className="space-y-6">
                    {currentItem.questions.map((question, qIndex) => (
                      <div key={qIndex} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                          {qIndex + 1}. {question.question}
                        </h3>
                        <div className="space-y-2">
                          {question.options?.map((option, oIndex) => (
                            <label
                              key={oIndex}
                              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                quizAnswers[qIndex] === oIndex
                                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${qIndex}`}
                                checked={quizAnswers[qIndex] === oIndex}
                                onChange={() => handleQuizAnswer(qIndex, oIndex)}
                                className="w-5 h-5 text-blue-600"
                              />
                              <span className="text-gray-900 dark:text-white">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={submitQuiz}
                      disabled={Object.keys(quizAnswers).length !== currentItem.questions.length}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      Submit Quiz
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className={`text-center py-8 px-6 rounded-xl mb-6 ${
                      quizScore >= 70
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-600'
                        : 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-600'
                    }`}>
                      <div className="text-6xl font-bold mb-2" style={{ color: quizScore >= 70 ? '#16a34a' : '#ea580c' }}>
                        {quizScore}%
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {quizScore >= 70 ? '🎉 Great job! You passed!' : '📚 Keep practicing!'}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        You got {Object.values(quizAnswers).filter((a, i) => a === currentItem.questions[i].correctAnswer).length} out of {currentItem.questions.length} correct
                      </p>
                    </div>

                    {/* Show answers */}
                    <div className="space-y-6 mb-6">
                      {currentItem.questions.map((question, qIndex) => {
                        const userAnswer = quizAnswers[qIndex];
                        const correct = userAnswer === question.correctAnswer;

                        return (
                          <div key={qIndex} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                              {qIndex + 1}. {question.question}
                            </h3>
                            <div className="space-y-2">
                              {question.options?.map((option, oIndex) => {
                                const isCorrect = oIndex === question.correctAnswer;
                                const wasSelected = oIndex === userAnswer;

                                return (
                                  <div
                                    key={oIndex}
                                    className={`p-4 border-2 rounded-lg ${
                                      isCorrect
                                        ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                                        : wasSelected
                                        ? 'border-red-600 bg-red-50 dark:bg-red-900/20'
                                        : 'border-gray-200 dark:border-gray-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      {isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                                      <span className="text-gray-900 dark:text-white">{option}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            {question.explanation && (
                              <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  <strong>Explanation:</strong> {question.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-4">
                      {quizScore < 70 && (
                        <button
                          onClick={retryQuiz}
                          className="flex-1 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                        >
                          Try Again
                        </button>
                      )}
                      {nextItem && (
                        <button
                          onClick={goToNext}
                          className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          Next Lesson
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModuleLearningPage;