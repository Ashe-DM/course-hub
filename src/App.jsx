import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { ProgressProvider } from './context/ProgressContext';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './pages/Dashboard';
import ModulesPage from './pages/ModulesPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import ModuleLearningPage from './pages/ModuleLearningPage';
import ComingSoonPage from './pages/ComingSoonPage';
import AuthPage from './pages/AuthPage';
import * as moduleApi from './api/moduleApi';

function App() {
  const [currentPage, setCurrentPage] = useState('modules');
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "Digital Marketing Hub",
      "description": "A collaborative platform for digital marketing education",
      "url": window.location.origin,
      "offers": {
        "@type": "Offer",
        "category": "Education",
        "price": "0",
        "priceCurrency": "USD"
      }
    });
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      setLoading(true);
      const data = await moduleApi.getAllModules();
      setModules(data);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUnit = async (moduleId, unitData) => {
    try {
      const updatedModule = await moduleApi.addUnit(moduleId, unitData);
      setModules(modules.map(m => m._id === moduleId ? updatedModule : m));
      if (selectedModule && selectedModule._id === moduleId) {
        setSelectedModule(updatedModule);
      }
    } catch (error) {
      console.error('Error adding unit:', error);
      alert('Failed to add unit');
    }
  };

  const handleAddItem = async (moduleId, unitId, itemData) => {
    try {
      const updatedModule = await moduleApi.addItem(moduleId, unitId, itemData);
      setModules(modules.map(m => m._id === moduleId ? updatedModule : m));
      
      if (selectedModule && selectedModule._id === moduleId) {
        setSelectedModule(updatedModule);
        const updatedUnit = updatedModule.units.find(u => u._id === unitId);
        if (updatedUnit) {
          setSelectedUnit(updatedUnit);
        }
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    }
  };

  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit);
    setCurrentPage('unitDetail');
  };

  const handleViewItem = (item) => {
    if (item.type === 'reading' || item.type === 'lab') {
      setSelectedItem(item);
      setCurrentPage('itemPresentation');
    } else if (item.type === 'quiz') {
      alert('Quiz viewer coming soon!');
    }
  };

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    const { user, loading: userLoading } = useUser();

    if (userLoading || loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  // Layout component with Sidebar and TopNav
  const ProtectedLayoutWithSidebar = () => {
    const { user, loading: userLoading } = useUser();
    const navigate = useNavigate();

    if (userLoading || loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return (
      <div className="flex h-screen">
        <Sidebar currentPage={currentPage} setCurrentPage={(page) => { setCurrentPage(page); navigate(`/${page}`); }} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <Outlet />
          </main>
        </div>
      </div>
    );
  };

  return (
    <UserProvider>
      <ProgressProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<AuthPage />} />
            
            {/* Protected Routes WITH Sidebar and TopNav */}
            <Route path="/" element={<ProtectedLayoutWithSidebar />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="modules" element={
                <ModulesPage 
                  modules={modules} 
                  setSelectedModule={setSelectedModule}
                  setCurrentPage={setCurrentPage}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              } />
              <Route path="content" element={<ComingSoonPage title="All Content" />} />
              <Route path="resources" element={<ComingSoonPage title="Resources" />} />
            </Route>

            {/* Protected Routes WITHOUT Sidebar (Full Screen) */}
            <Route path="/modules/:moduleId" element={
              <ProtectedRoute>
                <ModuleDetailPage 
                  module={selectedModule}
                  onBack={() => { setCurrentPage('modules'); setSelectedModule(null); }}
                  onAddUnit={handleAddUnit}
                  onSelectUnit={handleSelectUnit}
                />
              </ProtectedRoute>
            } />
            
            {/* Use ModuleLearningPage for both routes since it already exists */}
            <Route path="/modules/:moduleId/learn/:unitId/:itemId" element={
              <ProtectedRoute>
                <ModuleLearningPage />
              </ProtectedRoute>
            } />
            
            {/* Simple UnitListPage using the same component or a simple page */}
            <Route path="/modules/:moduleId/units" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50 p-8">
                  <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Unit List</h1>
                    <p className="text-gray-500">Unit list functionality coming soon.</p>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Keep your existing ModuleLearningPage route for compatibility */}
            <Route path="/modules/:moduleId/learn/:weekId/:itemId" element={
              <ProtectedRoute>
                <ModuleLearningPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </ProgressProvider>
    </UserProvider>
  );
}

export default App;