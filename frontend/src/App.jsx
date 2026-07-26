import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import HallPage from './pages/client/HallPage';
import PaymentPage from './pages/client/PaymentPage';
import SchedulePage from './pages/client/SchedulePage';
import TicketPage from './pages/client/TicketPage';
import './assets/styles/client/styles.css';
import './assets/styles/admin/styles.css';

function StyleScope({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return <div className={isAdmin ? 'admin-app' : 'client-app'}>{children}</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <StyleScope>
          <Routes>
            <Route path="/" element={<SchedulePage />} />
            <Route path="/hall/:seanceId" element={<HallPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/ticket/:code" element={<TicketPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </StyleScope>
      </BrowserRouter>
    </AuthProvider>
  );
}
