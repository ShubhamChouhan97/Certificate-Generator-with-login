import React, { useState } from 'react';
import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../API/login';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  const handleLogin = async () => {
    console.log('Logging in with:', formData);
    try {
      const response = await login(formData);
      console.log('Login success:', response);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        <div className={styles.inputGroup}>
          <span className={styles.icon}>📧</span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <span className={styles.icon}>🔒</span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <p className={styles.forgot}>Forgot Password?</p>
        <button className={styles.button} onClick={handleLogin}>
          Login
        </button>
        <p className={styles.signupText}>
          Don't have an account?{' '}
          <span className={styles.signupLink} onClick={handleSignUpClick}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
