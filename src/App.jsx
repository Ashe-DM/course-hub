import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import ModulesPage from './pages/ModulesPage'
import ModuleDetailPage from './pages/ModuleDetailPage'
import ProjectsPage from './pages/ProjectsPage'
import ComingSoonPage from './pages/ComingSoonPage'
import * as moduleApi from './api/moduleApi'

function App() {
  const [currentPage, setCurrentPage] = useState('modules')
  const [selectedModule, setSelectedModule] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)

  // Load modules from backend when app starts
  useEffect(() => {
    loadModules()
  }, [])

  const loadModules = async () => {
    try {
      setLoading(true)
      const data = await moduleApi.getAllModules()
      setModules(data)
    } catch (error) {
      console.error('Error loading modules:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddLesson = async (moduleId, lessonData) => {
    try {
      const updatedModule = await moduleApi.addLesson(moduleId, lessonData)
      
      // Update modules list
      setModules(modules.map(m => m._id === moduleId ? updatedModule : m))
      
      // Update selected module if viewing it
      if (selectedModule && selectedModule._id === moduleId) {
        setSelectedModule(updatedModule)
      }
    } catch (error) {
      console.error('Error adding lesson:', error)
      alert('Failed to add lesson')
    }
  }

  const handleAddProject = async (moduleId, projectData) => {
    try {
      const updatedModule = await moduleApi.addProject(moduleId, projectData)
      
      // Update modules list
      setModules(modules.map(m => m._id === moduleId ? updatedModule : m))
      
      // Update selected module if viewing it
      if (selectedModule && selectedModule._id === moduleId) {
        setSelectedModule(updatedModule)
      }
    } catch (error) {
      console.error('Error adding project:', error)
      alert('Failed to add project')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <TopNav searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <main className="ml-64 pt-20 p-8">
        <div className="max-w-7xl mx-auto">
          {currentPage === 'dashboard' && <ComingSoonPage title="Dashboard" />}
          
          {currentPage === 'modules' && (
            <ModulesPage 
              modules={modules} 
              setSelectedModule={setSelectedModule}
              setCurrentPage={setCurrentPage}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}
          
          {currentPage === 'moduleDetail' && selectedModule && (
            <ModuleDetailPage 
              module={selectedModule}
              onBack={() => setCurrentPage('modules')}
              onAddLesson={handleAddLesson}
              onAddProject={handleAddProject}
            />
          )}
          
          {currentPage === 'lessons' && <ComingSoonPage title="All Lessons" />}
          {currentPage === 'extra' && <ComingSoonPage title="Extra Learning" />}
          {currentPage === 'projects' && <ProjectsPage modules={modules} />}
        </div>
      </main>
    </div>
  )
}

export default App