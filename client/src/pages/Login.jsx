import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';

const Login = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  
 

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

   
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;