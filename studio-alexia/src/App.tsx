import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useScrollToHash } from './hooks/useScrollToHash';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import AppointmentForm from './components/Appointment/AppointmentForm';
import { AuthContextProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

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
