import { Search, X } from 'lucide-react'

function TopNav({ searchTerm, setSearchTerm }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6 ml-64 fixed top-0 right-0 left-64 z-10">
      <div className="flex-1 flex items-center justify-between max-w-7xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <button className="ml-6 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 font-medium transition">
          Sign In
        </button>
      </div>
    </header>
  )
}

export default TopNav