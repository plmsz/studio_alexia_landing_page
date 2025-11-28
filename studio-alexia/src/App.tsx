import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useScrollToHash } from './hooks/useScrollToHash';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import Dashboard from './pages/Dashboard';

function AppContent() {
  useScrollToHash();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element={<ServicesPage />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
