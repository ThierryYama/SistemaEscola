import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Home = () => {
  const [userType, setUserType] = useState('aluno');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validar campos
    if (!identifier || !password) {
      setError('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }

    const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  };


    try {
      // Montar payload de acordo com o tipo de usuário
      const payload = userType === 'aluno'
        ? { matricula: identifier, senha: password }
        : { siape: identifier, senha: password };

      // Fazer requisição para a API
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      const tokenData = decodeToken(data.token);

      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', tokenData.tipo);
      localStorage.setItem('userId', tokenData.id);
      localStorage.setItem('userName', tokenData.nome);

      // Redirecionar para dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor');
      console.error('Erro no login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sistema Escolar</h2>
        
        <div className="user-type-selector">
          <button
            type="button"
            className={`user-type-btn ${userType === 'aluno' ? 'active' : ''}`}
            onClick={() => setUserType('aluno')}
          >
            Aluno
          </button>
          <button
            type="button"
            className={`user-type-btn ${userType === 'professor' ? 'active' : ''}`}
            onClick={() => setUserType('professor')}
          >
            Professor
          </button>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>{userType === 'aluno' ? 'Matrícula' : 'SIAPE'}</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={userType === 'aluno' ? 'Digite sua matrícula' : 'Digite seu SIAPE'}
              required
            />
          </div>
          
          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;