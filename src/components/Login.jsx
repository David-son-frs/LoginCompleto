import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebase';
import './Login.css';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error("Erro no Google:", error);
      setError("Falha no login com Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <header className="login-header">
          <h2>Bem-vindo de volta ao ArtemiScore!</h2>
          <p>Entre na sua conta para continuar sua jornada</p>
        </header>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail*</label>
            <input
              type="email"
              placeholder="seu.email@exemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Senha*</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="toggle-password"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="remember-forgot">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Lembrar-me</label>
            </div>
            <Link to="/recuperar-senha" className="forgot-password">
              Esqueceu a senha?
            </Link>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="social-login">
            <p>Ou entre com</p>
            <button 
              type="button" 
              className="google-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google logo" 
              />
              Entrar com Google
            </button>
          </div>

          <div className="register-link">
            <p>
              Não tem uma conta? <Link to="/cadastro">Crie agora</Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
