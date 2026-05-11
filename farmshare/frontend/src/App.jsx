import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import FarmerDashboard from './pages/FarmerDashboard.jsx';
import UploadData from './pages/UploadData.jsx';
import MyBenchmarks from './pages/MyBenchmarks.jsx';
import SharingControls from './pages/SharingControls.jsx';
import ResearcherView from './pages/ResearcherView.jsx';
import ServiceProviderView from './pages/ServiceProviderView.jsx';
import GovernmentView from './pages/GovernmentView.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import CaseStudies from './pages/CaseStudies.jsx';

function Protected({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'farmer') return <Navigate to="/farmer" replace />;
  if (user.role === 'researcher') return <Navigate to="/researcher" replace />;
  if (user.role === 'service_provider') return <Navigate to="/provider" replace />;
  if (user.role === 'government') return <Navigate to="/government" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/casestudies" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeRedirect />} />
        <Route path="farmer" element={<Protected roles={['farmer']}><FarmerDashboard /></Protected>} />
        <Route path="upload" element={<Protected roles={['farmer']}><UploadData /></Protected>} />
        <Route path="benchmarks" element={<Protected roles={['farmer']}><MyBenchmarks /></Protected>} />
        <Route path="sharing" element={<Protected roles={['farmer']}><SharingControls /></Protected>} />
        <Route path="researcher" element={<Protected roles={['researcher', 'admin']}><ResearcherView /></Protected>} />
        <Route path="provider" element={<Protected roles={['service_provider', 'admin']}><ServiceProviderView /></Protected>} />
        <Route path="government" element={<Protected roles={['government', 'admin']}><GovernmentView /></Protected>} />
        <Route path="admin" element={<Protected roles={['admin']}><AdminPanel /></Protected>} />
        <Route path="casestudies" element={<Protected><CaseStudies /></Protected>} />
      </Route>
    </Routes>
  );
}
