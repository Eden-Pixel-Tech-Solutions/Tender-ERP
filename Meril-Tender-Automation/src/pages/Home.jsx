// Home.jsx
import Navbar from "../components/Navbar";
import { 
  TrendingUp, 
  FileSearch, 
  Brain, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import "../assets/css/home.css";

export default function Home() {
  const stats = [
    { icon: FileSearch, label: "Active Tenders", value: "247", change: "+12%", color: "blue" },
    { icon: CheckCircle, label: "Processed Today", value: "89", change: "+8%", color: "green" },
    { icon: Brain, label: "AI Accuracy", value: "94.2%", change: "+2.1%", color: "purple" },
    { icon: Clock, label: "Avg. Response Time", value: "2.3h", change: "-15%", color: "orange" }
  ];

  const features = [
    {
      icon: FileSearch,
      title: "GeM Tenders",
      description: "Monitor and process GeM bids with AI-powered matching and real-time updates.",
      color: "blue",
      metrics: ["500+ Daily Scans", "Auto-Classification"]
    },
    {
      icon: Brain,
      title: "AI Relevancy Engine",
      description: "Automated scoring using your trained models for precise tender matching.",
      color: "purple",
      metrics: ["94% Accuracy", "Real-time Analysis"]
    },
    {
      icon: Target,
      title: "Document Processing",
      description: "Extract technical specifications from tender PDFs with advanced OCR.",
      color: "green",
      metrics: ["Multi-format Support", "Instant Extraction"]
    }
  ];

  const recentActivity = [
    { type: "success", title: "New tender matched", time: "2 minutes ago" },
    { type: "info", title: "AI model updated", time: "15 minutes ago" },
    { type: "warning", title: "Deadline approaching", time: "1 hour ago" }
  ];

  return (
    <div className="app-layout">
      <Navbar />
      
      <main className="main-content">
        <div className="home-container">
          {/* Hero Section */}
          <div className="hero-section">
            <div className="hero-content">
              <div className="hero-badge">
                <Zap size={16} />
                <span>AI-Powered Automation</span>
              </div>
              <h1 className="hero-title">
                Welcome to Meril Tender
                <span className="hero-gradient"> Automation System</span>
              </h1>
              <p className="hero-description">
                This platform helps MESPL track, analyze, and automate government tenders
                including GeM bids, AI relevancy scoring, document extraction, and tender
                workflow management.
              </p>
              <div className="hero-actions">
                <button className="btn-primary">
                  <span>Explore Tenders</span>
                  <ArrowRight size={18} />
                </button>
                <button className="btn-secondary">
                  <BarChart3 size={18} />
                  <span>View Analytics</span>
                </button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="floating-card card-1">
                <FileSearch size={24} className="card-icon" />
                <span>Real-time Monitoring</span>
              </div>
              <div className="floating-card card-2">
                <Brain size={24} className="card-icon" />
                <span>AI Processing</span>
              </div>
              <div className="floating-card card-3">
                <TrendingUp size={24} className="card-icon" />
                <span>Smart Analytics</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`stat-card stat-${stat.color}`}>
                  <div className="stat-icon-wrapper">
                    <Icon size={24} />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">{stat.label}</p>
                    <div className="stat-value-row">
                      <h3 className="stat-value">{stat.value}</h3>
                      <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features Section */}
          <div className="features-section">
            <div className="section-header">
              <h2 className="section-title">Powerful Features</h2>
              <p className="section-subtitle">Everything you need to manage tenders efficiently</p>
            </div>
            
            <div className="features-grid">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className={`feature-card feature-${feature.color}`}>
                    <div className="feature-icon-wrapper">
                      <Icon size={28} />
                    </div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                    <div className="feature-metrics">
                      {feature.metrics.map((metric, idx) => (
                        <span key={idx} className="feature-metric">
                          <CheckCircle size={14} />
                          {metric}
                        </span>
                      ))}
                    </div>
                    <button className="feature-button">
                      <span>Learn More</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="activity-section">
            <div className="section-header">
              <h2 className="section-title">Recent Activity</h2>
              <button className="view-all-btn">View All</button>
            </div>
            
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className={`activity-item activity-${activity.type}`}>
                  <div className="activity-indicator"></div>
                  <div className="activity-content">
                    <p className="activity-title">{activity.title}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                  <AlertCircle size={18} className="activity-icon" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}