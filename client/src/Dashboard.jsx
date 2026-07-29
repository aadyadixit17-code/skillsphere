import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <h2 style={styles.logoText}>Skill<span style={styles.gradientText}>Sphere</span></h2>
        </div>
        <nav style={styles.navMenu}>
          <button style={{ ...styles.navItem, ...styles.activeNavItem }}>Dashboard</button>
          <button style={styles.navItem} onClick={() => navigate('/marketplace')}>Marketplace</button>
          <button style={styles.navItem} onClick={() => alert('Gigs module coming soon!')}>Gigs & Jobs</button>
          <button style={styles.navItem} onClick={() => alert('Matches module coming soon!')}>Smart Matches</button>
          <button style={styles.navItem} onClick={() => alert('Profile settings coming soon!')}>Profile</button>
        </nav>
        <div style={styles.sidebarFooter}>
          <button style={styles.logoutBtn} onClick={() => navigate('/login')}>Sign Out</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {/* Top Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.welcomeTitle}>Welcome back, Professional</h1>
            <p style={styles.welcomeSubtitle}>Here is an overview of your SkillSphere ecosystem.</p>
          </div>
          <div style={styles.userProfileBadge}>
            <div style={styles.avatar}>SS</div>
            <span style={styles.userName}>Developer Account</span>
          </div>
        </header>

        {/* Dashboard Grid Analytics / Modules */}
        <div style={styles.statsGrid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Active Gigs</h3>
            <p style={styles.cardValue}>12</p>
            <span style={styles.cardBadge}>+4 this week</span>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Profile Views</h3>
            <p style={styles.cardValue}>1,482</p>
            <span style={styles.cardBadge}>+18% growth</span>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Match Score</h3>
            <p style={styles.cardValue}>94%</p>
            <span style={styles.cardBadge}>High demand</span>
          </div>
        </div>

        {/* Recent Modules Preview Section */}
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>System Modules & Status</h2>
          <div style={styles.modulesGrid}>
            <div style={styles.moduleCard}>
              <h4 style={styles.moduleName}>Authentication & Security</h4>
              <p style={styles.moduleDesc}>JWT-based sessions, bcrypt encryption, and protected routes.</p>
              <span style={styles.statusActive}>Fully Operational</span>
            </div>
            <div style={styles.moduleCard}>
              <h4 style={styles.moduleName}>Marketplace Engine</h4>
              <p style={styles.moduleDesc}>Browse, filter, and discover high-value professional listings.</p>
              <span style={styles.statusPending}>UI Ready (Preview)</span>
            </div>
            <div style={styles.moduleCard}>
              <h4 style={styles.moduleName}>Asset Upload Pipeline</h4>
              <p style={styles.moduleDesc}>Multer middleware configured for secure multi-part document processing.</p>
              <span style={styles.statusActive}>Backend Active</span>
            </div>
            <div style={styles.moduleCard}>
              <h4 style={styles.moduleName}>Smart Matching</h4>
              <p style={styles.moduleDesc}>Algorithmic pairing connecting top talent with project requirements.</p>
              <span style={styles.statusPending}>In Development</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Professional CSS-in-JS Styling matching your Dark Theme & Gradients
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#0d0f18',
    color: '#ffffff',
    fontFamily: "'Inter', sans-serif",
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#131625',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px 16px',
  },
  logoContainer: {
    marginBottom: '32px',
    paddingLeft: '12px',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  gradientText: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  navItem: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    textAlign: 'left',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeNavItem: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
    color: '#3b82f6',
    borderLeft: '3px solid #3b82f6',
  },
  sidebarFooter: {
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '16px',
  },
  logoutBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    color: '#ef4444',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    padding: '40px',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  welcomeTitle: {
    fontSize: '26px',
    fontWeight: '700',
    marginBottom: '6px',
  },
  welcomeSubtitle: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  userProfileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#161a2e',
    padding: '8px 16px',
    borderRadius: '30px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '500',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  card: {
    backgroundColor: '#161a2e',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  cardTitle: {
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '10px',
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '10px',
  },
  cardBadge: {
    fontSize: '12px',
    color: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  sectionContainer: {
    marginTop: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  modulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
  },
  moduleCard: {
    backgroundColor: '#161a2e',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  moduleName: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  moduleDesc: {
    color: '#94a3b8',
    fontSize: '13px',
    marginBottom: '16px',
    lineHeight: '1.4',
  },
  statusActive: {
    fontSize: '11px',
    color: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: '4px 8px',
    borderRadius: '4px',
    alignSelf: 'flex-start',
    fontWeight: '600',
  },
  statusPending: {
    fontSize: '11px',
    color: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: '4px 8px',
    borderRadius: '4px',
    alignSelf: 'flex-start',
    fontWeight: '600',
  },
};

export default Dashboard;