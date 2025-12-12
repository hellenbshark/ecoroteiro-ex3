import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Chatbot from './components/Chatbot';
import ExploreRoutes from './components/ExploreRoutes';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import AccessibilityMenu from './components/AccessibilityMenu';
import { AccessibilityProvider } from './context/AccessibilityContext';
import ForgotPassword from './components/ForgotPassword';
import RouteDetails from './pages/RouteDetails';
import About from './pages/About'; 
import Recommendations from './pages/Recommendations'; // <-- NOVO: Importação da página Recomendações

function AppLayout() {
  const location = useLocation();
  const [user, setUser] = useState({ name: 'Visitante', email: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  

  const checkUser = () => {
    const token = localStorage.getItem('accessToken');
    const savedName = localStorage.getItem('userName');

    if (token) {
      setIsAuthenticated(true);
      setUser({
        name: savedName && savedName !== 'null' ? savedName : 'Viajante',
        email: 'user@email.com'
      });
    } else {
      setIsAuthenticated(false);
      setUser({ name: 'Visitante', email: '' });
    }
  };

  useEffect(() => {
    checkUser();
    const handleStorageChange = () => checkUser();
    window.addEventListener('userUpdated', handleStorageChange);
    return () => window.removeEventListener('userUpdated', handleStorageChange);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('userUpdated'));
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden relative bg-nature-beige dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">

      <ScrollToTop /> 
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/explorar-roteiros" element={<ExploreRoutes />} />
        <Route path="/route/:id" element={<RouteDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/recommendations" element={<Recommendations />} /> {/* <-- NOVO: Rota para Recomendações */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-center" />
    </div>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <Router>
        <AppLayout />
        <AccessibilityMenu /> 
      </Router>
    </AccessibilityProvider>
  );
}

export default App;