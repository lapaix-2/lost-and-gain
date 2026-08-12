import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [idCard, setIdCard] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', {
        id_card: idCard,
        password: password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Habaye ikosa!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to Lost and Gain</h1>
        <h2 style={styles.subtitle}>Injira</h2>

        {message && <p style={styles.error}>{message}</p>}

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Nimero y'indangamuntu (imibare 16)"
            value={idCard}
            onChange={(e) => setIdCard(e.target.value)}
            maxLength={16}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={styles.button} type="submit">Injira</button>
        </form>

        <p style={styles.link}>
          Nta konti ufite? <Link to="/register" style={{ color: '#3498db' }}>Iyandikishe hano</Link>
        </p>

        {/* Link ya Terms & Privacy yongejwe hano */}
        <p style={{ marginTop: '10px', fontSize: '13px', color: '#888' }}>
          By logging in, you agree to our <Link to="/terms" style={{ color: '#3498db' }}>Terms & Privacy</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000'
  },
  card: {
    backgroundColor: '#121212',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(255,255,255,0.05)',
    width: '400px',
    textAlign: 'center'
  },
  title: {
    color: '#ffffff',
    fontSize: '24px',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#aaaaaa',
    fontSize: '18px',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #333333',
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    fontSize: '14px'
  },
  button: {
    padding: '12px',
    backgroundColor: '#ffffff',
    color: '#000000',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  error: {
    color: '#ff6b6b',
    marginBottom: '10px'
  },
  link: {
    marginTop: '16px',
    fontSize: '14px',
    color: '#aaaaaa'
  }
};

export default Login;