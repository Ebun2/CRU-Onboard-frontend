import axios from 'axios';


const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('user');
  const admin = localStorage.getItem('admin');

  const isAdminPage = window.location.pathname.startsWith('/admin');
  const isAdminAuthRoute = req.url?.startsWith('/auth/admin');

  if ((isAdminPage || isAdminAuthRoute) && admin) {
    req.headers.Authorization = `Bearer ${JSON.parse(admin).token}`;
  } else if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  } else if (admin) {
    req.headers.Authorization = `Bearer ${JSON.parse(admin).token}`;
  }
  
  return req;
});

export default API;
