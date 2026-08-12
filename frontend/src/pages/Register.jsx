import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    full_name: '',
    id_card: '',
    province: '',
    district: '',
    sector: '',
    umudugudu: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.id_card.length !== 16 || isNaN(form.id_card)) {
      setMessage('Nimero y\'indangamuntu igomba kuba imibare 16!');
      return;
    }
    try {
      const res = await axios.post('http://localhost:4000/api/auth/register', form);
      setMessage(res.data.message);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Habaye ikosa!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to Lost and Gain</h1>
        <h2 style={styles.subtitle}>Iyandikishe</h2>

        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleRegister} style={styles.form}>
          <input style={styles.input} type="text" name="full_name" placeholder="Amazina yombi" onChange={handleChange} required />
          <input style={styles.input} type="text" name="id_card" placeholder="Nimero y'indangamuntu (imibare 16)" maxLength={16} onChange={handleChange} required />
          <input style={styles.input} type="text" name="province" placeholder="Intara" onChange={handleChange} required />
          <input style={styles.input} type="text" name="district" placeholder="Akarere" onChange={handleChange} required />
          <input style={styles.input} type="text" name="sector" placeholder="Umurenge" onChange={handleChange} required />
          <input style={styles.input} type="text" name="umudugudu" placeholder="Umudugudu" onChange={handleChange} required />
          <input style={styles.input} type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button style={styles.button} type="submit">Iyandikishe</button>
        </form>

        <p style={styles.link}>
          Usanzwe ufite konti? <Link to="/" style={{ color: '#3498db' }}>Injira hano</Link>
        </p>

        {/* Link ya Terms & Privacy yongejwe hano */}
        <p style={{ marginTop: '10px', fontSize: '13px', color: '#888' }}>
          By registering, you agree to our <Link to="/terms" style={{ color: '#3498db' }}>Terms & Privacy</Link>
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
    backgroundColor: '#000000',
    padding: '20px 0'
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
  message: {
    color: '#2ecc71',
    marginBottom: '10px'
  },
  link: {
    marginTop: '16px',
    fontSize: '14px',
    color: '#aaaaaa'
  }
};

export default Register;