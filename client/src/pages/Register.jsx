import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../redux/slices/authSlice';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Client' });
  const { name, email, password, role } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      alert(message);
    }
    if (isSuccess || user) {
      navigate('/dashboard');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ name, email, password, role }));
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 240, 245, 0.85)), url("https://static.vecteezy.com/system/resources/previews/032/169/892/large_2x/flower-wallpaper-rose-valentine-nature-bouquet-wedding-pink-background-beauty-flora-bloom-colorful-detail-photo.jpg") no-repeat center center fixed',
      backgroundSize: 'cover',
      color: '#4A4A4A',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <form onSubmit={onSubmit} style={{ 
        background: '#FFFFFF', 
        padding: '40px', 
        borderRadius: '16px', 
        width: '380px',
        boxShadow: '0 10px 30px rgba(255, 145, 164, 0.2)',
        border: '1px solid #FFE0E6'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#2D2D2D', fontWeight: '600' }}>Register for SkillSphere</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#555' }}>Full Name:</label>
          <input 
            type="text" 
            name="name" 
            placeholder="Enter your full name" 
            value={name} 
            onChange={onChange} 
            required 
            style={{ 
              width: '100%', 
              padding: '12px 14px', 
              background: '#FFFFFF', 
              border: '1px solid #FFD1DC', 
              color: '#2D2D2D', 
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }} 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#555' }}>Email Address:</label>
          <input 
            type="email" 
            name="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={onChange} 
            required 
            style={{ 
              width: '100%', 
              padding: '12px 14px', 
              background: '#FFFFFF', 
              border: '1px solid #FFD1DC', 
              color: '#2D2D2D', 
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }} 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#555' }}>Password:</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Create a password" 
            value={password} 
            onChange={onChange} 
            required 
            style={{ 
              width: '100%', 
              padding: '12px 14px', 
              background: '#FFFFFF', 
              border: '1px solid #FFD1DC', 
              color: '#2D2D2D', 
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }} 
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#555' }}>Role:</label>
          <select 
            name="role" 
            value={role} 
            onChange={onChange} 
            style={{ 
              width: '100%', 
              padding: '12px 14px', 
              background: '#FFFFFF', 
              border: '1px solid #FFD1DC', 
              color: '#2D2D2D', 
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          >
            <option value="Client">Client</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={isLoading} 
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: '#FF91A4', 
            color: '#FFFFFF', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontWeight: '600',
            fontSize: '15px',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#FF758C'}
          onMouseOut={(e) => e.target.style.background = '#FF91A4'}
        >
          {isLoading ? 'Registering...' : 'Submit'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Already have an account? <Link to="/" style={{ color: '#FF758C', fontWeight: '500', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;