import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Icon = ({ name }) => {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
  };

  const paths = {
    dashboard: (
      <>
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </>
    ),
    topics: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
      </>
    ),
    students: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    dsa: (
      <>
        <path d="m22 10-10-5-10 5 10 5 10-5Z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </>
    ),
    questions: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </>
    ),
    menu: (
      <>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </>
    ),
    close: (
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
      </>
    )
  };

  return <svg {...common}>{paths[name]}</svg>;
};

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/topics', label: 'Topics', icon: 'topics' },
  { to: '/admin/students', label: 'Students', icon: 'students' },
  { to: '/admin/dsa', label: 'DSA Results', icon: 'dsa' },
  { to: '/admin/questions', label: 'Questions', icon: 'questions' }
];

const pageTitles = {
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/topics': 'Manage Topics',
  '/admin/students': 'Manage Students',
  '/admin/dsa': 'DSA Results',
  '/admin/questions': 'Manage Questions'
};

const AdminLayout = ({ children }) => {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const title = pageTitles[location.pathname] || 'Admin Panel';

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`} aria-label="Admin navigation">
        <div className="admin-sidebar-brand">
          <img
            src="https://th.bing.com/th/id/ODF.LlApKej9G3fd5Je1VUbumg?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2"
            alt="Crawford University"
          />
          <div>
            <strong>CRU Onboard</strong>
            <span>Admin Console</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {adminLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="admin-sidebar-link"
              onClick={() => setSidebarOpen(false)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="admin-sidebar-logout" onClick={handleLogout}>
          <Icon name="logout" />
          <span>Logout</span>
        </button>
      </aside>

      <button
        type="button"
        className={`admin-sidebar-backdrop ${sidebarOpen ? 'is-visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close admin navigation"
      />

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-menu-toggle"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? 'Close admin navigation' : 'Open admin navigation'}
          >
            <Icon name={sidebarOpen ? 'close' : 'menu'} />
          </button>
          <div>
            <p>Admin Panel</p>
            <h1>{title}</h1>
          </div>
          <div className="admin-topbar-user">
            <span>{admin?.fullName || 'Administrator'}</span>
            <button type="button" onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </header>

        <main className="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
