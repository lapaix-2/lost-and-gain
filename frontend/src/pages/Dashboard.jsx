import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [materialName, setMaterialName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [msgSent, setMsgSent] = useState('');
  const [myMessages, setMyMessages] = useState([]);
  const [showMyMsgs, setShowMyMsgs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState({ posts: 0, claimed: 0, active: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [activeMenu, setActiveMenu] = useState('home');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/'); }
    else {
      fetchMyMessages();
      fetchNotifications();
      fetchStats();
    }
  }, []);

  const fetchMyMessages = async () => {
    try {
      const res = await axios.get('http://https://lost-and-gain-backend.onrender.com/api/auth/messages/mine/' + encodeURIComponent(user.full_name));
      setMyMessages(res.data);
    } catch (err) { console.log(err); }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://https://lost-and-gain-backend.onrender.com/api/auth/notifications/' + encodeURIComponent(user.full_name));
      setNotifications(res.data);
    } catch (err) { console.log(err); }
  };

  const markAllRead = async () => {
    try {
      await axios.put('http://https://lost-and-gain-backend.onrender.com/api/auth/notifications/readall/' + encodeURIComponent(user.full_name));
      fetchNotifications();
    } catch (err) { console.log(err); }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://https://lost-and-gain-backend.onrender.com/api/materials', {
        headers: { authorization: 'Bearer ' + token }
      });
      const all = res.data;
      setRecentPosts(all.slice(0, 4));
      setStats({
        posts: all.length,
        claimed: all.filter(p => p.status === 'claimed').length,
        active: all.filter(p => p.status === 'active').length
      });
    } catch (err) { console.log(err); }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!materialName.trim()) { setMessage('Injiza izina ryikintu!'); return; }
    if (!photo) { setMessage('Ongeramo ifoto!'); return; }
    try {
      const formData = new FormData();
      formData.append('material_name', materialName);
      formData.append('photo', photo);
      const res = await axios.post('http://https://lost-and-gain-backend.onrender.com/api/materials/announce', formData, {
        headers: { authorization: 'Bearer ' + token }
      });
      setMessage(res.data.message);
      setMaterialName('');
      setPhoto(null);
      fetchStats();
    } catch (err) { setMessage(err.response?.data?.message || 'Habaye ikosa!'); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    try {
      await axios.post('http://https://lost-and-gain-backend.onrender.com/api/auth/messages/send', {
        sender_name: user.full_name, message: msgText
      });
      setMsgSent('Message yoherejwe neza!');
      setMsgText('');
      fetchMyMessages();
      setTimeout(() => setMsgSent(''), 3000);
    } catch (err) { setMsgSent('Habaye ikosa!'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const unreadNotifs = notifications.filter(n => !n.is_read).length;
  const unreadReplies = myMessages.filter(m => m.reply && !m.is_read).length;

  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'lost', icon: '📦', label: 'Lost Items' },
    { id: 'found', icon: '🎒', label: 'Found Items' },
    { id: 'report', icon: '➕', label: 'Report Item' },
    { id: 'messages', icon: '💬', label: 'Messages', badge: unreadReplies },
    { id: 'notifications', icon: '🔔', label: 'Notifications', badge: unreadNotifs },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  const handleMenuClick = (id) => {
    setActiveMenu(id);
    if (id === 'settings') navigate('/settings');
    if (id === 'profile') navigate('/profile');
    if (id === 'lost' || id === 'found') navigate('/all-announced');
    if (id === 'messages') setShowMsgModal(true);
    if (id === 'notifications') { setShowNotifications(true); markAllRead(); }
  };

  return (
    <div style={styles.wrapper}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>

        {/* Logo */}
        <div style={styles.sidebarLogo}>
          <div style={styles.logoIcon}>🔍</div>
          <div>
            <p style={styles.logoTitle}>Lost & Gain</p>
            <p style={styles.logoSub}>Rwanda</p>
          </div>
        </div>

        {/* User Info */}
        <div style={styles.sidebarUser}>
          <div style={styles.userAvatar}>
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={styles.userName}>{user?.full_name}</p>
            <p style={styles.userRole}>User</p>
          </div>
        </div>

        <div style={styles.sidebarDivider} />

        {/* Menu Items */}
        <nav style={styles.sidebarNav}>
          {menuItems.map(item => (
            <button
              key={item.id}
              style={{
                ...styles.menuItem,
                ...(activeMenu === item.id ? styles.menuItemActive : {})
              }}
              onClick={() => handleMenuClick(item.id)}
            >
              <span style={styles.menuIcon}>{item.icon}</span>
              <span style={styles.menuLabel}>{item.label}</span>
              {item.badge > 0 && (
                <span style={styles.menuBadge}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={styles.sidebarDivider} />

        {/* Logout */}
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <span>🚪</span>
          <span>Logout</span>
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>

        {/* Top Navbar */}
        <div style={styles.topbar}>
          <h2 style={styles.topbarTitle}>
            {activeMenu === 'home' && 'Dashboard'}
            {activeMenu === 'report' && 'Report Lost Item'}
            {activeMenu === 'lost' && 'Lost Items'}
            {activeMenu === 'found' && 'Found Items'}
            {activeMenu === 'messages' && 'Messages'}
            {activeMenu === 'notifications' && 'Notifications'}
          </h2>
          <div style={styles.topbarRight}>
            <button style={styles.topbarIcon} onClick={() => { setShowNotifications(!showNotifications); markAllRead(); }}>
              🔔 {unreadNotifs > 0 && <span style={styles.topBadge}>{unreadNotifs}</span>}
            </button>
            <button style={styles.topbarIcon} onClick={() => setShowMsgModal(true)}>
              💬 {unreadReplies > 0 && <span style={styles.topBadge}>{unreadReplies}</span>}
            </button>
          </div>
        </div>

        {/* HOME PAGE */}
        {activeMenu === 'home' && (
          <div style={styles.content}>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIconWrapper}>📋</div>
                <div>
                  <p style={styles.statNumber}>{stats.posts}</p>
                  <p style={styles.statLabel}>Posts Zose</p>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #2ecc71'}}>
                <div style={styles.statIconWrapper}>✅</div>
                <div>
                  <p style={styles.statNumber}>{stats.claimed}</p>
                  <p style={styles.statLabel}>Byaboneshejwe</p>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #e67e22'}}>
                <div style={styles.statIconWrapper}>⏳</div>
                <div>
                  <p style={styles.statNumber}>{stats.active}</p>
                  <p style={styles.statLabel}>Biracyashakwa</p>
                </div>
              </div>
              <div style={{...styles.statCard, borderLeft: '4px solid #3498db'}}>
                <div style={styles.statIconWrapper}>🔔</div>
                <div>
                  <p style={styles.statNumber}>{notifications.length}</p>
                  <p style={styles.statLabel}>Notifications</p>
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>📋 Posts za Vuba</h3>
                <button style={styles.seeAllBtn} onClick={() => navigate('/all-announced')}>
                  Reba Zose →
                </button>
              </div>
              <div style={styles.recentGrid}>
                {recentPosts.map(post => (
                  <div key={post.id} style={styles.recentCard}>
                    {post.photo ? (
                      <img src={'http://https://lost-and-gain-backend.onrender.com/uploads/' + post.photo} alt={post.material_name} style={styles.recentImg} />
                    ) : (
                      <div style={styles.recentNoImg}>📦</div>
                    )}
                    <div style={styles.recentInfo}>
                      <p style={styles.recentName}>{post.material_name}</p>
                      <p style={styles.recentAnnouncer}>{post.announcer_name}</p>
                      <span style={{
                        ...styles.recentBadge,
                        backgroundColor: post.status === 'claimed' ? '#2ecc71' : '#e67e22'
                      }}>
                        {post.status === 'claimed' ? 'Yaboneshejwe' : 'Biracyashakwa'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notifications */}
            {notifications.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>🔔 Notifications za Vuba</h3>
                {notifications.slice(0, 3).map(notif => (
                  <div key={notif.id} style={{
                    ...styles.notifItem,
                    backgroundColor: notif.is_read ? '#111827' : '#1a2e3b'
                  }}>
                    <p style={styles.notifMsg}>{notif.message}</p>
                    <p style={styles.notifDate}>{new Date(notif.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* REPORT ITEM */}
        {activeMenu === 'report' && (
          <div style={styles.content}>
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>➕ Tangaza Ikintu Watoraguye</h3>
              {message && <p style={styles.formMessage}>{message}</p>}
              <form onSubmit={handlePost} style={styles.form}>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Injiza izina ryikintu (urugero: Laptop, ID Card...)"
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                />
                <div style={styles.fileWrapper}>
                  <label style={styles.fileLabel}>📷 Ongeramo Ifoto:</label>
                  <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} style={styles.fileInput} />
                </div>
                {photo && <img src={URL.createObjectURL(photo)} alt="preview" style={styles.preview} />}
                <button style={styles.submitBtn} type="submit">📌 Post</button>
              </form>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS PAGE */}
        {activeMenu === 'notifications' && showNotifications && (
          <div style={styles.content}>
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>🔔 Notifications Zawe</h3>
              {notifications.length === 0 ? (
                <p style={styles.empty}>Nta notification ufite.</p>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} style={{
                    ...styles.notifItem,
                    backgroundColor: notif.is_read ? '#111827' : '#1a2e3b',
                    marginBottom: '12px'
                  }}>
                    <p style={styles.notifMsg}>{notif.message}</p>
                    <p style={styles.notifDate}>{new Date(notif.created_at).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* MESSAGE MODAL */}
      {showMsgModal && (
        <div style={styles.modalOverlay} onClick={() => setShowMsgModal(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setShowMsgModal(false)}>X</button>
            <h3 style={styles.modalTitle}>💬 Vugana na Admin</h3>
            <hr style={styles.divider} />
            <div style={styles.msgTabs}>
              <button style={showMyMsgs ? styles.msgTab : {...styles.msgTab, ...styles.activeMsgTab}} onClick={() => setShowMyMsgs(false)}>Ohereza</button>
              <button style={showMyMsgs ? {...styles.msgTab, ...styles.activeMsgTab} : styles.msgTab} onClick={() => { setShowMyMsgs(true); fetchMyMessages(); }}>Ibisubizo</button>
            </div>
            {!showMyMsgs ? (
              <form onSubmit={handleSendMessage} style={styles.msgForm}>
                {msgSent && <p style={styles.msgSent}>{msgSent}</p>}
                <textarea style={styles.msgTextarea} placeholder="Andika message yawe hano..." value={msgText} onChange={(e) => setMsgText(e.target.value)} rows={4} required />
                <button style={styles.msgSendBtn} type="submit">Ohereza</button>
              </form>
            ) : (
              <div style={styles.myMsgsList}>
                {myMessages.length === 0 ? (
                  <p style={styles.noMsg}>Nta message wohereje.</p>
                ) : (
                  myMessages.map((msg) => (
                    <div key={msg.id} style={styles.msgItem}>
                      <p style={styles.msgText}>{msg.message}</p>
                      {msg.reply ? <p style={styles.msgReply}>Admin: {msg.reply}</p> : <p style={styles.msgPending}>Gutegereza igisubizo...</p>}
                      <p style={styles.msgDate}>{new Date(msg.created_at).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#0d1117', color: '#ffffff' },

  // SIDEBAR
  sidebar: { width: '260px', minHeight: '100vh', backgroundColor: '#111827', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 100, borderRight: '1px solid #1e2d40' },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: '12px', padding: '24px 20px', borderBottom: '1px solid #1e2d40' },
  logoIcon: { fontSize: '28px' },
  logoTitle: { color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold' },
  logoSub: { color: '#8892a4', margin: 0, fontSize: '12px' },
  sidebarUser: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px' },
  userAvatar: { width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#2ecc71', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', flexShrink: 0 },
  userName: { color: 'white', margin: 0, fontSize: '14px', fontWeight: 'bold' },
  userRole: { color: '#8892a4', margin: 0, fontSize: '12px' },
  sidebarDivider: { height: '1px', backgroundColor: '#1e2d40', margin: '8px 0' },
  sidebarNav: { display: 'flex', flexDirection: 'column', padding: '8px 0', flex: 1 },
  menuItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 20px', backgroundColor: 'transparent', border: 'none', color: '#8892a4', fontSize: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', position: 'relative' },
  menuItemActive: { backgroundColor: '#1f2937', color: 'white', borderLeft: '3px solid #38bdf8' },
  menuIcon: { fontSize: '18px', width: '24px' },
  menuLabel: { flex: 1 },
  menuBadge: { backgroundColor: '#e74c3c', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', backgroundColor: 'transparent', border: 'none', color: '#e74c3c', fontSize: '14px', cursor: 'pointer', margin: '8px 0' },

  // MAIN
  main: { marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0d1117' },
  topbar: { backgroundColor: '#111827', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e2d40', position: 'sticky', top: 0, zIndex: 50 },
  topbarTitle: { color: '#ffffff', margin: 0, fontSize: '20px', fontWeight: 'bold' },
  topbarRight: { display: 'flex', gap: '16px', alignItems: 'center' },
  topbarIcon: { backgroundColor: 'transparent', border: 'none', fontSize: '22px', cursor: 'pointer', position: 'relative', color: '#ffffff' },
  topBadge: { position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#e74c3c', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  // CONTENT
  content: { padding: '32px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' },
  statCard: { backgroundColor: '#111827', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #1e2d40', borderLeft: '4px solid #38bdf8' },
  statIconWrapper: { fontSize: '32px' },
  statNumber: { margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#ffffff' },
  statLabel: { margin: 0, fontSize: '13px', color: '#8892a4' },

  section: { marginBottom: '32px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { color: '#ffffff', margin: 0, fontSize: '18px' },
  seeAllBtn: { padding: '8px 16px', backgroundColor: '#1e6fa4', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },

  recentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  recentCard: { backgroundColor: '#111827', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e2d40' },
  recentImg: { width: '100%', height: '140px', objectFit: 'cover' },
  recentNoImg: { width: '100%', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1f2937', fontSize: '40px' },
  recentInfo: { padding: '12px' },
  recentName: { margin: '0 0 4px', fontSize: '15px', fontWeight: 'bold', color: '#ffffff' },
  recentAnnouncer: { margin: '0 0 8px', fontSize: '12px', color: '#8892a4' },
  recentBadge: { padding: '3px 10px', borderRadius: '20px', color: 'white', fontSize: '11px', fontWeight: 'bold' },

  notifItem: { padding: '12px 16px', borderRadius: '8px', border: '1px solid #1e2d40', marginBottom: '8px' },
  notifMsg: { margin: '0 0 4px', fontSize: '14px', color: '#ffffff', fontWeight: 'bold' },
  notifDate: { margin: 0, fontSize: '11px', color: '#8892a4' },
  empty: { textAlign: 'center', color: '#8892a4', padding: '20px' },

  formCard: { backgroundColor: '#111827', borderRadius: '12px', padding: '32px', maxWidth: '600px', border: '1px solid #1e2d40' },
  formTitle: { color: '#ffffff', marginBottom: '20px', fontSize: '18px' },
  formMessage: { color: '#2ecc71', marginBottom: '12px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #1e2d40', backgroundColor: '#0d1117', color: 'white', fontSize: '14px', outline: 'none' },
  fileWrapper: { display: 'flex', flexDirection: 'column', gap: '6px' },
  fileLabel: { fontSize: '14px', color: '#8892a4' },
  fileInput: { fontSize: '14px', color: '#8892a4' },
  preview: { width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #1e2d40' },
  submitBtn: { padding: '12px', backgroundColor: '#1e6fa4', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalCard: { backgroundColor: '#111827', borderRadius: '16px', padding: '32px', width: '450px', maxWidth: '90%', position: 'relative', maxHeight: '80vh', overflowY: 'auto', border: '1px solid #1e2d40' },
  closeBtn: { position: 'absolute', top: '16px', right: '16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' },
  modalTitle: { color: '#ffffff', fontSize: '20px', margin: '0 0 8px' },
  divider: { border: 'none', borderTop: '1px solid #1e2d40', margin: '16px 0' },
  msgTabs: { display: 'flex', gap: '8px', marginBottom: '16px' },
  msgTab: { flex: 1, padding: '10px', backgroundColor: '#0d1117', border: '1px solid #1e2d40', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#8892a4' },
  activeMsgTab: { backgroundColor: '#1e6fa4', color: 'white', border: '1px solid #1e6fa4' },
  msgForm: { display: 'flex', flexDirection: 'column', gap: '12px' },
  msgSent: { color: '#2ecc71', fontWeight: 'bold' },
  msgTextarea: { padding: '12px', borderRadius: '8px', border: '1px solid #1e2d40', backgroundColor: '#0d1117', color: 'white', fontSize: '14px', resize: 'vertical', outline: 'none' },
  msgSendBtn: { padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold' },
  myMsgsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  noMsg: { textAlign: 'center', color: '#8892a4' },
  msgItem: { backgroundColor: '#0d1117', borderRadius: '8px', padding: '12px', border: '1px solid #1e2d40' },
  msgText: { margin: '0 0 8px', fontSize: '14px', color: '#ffffff' },
  msgReply: { margin: '0 0 4px', fontSize: '14px', color: '#2ecc71', fontWeight: 'bold' },
  msgPending: { margin: '0 0 4px', fontSize: '13px', color: '#e67e22' },
  msgDate: { margin: 0, fontSize: '11px', color: '#8892a4' }
};

export default Dashboard;