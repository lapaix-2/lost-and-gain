import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Guhuza icon ya Leaflet n'ibibazo byayo bisanzwe muri React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function Map() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Gushaka amakuru y'ibintu byose byatangajwe hamwe n'aho biherereye
  useEffect(() => {
    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/materials', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPosts(response.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error("Hari ikibazo cyo gushaka amakuru ya map", err);
        }
    };
    fetchAnnouncements();
  }, [token]);

  // Isoko rusange y'u Rwanda (Rwanda Center coordinates: -1.9403, 29.8739)
  const rwandaCenter = [-1.9403, 29.8739];

  return (
    <div style={styles.container}>
      {/* Navbar yoroheje yo gusubira ahandi */}
      <nav style={styles.navbar}>
        <div style={styles.logo} onClick={() => navigate('/')}>LOST & GAIN</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={styles.backBtn} onClick={() => navigate('/announcements')}>📋 All Announcements</button>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>📊 Dashboard</button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.content}>
        <h1 style={styles.title}>📍 Lost Items Live Map</h1>
        <p style={styles.subtitle}>
          Aha hagaragaza ahantu hatandukanye ibintu byatoraguwe biherereye mu gihugu hose. Koresha ikarita hepfo kugira ngo umenye aho biherereye.
        </p>

        {loading ? (
          <p style={{ color: '#aaa' }}>Ikarita irimo gutunganywa n'amakuru...</p>
        ) : (
          <div style={styles.mapBox}>
            <MapContainer center={rwandaCenter} zoom={8} style={{ width: '100%', height: '100%', borderRadius: '12px' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Kuzenguruka posts zose no gushyira markers ku ikarita */}
              {posts.map((post) => {
                // Niba posts zifite latitude na longitude zabugenewe, twazikoresha. 
                // Hano dushyize aho zihuye n'akarere cyangwa default coordinates niba zitazwi neza.
                const lat = post.latitude || -1.9403 + (Math.random() - 0.5) * 0.5;
                const lng = post.longitude || 29.8739 + (Math.random() - 0.5) * 0.5;

                return (
                  <Marker key={post.id} position={[lat, lng]}>
                    <Popup>
                      <div style={{ color: '#000' }}>
                        {post.photo && (
                          <img 
                            src={`http://localhost:4000/uploads/${post.photo}`} 
                            alt={post.material_name} 
                            style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '4px' }} 
                          />
                        )}
                        <h4 style={{ margin: '5px 0' }}>{post.material_name}</h4>
                        <p style={{ margin: '2px 0', fontSize: '12px' }}><strong>Akarere:</strong> {post.district || 'N/A'}</p>
                        <p style={{ margin: '2px 0', fontSize: '12px' }}><strong>Umurenge:</strong> {post.sector || 'N/A'}</p>
                        <p style={{ margin: '2px 0', fontSize: '12px' }}><strong>Status:</strong> {post.status || 'Available'}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { 
    minHeight: '100vh', 
    backgroundColor: '#0d1117', 
    color: 'white', 
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    boxSizing: 'border-box'
  },
  navbar: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '15px 30px', 
    backgroundColor: '#111827', 
    borderBottom: '1px solid #1e2d40' 
  },
  logo: { 
    fontSize: '22px', 
    fontWeight: 'bold', 
    color: '#4a90a4', 
    letterSpacing: '1px', 
    cursor: 'pointer' 
  },
  backBtn: { 
    backgroundColor: '#1e6fa4', 
    border: 'none', 
    color: 'white', 
    padding: '8px 16px', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontWeight: 'bold',
    fontSize: '14px'
  },
  content: { 
    padding: '40px 20px', 
    maxWidth: '1100px', 
    margin: '0 auto', 
    textAlign: 'center' 
  },
  title: { 
    fontSize: '32px', 
    fontWeight: 'bold', 
    marginBottom: '10px', 
    color: '#ffffff' 
  },
  subtitle: { 
    fontSize: '16px', 
    color: '#8892a4', 
    marginBottom: '30px', 
    lineHeight: '1.5' 
  },
  mapBox: { 
    width: '100%', 
    height: '500px', 
    backgroundColor: '#111827', 
    borderRadius: '12px', 
    border: '1px solid #1e2d40', 
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    overflow: 'hidden'
  }
};

export default Map;