import React, { useState } from 'react';
import axios from 'axios';

function ClaimForm({ postId, onClose, onSuccess }) {
    const [phone, setPhone] = useState('');
    const [fullName, setFullName] = useState('');
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [sector, setSector] = useState('');
    const [umudugudu, setUmudugudu] = useState('');
    const [idCard, setIdCard] = useState('');
    
    // State zibika za foto
    const [idCardPhoto, setIdCardPhoto] = useState(null);
    const [selfie, setSelfie] = useState(null);
    
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        // Genzura niba amafoto yombi ahari mbere yo kohereza
        if (!idCardPhoto || !selfie) {
            setErrorMsg("Ugomba kohereza ifoto y'indangamuntu n'ifoto yawe ya Selfie kugira ngo wemeze ko ari wowe! ❌");
            return;
        }

        const formData = new FormData();
        formData.append('phone', phone);
        formData.append('full_name', fullName);
        formData.append('province', province);
        formData.append('district', district);
        formData.append('sector', sector);
        formData.append('umudugudu', umudugudu);
        formData.append('id_card', idCard);
        
        // Amazina ahuye neza n'ayo Backend isaba muri Multer ({ name: 'id_card_photo' } na { name: 'selfie' })
        formData.append('id_card_photo', idCardPhoto);
        formData.append('selfie', selfie);

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await axios.post(`http://https://lost-and-gain-backend.onrender.com/api/materials/claim-request/${postId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            alert(response.data.message);
            setLoading(false);
            if (onSuccess) onSuccess();
            if (onClose) onClose();

        } catch (err) {
            setLoading(false);
            setErrorMsg(err.response?.data?.message || 'Hari ikibazo cyabayeho mu kohereza ubutumwa!');
        }
    };

    return (
        <div style={modalStyle}>
            <div style={formContentStyle}>
                <h3>It Is Mine — Kwemeza ibyangombwa</h3>
                
                {errorMsg && <div style={{ color: '#ff6b6b', marginBottom: '10px', fontWeight: 'bold' }}>{errorMsg}</div>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nimero ya Telefoni:</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required style={inputStyle} />
                    </div>
                    <div>
                        <label>Amazina Yose (Full Name):</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={inputStyle} />
                    </div>
                    <div>
                        <label>Intara (Province):</label>
                        <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} required style={inputStyle} />
                    </div>
                    <div>
                        <label>Akarere (District):</label>
                        <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} required style={inputStyle} />
                    </div>
                    <div>
                        <label>Umurenge (Sector):</label>
                        <input type="text" value={sector} onChange={(e) => setSector(e.target.value)} required style={inputStyle} />
                    </div>
                    <div>
                        <label>Umudugudu:</label>
                        <input type="text" value={umudugudu} onChange={(e) => setUmudugudu(e.target.value)} required style={inputStyle} />
                    </div>
                    <div>
                        <label>Nimero y'Indangamuntu (ID Card):</label>
                        <input type="text" value={idCard} onChange={(e) => setIdCard(e.target.value)} required style={inputStyle} />
                    </div>

                    {/* Ifoto y'Indangamuntu */}
                    <div style={{ margin: '12px 0' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Ifoto y'Indangamuntu (ID Card Photo):</label>
                        <input type="file" accept="image/*" onChange={(e) => setIdCardPhoto(e.target.files[0])} required />
                    </div>

                    {/* Ifoto ya Selfie */}
                    <div style={{ margin: '12px 0' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Ifoto yawe ya Selfie:</label>
                        <input type="file" accept="image/*" onChange={(e) => setSelfie(e.target.files[0])} required />
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <button type="submit" disabled={loading} style={buttonStyle}>
                            {loading ? 'Birimo koherezwa...' : 'Ohereza Ibimenyetso ✅'}
                        </button>
                        {onClose && <button type="button" onClick={onClose} style={cancelButtonStyle}>Funga</button>}
                    </div>
                </form>
            </div>
        </div>
    );
}

const modalStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};
const formContentStyle = {
    backgroundColor: '#1e1e2f', color: '#fff', padding: '25px', borderRadius: '10px', width: '420px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
};
const inputStyle = { width: '100%', padding: '8px', margin: '5px 0 12px 0', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a40', color: '#fff' };
const buttonStyle = { backgroundColor: '#4CAF50', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const cancelButtonStyle = { backgroundColor: '#f44336', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

export default ClaimForm;