import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useScrollToHash } from '../shared/hooks/useScrollToHash';
import { Header } from '../shared/ui/Header';
import { Footer } from '../shared/ui/Footer';
import Home from '../pages/Home';
import ServicesPage from '../pages/ServicesPage';
import Dashboard from '../features/auth/pages/Dashboard';
import Login from '../features/auth/pages/Login';
import Unauthorized from '../features/auth/pages/Unauthorized';
import AppointmentForm from '../features/appointments/components/AppointmentForm';
import { AuthContextProvider } from './providers/AuthProvider';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';

function AppContent() {
  useScrollToHash();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element={<ServicesPage />} />
        <Route path="/agendar" element={<AppointmentForm />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <AppContent />
      </AuthContextProvider>
    </Router>
  );
}

export default App;
