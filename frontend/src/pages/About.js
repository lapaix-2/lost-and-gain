import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Arial, sans-serif', paddingBottom: '60px' }}>

      {/* Navbar */}
      <div style={{ backgroundColor: '#2c3e50', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '22px' }}>🔍 Lost & Found</h2>
        <button
          style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '900px', margin: '40px auto', backgroundColor: 'white', padding: '50px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#2c3e50', fontSize: '32px', marginBottom: '10px' }}>About Us</h1>
          <h3 style={{ color: '#16a085', fontSize: '20px', fontWeight: 'normal' }}>Reconnecting People With What Matters</h3>
          <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', maxWidth: '750px', margin: '20px auto 0 auto' }}>
            Lost & Found is a digital platform designed to make the process of reporting, discovering, and recovering lost belongings easier, faster, and safer.
          </p>
        </div>

        <hr style={{ border: 'none', height: '1px', backgroundColor: '#eee', margin: '30px 0' }} />

        {/* Section: The Problem */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '15px' }}>The Problem We Are Solving</h2>
          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '15px' }}>
            Every day, people lose important belongings such as identity cards, phones, wallets, bags, documents, keys, books, electronics, and other personal items. At the same time, many people find belongings that do not belong to them but have no simple and reliable way to locate the rightful owner.
          </p>
          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6' }}>
            Lost & Found was created to bridge that gap. Our platform brings people together through technology, allowing users to report lost items, report items they have found, search available announcements, share relevant information, and connect with people who may help return an item to its rightful owner.
          </p>
        </section>

        {/* Section: Our Mission */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '15px' }}>Our Mission</h2>
          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '15px' }}>
            Our mission is to make lost-and-found recovery simpler, more accessible, and more trustworthy through technology. We want to provide a platform where a person who loses an important belonging does not have to rely only on word of mouth or searching through different social media platforms.
          </p>
          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6' }}>
            Instead, users can report an item in one place, provide useful information, search for possible matches, and communicate with people who may help return the item. Our goal is not only to help people find lost belongings, but also to encourage a culture of honesty, responsibility, cooperation, and community support.
          </p>
        </section>

        {/* Section: How It Works */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '20px' }}>How Lost & Found Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ backgroundColor: '#f9fbfb', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>1. Report a Lost Item</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.5' }}>Create a report with the item's name, category, description, date, location, and photograph.</p>
            </div>
            <div style={{ backgroundColor: '#f9fbfb', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #2ecc71' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>2. Report a Found Item</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.5' }}>Report something you found to help the rightful owner recognize and claim it easily.</p>
            </div>
            <div style={{ backgroundColor: '#f9fbfb', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #e67e22' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>3. Search Announcements</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.5' }}>Browse and search reported items to find announcements matching what you lost or found.</p>
            </div>
            <div style={{ backgroundColor: '#f9fbfb', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #9b59b6' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>4. Connect & Return Safely</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.5' }}>Identify matches, verify ownership securely, and arrange a safe return.</p>
            </div>
          </div>
        </section>

        {/* Section: Our Values */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '15px' }}>Our Values</h2>
          <ul style={{ paddingLeft: '20px', color: '#555', fontSize: '15px', lineHeight: '1.7' }}>
            <li><strong>Trust:</strong> At the center of Lost & Found. We encourage honest information and responsible communication.</li>
            <li><strong>Honesty:</strong> Ensuring found items return to their rightful owners with integrity.</li>
            <li><strong>Safety:</strong> Protecting yourself and others when communicating or arranging returns.</li>
            <li><strong>Privacy:</strong> Treating personal information responsibly and avoiding unnecessary sensitive exposure.</li>
            <li><strong>Community:</strong> Built on the idea that supporting one another makes a meaningful difference.</li>
            <li><strong>Responsibility:</strong> Every user is accountable for the information and actions they take.</li>
          </ul>
        </section>

        {/* Section: Technology Stack */}
        <section style={{ marginBottom: '35px' }}>
          <h2 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '15px' }}>Technology and Innovation</h2>
          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '15px' }}>
            Lost & Found combines modern web technologies to provide a practical and accessible digital experience:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ backgroundColor: '#eef2f3', padding: '8px 14px', borderRadius: '20px', fontSize: '14px', color: '#333' }}>React.js (Frontend)</span>
            <span style={{ backgroundColor: '#eef2f3', padding: '8px 14px', borderRadius: '20px', fontSize: '14px', color: '#333' }}>Node.js (Backend)</span>
            <span style={{ backgroundColor: '#eef2f3', padding: '8px 14px', borderRadius: '20px', fontSize: '14px', color: '#333' }}>Express.js (APIs)</span>
            <span style={{ backgroundColor: '#eef2f3', padding: '8px 14px', borderRadius: '20px', fontSize: '14px', color: '#333' }}>MySQL (Database)</span>
            <span style={{ backgroundColor: '#eef2f3', padding: '8px 14px', borderRadius: '20px', fontSize: '14px', color: '#333' }}>Socket.IO (Real-time)</span>
          </div>
        </section>

        {/* Section: Safety First */}
        <section style={{ marginBottom: '35px', backgroundColor: '#fffdf4', padding: '20px', borderRadius: '8px', border: '1px solid #f39c12' }}>
          <h3 style={{ color: '#d35400', marginTop: 0, fontSize: '18px' }}>⚠️ Safety First</h3>
          <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
            While Lost & Found helps users connect, always take reasonable precautions: avoid unnecessary personal info disclosure, use public and safe meeting locations, verify ownership thoroughly, and never share passwords or financial information.
          </p>
        </section>

        {/* Contact Us Section */}
        <section style={{ backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Contact Us</h3>
          <p style={{ color: '#555', fontSize: '15px', marginBottom: '15px' }}>Have a question, suggestion, or concern? We would love to hear from you.</p>
          <p style={{ margin: '5px 0', color: '#333' }}>📧 <strong>Email:</strong> ericn2647@gmail.com</p>
          <p style={{ margin: '5px 0', color: '#333' }}>📞 <strong>Phone:</strong> +250 723 662 295</p>
          <p style={{ margin: '5px 0', color: '#333' }}>📍 <strong>Location:</strong> Rwanda</p>
        </section>

        {/* Footer Note */}
        <div style={{ textAlign: 'center', marginTop: '40px', color: '#888', fontSize: '13px' }}>
          <p style={{ fontStyle: 'italic', color: '#2c3e50', fontWeight: 'bold' }}>"Report it. Find it. Return it safely."</p>
          <p>© 2026 Lost & Found. All rights reserved.</p>
        </div>

      </div>

    </div>
  );
}

export default About;