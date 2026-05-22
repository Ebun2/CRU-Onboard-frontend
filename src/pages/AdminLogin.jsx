import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { ButtonLoader } from '../components/Loader';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/admin/login', formData);
      loginAdmin(data);
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <img src="/crawford-logo.png" alt="Crawford University" className="auth-logo" />
          <h2>Admin Login</h2>
          <p>CRU Onboard System</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <ButtonLoader label="Logging in..." /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
