import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
import Loader, { ButtonLoader } from '../components/Loader';

const AdminStudents = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data } = await API.get('/admin/progress');
      setProgress(data);
    } catch {
      console.log('Failed to load progress');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    setDeletingId(id);
    try {
      await API.delete(`/admin/students/${id}`);
      toast.success('Student deleted successfully!');
      fetchStudents();
    } catch {
      toast.error('Failed to delete student');
    } finally {
      setDeletingId(null);
    }
  };

  const getStudentAttempts = (studentId) => {
    return progress.filter(p => p.studentId?._id === studentId);
  };

  return (
    <div className="admin-page">
      <div className="admin-content">
        <div className="admin-page-header">
          <h1>Manage Students</h1>
          <span className="total-count">{students.length} students registered</span>
        </div>

        {loading ? (
          <Loader message="Loading students..." variant="panel" />
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
                        disabled={deletingId === student._id}
                      >
                        {deletingId === student._id ? <ButtonLoader label="Deleting..." /> : 'Delete'}
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
