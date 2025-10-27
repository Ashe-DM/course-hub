import { Rocket } from 'lucide-react'

function ComingSoonPage({ title }) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <Rocket className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-600 text-lg">Coming Soon...</p>
      </div>
    </div>
  )
}

export default ComingSoonPage