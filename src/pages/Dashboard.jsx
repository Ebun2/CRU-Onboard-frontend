import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTopics();
  }, [user]);

  const fetchTopics = async () => {
    try {
      const { data } = await API.get('/topics');
      setTopics(data);
    } catch (error) {
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

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
          <span>Welcome, {user?.fullName}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Orientation Program</h1>
          <p>Complete all topics and quizzes to finish your orientation</p>
        </div>

        {loading ? (
          <div className="loading">Loading topics...</div>
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