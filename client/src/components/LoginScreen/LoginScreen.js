import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginScreen.css';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const { data } = await axios.post(
        '/api/authenticate/login',
        {
          email,
          password,
        },
        config
      );
     
      localStorage.setItem('authToken', data.token);

      navigate("/", { replace: true });
    } catch (error) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-screen">
      <form onSubmit={loginHandler} className="login-screen-form">
        <h3 className="login-screen-title">Login</h3>
        {error && <span className="error-message">{error}</span>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            required
            id="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            required
            id="password"
            autoComplete="true"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <span className="login-screen-subtext">
          Don't have an account? <Link to="/register">Register</Link>
        </span>
      </form>
    </div>
  );
}

export default LoginScreen;
