// ItemManager.jsx
import { useState } from 'react';
import { Plus, Edit, Trash2, BookOpen, Video, FileText, CheckSquare, Code } from 'lucide-react';
import { addItemToUnit, updateItem, deleteItem } from '../api/itemApi';
import RichTextEditor from './RichTextEditor';

function ItemManager({ moduleId, unit, onItemUpdated }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    type: 'reading',
    title: '',
    duration: '',
    content: '',
    videoUrl: ''
  });

  const itemTypes = [
    { value: 'reading', label: 'Reading', icon: BookOpen },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'article', label: 'Article', icon: FileText },
    { value: 'quiz', label: 'Quiz', icon: CheckSquare },
    { value: 'lab', label: 'Lab', icon: Code }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing item
        await updateItem(moduleId, unit._id, editingItem._id, formData);
      } else {
        // Add new item
        await addItemToUnit(moduleId, unit._id, formData);
      }
      
      setShowAddForm(false);
      setEditingItem(null);
      setFormData({ type: 'reading', title: '', duration: '', content: '', videoUrl: '' });
      onItemUpdated(); // Refresh the parent component
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      title: item.title,
      duration: item.duration || '',
      content: item.content || '',
      videoUrl: item.videoUrl || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (itemId) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(moduleId, unit._id, itemId);
        onItemUpdated(); // Refresh the parent component
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };

  const getItemIcon = (type) => {
    const itemType = itemTypes.find(t => t.value === type);
    return itemType ? itemType.icon : BookOpen;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Manage Items in "{unit.title}"</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold mb-3 text-gray-800">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {itemTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 15 min, 1h"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {formData.type === 'video' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* // Replace the textarea for content with: */}
          {(formData.type === 'reading' || formData.type === 'article' || formData.type === 'lab') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingItem(null);
                setFormData({ type: 'reading', title: '', duration: '', content: '', videoUrl: '' });
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {unit.items && unit.items.map((item, index) => {
          const ItemIcon = getItemIcon(item.type);
          
          return (
            <div key={item._id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3 flex-1">
                <ItemIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500">
                    {itemTypes.find(t => t.value === item.type)?.label} • {item.duration || 'No duration set'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                  title="Edit item"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        
        {(!unit.items || unit.items.length === 0) && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No items yet.</p>
            <p className="text-sm">Click "Add Item" to create your first learning item.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemManager;