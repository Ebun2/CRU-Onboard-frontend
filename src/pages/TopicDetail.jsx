import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const TopicDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTopic();
    fetchVideos();
  }, [id]);

  const fetchTopic = async () => {
    try {
      const { data } = await API.get(`/topics/${id}`);
      setTopic(data);
    } catch {
      toast.error('Failed to load topic');
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const { data } = await API.get(`/videos/${id}`);
      setVideos(data);
    } catch {
      console.log('No videos for this topic');
    }
  };

  if (loading) return <Loader message="Loading topic details..." />;
  if (!topic) return <div className="loading">Topic not found</div>;

  return (
    <div className="topic-detail">
      <nav className="navbar">
        <div className="navbar-brand">
          <img src="https://th.bing.com/th/id/ODF.LlApKej9G3fd5Je1VUbumg?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2" style={{
            
          }} width={50} alt="Crawford University" />
          <span>CRU Onboard</span>
        </div>
        <Link to="/dashboard" className="btn-back">← Back to Dashboard</Link>
      </nav>

      <div className="topic-content">
        <div className="topic-header">
          <span className="topic-category-badge">{topic.category}</span>
          <h1>{topic.title}</h1>
          <p className="topic-description">{topic.description}</p>
        </div>

        {videos.length > 0 && (
          <div className="videos-section">
            <h2>Orientation Videos</h2>
            <div className="videos-grid">
              {videos.map((video) => (
                <div key={video._id} className="video-card">
                  <h3>{video.title}</h3>
                  <div className="video-wrapper">
                    <iframe
                      src={video.videoUrl}
                      title={video.title}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                  {video.duration && <p>Duration: {video.duration}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="topic-body">
          <h2>About {topic.title}</h2>
          <div className="topic-text">
            {topic.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="topic-actions">
          <Link to={`/quiz/${id}`} className="btn-primary">
            Take Quiz →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
