import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
  }, [admin]);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data);
    } catch {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-content">
        <h1>Admin Dashboard</h1>

        {loading ? (
          <Loader message="Loading dashboard stats..." variant="panel" />
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{stats?.totalStudents}</h3>
              <p>Total Students</p>
            </div>
            <div className="stat-card">
              <h3>{stats?.totalTopics}</h3>
              <p>Published Topics</p>
            </div>
            <div className="stat-card">
              <h3>{stats?.totalAttempts}</h3>
              <p>Quiz Attempts</p>
            </div>
            <div className="stat-card">
              <h3>{stats?.passedAttempts}</h3>
              <p>Passed Quizzes</p>
            </div>
          </div>
        )}

        <div className="admin-menu">
  <Link to="/admin/topics" className="admin-menu-card">
    <h3>📚 Manage Topics</h3>
    <p>Add, edit or delete orientation topics</p>
  </Link>
  <Link to="/admin/students" className="admin-menu-card">
    <h3>👥 Manage Students</h3>
    <p>View registered students and their progress</p>
  </Link>
  <Link to="/admin/dsa" className="admin-menu-card">
    <h3>🎓 DSA Results</h3>
    <p>View students who passed their orientation quizzes</p>
  </Link>
  <Link to="/admin/questions" className="admin-menu-card">
  <h3>❓ Manage Questions</h3>
  <p>Add or delete quiz questions for each topic</p>
</Link>
</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
