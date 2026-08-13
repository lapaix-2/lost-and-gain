

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({ users: 0, posts: 0, claimed: 0 });
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [claimRequests, setClaimRequests] = useState([]);
  const [onlineUsersList, setOnlineUsersList] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);

  // Search states for each section
  const [postSearch, setPostSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [msgSearch, setMsgSearch] = useState('');
  const [claimSearch, setClaimSearch] = useState('');

  const navigate = useNavigate();
  const ADMIN_PASSWORD = 'nsa1Eri$';

  // Kwihuza na Socket.io igihe Admin yemewe
  useEffect(() => {
    if (authenticated) {
      const socket = io('http://https://lost-and-gain-backend.onrender.com');

      socket.on('update_online_users', (activeList) => {
        setOnlineUsersList(activeList);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [authenticated]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setAuthError('');
      fetchAllData();
    } else {
      setAuthError('Password ntabwo ari yo!');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [postsRes, usersRes, msgsRes, claimRes] = await Promise.all([
        axios.get('http://https://lost-and-gain-backend.onrender.com/api/materials/admin/posts'),
        axios.get('http://https://lost-and-gain-backend.onrender.com/api/auth/admin/users'),
        axios.get('http://https://lost-and-gain-backend.onrender.com/api/auth/messages/admin/all'),
        axios.get('http://https://lost-and-gain-backend.onrender.com/api/materials/admin/claim-requests')
      ]);
      setPosts(postsRes.data);
      setUsers(usersRes.data);
      setMessages(msgsRes.data);
      setClaimRequests(claimRes.data);
      setStats({
        users: usersRes.data.length,
        posts: postsRes.data.length,
        claimed: postsRes.data.filter(p => p.status === 'claimed').length
      });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Urashaka gusiba iyi post?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://https://lost-and-gain-backend.onrender.com/api/materials/delete/' + id, {
        headers: { authorization: 'Bearer ' + token }
      });
      fetchAllData();
    } catch (err) {
      alert('Habaye ikosa: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleBlock = async (id) => {
    if (!window.confirm('Urashaka guhagarika iyi account?')) return;
    try {
      await axios.put('http://https://lost-and-gain-backend.onrender.com/api/auth/admin/block/' + id);
      fetchAllData();
    } catch (err) { alert('Habaye ikosa!'); }
  };

  const handleUnblock = async (id) => {
    if (!window.confirm('Urashaka gusubiza iyi account?')) return;
    try {
      await axios.put('http://https://lost-and-gain-backend.onrender.com/api/auth/admin/unblock/' + id);
      fetchAllData();
    } catch (err) { alert('Habaye ikosa!'); }
  };

  const handleReply = async (id) => {
    if (!replyText[id]?.trim()) return;
    try {
      await axios.put('http://https://lost-and-gain-backend.onrender.com/api/auth/messages/reply/' + id, {
        reply: replyText[id]
      });
      setReplyText({ ...replyText, [id]: '' });
      fetchAllData();
    } catch (err) { alert('Habaye ikosa!'); }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Urashaka kwemeza iyi request?')) return;
    try {
      await axios.put('http://https://lost-and-gain-backend.onrender.com/api/materials/admin/claim-requests/approve/' + id);
      fetchAllData();
    } catch (err) { alert('Habaye ikosa!'); }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Urashaka guta iyi request?')) return;
    try {
      await axios.put('http://https://lost-and-gain-backend.onrender.com/api/materials/admin/claim-requests/reject/' + id);
      fetchAllData();
    } catch (err) { alert('Habaye ikosa!'); }
  };

  // Filtered lists based on search inputs
  const filteredPosts = posts.filter(p => 
    p.material_name?.toLowerCase().includes(postSearch.toLowerCase()) ||
    p.announcer_name?.toLowerCase().includes(postSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.district?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.sector?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.province?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredMessages = messages.filter(m => 
    m.sender_name?.toLowerCase().includes(msgSearch.toLowerCase()) ||
    m.message?.toLowerCase().includes(msgSearch.toLowerCase())
  );

  const filteredClaims = claimRequests.filter(c => 
    c.material_name?.toLowerCase().includes(claimSearch.toLowerCase()) ||
    c.claimer_name?.toLowerCase().includes(claimSearch.toLowerCase()) ||
    c.claimer_phone?.toLowerCase().includes(claimSearch.toLowerCase()) ||
    c.claimer_district?.toLowerCase().includes(claimSearch.toLowerCase())
  );

  if (!authenticated) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authCard}>
          <div style={styles.authIcon}>🔐</div>
          <h2 style={styles.authTitle}>Admin Dashboard</h2>
          <p style={styles.authSubtitle}>Injiza password ya admin kugira ngo winjire</p>
          {authError && <p style={styles.authError}>{authError}</p>}
          <form onSubmit={handleAdminLogin} style={styles.authForm}>
            <input
              style={styles.authInput}
              type="password"
              placeholder="Admin Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
            />
            <button style={styles.authBtn} type="submit">Injira</button>
          </form>
          <button style={styles.backLink} onClick={() => navigate('/dashboard')}>
            Subira Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>Admin Dashboard</h2>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          Subira Dashboard
        </button>
      </div>

      <div style={styles.tabs}>
        <button style={{...styles.tab, ...(activeTab === 'stats' ? styles.activeTab : {})}} onClick={() => setActiveTab('stats')}>
          📊 Statistics
        </button>
        <button style={{...styles.tab, ...(activeTab === 'posts' ? styles.activeTab : {})}} onClick={() => setActiveTab('posts')}>
          📋 Posts ({posts.length})
        </button>
        <button style={{...styles.tab, ...(activeTab === 'users' ? styles.activeTab : {})}} onClick={() => setActiveTab('users')}>
          👥 Users ({users.length})
          <span style={styles.onlineBadgeCount}>{onlineUsersList.length} Online</span>
        </button>
        <button style={{...styles.tab, ...(activeTab === 'messages' ? styles.activeTab : {})}} onClick={() => setActiveTab('messages')}>
          💬 Messages
          {messages.filter(m => !m.reply).length > 0 && (
            <span style={styles.msgBadge}>{messages.filter(m => !m.reply).length}</span>
          )}
        </button>
        <button style={{...styles.tab, ...(activeTab === 'claims' ? styles.activeTab : {})}} onClick={() => setActiveTab('claims')}>
          📨 Claim Requests
          {claimRequests.filter(c => c.status === 'pending').length > 0 && (
            <span style={styles.msgBadge}>{claimRequests.filter(c => c.status === 'pending').length}</span>
          )}
        </button>
      </div>

      <div style={styles.content}>
        {loading ? (
          <p style={styles.loading}>Gutegereza...</p>
        ) : (
          <>
            {/* STATISTICS */}
            {activeTab === 'stats' && (
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>👥</div>
                  <h3 style={styles.statNumber}>{stats.users}</h3>
                  <p style={styles.statLabel}>Users Bose</p>
                </div>
                <div style={{...styles.statCard, border: '1px solid #3fb950'}}>
                  <div style={styles.statIcon}>🟢</div>
                  <h3 style={{...styles.statNumber, color: '#3fb950'}}>{onlineUsersList.length}</h3>
                  <p style={styles.statLabel}>Bari Online Ubu</p>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>📋</div>
                  <h3 style={styles.statNumber}>{stats.posts}</h3>
                  <p style={styles.statLabel}>Posts Zose</p>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>✅</div>
                  <h3 style={styles.statNumber}>{stats.claimed}</h3>
                  <p style={styles.statLabel}>Ibintu Byaboneshejwe</p>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>⏳</div>
                  <h3 style={styles.statNumber}>{stats.posts - stats.claimed}</h3>
                  <p style={styles.statLabel}>Biracyashakwa</p>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>💬</div>
                  <h3 style={styles.statNumber}>{messages.length}</h3>
                  <p style={styles.statLabel}>Messages Zose</p>
                </div>
              </div>
            )}

            {/* POSTS */}
            {activeTab === 'posts' && (
              <div>
                <div style={styles.headerFlex}>
                  <h3 style={styles.sectionTitle}>Posts Zose ({filteredPosts.length})</h3>
                  <input
                    type="text"
                    placeholder="🔍 Shakisha post cyangwa utangaje..."
                    value={postSearch}
                    onChange={(e) => setPostSearch(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
                {filteredPosts.length === 0 ? (
                  <p style={styles.noMsg}>Nta post ibonetse.</p>
                ) : (
                  <div style={styles.grid}>
                    {filteredPosts.map((post) => (
                      <div key={post.id} style={{...styles.postCard, opacity: post.status === 'claimed' ? 0.7 : 1}}>
                        {post.photo ? (
                          <img src={'http://https://lost-and-gain-backend.onrender.com/uploads/' + post.photo} alt={post.material_name} style={styles.postImage} />
                        ) : (
                          <div style={styles.noImage}>📦</div>
                        )}
                        <div style={styles.postInfo}>
                          <p style={styles.postName}>{post.material_name}</p>
                          <p style={styles.postAnnouncer}>👤 {post.announcer_name}</p>
                          <p style={styles.postDate}>{new Date(post.date_announced).toLocaleDateString()}</p>
                          {post.status === 'claimed' && <p style={styles.claimedBadge}>Yaboneshejwe</p>}
                          <button style={styles.deleteBtn} onClick={() => handleDeletePost(post.id)}>Siba</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
              <div>
                <div style={styles.headerFlex}>
                  <h3 style={styles.sectionTitle}>Users Bose ({filteredUsers.length})</h3>
                  <input
                    type="text"
                    placeholder="🔍 Shakisha umukoresha cyangwa akarere..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
                {filteredUsers.length === 0 ? (
                  <p style={styles.noMsg}>Nta user ubonetse.</p>
                ) : (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.tableHeader}>
                          <th style={styles.th}>#</th>
                          <th style={styles.th}>Amazina</th>
                          <th style={styles.th}>Akarere</th>
                          <th style={styles.th}>Real-time Status</th>
                          <th style={styles.th}>Account Status</th>
                          <th style={styles.th}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u, index) => {
                          const isOnline = onlineUsersList.some(onlineUser => onlineUser.userId === u.id);

                          return (
                            <tr key={u.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                              <td style={styles.td}>{index + 1}</td>
                              <td style={styles.td}>{u.full_name}</td>
                              <td style={styles.td}>{u.district}</td>
                              <td style={styles.td}>
                                {isOnline ? (
                                  <span style={{color: '#3fb950', fontWeight: 'bold'}}>🟢 Online (Arigukoresha Urubuga)</span>
                                ) : (
                                  <span style={{color: '#8b949e'}}>⚪ Offline (Yasohotse)</span>
                                )}
                              </td>
                              <td style={styles.td}>
                                {u.status === 'blocked' ? (
                                  <span style={styles.blockedBadge}>Blocked</span>
                                ) : (
                                  <span style={styles.activeBadge}>Active</span>
                                )}
                              </td>
                              <td style={styles.td}>
                                {u.status === 'blocked' ? (
                                  <button style={styles.unblockBtn} onClick={() => handleUnblock(u.id)}>Unblock</button>
                                ) : (
                                  <button style={styles.blockBtn} onClick={() => handleBlock(u.id)}>Block</button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* MESSAGES */}
            {activeTab === 'messages' && (
              <div>
                <div style={styles.headerFlex}>
                  <h3 style={styles.sectionTitle}>Messages ({filteredMessages.length})</h3>
                  <input
                    type="text"
                    placeholder="🔍 Shakisha muri messages..."
                    value={msgSearch}
                    onChange={(e) => setMsgSearch(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
                {filteredMessages.length === 0 ? (
                  <p style={styles.noMsg}>Nta message ibonetse.</p>
                ) : (
                  <div style={styles.msgList}>
                    {filteredMessages.map((msg) => (
                      <div key={msg.id} style={{...styles.msgCard, borderLeft: msg.reply ? '4px solid #2ea043' : '4px solid #d29922'}}>
                        <div style={styles.msgHeader}>
                          <span style={styles.msgSender}>👤 {msg.sender_name}</span>
                          <span style={styles.msgDate}>{new Date(msg.created_at).toLocaleDateString()}</span>
                        </div>
                        <p style={styles.msgText}>{msg.message}</p>
                        {msg.reply ? (
                          <p style={styles.msgReply}>Igisubizo: {msg.reply}</p>
                        ) : (
                          <div style={styles.replyWrapper}>
                            <textarea
                              style={styles.replyInput}
                              placeholder="Andika igisubizo..."
                              value={replyText[msg.id] || ''}
                              onChange={(e) => setReplyText({ ...replyText, [msg.id]: e.target.value })}
                              rows={2}
                            />
                            <button style={styles.replyBtn} onClick={() => handleReply(msg.id)}>
                              Subira
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CLAIM REQUESTS */}
            {activeTab === 'claims' && (
              <div>
                <div style={styles.headerFlex}>
                  <h3 style={styles.sectionTitle}>📨 Claim Requests ({filteredClaims.length})</h3>
                  <input
                    type="text"
                    placeholder="🔍 Shakisha uwasabye cyangwa igikoresho..."
                    value={claimSearch}
                    onChange={(e) => setClaimSearch(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
                {filteredClaims.length === 0 ? (
                  <p style={styles.noMsg}>Nta request ibonetse.</p>
                ) : (
                  <div style={styles.claimList}>
                    {filteredClaims.map((req) => (
                      <div key={req.id} style={{
                        ...styles.claimCard,
                        borderLeft: req.status === 'approved' ? '4px solid #2ea043' :
                                    req.status === 'rejected' ? '4px solid #f85149' :
                                    '4px solid #d29922'
                      }}>
                        <div style={styles.claimHeader}>
                          <span style={styles.claimMaterial}>📦 {req.material_name}</span>
                          <span style={{
                            ...styles.claimStatus,
                            color: req.status === 'approved' ? '#3fb950' :
                                   req.status === 'rejected' ? '#f85149' : '#d29922'
                          }}>
                            {req.status === 'approved' ? '✅ Yemejwe' :
                             req.status === 'rejected' ? '❌ Yahakanwe' : '⏳ Gutegereza'}
                          </span>
                        </div>

                        <div style={styles.claimInfo}>
                          <div style={styles.claimInfoLeft}>
                            <p style={styles.claimText}><strong>Amazina:</strong> {req.claimer_name}</p>
                            <p style={styles.claimText}><strong>Telefone:</strong> {req.claimer_phone}</p>
                            <p style={styles.claimText}><strong>Intara:</strong> {req.claimer_province}</p>
                            <p style={styles.claimText}><strong>Akarere:</strong> {req.claimer_district}</p>
                            <p style={styles.claimText}><strong>Umurenge:</strong> {req.claimer_sector}</p>
                            <p style={styles.claimText}><strong>Umudugudu:</strong> {req.claimer_umudugudu}</p>
                            <p style={styles.claimDate}>{new Date(req.created_at).toLocaleDateString()}</p>
                          </div>
                          <div style={styles.claimInfoRight}>
                            <p style={styles.idLabel}>Indangamuntu — Imbere</p>
                            <img
                              src={'http://https://lost-and-gain-backend.onrender.com/uploads/' + req.id_card_front}
                              alt="ID Front"
                              style={styles.idImage}
                            />
                            <p style={styles.idLabel}>Indangamuntu — Inyuma</p>
                            <img
                              src={'http://https://lost-and-gain-backend.onrender.com/uploads/' + req.id_card_back}
                              alt="ID Back"
                              style={styles.idImage}
                            />
                          </div>
                        </div>

                        {req.status === 'pending' && (
                          <div style={styles.claimActions}>
                            <button style={styles.approveBtn} onClick={() => handleApprove(req.id)}>
                              ✅ Emeza
                            </button>
                            <button style={styles.rejectBtn} onClick={() => handleReject(req.id)}>
                              ❌ Hakanisha
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  authContainer: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d1117' },
  authCard: { backgroundColor: '#161b22', borderRadius: '12px', padding: '40px', width: '400px', textAlign: 'center', border: '1px solid #30363d', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' },
  authIcon: { fontSize: '48px', marginBottom: '16px' },
  authTitle: { color: '#ffffff', fontSize: '24px', margin: '0 0 8px' },
  authSubtitle: { color: '#8b949e', fontSize: '14px', margin: '0 0 24px' },
  authError: { color: '#f85149', marginBottom: '12px' },
  authForm: { display: 'flex', flexDirection: 'column', gap: '12px' },
  authInput: { padding: '12px', borderRadius: '8px', border: '1px solid #30363d', backgroundColor: '#0d1117', color: '#ffffff', fontSize: '14px' },
  authBtn: { padding: '12px', backgroundColor: '#238636', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold' },
  backLink: { marginTop: '16px', backgroundColor: 'transparent', border: 'none', color: '#58a6ff', cursor: 'pointer', fontSize: '14px' },
  container: { minHeight: '100vh', backgroundColor: '#0d1117', color: '#ffffff', fontFamily: 'Arial, sans-serif' },
  navbar: { backgroundColor: '#161b22', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #30363d' },
  navTitle: { color: '#ffffff', margin: 0, fontSize: '22px' },
  backBtn: { padding: '8px 16px', backgroundColor: '#21262d', color: '#c9d1d9', border: '1px solid #30363d', borderRadius: '6px', cursor: 'pointer' },
  tabs: { backgroundColor: '#161b22', display: 'flex', borderBottom: '1px solid #30363d', flexWrap: 'wrap' },
  tab: { padding: '16px 20px', backgroundColor: 'transparent', border: 'none', fontSize: '14px', cursor: 'pointer', color: '#8b949e', fontWeight: 'bold', position: 'relative' },
  activeTab: { color: '#58a6ff', borderBottom: '3px solid #58a6ff' },
  msgBadge: { backgroundColor: '#f85149', color: '#ffffff', borderRadius: '50%', padding: '2px 6px', fontSize: '11px', marginLeft: '6px' },
  onlineBadgeCount: { backgroundColor: '#238636', color: '#ffffff', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', marginLeft: '6px' },
  content: { padding: '32px', maxWidth: '1100px', margin: '0 auto' },
  loading: { textAlign: 'center', color: '#8b949e' },
  headerFlex: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  searchInput: { padding: '10px 16px', borderRadius: '8px', border: '1px solid #30363d', backgroundColor: '#161b22', color: '#ffffff', fontSize: '14px', width: '260px', outline: 'none' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' },
  statCard: { backgroundColor: '#161b22', borderRadius: '12px', padding: '24px', textAlign: 'center', border: '1px solid #30363d' },
  statIcon: { fontSize: '40px', marginBottom: '12px' },
  statNumber: { fontSize: '36px', fontWeight: 'bold', color: '#58a6ff', margin: '0 0 8px' },
  statLabel: { color: '#8b949e', fontSize: '14px', margin: 0 },
  sectionTitle: { color: '#ffffff', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  postCard: { backgroundColor: '#161b22', borderRadius: '12px', overflow: 'hidden', border: '1px solid #30363d' },
  postImage: { width: '100%', height: '160px', objectFit: 'cover' },
  noImage: { width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#21262d', fontSize: '40px' },
  postInfo: { padding: '12px' },
  postName: { margin: '0 0 6px', fontSize: '15px', fontWeight: 'bold', color: '#ffffff' },
  postAnnouncer: { margin: '0 0 4px', fontSize: '12px', color: '#8b949e' },
  postDate: { margin: '0 0 6px', fontSize: '12px', color: '#8b949e' },
  claimedBadge: { color: '#3fb950', fontWeight: 'bold', fontSize: '12px', margin: '0 0 6px' },
  deleteBtn: { width: '100%', padding: '7px', backgroundColor: '#da3633', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  tableWrapper: { width: '100%', overflowX: 'auto', borderRadius: '12px', border: '1px solid #30363d' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#161b22' },
  tableHeader: { backgroundColor: '#21262d' },
  th: { padding: '14px 16px', color: '#58a6ff', textAlign: 'left', fontSize: '14px', borderBottom: '1px solid #30363d' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#c9d1d9', borderBottom: '1px solid #21262d' },
  trEven: { backgroundColor: '#161b22' },
  trOdd: { backgroundColor: '#0d1117' },
  activeBadge: { color: '#3fb950', fontWeight: 'bold', fontSize: '13px' },
  blockedBadge: { color: '#f85149', fontWeight: 'bold', fontSize: '13px' },
  blockBtn: { padding: '6px 12px', backgroundColor: '#da3633', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  unblockBtn: { padding: '6px 12px', backgroundColor: '#238636', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  msgList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  noMsg: { textAlign: 'center', color: '#8b949e' },
  msgCard: { backgroundColor: '#161b22', borderRadius: '12px', padding: '16px', border: '1px solid #30363d' },
  msgHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  msgSender: { fontWeight: 'bold', color: '#ffffff', fontSize: '14px' },
  msgDate: { color: '#8b949e', fontSize: '12px' },
  msgText: { margin: '0 0 10px', fontSize: '14px', color: '#c9d1d9' },
  msgReply: { margin: 0, fontSize: '14px', color: '#3fb950', fontWeight: 'bold', backgroundColor: '#0d1117', padding: '8px', borderRadius: '6px', border: '1px solid #30363d' },
  replyWrapper: { display: 'flex', gap: '8px', alignItems: 'flex-end' },
  replyInput: { flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #30363d', backgroundColor: '#0d1117', color: '#ffffff', fontSize: '14px', resize: 'none' },
  replyBtn: { padding: '8px 16px', backgroundColor: '#1f6feb', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  claimList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  claimCard: { backgroundColor: '#161b22', borderRadius: '12px', padding: '20px', border: '1px solid #30363d' },
  claimHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  claimMaterial: { fontWeight: 'bold', color: '#ffffff', fontSize: '16px' },
  claimStatus: { fontWeight: 'bold', fontSize: '14px' },
  claimInfo: { display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' },
  claimInfoLeft: { flex: 1, minWidth: '250px' },
  claimInfoRight: { flex: 1, minWidth: '250px' },
  claimText: { margin: '0 0 6px', fontSize: '14px', color: '#c9d1d9' },
  claimDate: { margin: '8px 0 0', fontSize: '12px', color: '#8b949e' },
  idLabel: { fontWeight: 'bold', fontSize: '13px', color: '#8b949e', margin: '8px 0 4px' },
  idImage: { width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #30363d' },
  claimActions: { display: 'flex', gap: '12px' },
  approveBtn: { flex: 1, padding: '10px', backgroundColor: '#238636', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  rejectBtn: { flex: 1, padding: '10px', backgroundColor: '#da3633', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }
};

export default Admin;