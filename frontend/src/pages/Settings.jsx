import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const translations = {
  english: {
    title: 'Settings',
    theme: 'Theme',
    light: 'Light Mode',
    dark: 'Dark Mode',
    language: 'Language',
    profilePic: 'Profile Picture',
    uploadPic: 'Upload Photo',
    removePic: 'Remove Photo',
    save: 'Save',
    back: 'Back to Dashboard',
    saved: 'Saved successfully! ✅',
    error: 'An error occurred!',
    deleteTitle: 'Delete Account',
    deleteDesc: 'Once you close your account, you will not be able to log back in, but your posted data will remain.',
    deleteBtn: 'Delete Account',
    confirmDelete: 'Are you sure you want to close your account? This action cannot be undone!'
  },
  french: {
    title: 'Paramètres',
    theme: 'Thème',
    light: 'Mode Clair',
    dark: 'Mode Sombre',
    language: 'Langue',
    profilePic: 'Photo de Profil',
    uploadPic: 'Télécharger Photo',
    removePic: 'Supprimer Photo',
    save: 'Enregistrer',
    back: 'Retour au Dashboard',
    saved: 'Enregistré avec succès! ✅',
    error: 'Une erreur est survenue!',
    deleteTitle: 'Supprimer le Compte',
    deleteDesc: 'Une fois votre compte fermé, vous ne pourrez plus vous connecter, mais vos données publiées resteront.',
    deleteBtn: 'Supprimer le Compte',
    confirmDelete: 'Êtes-vous sûr de vouloir fermer votre compte ? Cette action est irréversible !'
  },
  kinyarwanda: {
    title: 'Igenamiterere',
    theme: 'Isura',
    light: 'Urumuri',
    dark: 'Umukara',
    language: 'Ururimi',
    profilePic: 'Ifoto y Umwirondoro',
    uploadPic: 'Shyiraho Ifoto',
    removePic: 'Siba Ifoto',
    save: 'Bika',
    back: 'Subira Dashboard',
    saved: 'Byabitswe neza! ✅',
    error: 'Habaye ikosa!',
    deleteTitle: 'Gusiba Konti',
    deleteDesc: 'Numara gufunga konti yawe, ntuzashobora kongera kwinjira, ariko amakuru yawe watangaje azasigarana na database.',
    deleteBtn: 'Siba Konti',
    confirmDelete: 'Wizeye neza ko ushaka gufunga konti yawe? Iki gikorwa ntigisubirwaho!'
  }
};

