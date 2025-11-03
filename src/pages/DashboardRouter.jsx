// DashboardRouter.jsx
import { useUser } from '../context/UserContext';
import StudentDashboard from './StudentDashboard';
import MentorDashboard from './MentorDashboard';
import AdminDashboard from './AdminDashboard';

function DashboardRouter() {
  const { user } = useUser();

  // Show appropriate dashboard based on role
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user?.role === 'mentor') {
    return <MentorDashboard />;
  }

  // Default to student dashboard
  return <StudentDashboard />;
}

export default DashboardRouter;