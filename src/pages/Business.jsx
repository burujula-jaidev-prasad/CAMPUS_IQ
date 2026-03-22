import React from 'react';
import Layout from '../components/Layout';

const Business = () => {
  return (
    <Layout>
      <section className="hero" style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)', padding: '80px 0' }}>
        <div className="container">
          <div className="section-intro">
            <span className="section-label">Business Solutions</span>
            <h1>Enterprise-Grade Space Management</h1>
            <p>Campus IQ provides the infrastructure needed to manage large-scale university and corporate environments with ease.</p>
          </div>
        </div>
      </section>
      
      <section className="section">
        <div className="container">
          <div className="grid-3">
            <div className="card">
              <h3>Universities</h3>
              <p>Optimize lecture halls, labs, and faculty offices with real-time scheduling.</p>
            </div>
            <div className="card">
              <h3>Hospitals</h3>
              <p>Manage operating rooms, wards, and diagnostic facilities efficiently.</p>
            </div>
            <div className="card">
              <h3>Corporates</h3>
              <p>Dynamic desk booking and meeting room management for hybrid teams.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Business;
