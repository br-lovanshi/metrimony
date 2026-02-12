import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ViewProfiles from './pages/ViewProfiles';
import SubmitProfile from './pages/SubmitProfile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import ProfileDetail from './pages/ProfileDetail';
import SamajConnect from './pages/SamajConnect';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profiles" element={<ViewProfiles />} />
        <Route path="profile/:id" element={<ProfileDetail />} />
        <Route path="submit" element={<SubmitProfile />} />
        <Route path="samaj-connect" element={<SamajConnect />} />
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
