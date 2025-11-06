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

  // Debug the route parameters
  useEffect(() => {
    console.log('🔍 Route Params:', { moduleId, unitId, itemId });
  }, [moduleId, unitId, itemId]);

  useEffect(() => {
    loadModuleAndItem();
  }, [moduleId, unitId, itemId]);

  const loadModuleAndItem = async () => {
    try {
      setLoading(true);
      console.log('📥 Loading module:', moduleId);
      
      const data = await getModuleById(moduleId);
      console.log('✅ Module loaded:', data);
      setModule(data);

      // Find current unit and item
      const unit = data.units?.find(u => u._id === unitId);
      const item = unit?.items?.find(i => i._id === itemId);

      console.log('🔍 Found unit:', unit);
      console.log('🔍 Found item:', item);

      setCurrentUnit(unit);
      setCurrentItem(item);
    } catch (error) {
      console.error('❌ Error loading content:', error);
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
      console.log('⬅️ Going to previous:', { prevUnit: prevUnit._id, prevItem: prevItem._id });
      navigate(`/modules/${moduleId}/learn/${prevUnit._id}/${prevItem._id}`);
    }
  };

  const goToNext = () => {
    const { nextUnit, nextItem } = findAdjacentItem('next');
    if (nextUnit && nextItem) {
      console.log('➡️ Going to next:', { nextUnit: nextUnit._id, nextItem: nextItem._id });
      navigate(`/modules/${moduleId}/learn/${nextUnit._id}/${nextItem._id}`);
    } else {
      // Course complete!
      console.log('🎉 Course complete!');
      navigate(`/modules/${moduleId}`);
    }
  };

  const findAdjacentItem = (direction) => {
    if (!module || !currentUnit || !currentItem) {
      console.log('❌ Cannot find adjacent item - missing data');
      return {};
    }

    const unitIndex = module.units.findIndex(u => u._id === unitId);
    const itemIndex = currentUnit.items.findIndex(i => i._id === itemId);

    console.log(`🔍 Finding ${direction} item:`, { unitIndex, itemIndex });

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
        if (nextUnit.items && nextUnit.items.length > 0) {
          return {
            nextUnit,
            nextItem: nextUnit.items[0]
          };
        }
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
        if (prevUnit.items && prevUnit.items.length > 0) {
          return {
            prevUnit,
            prevItem: prevUnit.items[prevUnit.items.length - 1]
          };
        }
      }
    }

    console.log(`❌ No ${direction} item found`);
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
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Module: {moduleId}<br />
          Unit: {unitId}<br />
          Item: {itemId}
        </p>
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
                      onClick={() => {
                        console.log('📚 Navigating to:', { unitId: unit._id, itemId: item._id });
                        navigate(`/modules/${moduleId}/learn/${unit._id}/${item._id}`);
                      }}
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

            {/* Reading/Article Content - FutureLearn Style */}
            {(currentItem.type === 'reading' || currentItem.type === 'article' || currentItem.type === 'lab') && (
              <div className="bg-white dark:bg-gray-800">
                {currentItem.content ? (
                  <article className="max-w-3xl mx-auto px-8 py-12">
                    <div 
                      className="prose prose-lg dark:prose-invert max-w-none 
                      prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                      prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
                      prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
                      prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
                      prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                      prose-a:text-pink-600 dark:prose-a:text-pink-400 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                      prose-ul:my-6 prose-ul:space-y-2
                      prose-ol:my-6 prose-ol:space-y-2
                      prose-li:text-gray-700 dark:prose-li:text-gray-300
                      prose-blockquote:border-l-4 prose-blockquote:border-pink-600 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
                      prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
                      prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:shadow-lg
                      prose-img:rounded-lg prose-img:shadow-md prose-img:my-8 prose-img:mx-auto prose-img:max-w-full
                      prose-hr:border-gray-200 dark:prose-hr:border-gray-700 prose-hr:my-12
                      prose-table:border-collapse prose-table:w-full prose-table:my-8
                      prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600
                      prose-td:p-3 prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600
                      "
                    >
                      <ReactMarkdown
                        rehypePlugins={[rehypeRaw, rehypeHighlight]}
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Custom image rendering - FutureLearn style
                          img: ({node, ...props}) => (
                            <figure className="my-8">
                              <img 
                                {...props} 
                                className="rounded-lg shadow-md mx-auto max-w-full h-auto"
                                loading="lazy"
                              />
                              {props.alt && (
                                <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 italic">
                                  {props.alt}
                                </figcaption>
                              )}
                            </figure>
                          ),
                          // Custom code block rendering
                          code: ({node, inline, className, children, ...props}) => {
                            const match = /language-(\w+)/.exec(className || '');
                            if (!inline && match) {
                              return (
                                <div className="relative my-6 group">
                                  <div className="absolute top-3 right-3 bg-gray-700 text-gray-300 px-3 py-1 rounded text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                    {match[1]}
                                  </div>
                                  <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-6 rounded-lg overflow-x-auto shadow-lg">
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  </pre>
                                </div>
                              );
                            }
                            return (
                              <code className="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                {children}
                              </code>
                            );
                          },
                          // Custom headings with anchors
                          h1: ({node, children, ...props}) => (
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8 border-b-2 border-pink-600 pb-4" {...props}>
                              {children}
                            </h1>
                          ),
                          h2: ({node, children, ...props}) => (
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8" {...props}>
                              {children}
                            </h2>
                          ),
                          // Custom blockquote
                          blockquote: ({node, children, ...props}) => (
                            <blockquote className="border-l-4 border-pink-600 pl-6 py-2 my-6 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg" {...props}>
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {currentItem.content}
                      </ReactMarkdown>
                    </div>

                    {/* Discussion prompt - FutureLearn style */}
                    <div className="mt-12 p-6 bg-pink-50 dark:bg-pink-900/20 border-l-4 border-pink-600 rounded-r-lg">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        Share your thoughts
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        What did you find most interesting about this topic? Share your insights in the discussion below.
                      </p>
                    </div>
                  </article>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
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