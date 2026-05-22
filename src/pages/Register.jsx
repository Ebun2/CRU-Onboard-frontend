import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { ButtonLoader } from '../components/Loader';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    cruNumber: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', formData);
      loginUser(data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'Computer Science and Technology',
    'Mass Communication',
    'Business Administration',
    'Accounting',
    'Economics',
    'Law',
    'Biochemistry',
    'Microbiology',
    'Industrial Chemistry',
    'Political Science',
    'Sociology',
    'Psychology',
    'Architecture',
    'Estate Management',
    'Other'
  ];

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
         <img src="https://th.bing.com/th/id/ODF.LlApKej9G3fd5Je1VUbumg?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2" style={{
            
          }} width={50} alt="Crawford University" />
          
          <h2>Student Registration</h2>
          <p>Create your orientation account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>CRU Number</label>
            <input
              type="text"
              name="cruNumber"
              value={formData.cruNumber}
              onChange={handleChange}
              placeholder="Enter your CRU number"
              required
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select your department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <ButtonLoader label="Registering..." /> : 'Register'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
