import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase';
import './Cadastro.css';

export default function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    favoriteGenres: [],
    preferredPlatforms: []
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'bio') setCharCount(value.length);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => {
      const currentArray = [...prev[name]];
      if (checked) {
        return { ...prev, [name]: [...currentArray, value] };
      } else {
        return { ...prev, [name]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validações
    if (!formData.username.trim()) newErrors.username = 'Nome obrigatório';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Email inválido';
    if (formData.password.length < 6) newErrors.password = 'Senha deve ter 6+ caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Senhas não coincidem';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Criar usuário
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Atualizar perfil
      await updateProfile(userCredential.user, {
        displayName: formData.username
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Opções para formulário
  const genres = ['Ação', 'Aventura', 'RPG', 'Estratégia', 'FPS', 'Esportes'];
  const platforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];

  return (
    <div className="cadastro-container">
      <h1>Crie Sua Conta</h1>
      {errors.general && <div className="error-message">{errors.general}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Nome de Usuário */}
        <div className="form-group">
          <label>Nome de Usuário*</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Senha */}
        <div className="form-group">
          <label>Senha*</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        {/* Confirmar Senha */}
        <div className="form-group">
          <label>Confirmar Senha*</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        {/* Biografia */}
        <div className="form-group">
          <label>Biografia</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            maxLength={500}
          />
          <div className="char-count">{charCount}/500 caracteres</div>
        </div>

        {/* Gêneros Favoritos */}
        <div className="form-group">
          <label>Gêneros Favoritos</label>
          <div className="checkbox-group">
            {genres.map(genre => (
              <label key={genre} className="checkbox-label">
                <input
                  type="checkbox"
                  name="favoriteGenres"
                  value={genre}
                  onChange={handleCheckboxChange}
                />
                {genre}
              </label>
            ))}
          </div>
        </div>

        {/* Plataformas Preferidas */}
        <div className="form-group">
          <label>Plataformas Preferidas</label>
          <div className="checkbox-group">
            {platforms.map(platform => (
              <label key={platform} className="checkbox-label">
                <input
                  type="checkbox"
                  name="preferredPlatforms"
                  value={platform}
                  onChange={handleCheckboxChange}
                />
                {platform}
              </label>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Criando conta...' : 'Criar Conta'}
        </button>
      </form>
      
      <div className="login-link">
        Já tem uma conta? <Link to="/login">Faça login</Link>
      </div>
    </div>
  );
}
