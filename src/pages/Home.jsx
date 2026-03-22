import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="badge badge-blue" style={{ marginBottom: '20px' }}>🏫 Campus Infrastructure Platform</span>
            <h1>Maximize the Value of Your <span>Campus Infrastructure</span></h1>
            <p>Real-time visibility, booking, and analytics for space management that matters — built for universities, hospitals, and corporates.</p>
            <div className="hero-btns">
              <Link to="/signup" className="btn btn-primary btn-lg">Get Started</Link>
            </div>

          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="section-sm" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <p style={{ textAlign: 'center', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: '24px' }}>Trusted by leading institutions</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', alignItems: 'center', opacity: 0.6 }}>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--dark)' }}>🎓 Christ University</span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--dark)' }}>🏥 Manipal Hospitals</span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--dark)' }}>🏢 WeWork India</span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--dark)' }}>🎓 BITS Pilani</span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--dark)' }}>🏢 Infosys Campus</span>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="section problem-section">
        <div className="container">
          <div className="section-intro">
            <span className="section-label">The Problem</span>
            <h2>Spaces exist — but no one knows how to use them</h2>
            <p>Most institutions sit on valuable infrastructure that goes underutilized due to a lack of visibility and tools.</p>
          </div>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="icon">😵</div>
              <h3>No Visibility</h3>
              <p>Admins have no real-time view of which rooms are free, occupied, or available soon.</p>
            </div>
            <div className="problem-card">
              <div className="icon">📊</div>
              <h3>No Data, No Decisions</h3>
              <p>Without usage analytics, institutions can't optimize space allocation or plan expansions.</p>
            </div>
            <div className="problem-card">
              <div className="icon">📉</div>
              <h3>Revenue Left on Table</h3>
              <p>Empty conference halls, underused labs, and idle parking spots that could be monetized.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-intro" style={{ textAlign: 'center', margin: '0 auto 0' }}>
            <span className="section-label">The Solution</span>
            <h2>One platform to manage, book, and optimize every space</h2>
            <p>Campus IQ gives your institution the tools to go from chaotic space management to intelligent infrastructure operations.</p>
          </div>
          <div className="solution-cards" style={{ marginTop: '48px' }}>
            <div className="solution-card">
              <div className="solution-icon">📡</div>
              <h3>Real-Time Availability</h3>
              <p>Know exactly which rooms, halls, labs, or parking spots are free at any moment with live sensor and booking data.</p>
              <div style={{ marginTop: '16px' }}><span className="badge badge-blue">Live Updates</span></div>
            </div>
            <div className="solution-card">
              <div className="solution-icon">📅</div>
              <h3>Instant Booking System</h3>
              <p>Faculty, students, and staff can search, select, and book any space in under 30 seconds — from web or mobile.</p>
              <div style={{ marginTop: '16px' }}><span className="badge badge-blue">30-Second Booking</span></div>
            </div>
            <div className="solution-card">
              <div className="solution-icon">📊</div>
              <h3>Usage Analytics Dashboard</h3>
              <p>Powerful admin dashboards with peak usage hours, occupancy trends, forecast models, and actionable insights.</p>
              <div style={{ marginTop: '16px' }}><span className="badge badge-blue">Smart Reports</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT LOOKS */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="section-label">Platform Preview</span>
            <h2>See the platform in action</h2>
          </div>
          <div className="demo-snippet">
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <select className="mini-filter" style={{ padding: '8px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.88rem', color: 'var(--text)' }}>
                <option>Building: Christ University Main</option>
              </select>
              <select className="mini-filter" style={{ padding: '8px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.88rem', color: 'var(--text)' }}>
                <option>Block: Science Block</option>
              </select>
              <select className="mini-filter" style={{ padding: '8px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.88rem', color: 'var(--text)' }}>
                <option>Floor: 2nd Floor</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '16px', textAlign: 'left' }}>
              <div className="card" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>S201</span>
                  <span className="badge badge-green">Available</span>
                </div>
                <h4 style={{ color: 'var(--dark)', marginBottom: '4px' }}>Seminar Hall</h4>
                <p style={{ fontSize: '0.82rem', marginBottom: '12px' }}>Capacity: 80 · Lab</p>
                <div className="progress-bar"><div className="progress-fill green" style={{ width: '30%' }}></div></div>
                <p style={{ fontSize: '0.78rem', marginTop: '6px' }}>30% utilized today</p>
              </div>
              <div className="card" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>L205</span>
                  <span className="badge badge-red">Occupied</span>
                </div>
                <h4 style={{ color: 'var(--dark)', marginBottom: '4px' }}>Computer Lab</h4>
                <p style={{ fontSize: '0.82rem', marginBottom: '12px' }}>Capacity: 40 · Lab</p>
                <div className="progress-bar"><div className="progress-fill red" style={{ width: '90%' }}></div></div>
                <p style={{ fontSize: '0.78rem', marginTop: '6px' }}>90% utilized today</p>
              </div>
              <div className="card" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>C101</span>
                  <span className="badge badge-green">Available</span>
                </div>
                <h4 style={{ color: 'var(--dark)', marginBottom: '4px' }}>Classroom 101</h4>
                <p style={{ fontSize: '0.82rem', marginBottom: '12px' }}>Capacity: 60 · Classroom</p>
                <div className="progress-bar"><div className="progress-fill blue" style={{ width: '55%' }}></div></div>
                <p style={{ fontSize: '0.78rem', marginTop: '6px' }}>55% utilized today</p>
              </div>
              <div className="card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)', boxShadow: 'none' }}>
                <span style={{ fontSize: '2rem', marginBottom: '8px' }}>➕</span>
                <p style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 600 }}>Explore Full Demo</p>
              </div>
            </div>
            <Link to="/demo" className="btn btn-primary" style={{ marginTop: '28px' }}>Open Full Demo →</Link>
          </div>
        </div>
      </section>

      {/* VALUE SECTION */}
      <section className="section value-section">
        <div className="container">
          <div className="section-intro" style={{ textAlign: 'left' }}>
            <span className="section-label">Why Campus IQ</span>
            <h2>Transform how your institution operates</h2>
            <p>Real benefits, measurable outcomes — from day one of deployment.</p>
          </div>
          <div className="value-grid">
            <div className="value-item">
              <div className="val-icon">📈</div>
              <h3>Better Utilization</h3>
              <p>Institutions see an average 40% improvement in space utilization within the first semester.</p>
            </div>
            <div className="value-item">
              <div className="val-icon">🎓</div>
              <h3>Improved Student Experience</h3>
              <p>Students find rooms instantly, book study halls, and never waste time searching for space.</p>
            </div>
            <div className="value-item">
              <div className="val-icon">💰</div>
              <h3>Revenue Generation</h3>
              <p>Monetize idle spaces by enabling external bookings, event hosting, and premium parking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to optimize your campus?</h2>
            <p>Join 12+ institutions already using Campus IQ to manage every space that matters.</p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn btn-primary btn-lg">Get Started</Link>
              <Link to="/business" className="btn btn-outline btn-lg">Learn How It Works</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
