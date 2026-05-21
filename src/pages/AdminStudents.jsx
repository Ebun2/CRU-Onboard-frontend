import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';

const AdminStudents = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchStudents();
    fetchProgress();
  }, [admin]);

  const fetchStudents = async () => {
    try {
      const { data } = await API.get('/admin/students');
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data } = await API.get('/admin/progress');
      setProgress(data);
    } catch (error) {
      console.log('Failed to load progress');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await API.delete(`/admin/students/${id}`);
      toast.success('Student deleted successfully!');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const getStudentAttempts = (studentId) => {
    return progress.filter(p => p.studentId?._id === studentId);
  };

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
          <h1>Manage Students</h1>
          <span className="total-count">{students.length} students registered</span>
        </div>

        {loading ? (
          <div className="loading">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <h3>No students registered yet</h3>
          </div>
        ) : (
          <div className="topics-table">
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>CRU Number</th>
                  <th>Department</th>
                  <th>Quiz Attempts</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td>{student.fullName}</td>
                    <td>{student.email}</td>
                    <td>{student.cruNumber}</td>
                    <td>{student.department}</td>
                    <td>{getStudentAttempts(student._id).length}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(student._id)}
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

export default AdminStudents;