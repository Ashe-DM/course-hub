import { ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

function ArticlePresentationPage({ article, onBack }) {
  // Split by headings for sections
  const sections = article.content.split(/(?=^#{1,2}\s)/m).filter(s => s.trim())

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="fixed top-4 left-4 z-50">
        <button 
          onClick={onBack}
          className="bg-white text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Title Section */}
        <section className="min-h-screen flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">{article.title}</h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            {article.duration && (
              <p className="text-xl text-gray-600 mt-6">{article.duration}</p>
            )}
          </div>
        </section>

        {/* Content Sections */}
        {sections.map((section, index) => (
          <section key={index} className="min-h-screen flex items-center justify-center p-8">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-4xl w-full">
              <div className="prose prose-lg prose-blue max-w-none">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      return inline ? (
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {section}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        ))}

        {/* End Section */}
        <section className="min-h-screen flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Thank You</h2>
            <button
              onClick={onBack}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium text-lg"
            >
              Back to Unit
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ArticlePresentationPage