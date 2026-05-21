import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';

const AdminTopics = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTopic, setEditTopic] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    content: '',
    order: '',
    isPublished: false
  });

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchTopics();
  }, [admin]);

  const fetchTopics = async () => {
    try {
      const { data } = await API.get('/topics/admin/all');
      setTopics(data);
    } catch (error) {
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data being sent:', formData);
    try {
      if (editTopic) {
        await API.put(`/topics/${editTopic._id}`, formData);
        toast.success('Topic updated successfully!');
      } else {
        await API.post('/topics', formData);
        toast.success('Topic created successfully!');
      }
      setShowForm(false);
      setEditTopic(null);
      setFormData({
        title: '', category: '', description: '',
        content: '', order: '', isPublished: false
      });
      fetchTopics();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save topic');
    }
  };

  const handleEdit = (topic) => {
    setEditTopic(topic);
    setFormData({
      title: topic.title,
      category: topic.category,
      description: topic.description,
      content: topic.content,
      order: topic.order,
      isPublished: topic.isPublished
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this topic?')) return;
    try {
      await API.delete(`/topics/${id}`);
      toast.success('Topic deleted successfully!');
      fetchTopics();
    } catch (error) {
      toast.error('Failed to delete topic');
    }
  };

  const categories = [
    'General', 'SRC', 'Library', 'Registrar',
    'DSA(Student Affairs)', 'College', 'Department', 'Clinic', 'Security'
  ];

  return (
    <div className="admin-page">
      <nav className="navbar admin-navbar">
        <div className="navbar-brand">
          <img src="https://th.bing.com/th/id/ODF.LlApKej9G3fd5Je1VUbumg?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2" style={{
            
          }} width={50} alt="Crawford University" />
          <span>Admin Panel</span>
        </div>
        <Link to="/admin/dashboard" className="btn-back">← Back to Dashboard</Link>
      </nav>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Manage Topics</h1>
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setEditTopic(null);
              setFormData({
                title: '', category: '', description: '',
                content: '', order: '', isPublished: false
              });
            }}
          >
            {showForm ? 'Cancel' : '+ Add New Topic'}
          </button>
        </div>

        {showForm && (
          <div className="topic-form">
            <h2>{editTopic ? 'Edit Topic' : 'Add New Topic'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter topic title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description"
                  required
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Full topic content"
                  rows="8"
                  required
                />
              </div>
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="Display order (e.g. 1, 2, 3)"
                  required
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                  />
                  Publish this topic (visible to students)
                </label>
              </div>
              <button type="submit" className="btn-primary">
                {editTopic ? 'Update Topic' : 'Create Topic'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading topics...</div>
        ) : topics.length === 0 ? (
          <div className="empty-state">
            <h3>No topics yet</h3>
            <p>Click "Add New Topic" to create your first orientation topic</p>
          </div>
        ) : (
          <div className="topics-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {topics.map(topic => (
                  <tr key={topic._id}>
                    <td>{topic.title}</td>
                    <td>{topic.category}</td>
                    <td>{topic.order}</td>
                    <td>
                      <span className={`status-badge ${topic.isPublished ? 'published' : 'draft'}`}>
                        {topic.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(topic)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(topic._id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTopics;


