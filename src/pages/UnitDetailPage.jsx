import { useState } from 'react'
import { ArrowLeft, BookOpen, FlaskConical, HelpCircle, Plus, X, ChevronDown, ChevronUp, Play, Trash2 } from 'lucide-react'
import MarkdownEditor from '../components/MarkdownEditor'

function UnitDetailPage({ module, unit, onBack, onAddItem, onViewItem }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [itemType, setItemType] = useState('reading')
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('')
  const [content, setContent] = useState('')
  
  // For quizzes
  const [questions, setQuestions] = useState([{
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  }])

  const getItemIcon = (type) => {
    switch(type) {
      case 'reading': return <BookOpen className="w-5 h-5" />
      case 'lab': return <FlaskConical className="w-5 h-5" />
      case 'quiz': return <HelpCircle className="w-5 h-5" />
      case 'video': return <Play className="w-5 h-5" />
      default: return <BookOpen className="w-5 h-5" />
    }
  }

  const getItemLabel = (type) => {
    switch(type) {
      case 'reading': return 'Reading'
      case 'lab': return 'Lab'
      case 'quiz': return 'Graded Quiz'
      case 'video': return 'Video'
      default: return 'Item'
    }
  }

  const handleAddItem = () => {
    if (!title.trim()) {
      alert('Title is required')
      return
    }

    if (itemType !== 'quiz' && !content.trim()) {
      alert('Content is required')
      return
    }

    if (itemType === 'quiz') {
      const hasEmptyQuestion = questions.some(q => !q.question.trim())
      const hasEmptyOptions = questions.some(q => q.options.some(opt => !opt.trim()))
      
      if (hasEmptyQuestion || hasEmptyOptions) {
        alert('All quiz questions and options must be filled')
        return
      }
    }

    const itemData = {
      type: itemType,
      title,
      duration,
      content: itemType !== 'quiz' ? content : '',
      questions: itemType === 'quiz' ? questions : []
    }

    onAddItem(module._id, unit._id, itemData)
    
    // Reset form
    setTitle('')
    setDuration('')
    setContent('')
    setItemType('reading')
    setQuestions([{
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }])
    setShowAddForm(false)
  }

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }])
  }

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    setQuestions(newQuestions)
  }

  const updateOption = (qIndex, optIndex, value) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].options[optIndex] = value
    setQuestions(newQuestions)
  }

  const totalReadings = unit.items?.filter(i => i.type === 'reading').length || 0
  const totalQuizzes = unit.items?.filter(i => i.type === 'quiz').length || 0

  return (
    <div>
      <button 
        onClick={onBack}
        className="text-blue-600 hover:text-blue-700 mb-6 flex items-center space-x-2 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Module</span>
      </button>

      {/* Unit Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 flex items-start justify-between hover:bg-gray-50 transition"
        >
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{unit.title}</h2>
              <span className="text-sm text-gray-600">{totalQuizzes} graded assessment{totalQuizzes !== 1 ? 's' : ''} left</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{totalReadings} reading{totalReadings !== 1 ? 's' : ''} left</span>
              </span>
              {totalQuizzes > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <HelpCircle className="w-4 h-4" />
                    <span>{totalQuizzes} graded assessment{totalQuizzes !== 1 ? 's' : ''} left</span>
                  </span>
                </>
              )}
            </div>
          </div>
          {isExpanded ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-200">
            <p className="text-gray-600 py-4">{unit.description}</p>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Content Item</span>
            </button>

            {/* Enhanced Add Item Form */}
            {showAddForm && (
              <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">Add New Content Item</h4>
                  <button onClick={() => setShowAddForm(false)}>
                    <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>

                {/* Item Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['reading', 'lab', 'quiz', 'video'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setItemType(type)}
                        className={`p-4 border-2 rounded-lg text-center capitalize transition ${
                          itemType === type
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          {getItemIcon(type)}
                          <span className="text-sm font-medium">{type}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Introduction to SEO Fundamentals"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Duration */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 15 min, 1h, 30 min"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Content (for reading/lab) */}
                {itemType !== 'quiz' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content * (Markdown supported)</label>
                    <MarkdownEditor
                      value={content}
                      onChange={setContent}
                      placeholder="# Introduction\n\nWrite your content here using Markdown...\n\n## Key Points\n- Point 1\n- Point 2\n\n```javascript\n// Code example\nconst example = 'Hello';\n```"
                    />
                  </div>
                )}

                {/* Quiz Questions */}
                {itemType === 'quiz' && (
                  <div className="mb-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">Quiz Questions *</label>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    {questions.map((q, qIndex) => (
                      <div key={qIndex} className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900">Question {qIndex + 1}</h5>
                          {questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(qIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder="Enter your question"
                          value={q.question}
                          onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="space-y-2 mb-3">
                          <p className="text-sm font-medium text-gray-700">Options (select correct answer):</p>
                          {q.options.map((opt, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={q.correctAnswer === optIndex}
                                onChange={() => updateQuestion(qIndex, 'correctAnswer', optIndex)}
                                className="w-4 h-4 text-blue-600"
                              />
                              <input
                                type="text"
                                placeholder={`Option ${optIndex + 1}`}
                                value={opt}
                                onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          ))}
                        </div>

                        <textarea
                          placeholder="Explanation (optional)"
                          value={q.explanation}
                          onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                          rows="2"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddItem}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Add {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="mt-6 space-y-3">
              {unit.items?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No content items yet</p>
              ) : (
                unit.items?.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => onViewItem(item)}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="text-gray-600">
                        {getItemIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                          <span>{getItemLabel(item.type)}</span>
                          {item.duration && (
                            <>
                              <span>•</span>
                              <span>{item.duration}</span>
                            </>
                          )}
                          {item.type === 'quiz' && (
                            <>
                              <span>•</span>
                              <span>Grade: --</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {(item.type === 'reading' || item.type === 'lab') && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                        Get started
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UnitDetailPage