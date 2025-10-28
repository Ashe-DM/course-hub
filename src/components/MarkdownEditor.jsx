import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import { Eye, Code } from 'lucide-react'
import 'highlight.js/styles/github-dark.css'

function MarkdownEditor({ value, onChange, placeholder }) {
  const [preview, setPreview] = useState(false)

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b border-gray-300">
        <div className="text-sm text-gray-600 font-medium">
          {preview ? 'Preview' : 'Markdown Editor'}
        </div>
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="flex items-center space-x-2 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm"
        >
          {preview ? (
            <>
              <Code className="w-4 h-4" />
              <span>Edit</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </>
          )}
        </button>
      </div>

      {/* Content */}
      {preview ? (
        <div className="p-6 bg-white prose prose-blue max-w-none min-h-64 overflow-auto">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
          >
            {value || '*No content yet*'}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Write your content in Markdown...\n\n# Heading\n## Subheading\n**bold** *italic*\n- List item\n```code```"}
          className="w-full p-4 min-h-64 font-mono text-sm focus:outline-none resize-none"
          spellCheck={false}
        />
      )}

      {/* Help Text */}
      {!preview && (
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-300 text-xs text-gray-600">
          <span className="font-semibold">Markdown supported:</span> **bold**, *italic*, # heading, - list, ```code```, [link](url)
        </div>
      )}
    </div>
  )
}

export default MarkdownEditor