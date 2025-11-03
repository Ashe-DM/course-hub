import { useState, useCallback, useEffect } from 'react';
import RichTextEditor from './RichTextEditor.jsx';

function AdvancedEditorWrapper({ content = '', onChange, dark = false }) {
  const [editorContent, setEditorContent] = useState(content);

  // Debounce function to avoid too many updates
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const debouncedOnChange = useCallback(
    debounce((value) => {
      if (onChange) {
        onChange(value);
      }
    }, 300),
    [onChange]
  );

  const handleChange = (newContent) => {
    setEditorContent(newContent);
    debouncedOnChange(newContent);
  };

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Using the actual RichTextEditor component */}
      <RichTextEditor
        output="html"
        content={editorContent}
        onChangeContent={handleChange}
        dark={dark}
      />
      
      {/* Optional preview section - you can remove this if not needed */}
      <div className="mt-4 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
            ✅ Advanced Editor Connected
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Now using the full-featured editor from <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">RichTextEditor.jsx</code>
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            Features: Rich text formatting, images, videos, tables, code blocks, mermaid diagrams, excalidraw, and more!
          </p>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Content Preview:</h5>
          <div 
            className="text-sm text-gray-600 dark:text-gray-400 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: editorContent || '<em>No content yet...</em>' }}
          />
        </div>
      </div>
    </div>
  );
}

export default AdvancedEditorWrapper;