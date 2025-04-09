import React, { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import "./signup.css"; // external CSS
import  { registerUser } from "../API/register"; // API call to register user
function SignUp({ }) {


  const navigate = useNavigate();

const onToggleLogin = () => {
  navigate('/login');
};

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = registerUser(formData);
    // console.log("Registering:", formData);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <User className="icon" />
            <input
              type="text"
              name="userName"
              placeholder="Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <Mail className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <Lock className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Password (Min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="signup-button">Register</button>
        </form>
        <p className="switch-link">
          Already have an account?{" "}
          <span onClick={onToggleLogin}>Sign In</span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
