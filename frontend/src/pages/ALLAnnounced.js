import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ClaimForm from '../component/ClaimForm';

function AllAnnounced() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedPostId, setSelectedPostId] = useState(null);
    const [isClaimOpen, setIsClaimOpen] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:4000/api/materials', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPosts(response.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                setErrorMsg('Hari ikibazo cyabaye mu gushaka amakuru!');
            }
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchAnnouncements();
    }, [token, navigate]);

    // Gufungura Google Maps bifashishije amakuru y'aho ikintu cyatorerewe
    const openGoogleMap = (province, district, sector) => {
        const address = `${sector || ''}, ${district || ''}, ${province || ''}, Rwanda`;
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(mapUrl, '_blank');
    };

    const filteredPosts = posts.filter(post => 
        post.material_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.announcer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.district && post.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post.sector && post.sector.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div style={containerStyle}>
            {/* Header yihariye yerekana Links zo gusubira kuri Dashboard na Profile hejuru iburyo */}
            <div style={headerNavStyle}>
                <h2 style={{ margin: 0 }}>Ibintu Byose Byatangajwe</h2>
                <div style={navLinksStyle}>
                    <Link to="/dashboard" style={linkStyle}>📊 Dashboard</Link>
                    <Link to="/profile" style={linkStyle}>👤 Profile</Link>
                </div>
            </div>
            
            {/* Search Input Bar */}
            <div style={{ margin: '20px 0' }}>
                <input 
                    type="text" 
                    placeholder="🔍 Shakisha igikoresho, uwacyatangaje, cyangwa akarere..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={searchInputStyle}
                />
            </div>

            {loading && <p>Birimo gushakishwa...</p>}
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

            {!loading && posts.length === 0 && <p>Nta bintu byatangajwe kugeza ubu.</p>}
            {!loading && posts.length > 0 && filteredPosts.length === 0 && (
                <p>Nta gikoresho gihuye n'ibyo ushakisha! ❌</p>
            )}

            <div style={gridStyle}>
                {filteredPosts.map((post) => (
                    <div key={post.id} style={cardStyle}>
                        {post.photo && (
                            <img 
                                src={`http://localhost:4000/uploads/${post.photo}`} 
                                alt={post.material_name} 
                                style={imageStyle} 
                            />
                        )}
                        <h3>{post.material_name}</h3>
                        <p><strong>Uwatangaje:</strong> {post.announcer_name}</p>
                        <p><strong>Akarere/Umurenge:</strong> {post.district || 'N/A'}, {post.sector || 'N/A'}</p>
                        <p><strong>Itariki:</strong> {new Date(post.date_announced).toLocaleDateString()}</p>
                        
                        {/* Status y'ikintu */}
                        <p>
                            <strong>Status:</strong>{' '}
                            <span style={{ color: post.status === 'claimed' ? '#e74c3c' : '#2ecc71', fontWeight: 'bold' }}>
                                {post.status ? post.status.toUpperCase() : 'AVAILABLE'}
                            </span>
                        </p>

                        {/* Map Icon / Button yo kureba aho biherereye */}
                        <button 
                            onClick={() => openGoogleMap(post.province, post.district, post.sector)}
                            style={mapButtonStyle}
                            title="Reba aho iherereye kuri Map"
                        >
                            🗺️ Reba kuri Map
                        </button>

                        {/* Niba cyabaye claimed yerekana badge, niba kitarayibona yerekana buto yo gukora claim */}
                        {post.status === 'claimed' ? (
                            <div style={claimedBadgeStyle}>
                                🔒 Claimed / Resolved
                            </div>
                        ) : (
                            <button 
                                onClick={() => {
                                    setSelectedPostId(post.id);
                                    setIsClaimOpen(true);
                                }} 
                                style={buttonStyle}
                            >
                                It Is Mine 🚗
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {isClaimOpen && (
                <ClaimForm 
                    postId={selectedPostId} 
                    onClose={() => setIsClaimOpen(false)} 
                    onSuccess={() => {
                        fetchAnnouncements();
                    }} 
                />
            )}
        </div>
    );
}

// Imiterere n'uburyo bwa design (Styles)
const containerStyle = { 
    width: '100%', 
    minHeight: '100vh', 
    padding: '20px 40px', 
    boxSizing: 'border-box', 
    color: '#fff', 
    backgroundColor: '#12121a' 
};
const headerNavStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' };
const navLinksStyle = { display: 'flex', gap: '15px' };
const linkStyle = { color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', backgroundColor: '#1e1e2f', padding: '8px 12px', borderRadius: '6px', border: '1px solid #444' };
const searchInputStyle = { width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e2f', color: '#fff', fontSize: '16px', boxSizing: 'border-box' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' };
const cardStyle = { backgroundColor: '#1e1e2f', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
const imageStyle = { width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' };
const mapButtonStyle = { backgroundColor: '#2a2a40', color: '#36A2EB', border: '1px solid #36A2EB', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginBottom: '8px', fontSize: '14px' };
const buttonStyle = { backgroundColor: '#4CAF50', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '5px' };
const claimedBadgeStyle = { backgroundColor: '#2a1a1a', color: '#e74c3c', padding: '8px', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold', marginTop: '5px', border: '1px solid #e74c3c' };

export default AllAnnounced;