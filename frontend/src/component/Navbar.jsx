import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    setMenuOpen(false);
  };

  const go = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button style={styles.hamburger} onClick={() => setMenuOpen(true)}>
        ☰
      </button>

      {/* Overlay */}
      {menuOpen && (
        <div style={styles.overlay} onClick={() => setMenuOpen(false)} />
      )}

      {/* Sidebar Menu */}
      <div style={{ ...styles.sidebar, left: menuOpen ? 0 : '-300px' }}>

        {/* Header */}
        <div style={styles.menuHeader}>
          <h3 style={styles.menuTitle}>☰ MENU</h3>
          <button style={styles.closeBtn} onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        {/* User Info */}
        {token && user && (
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {user.full_name?.charAt(0).toUpperCase()}
            </div>
            <p style={styles.userName}>{user.full_name}</p>
          </div>
        )}

        <hr style={styles.divider} />

        {/* Menu Items */}
        <div style={styles.menuItems}>

          <button style={styles.menuItem} onClick={() => go('/dashboard')}>
            🏠 <span>Home</span>
          </button>

          <button style={styles.menuItem} onClick={() => go('/all-announced')}>
            🔍 <span>Search Items</span>
          </button>

          <button style={styles.menuItem} onClick={() => go('/all-announced')}>
            📦 <span>Lost Items</span>
          </button>

          <button style={styles.menuItem} onClick={() => go('/all-announced')}>
            🎒 <span>Found Items</span>
          </button>

          {token && (
            <>
              <hr style={styles.divider} />
              <button style={styles.menuItem} onClick={() => go('/dashboard')}>
                ➕ <span>Report Lost Item</span>
              </button>

              <button style={styles.menuItem} onClick={() => go('/dashboard')}>
                ➕ <span>Report Found Item</span>
              </button>
            </>
          )}

          <hr style={styles.divider} />

          <button style={styles.menuItem} onClick={() => go('/about')}>
            ℹ️ <span>About Us</span>
          </button>

          <button style={styles.menuItem} onClick={() => go('/contact')}>
            📞 <span>Contact Us</span>
          </button>

          <hr style={styles.divider} />

          {!token ? (
            <>
              <button style={styles.menuItem} onClick={() => go('/')}>
                🔐 <span>Login</span>
              </button>
              <button style={styles.menuItem} onClick={() => go('/register')}>
                📝 <span>Sign Up</span>
              </button>
            </>
          ) : (
            <>
              <button style={styles.menuItem} onClick={() => go('/profile')}>
                👤 <span>Profile</span>
              </button>
              <button style={styles.menuItem} onClick={() => go('/settings')}>
                ⚙️ <span>Settings</span>
              </button>
              <button style={{...styles.menuItem, color: '#e74c3c'}} onClick={handleLogout}>
                🚪 <span>Logout</span>
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}

const styles = {
  hamburger: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    color: 'white',
    cursor: 'pointer',
    padding: '4px 8px'
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 998
  },
  sidebar: {
    position: 'fixed',
    top: 0, left: 0,
    width: '280px',
    height: '100%',
    backgroundColor: '#1a252f',
    zIndex: 999,
    transition: 'left 0.3s ease',
    overflowY: 'auto',
    boxShadow: '4px 0 20px rgba(0,0,0,0.3)'
  },
  menuHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 16px',
    backgroundColor: '#2c3e50'
  },
  menuTitle: {
    color: 'white',
    margin: 0,
    fontSize: '18px'
  },
  closeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px'
  },
  userAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#2ecc71',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  userName: {
    color: 'white',
    margin: 0,
    fontSize: '15px',
    fontWeight: 'bold'
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #2c3e50',
    margin: '8px 0'
  },
  menuItems: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 0'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ecf0f1',
    fontSize: '15px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.2s'
  }
};

export default Navbar;
