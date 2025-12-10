// Login.jsx
import { useState } from "react";
import axios from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import "../assets/css/login.css";
import Logo from "../assets/images/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      
      // Success animation before navigation
      setTimeout(() => {
        navigate("/Home");
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Branding */}
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-logo-wrapper">
            <img src={Logo} alt="Meril Logo" className="brand-logo-img" />
          </div>
          <h1 className="brand-title">
            Meril Tender
            <span className="brand-subtitle">Automated System</span>
          </h1>
          <p className="brand-tagline">
            Streamline your tender management with AI-powered automation
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="features-showcase">
          <div className="feature-item">
            <div className="feature-icon feature-icon-blue">
              <Shield size={24} />
            </div>
            <div className="feature-text">
              <h3>Secure & Reliable</h3>
              <p>Enterprise-grade security for your data</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon feature-icon-purple">
              <Zap size={24} />
            </div>
            <div className="feature-text">
              <h3>AI-Powered</h3>
              <p>Smart automation for faster processing</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon feature-icon-green">
              <TrendingUp size={24} />
            </div>
            <div className="feature-text">
              <h3>Real-Time Analytics</h3>
              <p>Track and analyze tender performance</p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="decorative-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-container">
          <div className="login-header">
            <div className="login-logo-mobile">
              <img src={Logo} alt="Logo" className="mobile-logo-img" />
            </div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to access your dashboard</p>
          </div>

          <form className="login-form" onSubmit={loginUser}>
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Remember & Forgot */}
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox-input" />
                <span className="checkbox-text">Remember me</span>
              </label>
              <a href="#forgot" className="forgot-link">Forgot password?</a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p className="footer-text">
              Don't have an account? 
              <a href="#signup" className="footer-link"> Contact Administrator</a>
            </p>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="login-decoration">
          <div className="decoration-wave"></div>
        </div>
      </div>
    </div>
  );
}