import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTopics = useCallback(async () => {
    try {
      const { data } = await API.get('/topics');
      setTopics(data);
    } catch {
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTopics();
  }, [user, navigate, fetchTopics]);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const categories = [
    'General', 'SRC', 'Library', 'Registrar',
    'DSA', 'College', 'Department', 'Clinic', 'Security'
  ];

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <img src="https://th.bing.com/th/id/ODF.LlApKej9G3fd5Je1VUbumg?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2" style={{
            
          }} width={50} alt="Crawford University" />
          <span>CRU Onboard</span>
        </div>
        <div className="navbar-user">
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <section className="dashboard-header">
          <div className="dashboard-header-text">
            <span className="welcome-eyebrow">Welcome back</span>
            <p className="dashboard-user-name">{user?.fullName || 'Student'}</p>
            <h1>Orientation Program</h1>
            <p>Continue your Crawford University orientation. Complete all topics and quizzes to finish your orientation.</p>
          </div>
          <div className="welcome-summary">
            <strong>{topics.length}</strong>
            <span>Available topics</span>
          </div>
        </section>

        {loading ? (
          <Loader message="Loading orientation topics..." />
        ) : topics.length === 0 ? (
          <div className="empty-state">
            <h3>No orientation topics available yet</h3>
            <p>Please check back later</p>
          </div>
        ) : (
          categories.map((category) => {
            const categoryTopics = topics.filter(t => t.category === category);
            if (categoryTopics.length === 0) return null;
            return (
              <div key={category} className="category-section">
                <h2 className="category-title">{category}</h2>
                <div className="topics-grid">
                  {categoryTopics.map((topic) => (
                    <Link to={`/topics/${topic._id}`} key={topic._id} className="topic-card">
                      <div className="topic-card-header">
                        <span className="topic-category">{topic.category}</span>
                      </div>
                      <h3>{topic.title}</h3>
                      <p>{topic.description}</p>
                      <span className="topic-link">Read More →</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
