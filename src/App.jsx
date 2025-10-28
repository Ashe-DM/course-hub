import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import ModulesPage from './pages/ModulesPage'
import ModuleDetailPage from './pages/ModuleDetailPage'
import UnitDetailPage from './pages/UnitDetailPage'
import ArticlePresentationPage from './pages/ArticlePresentationPage'
import ComingSoonPage from './pages/ComingSoonPage'
import * as moduleApi from './api/moduleApi'

function App() {
  const [currentPage, setCurrentPage] = useState('modules')
  const [selectedModule, setSelectedModule] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)

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

  const handleAddUnit = async (moduleId, unitData) => {
    try {
      const updatedModule = await moduleApi.addUnit(moduleId, unitData)
      setModules(modules.map(m => m._id === moduleId ? updatedModule : m))
      if (selectedModule && selectedModule._id === moduleId) {
        setSelectedModule(updatedModule)
      }
    } catch (error) {
      console.error('Error adding unit:', error)
      alert('Failed to add unit')
    }
  }

  const handleAddItem = async (moduleId, unitId, itemData) => {
    try {
      const updatedModule = await moduleApi.addItem(moduleId, unitId, itemData)
      setModules(modules.map(m => m._id === moduleId ? updatedModule : m))
      
      if (selectedModule && selectedModule._id === moduleId) {
        setSelectedModule(updatedModule)
        const updatedUnit = updatedModule.units.find(u => u._id === unitId)
        if (updatedUnit) {
          setSelectedUnit(updatedUnit)
        }
      }
    } catch (error) {
      console.error('Error adding item:', error)
      alert('Failed to add item')
    }
  }

  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit)
    setCurrentPage('unitDetail')
  }

  const handleViewItem = (item) => {
    if (item.type === 'reading' || item.type === 'lab') {
      setSelectedItem(item)
      setCurrentPage('itemPresentation')
    } else if (item.type === 'quiz') {
      // Handle quiz view later
      alert('Quiz viewer coming soon!')
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
      {currentPage !== 'itemPresentation' && (
        <>
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <TopNav searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </>
      )}
      
      <main className={currentPage !== 'itemPresentation' ? 'ml-64 pt-20 p-8' : ''}>
        <div className={currentPage !== 'itemPresentation' ? 'max-w-7xl mx-auto' : ''}>
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
              onBack={() => {
                setCurrentPage('modules')
                setSelectedModule(null)
              }}
              onAddUnit={handleAddUnit}
              onSelectUnit={handleSelectUnit}
            />
          )}

          {currentPage === 'unitDetail' && selectedModule && selectedUnit && (
            <UnitDetailPage
              module={selectedModule}
              unit={selectedUnit}
              onBack={() => {
                setCurrentPage('moduleDetail')
                setSelectedUnit(null)
              }}
              onAddItem={handleAddItem}
              onViewItem={handleViewItem}
            />
          )}

          {currentPage === 'itemPresentation' && selectedItem && (
            <ArticlePresentationPage
              article={selectedItem}
              onBack={() => {
                setCurrentPage('unitDetail')
                setSelectedItem(null)
              }}
            />
          )}
          
          {currentPage === 'lessons' && <ComingSoonPage title="All Content" />}
          {currentPage === 'extra' && <ComingSoonPage title="Resources" />}
        </div>
      </main>
    </div>
  )
}

export default App