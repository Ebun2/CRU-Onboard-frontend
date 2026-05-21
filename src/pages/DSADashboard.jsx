import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';

const DSADashboard = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState({ passed: [], failed: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterTopic, setFilterTopic] = useState('');

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchResults();
  }, [admin]);

  const fetchResults = async () => {
    try {
      const { data } = await API.get('/admin/dsa/results');
      setResults(data);
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const allAttempts = [...results.passed, ...results.failed]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const displayData = activeTab === 'passed' ? results.passed :
    activeTab === 'failed' ? results.failed : allAttempts;

  // Get unique departments and topics for filter dropdowns
  const departments = [...new Set(allAttempts.map(a => a.studentId?.department).filter(Boolean))];
  const topics = [...new Set(allAttempts.map(a => a.topicId?.title).filter(Boolean))];

  // Apply filters
  const filteredData = displayData.filter(attempt => {
    const matchesSearch = searchTerm === '' ||
      attempt.studentId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.studentId?.cruNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.studentId?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filterDepartment === '' ||
      attempt.studentId?.department === filterDepartment;

    const matchesTopic = filterTopic === '' ||
      attempt.topicId?.title === filterTopic;

    return matchesSearch && matchesDepartment && matchesTopic;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterDepartment('');
    setFilterTopic('');
  };

  return (
    <div className="admin-page">
      <nav className="navbar admin-navbar">
        <div className="navbar-brand">
          <img src="https://th.bing.com/th/id/ODF.LlApKej9G3fd5Je1VUbumg?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2" style={{
            
          }} width={50} alt="Crawford University" />
          <span>DSA Dashboard</span>
        </div>
        <Link to="/admin/dashboard" className="btn-back">← Back to Dashboard</Link>
      </nav>

      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Student Quiz Results</h1>
          <span className="total-count">{results.total} total attempts</span>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: '30px' }}>
          <div className="stat-card" style={{ borderTopColor: '#27ae60' }}>
            <h3>{results.passed.length}</h3>
            <p>Passed</p>
          </div>
          <div className="stat-card" style={{ borderTopColor: '#e74c3c' }}>
            <h3>{results.failed.length}</h3>
            <p>Failed</p>
          </div>
          <div className="stat-card">
            <h3>{results.total > 0 ? Math.round((results.passed.length / results.total) * 100) : 0}%</h3>
            <p>Pass Rate</p>
          </div>
          <div className="stat-card" style={{ borderTopColor: '#f39c12' }}>
            <h3>{filteredData.length}</h3>
            <p>Showing</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['all', 'passed', 'failed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'btn-primary' : 'btn-secondary'}
              style={{ width: 'auto', padding: '8px 20px', textTransform: 'capitalize' }}
            >
              {tab === 'all' ? `All (${results.total})` :
               tab === 'passed' ? `Passed (${results.passed.length})` :
               `Failed (${results.failed.length})`}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          background: 'white', padding: '20px', borderRadius: '10px',
          marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                🔍 Search by Name, CRU Number or Email
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student..."
                style={{
                  width: '100%', padding: '10px 12px',
                  border: '2px solid #e0e0e0', borderRadius: '8px',
                  fontSize: '14px', outline: 'none'
                }}
              />
            </div>
            <div style={{ flex: '1', minWidth: '180px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                🏢 Filter by Department
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px',
                  border: '2px solid #e0e0e0', borderRadius: '8px',
                  fontSize: '14px', outline: 'none'
                }}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: '1', minWidth: '180px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px' }}>
                📚 Filter by Topic
              </label>
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px',
                  border: '2px solid #e0e0e0', borderRadius: '8px',
                  fontSize: '14px', outline: 'none'
                }}
              >
                <option value="">All Topics</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
            {(searchTerm || filterDepartment || filterTopic) && (
              <button
                onClick={clearFilters}
                style={{
                  padding: '10px 20px', background: '#e74c3c',
                  color: 'white', border: 'none', borderRadius: '8px',
                  cursor: 'pointer', fontWeight: '600', fontSize: '14px'
                }}
              >
                ✕ Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Table */}
        {loading ? (
          <div className="loading">Loading results...</div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">
            <h3>No results found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="topics-table">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>CRU Number</th>
                  <th>Department</th>
                  <th>Topic</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(attempt => (
                  <tr key={attempt._id}>
                    <td>{attempt.studentId?.fullName || 'N/A'}</td>
                    <td>{attempt.studentId?.cruNumber || 'N/A'}</td>
                    <td>{attempt.studentId?.department || 'N/A'}</td>
                    <td>{attempt.topicId?.title || 'N/A'}</td>
                    <td>{attempt.score}/{attempt.totalQuestions}</td>
                    <td>{Math.round((attempt.score / attempt.totalQuestions) * 100)}%</td>
                    <td>
                      <span className={`status-badge ${attempt.passed ? 'published' : 'draft'}`}>
                        {attempt.passed ? '✅ Passed' : '❌ Failed'}
                      </span>
                    </td>
                    <td>{new Date(attempt.createdAt).toLocaleDateString()}</td>
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

export default DSADashboard;