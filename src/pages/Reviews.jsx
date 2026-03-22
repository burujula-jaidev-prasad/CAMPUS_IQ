import React from 'react';
import Layout from '../components/Layout';

const Reviews = () => {
  return (
    <Layout>
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="section-label">Testimonials</span>
            <h2>Loved by Administrators & Students</h2>
          </div>
          <div className="grid-3">
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>"Campus IQ transformed how we manage our 400+ classrooms. Our utilization increased by 35% in just one semester."</p>
              <div className="testimonial-author">
                <div className="author-avatar" style={{ background: 'var(--primary)' }}>RK</div>
                <div className="author-info">
                  <strong>Registrar Office</strong>
                  <span>Tier 1 University</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>"Finding a project meeting room used to take 20 minutes. Now it takes 20 seconds. Every student should have this."</p>
              <div className="testimonial-author">
                <div className="author-avatar" style={{ background: 'var(--accent)' }}>AS</div>
                <div className="author-info">
                  <strong>Ananya Sharma</strong>
                  <span>Final Year Student</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>"The real-time visibility is a game changer for maintenance and security staff. Highly recommended."</p>
              <div className="testimonial-author">
                <div className="author-avatar" style={{ background: 'var(--dark)' }}>JM</div>
                <div className="author-info">
                  <strong>John Mathew</strong>
                  <span>Facility Manager</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Reviews;
