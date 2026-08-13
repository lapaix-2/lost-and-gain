import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token) { navigate('/'); } else { fetchProfile(); }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        'https://lost-and-gain-backend.onrender.com/api/auth/userinfo/' + encodeURIComponent(user.full_name),
        { headers: { authorization: 'Bearer ' + token } }
      );
      setProfile(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>🔍 Lost and Gain</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Subira Dashboard
        </button>
      </div>

      <div style={styles.content}>
        {loading ? (
          <p style={styles.loading}>Gutegereza...</p>
        ) : profile ? (
          <div style={styles.profileCard}>

            {/* Avatar */}
            <div style={styles.avatarWrapper}>
              <div style={styles.avatar}>
                {profile.full_name?.charAt(0).toUpperCase()}
              </div>
              <h2 style={styles.profileName}>{profile.full_name}</h2>
            </div>

            <hr style={styles.divider} />

            {/* Amakuru */}
            <h3 style={styles.sectionTitle}>📋 Amakuru Yawe</h3>
            <div style={styles.infoList}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>👤 Amazina:</span>
                <span style={styles.infoValue}>{profile.full_name}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>🏔️ Intara:</span>
                <span style={styles.infoValue}>{profile.province}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>🏘️ Akarere:</span>
                <span style={styles.infoValue}>{profile.district}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>🏠 Umurenge:</span>
                <span style={styles.infoValue}>{profile.sector}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>🏡 Umudugudu:</span>
                <span style={styles.infoValue}>{profile.umudugudu}</span>
              </div>
            </div>

            <hr style={styles.divider} />

            <button style={styles.logoutBtn} onClick={handleLogout}>
              🚪 Sohoka
            </button>

          </div>
        ) : (
          <p style={styles.loading}>Amakuru ntabwo abonetse.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f4f8', fontFamily: 'Arial, sans-serif' },
  navbar: { backgroundColor: '#2c3e50', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navTitle: { color: 'white', margin: 0, fontSize: '22px' },
  backBtn: { padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  content: { padding: '32px', maxWidth: '500px', margin: '0 auto' },
  loading: { textAlign: 'center', color: '#999', marginTop: '40px' },
  profileCard: { backgroundColor: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  avatarWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#2ecc71', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' },
  profileName: { color: '#2c3e50', margin: 0, fontSize: '22px' },
  divider: { border: 'none', borderTop: '1px solid #eee', margin: '20px 0' },
  sectionTitle: { color: '#2c3e50', fontSize: '16px', marginBottom: '16px' },
  infoList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f8f9fa', borderRadius: '8px' },
  infoLabel: { color: '#7f8c8d', fontSize: '14px', fontWeight: 'bold' },
  infoValue: { color: '#2c3e50', fontSize: '14px' },
  logoutBtn: { width: '100%', padding: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Profile;