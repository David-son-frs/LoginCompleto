import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Cadastro from './components/Cadastro.jsx';
import Dashboard from './components/Dashboard.jsx';
import { AuthProvider } from './contexts/AuthContext.js';
import { useAuth } from './contexts/AuthContext.js';

// Corrigindo o PrivateRoute para a versão v6 do React Router
function PrivateRoute({ element }) {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          
          {/* Rota privada corrigida */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute element={<Dashboard />} />
            } 
          />
          
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
          
          <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