function Settings() {
  const [settings, setSettings] = useState(null);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('english');
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const t = translations[language] || translations.english;

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/auth/settings/' + user.id);
      setSettings(res.data);
      setTheme(res.data.theme || 'light');
      setLanguage(res.data.language || 'english');
      if (res.data.profile_pic) {
        setPreviewPic('http://localhost:4000/uploads/' + res.data.profile_pic);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleSaveTheme = async () => {
    try {
      await axios.put('http://localhost:4000/api/auth/settings/theme/' + user.id, { theme });
      localStorage.setItem('theme', theme);
      setMessage(t.saved);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage(t.error); }
  };

  const handleSaveLanguage = async () => {
    try {
      await axios.put('http://localhost:4000/api/auth/settings/language/' + user.id, { language });
      localStorage.setItem('language', language);
      setMessage(t.saved);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage(t.error); }
  };

  const handleUploadPic = async () => {
    if (!profilePic) return;
    try {
      const formData = new FormData();
      formData.append('profile_pic', profilePic);
      const res = await axios.put(
        'http://localhost:4000/api/auth/settings/profilepic/' + user.id,
        formData
      );
      setPreviewPic('http://localhost:4000/uploads/' + res.data.filename);
      setMessage(t.saved);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage(t.error); }
  };

  const handleRemovePic = async () => {
    try {
      await axios.delete('http://localhost:4000/api/auth/settings/profilepic/' + user.id);
      setPreviewPic(null);
      setProfilePic(null);
      setMessage(t.saved);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setMessage(t.error); }
  };

  // Function yo gusiba / gufunga konti
  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(t.confirmDelete);
    if (confirmation) {
      try {
        const response = await axios.delete('http://localhost:4000/api/auth/delete-account', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          alert(response.data.message);
          localStorage.clear(); // Isiba byose muri localStorage (token, user, nibindi)
          navigate('/'); // Isubiza umukoresha aho binjirira (Login page)
        }
      } catch (err) {
        alert(t.error + ': ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const isDark = theme === 'dark';

  const bg = isDark ? '#1a1a2e' : '#f0f4f8';
  const cardBg = isDark ? '#16213e' : 'white';
  const textColor = isDark ? 'white' : '#2c3e50';
  const borderColor = isDark ? '#0f3460' : '#ddd';

  if (loading) return <div style={{ textAlign: 'center', marginTop: '40px' }}>Gutegereza...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, fontFamily: 'Arial, sans-serif' }}>

      {/* Navbar */}
      <div style={{ backgroundColor: isDark ? '#0f3460' : '#2c3e50', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'white', margin: 0, fontSize: '22px' }}>⚙️ {t.title}</h2>
        <button
          style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          ← {t.back}
        </button>
      </div>

      <div style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>

        {message && (
          <div style={{ backgroundColor: '#2ecc71', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
            {message}
          </div>
        )}

        {/* Profile Picture */}
        <div style={{ backgroundColor: cardBg, borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: textColor, marginBottom: '16px' }}>🖼️ {t.profilePic}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
            {previewPic ? (
              <img src={previewPic} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2ecc71' }} />
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: 'white', fontWeight: 'bold' }}>
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setProfilePic(e.target.files[0]);
                  setPreviewPic(URL.createObjectURL(e.target.files[0]));
                }}
                style={{ fontSize: '13px', color: textColor }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{ padding: '8px 16px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                  onClick={handleUploadPic}
                >
                  📤 {t.uploadPic}
                </button>
                {previewPic && (
                  <button
                    style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                    onClick={handleRemovePic}
                  >
                    🗑️ {t.removePic}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div style={{ backgroundColor: cardBg, borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: textColor, marginBottom: '16px' }}>🎨 {t.theme}</h3>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <button
              style={{ flex: 1, padding: '12px', backgroundColor: theme === 'light' ? '#2ecc71' : borderColor, color: theme === 'light' ? 'white' : textColor, border: '2px solid ' + (theme === 'light' ? '#2ecc71' : borderColor), borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => setTheme('light')}
            >
              ☀️ {t.light}
            </button>
            <button
              style={{ flex: 1, padding: '12px', backgroundColor: theme === 'dark' ? '#2ecc71' : borderColor, color: theme === 'dark' ? 'white' : textColor, border: '2px solid ' + (theme === 'dark' ? '#2ecc71' : borderColor), borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => setTheme('dark')}
            >
              🌙 {t.dark}
            </button>
          </div>
          <button
            style={{ width: '100%', padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={handleSaveTheme}
          >
            💾 {t.save}
          </button>
        </div>

        {/* Language */}
        <div style={{ backgroundColor: cardBg, borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: textColor, marginBottom: '16px' }}>🌍 {t.language}</h3>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            {['english', 'french', 'kinyarwanda'].map((lang) => (
              <button
                key={lang}
                style={{ flex: 1, padding: '12px', backgroundColor: language === lang ? '#2ecc71' : borderColor, color: language === lang ? 'white' : textColor, border: '2px solid ' + (language === lang ? '#2ecc71' : borderColor), borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                onClick={() => setLanguage(lang)}
              >
                {lang === 'english' ? '🇬🇧 English' : lang === 'french' ? '🇫🇷 Français' : '🇷🇼 Kinyarwanda'}
              </button>
            ))}
          </div>
          <button
            style={{ width: '100%', padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={handleSaveLanguage}
          >
            💾 {t.save}
          </button>
        </div>

        {/* Delete Account (Danger Zone) */}
        <div style={{ backgroundColor: cardBg, borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #e74c3c' }}>
          <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>⚠️ {t.deleteTitle}</h3>
          <p style={{ color: textColor, fontSize: '14px', marginBottom: '16px', lineHeight: '1.5' }}>
            {t.deleteDesc}
          </p>
          <button
            style={{ width: '100%', padding: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={handleDeleteAccount}
          >
            🗑️ {t.deleteBtn}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Settings;