import { ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

function ArticlePresentationPage({ article, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button 
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center space-x-2 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {article.title}
          </h1>
          <div className="w-16 h-1 bg-blue-600 mx-auto mb-4"></div>
          {article.duration && (
            <p className="text-gray-600 dark:text-gray-400">{article.duration}</p>
          )}
        </div>

        {/* Content Card - Coursera Style */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
              components={{
                h1: ({node, ...props}) => <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8" {...props} />,
                h2: ({node, ...props}) => <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 mt-6" {...props} />,
                h3: ({node, ...props}) => <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300" {...props} />,
                li: ({node, ...props}) => <li className="ml-4" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline ? (
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono text-pink-600 dark:text-pink-400" {...props} />
                  ) : (
                    <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto" {...props} />
                  ),
                pre: ({node, ...props}) => <pre className="my-6" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4" {...props} />
                ),
                hr: ({node, ...props}) => <hr className="my-8 border-gray-300 dark:border-gray-700" {...props} />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 font-medium transition"
          >
            Back to Unit
          </button>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            {article.duration || 'Read at your own pace'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticlePresentationPage