import { Route, Routes } from 'react-router-dom';

import DashboardPage from '@/app/page';
import AdminsPage from '@/app/admins/page';
import UsersPage from '@/app/users/page';
import ProfilePage from '@/app/profile/page';
import AuthLoginPage from '@/app/auth/login/page';

const NotFoundPage = () => (
  <div className="w-full h-[100svh] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-text-secondary">Page not found</p>
    </div>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/auth/login" element={<AuthLoginPage />} />
      <Route path="/admins" element={<AdminsPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

