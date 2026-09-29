import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../redux/slices/authSlice';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
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
    dispatch(login({ email, password }));
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 240, 245, 0.85)), url(https://m.media-amazon.com/images/I/71GO0sGzKoL._AC_UF1000,1000_QL80_.jpg) no-repeat center center fixed',
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
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#2D2D2D', fontWeight: '600' }}>FieldBook Sign In</h2>
        
        <div style={{ marginBottom: '16px' }}>
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

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#555' }}>Password:</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Enter your password" 
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
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Don't have an account? <Link to="/register" style={{ color: '#FF758C', fontWeight: '500', textDecoration: 'none' }}>Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;