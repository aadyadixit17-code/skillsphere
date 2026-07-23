import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice'; 

const Register = () => {
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Client',
  });

  const { name, email, password, role } = formData;
  const dispatch = useDispatch();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      role, 
    };

    dispatch(registerUser(userData));
  };

  return (
    <div className="register-container">
      <h2>Register for SkillSphere</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            name="name"
            value={name}
            placeholder="Enter your name"
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={onChange}
            required
          />
        </div>
        <div>
          <select name="role" value={role} onChange={onChange}>
            <option value="Client">Client</option>
            <option value="Freelancer">Freelancer</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Register;