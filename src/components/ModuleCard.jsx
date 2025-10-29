import { BookOpen, FileText, Users, Clock, Star } from 'lucide-react'

function ModuleCard({ module, onClick }) {
  const totalItems = module.units?.reduce((sum, unit) => sum + (unit.items?.length || 0), 0) || 0;
  const totalReadings = module.units?.reduce((sum, unit) => 
    sum + (unit.items?.filter(i => i.type === 'reading').length || 0), 0) || 0;
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden group border border-gray-200"
    >
      {/* Image Header */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
        <BookOpen className="w-16 h-16 text-white opacity-80" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white text-blue-600 rounded-full text-xs font-semibold">
            Published
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4 inline mr-1" />
          {totalItems * 15} min
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold text-gray-900">4.8</span>
          </div>
          <span className="text-gray-500 text-sm">(0)</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition line-clamp-2">
          {module.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {module.description || 'Learn essential digital marketing skills and strategies'}
        </p>

        {/* Category */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
            Digital Marketing
          </span>
          <span className="text-xs">Updated recently</span>
        </div>

        {/* Stats
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">Free</p>
            <p className="text-xs text-gray-500">Price</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">Students</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            <p className="text-xs text-gray-500">Items</p>
          </div>
        </div> */}
        {/* Footer */}
        {/* <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-600 font-medium">{totalItems} learning items</span>
            <span className="text-gray-500">Updated recently</span>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default ModuleCard