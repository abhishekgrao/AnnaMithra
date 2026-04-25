import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Explore } from './pages/Explore';
import { Upload } from './pages/Upload';
import { Dashboard } from './pages/Dashboard';
import { Feedback } from './pages/Feedback';
import { Notifications } from './pages/Notifications';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Toast } from './components/ui/Toast';
import { Loader } from './components/ui/Loader';
import { GeminiChat } from './components/chat/GeminiChat';
import type { ToastMessage } from './components/ui/Toast';
import './App.css';

function App() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => {
      addToast('⚡ High Priority Alert', 'Paneer Tikka expiring in 45 mins — 0.4 km away!', 'warning');
    }, 3000);
    const t2 = setTimeout(() => {
      addToast('✅ Match Found', 'Assorted Pastries matched with Hope NGO nearby.', 'success');
    }, 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const addToast = (title: string, message: string, type: 'info' | 'success' | 'warning') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      {showLoader && <Loader onComplete={() => setShowLoader(false)} />}
      <Router>
        <Navbar />
        <main style={{ padding: '84px 24px 0', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          </Routes>
        </main>
        <Toast messages={toasts} onRemove={removeToast} />
        {localStorage.getItem('isAuthenticated') === 'true' && <GeminiChat />}
      </Router>
    </>
  );
}

export default App;
