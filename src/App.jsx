import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './pages/Dashboard';
import ModulesPage from './pages/ModulesPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import ModuleLearningPage from './pages/ModuleLearningPage';
import ComingSoonPage from './pages/ComingSoonPage';
import AuthPage from './pages/AuthPage';
import * as moduleApi from './api/moduleApi';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('modules');
  const [selectedModule, setSelectedModule] = useState(null);
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
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={(page) => { 
            setCurrentPage(page); 
            navigate(`/${page}`); 
          }} 
        />
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
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<AuthPage />} />
        
        {/* Protected Routes WITH Sidebar and TopNav */}
        <Route path="/" element={<ProtectedLayoutWithSidebar />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route 
            path="modules" 
            element={
              <ModulesPage 
                modules={modules} 
                setSelectedModule={setSelectedModule}
                setCurrentPage={setCurrentPage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            } 
          />
          <Route path="content" element={<ComingSoonPage title="All Content" />} />
          <Route path="resources" element={<ComingSoonPage title="Resources" />} />
        </Route>

        {/* Module pages WITH Sidebar */}
        <Route path="/modules/:moduleId" element={<ModuleDetailPage />} />
        <Route path="/modules/:moduleId/learn/:weekId/:itemId" element={<ModuleLearningPage />} />
        <Route path="/modules/:moduleId/learn/:unitId/:itemId" element={<ModuleLearningPage />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <ProgressProvider>
          <AppContent />
        </ProgressProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;