import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Marketplace() {
  const [gigs, setGigs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [selectedGigId, setSelectedGigId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const { data } = await API.get('/gigs');
      setGigs(data.gigs || data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGig = async (e) => {
    e.preventDefault();
    try {
      await API.post('/gigs', {
        title,
        description,
        budgetRange: JSON.stringify({ min: Number(minBudget), max: Number(maxBudget) })
      });
      setTitle('');
      setDescription('');
      setMinBudget('');
      setMaxBudget('');
      fetchGigs();
    } catch (err) {
      alert('Failed to create gig');
    }
  };

  const handleApply = async (gigId) => {
    try {
      await API.post(`/gigs/${gigId}/proposals`, { coverLetter, bidAmount: Number(bidAmount) });
      alert('Proposal submitted!');
      setSelectedGigId(null);
      setCoverLetter('');
      setBidAmount('');
    } catch (err) {
      alert('Failed to submit proposal');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.page}>
      {/* Navigation Header */}
      <header style={styles.header}>
        <h2 style={styles.logo}>SkillSphere <span style={styles.badge}>Marketplace</span></h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
      </header>

      <div style={styles.container}>
        {/* Create Gig Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Post a New Gig</h3>
          <form onSubmit={handleCreateGig} style={styles.formGrid}>
            <input 
              type="text" 
              placeholder="Gig Title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              style={{ ...styles.input, gridColumn: 'span 2' }} 
            />
            <textarea 
              placeholder="Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              style={{ ...styles.input, gridColumn: 'span 2', minHeight: '80px', resize: 'vertical' }} 
            />
            <input 
              type="number" 
              placeholder="Min Budget" 
              value={minBudget} 
              onChange={(e) => setMinBudget(e.target.value)} 
              required 
              style={styles.input} 
            />
            <input 
              type="number" 
              placeholder="Max Budget" 
              value={maxBudget} 
              onChange={(e) => setMaxBudget(e.target.value)} 
              required 
              style={styles.input} 
            />
            <button type="submit" style={{ ...styles.primaryBtn, gridColumn: 'span 2' }}>Post Gig</button>
          </form>
        </div>

        {/* Gigs List */}
        <h3 style={styles.sectionTitle}>Open Gigs</h3>
        <div style={styles.grid}>
          {gigs.map((gig) => (
            <div key={gig._id} style={styles.gigCard}>
              <h4 style={styles.gigTitle}>{gig.title}</h4>
              <p style={styles.gigDesc}>{gig.description}</p>
              <div style={styles.gigMeta}>
                <span>💰 Budget: <strong>${gig.budgetRange?.min} - ${gig.budgetRange?.max}</strong></span>
                <span>👤 Client: {gig.client?.name || 'Anonymous'}</span>
              </div>

              {selectedGigId === gig._id ? (
                <div style={styles.proposalBox}>
                  <textarea 
                    placeholder="Cover Letter" 
                    value={coverLetter} 
                    onChange={(e) => setCoverLetter(e.target.value)} 
                    style={{ ...styles.input, marginBottom: '10px', minHeight: '60px' }} 
                  />
                  <input 
                    type="number" 
                    placeholder="Bid Amount" 
                    value={bidAmount} 
                    onChange={(e) => setBidAmount(e.target.value)} 
                    style={{ ...styles.input, marginBottom: '10px' }} 
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleApply(gig._id)} style={styles.primaryBtn}>Submit Application</button>
                    <button onClick={() => setSelectedGigId(null)} style={styles.cancelBtn}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setSelectedGigId(gig._id)} style={styles.applyBtn}>Apply for Gig</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top left, #1e1b4b 0%, #0f172a 100%)',
    color: '#f8fafc',
    paddingBottom: '50px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: 'rgba(15, 23, 42, 0.8)',
    borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  logo: {
    margin: 0,
    fontSize: '22px',
    color: '#c084fc',
    fontWeight: 'bold',
  },
  badge: {
    fontSize: '12px',
    background: 'rgba(124, 58, 237, 0.2)',
    color: '#d8b4fe',
    padding: '4px 8px',
    borderRadius: '6px',
    marginLeft: '10px',
    border: '1px solid rgba(124, 58, 237, 0.4)',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #ef4444',
    color: '#fca5a5',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background 0.2s',
  },
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '0 20px',
  },
  card: {
    background: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '40px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
  },
  cardTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    color: '#e2e8f0',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  primaryBtn: {
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
  },
  cancelBtn: {
    padding: '10px 16px',
    background: '#334155',
    color: '#cbd5e1',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#cbd5e1',
    marginBottom: '20px',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  gigCard: {
    background: 'rgba(30, 41, 59, 0.4)',
    border: '1px solid rgba(51, 65, 85, 0.8)',
    borderRadius: '12px',
    padding: '20px',
    transition: 'border-color 0.2s',
  },
  gigTitle: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    color: '#f1f5f9',
  },
  gigDesc: {
    margin: '0 0 15px 0',
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: '1.5',
  },
  gigMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#cbd5e1',
    marginBottom: '15px',
    paddingTop: '10px',
    borderTop: '1px solid rgba(51, 65, 85, 0.5)',
  },
  applyBtn: {
    padding: '8px 14px',
    background: 'rgba(124, 58, 237, 0.2)',
    border: '1px solid #7c3aed',
    color: '#d8b4fe',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  proposalBox: {
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid rgba(51, 65, 85, 0.8)',
  },
};