import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TopicDetail from './pages/TopicDetail';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminTopics from './pages/AdminTopics';
import AdminStudents from './pages/AdminStudents';
import DSADashboard from './pages/DSADashboard';
import AdminQuestions from './pages/AdminQuestions';

function App() {
  const adminPage = (page) => (
    <AdminProtectedRoute>
      <AdminLayout>{page}</AdminLayout>
    </AdminProtectedRoute>
  );

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/topics/:id" element={
            <ProtectedRoute><TopicDetail /></ProtectedRoute>
          } />
          <Route path="/quiz/:id" element={
            <ProtectedRoute><Quiz /></ProtectedRoute>
          } />
          <Route path="/quiz/:id/result" element={
            <ProtectedRoute><QuizResult /></ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            adminPage(<AdminDashboard />)
          } />
          <Route path="/admin/topics" element={
            adminPage(<AdminTopics />)
          } />
          <Route path="/admin/students" element={
            adminPage(<AdminStudents />)
          } />
          <Route path="/admin/dsa" element={
            adminPage(<DSADashboard />)
          } />
          <Route path="/admin/questions" element={
            adminPage(<AdminQuestions />)
          } />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
