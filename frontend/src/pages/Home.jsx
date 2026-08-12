import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [authMessage, setAuthMessage] = useState('');

  // Function isuzuma niba umuntu yarinjiye (Map, Terms na About byo aremerewe)
  const checkAuthAndNavigate = (path) => {
    const token = localStorage.getItem('token');
    
    // Map, Terms na About ntibisaba login
    if (path === '/map' || path === '/terms' || path === '/about') {
      navigate(path);
      return;
    }

    // Ahandi hose, niba adafite token ajya kuri dashboard atanze ubutumwa
    if (!token) {
      setAuthMessage("please login before you start");
      setTimeout(() => {
        setAuthMessage('');
        navigate('/dashboard'); 
      }, 1500);
    } else {
      navigate(path);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Ubutumwa bw'iburira niba atarinjira */}
      {authMessage && (
        <div style={styles.alertBanner}>
          ⚠️ {authMessage}
        </div>
      )}

      {/* 1. Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo} onClick={() => navigate('/')}>LOST & GAIN</div>
        
        <div style={styles.navLinks}>
          <button style={styles.navLinkBtn} onClick={() => navigate('/')}>🏠 Home</button>
          <button style={styles.navLinkBtn} onClick={() => checkAuthAndNavigate('/all-announced')}>📦 Find Item</button>
          <button style={styles.navLinkBtn} onClick={() => checkAuthAndNavigate('/report-lost')}>📢 Report Lost</button>
          <button style={styles.navLinkBtn} onClick={() => checkAuthAndNavigate('/report-found')}>📦 Report Found</button>
          <button style={styles.navLinkBtn} onClick={() => checkAuthAndNavigate('/map')}>📍 Map</button>
          <button style={styles.navLinkBtn} onClick={() => checkAuthAndNavigate('/dashboard')}>📊 Dashboard</button>
          <button style={styles.navLinkBtn} onClick={() => checkAuthAndNavigate('/terms')}>📄 Terms & Privacy</button>
        </div>

        <div style={styles.navRightGroup}>
          <button style={styles.iconBtn} onClick={() => checkAuthAndNavigate('/dashboard')} title="Notifications">
            🔔
          </button>
          <button style={styles.iconBtn} onClick={() => checkAuthAndNavigate('/dashboard')} title="Messages">
            💬
          </button>

          <div style={styles.authButtons}>
            <button style={styles.loginBtn} onClick={() => navigate('/login')}>🔐 Login</button>
            <button style={styles.signupBtn} onClick={() => navigate('/signup')}>📝 Sign Up</button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          
          <div style={styles.movingTextWrapper}>
            <p style={styles.movingText}>
              WELCOME TO LOST AND GAIN SITE WE ARE HIRE TO FIND YOUR LOST ITEMS
            </p>
          </div>

          <h1 style={styles.heroTitle}>Lost Something? Let's Help You Find It.</h1>
          <p style={styles.heroSubtitle}>
            **Lost & Gain** helps people report lost or found items and connect with others who may have useful information about them. Users can provide details such as the item’s name, location, date, and description, making it easier to search for matching reports. The platform encourages people to communicate responsibly, verify ownership before returning an item, protect personal information, and arrange safe public places for handovers. By working together and sharing accurate information, the community can increase the chances of lost belongings being safely returned to their rightful owners.
          </p>
          <div style={styles.heroBtnGroup}>
            <button style={styles.reportLostBtn} onClick={() => checkAuthAndNavigate('/report-lost')}>
              🔴 Report Lost Item
            </button>
            <button style={styles.reportFoundBtn} onClick={() => checkAuthAndNavigate('/report-found')}>
              🟢 Report Found Item
            </button>
          </div>
        </div>
        
        <div style={styles.heroImageWrapper}>
          <img 
            src="/hero.jpeg" 
            alt="Lost and Found Illustration" 
            style={styles.heroImage} 
          />
        </div>
      </section>

      {/* 3. Statistic Section */}
      <section style={styles.statsSection}>
        <div style={styles.statBox}>
          <h2 style={styles.statNumber}>1,240+</h2>
          <p style={styles.statLabel}>Items Found</p>
        </div>
        <div style={styles.statBox}>
          <h2 style={styles.statNumber}>85%</h2>
          <p style={styles.statLabel}>Success Rate</p>
        </div>
        <div style={styles.statBox}>
          <h2 style={styles.statNumber}>3,500+</h2>
          <p style={styles.statLabel}>Active Users</p>
        </div>
      </section>

      {/* 4. Success Stories */}
      <section style={styles.testimonialsSection}>
        <h2 style={styles.sectionTitle}>Success Stories</h2>
        <div style={styles.testimonialCard}>
          <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
          <p style={styles.testimonialText}>
            "I lost my phone at school and found it through Lost & Gain within 24 hours. The verification process is amazing and secure even ihave found my lost wallet through lost and gain website!"
          </p>
          <p style={styles.testimonialAuthor}>— Jean Paul N.</p> 
        </div>
      </section>

      {/* 5. Call-to-Action */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Found something that belongs to someone?</h2>
          <p style={styles.ctaSubtitle}>Help return it to its owner and bring a smile back to their face.</p>
          <button style={styles.ctaButton} onClick={() => checkAuthAndNavigate('/report-found')}>
            Report Found Item Now
          </button>
        </div>
      </section>

      {/* 6. Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerCol}>
          <h3 style={styles.footerLogo}>LOST & GAIN</h3>
          <p style={styles.footerDesc}>Helping people reconnect with their lost belongings securely and efficiently.</p>
        </div>
        <div style={styles.footerCol}>
          <h4 style={styles.footerHeading}>Quick Links</h4>
          <span style={styles.footerLink} onClick={() => navigate('/')}>• Home</span>
          <span style={styles.footerLink} onClick={() => checkAuthAndNavigate('/all-announced')}>• Find Item</span>
          <span style={styles.footerLink} onClick={() => checkAuthAndNavigate('/report-lost')}>• Report Lost</span>
          <span style={styles.footerLink} onClick={() => checkAuthAndNavigate('/report-found')}>• Report Found</span>
          <span style={styles.footerLink} onClick={() => checkAuthAndNavigate('/map')}>• Map</span>
          <span style={styles.footerLink} onClick={() => checkAuthAndNavigate('/dashboard')}>• Dashboard</span>
        </div>
        <div style={styles.footerCol}>
          <h4 style={styles.footerHeading}>Support</h4>
          {/* Aha ni ho twashyize /about kugira ngo uhite ujya kuri About Us page */}
          <span style={styles.footerLink} onClick={() => navigate('/about')}>• About Us</span>
          <span style={styles.footerLink} onClick={() => checkAuthAndNavigate('/terms')}>• Terms & Privacy</span>
        </div>
        <div style={styles.footerBottom}>
          <p style={{margin: 0, color: '#8892a4', fontSize: '13px'}}>© 2026 Lost & Gain. All rights reserved.</p>
        </div>
      </footer>

      {/* CSS Animation */}
      <style>{`
        @keyframes moveRightToLeft {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0d1117', color: 'white', fontFamily: 'Arial, sans-serif' },
  alertBanner: { backgroundColor: '#e74c3c', color: 'white', padding: '12px 20px', textAlign: 'center', fontWeight: 'bold', fontSize: '15px', position: 'sticky', top: 0, zIndex: 1000 },
  
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#111827', borderBottom: '1px solid #1e2d40', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap', gap: '15px' },
  logo: { fontSize: '22px', fontWeight: 'bold', color: '#4a90a4', letterSpacing: '1px', cursor: 'pointer' },
  navLinks: { display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' },
  navLinkBtn: { background: 'none', border: 'none', color: '#c9d1d9', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  navRightGroup: { display: 'flex', alignItems: 'center', gap: '15px' },
  iconBtn: { background: '#1e2d40', border: 'none', fontSize: '18px', padding: '8px 10px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  authButtons: { display: 'flex', gap: '10px' },
  loginBtn: { padding: '7px 14px', backgroundColor: 'transparent', border: '1px solid #1e6fa4', color: '#4a90a4', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  signupBtn: { padding: '7px 14px', backgroundColor: '#1e6fa4', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  
  heroSection: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '80px 40px', maxWidth: '1200px', margin: '0 auto', gap: '40px', flexWrap: 'wrap' },
  heroContent: { flex: 1, minWidth: '300px', overflow: 'hidden' },
  
  movingTextWrapper: { width: '100%', backgroundColor: '#111827', padding: '10px 0', borderRadius: '8px', marginBottom: '20px', overflow: 'hidden', whiteSpace: 'nowrap', border: '1px solid #1e3a5f' },
  movingText: { display: 'inline-block', animation: 'moveRightToLeft 14s linear infinite', color: '#38bdf8', fontSize: '15px', fontWeight: 'bold', paddingLeft: '100%', letterSpacing: '0.5px' },

  heroTitle: { fontSize: '42px', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '20px', color: '#ffffff' },
  heroSubtitle: { fontSize: '18px', color: '#8892a4', marginBottom: '30px', lineHeight: '1.5' },
  heroBtnGroup: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  reportLostBtn: { padding: '12px 24px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  reportFoundBtn: { padding: '12px 24px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  
  heroImageWrapper: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '300px', backgroundColor: '#111827', padding: '20px', borderRadius: '16px', border: '1px solid #1e2d40' },
  heroImage: { width: '100%', maxWidth: '520px', height: 'auto', borderRadius: '12px' },

  statsSection: { display: 'flex', justifyContent: 'space-around', padding: '50px 20px', backgroundColor: '#111827', borderTop: '1px solid #1e2d40', borderBottom: '1px solid #1e2d40', maxWidth: '1200px', margin: '0 auto', borderRadius: '12px', flexWrap: 'wrap', gap: '20px' },
  statBox: { textAlign: 'center' },
  statNumber: { fontSize: '36px', fontWeight: 'bold', color: '#4a90a4', margin: '0 0 8px' },
  statLabel: { color: '#8892a4', fontSize: '16px', margin: 0 },

  testimonialsSection: { padding: '80px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' },
  sectionTitle: { fontSize: '30px', marginBottom: '40px', color: 'white' },
  testimonialCard: { backgroundColor: '#111827', padding: '30px', borderRadius: '16px', border: '1px solid #1e2d40', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' },
  stars: { fontSize: '20px', marginBottom: '16px' },
  testimonialText: { fontSize: '18px', fontStyle: 'italic', color: '#c9d1d9', lineHeight: '1.6', marginBottom: '20px' },
  testimonialAuthor: { fontWeight: 'bold', color: '#4a90a4', fontSize: '16px', margin: 0 },

  ctaSection: { padding: '60px 20px', backgroundColor: '#1e3a5f', textAlign: 'center', margin: '40px auto', maxWidth: '1000px', borderRadius: '16px' },
  ctaContent: { maxWidth: '600px', margin: '0 auto' },
  ctaTitle: { fontSize: '28px', color: 'white', marginBottom: '12px' },
  ctaSubtitle: { color: '#c9d1d9', fontSize: '16px', marginBottom: '24px' },
  ctaButton: { padding: '12px 28px', backgroundColor: 'white', color: '#1e3a5f', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },

  footer: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '60px 40px 20px', backgroundColor: '#111827', borderTop: '1px solid #1e2d40', marginTop: '60px' },
  footerCol: { flex: '1 1 200px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' },
  footerLogo: { fontSize: '20px', fontWeight: 'bold', color: '#4a90a4', margin: '0 0 10px' },
  footerDesc: { color: '#8892a4', fontSize: '14px', lineHeight: '1.5', margin: 0 },
  footerHeading: { color: 'white', fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px' },
  footerLink: { color: '#8892a4', fontSize: '14px', cursor: 'pointer' },
  footerBottom: { width: '100%', textAlign: 'center', borderTop: '1px solid #1e2d40', paddingTop: '20px', marginTop: '20px' }
};

export default Home;