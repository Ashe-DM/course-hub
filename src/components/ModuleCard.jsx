import { BookOpen, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ModuleCard({ module }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/modules/${module._id}`);
  };

  // Calculate total items from units
  const totalItems = module.units?.reduce((sum, unit) => sum + (unit.items?.length || 0), 0) || 0;
  
  // Use title if available, fallback to name
  const moduleTitle = module.title || module.name;
  
  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden group border border-gray-200 h-full flex flex-col"
    >
      {/* Image Header */}
      <div 
        className="relative h-48 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: module.imageUrl ? `url(${module.imageUrl})` : 'none', backgroundColor: module.imageUrl ? 'transparent' : '#4F46E5' }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <BookOpen className="w-16 h-16 text-white opacity-90 relative z-10" />
        
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-white text-blue-600 rounded-full text-xs font-semibold">
            Published
          </span>
        </div>
        
        <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          <Clock className="w-4 h-4 inline mr-1" />
          {totalItems * 15} min
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold text-gray-900">{module.rating || 4.8}</span>
          </div>
          <span className="text-gray-500 text-sm">(0)</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition line-clamp-2 flex-1">
          {moduleTitle}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {module.description || 'Learn essential digital marketing skills and strategies'}
        </p>

        {/* Category */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
            {module.category || 'Digital Marketing'}
          </span>
          <span className="text-xs">Updated recently</span>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-600 font-medium">{totalItems} learning items</span>
            <span className="text-gray-500">Updated recently</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModuleCard;