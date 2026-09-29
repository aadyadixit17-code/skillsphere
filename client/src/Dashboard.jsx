import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedModule, setSelectedModule] = useState(null);

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Professional', role: 'Developer Account' };

  const onLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleModuleClick = (modTitle) => {
    setSelectedModule(modTitle);
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: 'linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 240, 245, 0.88)), url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU5KaOqtx6DIXp6d9e0l2D_W9FsrmLIhlwgTUCVHHl7YIHrxn1ww3VGVYV&s=10") no-repeat center center fixed',
      backgroundSize: 'cover',
      fontFamily: "'Poppins', sans-serif",
      color: '#D91A60'
    }}>
      
      {/* Sidebar */}
      <aside style={{ 
        width: '270px', 
        background: '#FFFFFF', 
        padding: '30px 20px', 
        borderRight: '1px solid #FFE0E6',
        boxShadow: '4px 0 20px rgba(255, 145, 164, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}>
        <div>
          <h2 style={{ color: '#D91A60', fontWeight: '700', fontSize: '24px', marginBottom: '35px', textAlign: 'center', letterSpacing: '-0.5px' }}>
            Skill<span>Sphere</span>
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { name: 'Dashboard', symbol: '📊' },
              { name: 'Marketplace', symbol: '🛍️' },
              { name: 'Gigs & Jobs', symbol: '💼' },
              { name: 'Smart Matches', symbol: '✨' },
              { name: 'Profile', symbol: '👤' }
            ].map((item) => (
              <button 
                key={item.name} 
                onClick={() => {
                  setActiveTab(item.name);
                  setSelectedModule(null);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  textAlign: 'left',
                  background: activeTab === item.name && !selectedModule ? 'linear-gradient(135deg, #FF91A4 0%, #D91A60 100%)' : '#FFF5F7',
                  color: activeTab === item.name && !selectedModule ? '#FFFFFF' : '#D91A60',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: activeTab === item.name && !selectedModule ? '0 4px 15px rgba(217, 26, 96, 0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{item.symbol}</span> {item.name}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '25px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #FFF0F3 0% , #FFE0E6 100%)',
              padding: '12px',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '15px',
              border: '1px solid #FFD1DC'
            }}>
              <img 
                src="https://img.magnific.com/free-vector/freelancer-working-laptop-her-house_1150-35054.jpg?semt=ais_test_b&w=740&q=80" 
                alt="Progress Tracker" 
                style={{ width: '100%', height: '110px', borderRadius: '8px', objectFit: 'cover', marginBottom: '8px', border: '1px solid #D91A56' }}
              />
              <h4 style={{ color: '#D91A56', fontSize: '13px', margin: '0 0 4px 0', fontWeight: '700' }}>Progress Tracker</h4>
              <p style={{ color: '#666666', fontSize: '11px', margin: 0 }}>All systems synchronized.</p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #FFF0F3 0% , #FFE0E6 100%)',
              padding: '12px',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '15px',
              border: '1px solid #FFD1DC'
            }}>
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4lMelwl4zinTw_gg3xEDRCm0WEhHXPTfCgdW_buENKLGTGd-ClqIiTKE&s=10" 
                alt="Feedback" 
                style={{ width: '100%', height: '110px', borderRadius: '8px', objectFit: 'cover', marginBottom: '8px', border: '1px solid #D91A56' }}
              />
              <h4 style={{ color: '#D91A56', fontSize: '13px', margin: '0 0 4px 0', fontWeight: '700' }}>Feedback</h4>
              <p style={{ color: '#666666', fontSize: '11px', margin: 0 }}>Analytics.</p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #FFF0F3 0% , #FFE0E6 100%)',
              padding: '12px',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '15px',
              border: '1px solid #FFD1DC'
            }}>
              <img 
                src="https://img.magnific.com/premium-vector/freelancer-woman-working-laptop-cozy-cafe-interior-scene-vector-illustration_345238-5609.jpg?semt=ais_test_b&w=740&q=80" 
                alt="Project Marketplace" 
                style={{ width: '100%', height: '110px', borderRadius: '8px', objectFit: 'cover', marginBottom: '8px', border: '1px solid #D91A56' }}
              />
              <h4 style={{ color: '#D91A56', fontSize: '13px', margin: '0 0 4px 0', fontWeight: '700' }}>Project Marketplace</h4>
              <p style={{ color: '#666666', fontSize: '11px', margin: 0 }}>Milestones.</p>
            </div>
          </div>
        </div>

        {/* Filled Sidebar Footer Space with Decorative Card/Image */}
        <div style={{ marginTop: '20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFF0F3 0% , #FFE0E6 100%)',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '20px',
            border: '1px solid #FFD1DC'
          }}>
            <img 
               src="/pic.jpeg"
               alt="Pro badge" 
               style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', marginBottom: '8px', border: '2px solid #D91A56' }}
            />
            <h4 style={{ color: '#D91A56', fontSize: '13px', margin: '0 0 4px 0', fontWeight: '700' }}>Verified Member</h4>
            <p style={{ color: '#666666', fontSize: '11px', margin: 0 }}>All systems synchronized.</p>
          </div>

          <button 
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '12px',
              background: '#FFF0F3',
              color: '#D91A60',
              border: '1px solid #FFE0E6',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#FFD1DC'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#FFF0F3'; }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ color: '#D91A60', fontSize: '28px', margin: '0 0 5px 0', fontWeight: '700' }}>
              Welcome back, {user.name} 👋
            </h1>
            <p style={{ color: '#D91A60', margin: 0, fontSize: '14px', fontWeight: '500', opacity: 0.85 }}>Here is a comprehensive real-time overview of your ecosystem.</p>
          </div>
          <div style={{ background: '#FFFFFF', padding: '10px 20px', borderRadius: '30px', border: '1px solid #FFE0E6', fontWeight: '600', color: '#D91A60', boxShadow: '0 4px 15px rgba(255, 145, 164, 0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#27AE60', borderRadius: '50%' }}></span>
            {user.role || 'Developer Account'}
          </div>
        </div>

        {/* Dynamic Display Area for Selected Sidebar Tabs or Modules */}
        {selectedModule ? (
          <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '20px', border: '1px solid #FFE0E6', boxShadow: '0 10px 30px rgba(217, 26, 86, 0.1)' }}>
            <button 
              onClick={() => setSelectedModule(null)}
              style={{ background: '#FFF5F7', color: '#D91A60', border: '1px solid #FFE0E6', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginBottom: '20px' }}
            >
              ← Back to Dashboard
            </button>
            <h2 style={{ color: '#D91A60', fontSize: '24px', marginBottom: '15px' }}>{selectedModule} Workspace</h2>
            <p style={{ color: '#666666', fontSize: '15px', lineHeight: '1.6' }}>
              Interactive controls, logs, and data streams for <strong>{selectedModule}</strong> are fully initialized and ready for live user input verification.
            </p>
          </div>
        ) : activeTab !== 'Dashboard' ? (
          <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '20px', border: '1px solid #FFE0E6', boxShadow: '0 10px 30px rgba(217, 26, 86, 0.1)' }}>
            <button 
              onClick={() => setActiveTab('Dashboard')}
              style={{ background: '#FFF5F7', color: '#D91A60', border: '1px solid #FFE0E6', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginBottom: '20px' }}
            >
              ← Back to Dashboard
            </button>
            <h2 style={{ color: '#D91A60', fontSize: '24px', marginBottom: '15px' }}>{activeTab} Management Panel</h2>
            <p style={{ color: '#666666', fontSize: '15px', lineHeight: '1.6' }}>
              You are currently viewing the active workspace panel for <strong>{activeTab}</strong>. All related tools and API connections will render here.
            </p>
          </div>
        ) : (
          <>
            {/* Promotional / Creative Hero Banner With Image & Updated #D91A56 Background */}
            <div style={{ 
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              marginBottom: '35px',
              boxShadow: '0 10px 30px rgba(217, 26, 86, 0.2)',
              background: '#D91A56',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '40px'
            }}>
              <div style={{ zIndex: 2, maxWidth: '600px' }}>
                <span style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
                  ✨ Ecosystem Feature Spotlight
                </span>
                <h2 style={{ fontSize: '26px', margin: '15px 0 10px 0', fontWeight: '700', color: '#FFFFFF' }}>Accelerate Your Professional Growth</h2>
                <p style={{ color: '#FFE0E6', fontSize: '14px', margin: '0 0 20px 0', lineHeight: '1.6' }}>
                  Leverage advanced smart matching, secure multi-part document pipelines, and instant client connection channels built directly into SkillSphere.
                </p>
                <button 
                  onClick={() => setActiveTab('Marketplace')}
                  style={{ 
                    background: '#FFFFFF', 
                    color: '#D91A56', 
                    border: 'none', 
                    padding: '10px 20px', 
                    borderRadius: '8px', 
                    fontWeight: '600', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  Explore Marketplace ↗
                </button>
              </div>
              <div style={{ zIndex: 2 }}>
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1X73pJHm2pnx7ka3Mn-t31UwWokxpHqeST3FlWK8heBzm-Hczt1eIxbmh&s=10" 
                  alt="Collaboration" 
                  style={{ width: '220px', height: '140px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}
                />
              </div>
            </div>

            {/* Metric Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
              
              <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #FFE0E6', boxShadow: '0 8px 25px rgba(255, 145, 164, 0.12)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <p style={{ color: '#D91A60', fontSize: '14px', margin: 0, fontWeight: '600' }}>Active Gigs</p>
                  <span>💼</span>
                </div>
                <h2 style={{ color: '#D91A60', fontSize: '32px', margin: '0 0 10px 0' }}>12</h2>
                <span style={{ background: '#E8F8F5', color: '#27AE60', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>+4 this week</span>
              </div>

              <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #FFE0E6', boxShadow: '0 8px 25px rgba(255, 145, 164, 0.12)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <p style={{ color: '#D91A60', fontSize: '14px', margin: 0, fontWeight: '600' }}>Profile Views</p>
                  <span>👁️</span>
                </div>
                <h2 style={{ color: '#D91A60', fontSize: '32px', margin: '0 0 10px 0' }}>1,482</h2>
                <span style={{ background: '#E8F8F5', color: '#27AE60', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>+18% growth</span>
              </div>

              <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #FFE0E6', boxShadow: '0 8px 25px rgba(255, 145, 164, 0.12)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <p style={{ color: '#D91A60', fontSize: '14px', margin: 0, fontWeight: '600' }}>Match Score</p>
                  <span>📈</span>
                </div>
                <h2 style={{ color: '#D91A60', fontSize: '32px', margin: '0 0 10px 0' }}>94%</h2>
                <span style={{ background: '#FFF5F7', color: '#D91A60', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>High demand</span>
              </div>

            </div>

            {/* System Modules & Status Section - Now Fully Clickable */}
            <h3 style={{ color: '#D91A60', fontSize: '20px', marginBottom: '20px', fontWeight: '600' }}>System Modules & Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              
              {[
                { title: '1. Authentication & Security', desc: 'JWT-based sessions, bcrypt encryption, and secure protected routes.', tag: 'Fully Operational', symbol: '🔒' },
                { title: '2. Marketplace Engine', desc: 'Browse, filter, and discover high-value professional service listings.', tag: 'UI Ready', symbol: '🛍️' },
                { title: '3. Asset Upload Pipeline', desc: 'Multer middleware configured for multi-part document and image processing.', tag: 'Backend Active', symbol: '📁' },
                { title: '4. Smart Matching Engine', desc: 'Algorithmic pairing connecting top talent directly with project requirements.', tag: 'Active Sync', symbol: '✨' },
                { title: '5. Gigs & Jobs Hub', desc: 'Post, manage, and track application workflows for active contractual work.', tag: 'Live Tracking', symbol: '💼' },
                { title: '6. Professional Profiles', desc: 'Custom portfolios, skill tags, ratings, and credential verifications.', tag: 'Optimized', symbol: '👤' }
              ].map((mod, index) => (
                <div 
                  key={index} 
                  onClick={() => handleModuleClick(mod.title)}
                  style={{ 
                    background: '#FFFFFF', 
                    padding: '24px', 
                    borderRadius: '16px', 
                    border: '1px solid #FFE0E6', 
                    boxShadow: '0 8px 25px rgba(255, 145, 164, 0.12)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(217, 26, 86, 0.18)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 145, 164, 0.12)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{mod.symbol}</span>
                    <h4 style={{ color: '#D91A60', margin: 0, fontSize: '16px' }}>{mod.title}</h4>
                  </div>
                  <p style={{ color: '#D91A60', fontSize: '13px', margin: '0 0 15px 0', lineHeight: '1.5', fontWeight: '500', opacity: 0.9 }}>{mod.desc}</p>
                  <span style={{ background: '#FFF5F7', color: '#D91A60', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>{mod.tag}</span>
                </div>
              ))}

            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default Dashboard;