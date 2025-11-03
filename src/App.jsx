// App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import NewSidebar from './components/NewSidebar';
import NewTopNav from './components/NewTopNav';
import StudentDashboard from './pages/StudentDashboard';
import DashboardRouter from './pages/DashboardRouter';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ModulesPage from './pages/ModulesPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import ModuleLearningPage from './pages/ModuleLearningPage';
import ComingSoonPage from './pages/ComingSoonPage';
import AuthPage from './pages/AuthPage';
import * as moduleApi from './api/moduleApi';
import SettingsPage from './pages/SettingsPage';
import RoadmapsPage from './pages/RoadmapsPage';
import ModuleCreatorPage from './pages/ModuleCreatorPage';

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
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <NewSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <NewTopNav searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <main className="flex-1 overflow-y-auto">
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
          <Route path="dashboard" element={<DashboardRouter />} />
          <Route path="modules" element={<ModulesPage />} />
          {/* NEW: Module Creator Routes */}
          <Route path="modules/create" element={<ModuleCreatorPage />} />
          <Route path="modules/:moduleId/edit" element={<ModuleCreatorPage />} />
          <Route path="roadmaps" element={<RoadmapsPage />} />
          <Route path="events" element={<ComingSoonPage title="Events" />} />
          <Route path="messages" element={<ComingSoonPage title="Messages" />} />
          <Route path="students" element={<ComingSoonPage title="Students" />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="/modules/:moduleId" element={<ModuleDetailPage />} />
        </Route>

        {/* Module pages WITH Sidebar */}
        <Route path="/modules/:moduleId" element={<ModuleDetailPage />} />
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