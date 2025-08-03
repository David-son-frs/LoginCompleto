// src/components/Dashboard.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext.js';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();

  // Adicione esta verificação
  if (!currentUser) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="user-info">
        <h2>Bem-vindo, {currentUser.displayName || currentUser.email}!</h2>
        <p>Email: {currentUser.email}</p>
      </div>
      
      <div className="dashboard-content">
        <h3>Sua Área de Controle</h3>
        <div className="stats">
          <div className="stat-card">
            <h4>Jogos Avaliados</h4>
            <p>24</p>
          </div>
          <div className="stat-card">
            <h4>Amigos</h4>
            <p>12</p>
          </div>
          <div className="stat-card">
            <h4>Conquistas</h4>
            <p>8</p>
          </div>
        </div>
      </div>
      
      <button onClick={logout} className="logout-btn">
        Sair
      </button>
    </div>
  );
};

export default Dashboard;
