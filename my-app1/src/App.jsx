import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { Home, Login, Register } from './pages/Pages.jsx';
import { MyEvents } from './pages/MyEvents.jsx';
import { Toaster } from 'react-hot-toast'; // NEW: Toast Provider

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Position toasts at bottom-right for a modern feel */}
        <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;