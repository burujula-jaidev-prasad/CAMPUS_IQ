import React from 'react';
import Layout from '../components/Layout';

const Contact = () => {
  return (
    <Layout>
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <span className="section-label">Get in Touch</span>
              <h1 style={{ marginBottom: '24px' }}>Ready to Start Your Journey?</h1>
              <p style={{ fontSize: '1.1rem', marginBottom: '32px' }}>Fill out the form and our campus optimization experts will reach out to you within 24 hours.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ fontSize: '1.5rem' }}>📍</div>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>Visit Us</h4>
                    <p style={{ fontSize: '0.9rem' }}>123 Innovation Drive, Tech Park, Bangalore</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ fontSize: '1.5rem' }}>📧</div>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>Email Us</h4>
                    <p style={{ fontSize: '0.9rem' }}>hello@campusspace.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card" style={{ padding: '40px' }}>
              <form onSubmit={(e) => { e.preventDefault(); alert('Demo request received!'); }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="workemail@institution.com" required />
                </div>
                <div className="form-group">
                  <label>Institution</label>
                  <input type="text" placeholder="e.g. Christ University" required />
                </div>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label>Message</label>
                  <textarea placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Request</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
