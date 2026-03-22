import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Calendar, 
  Shield, 
  Zap, 
  Clock, 
  Building2, 
  BarChart3, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="home-wrapper" style={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <section className="hero relative overflow-hidden" style={{ background: 'var(--light)', padding: '10rem 0 8rem', position: 'relative' }}>
        <div className="container relative z-10">
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '4rem', alignItems: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="hero-content"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-6 border border-indigo-100" style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#eef2ff', color: '#4f46e5', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', border: '1px solid #e0e7ff' }}>
                <Sparkles size={14} />
                <span>Next-Gen Campus Space Management</span>
              </div>
              
              <h1 className="mb-6 font-extrabold tracking-tight" style={{ marginBottom: '1.5rem', lineHeight: '1.05', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                Optimize Your <span className="text-gradient">Campus Experience</span>
              </h1>
              
              <p className="mb-10 text-lg leading-relaxed opacity-80" style={{ marginBottom: '2.5rem', fontSize: '1.125rem', color: '#64748b', lineHeight: '1.6', maxWidth: '480px' }}>
                The ultimate smart booking system for modern universities. 
                Manage classrooms, labs, and study areas with real-time 
                utilization insights and seamless scheduling.
              </p>
              
              <div className="hero-btns flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/demo" className="btn btn-primary">
                  Explore Spaces <ArrowRight size={18} />
                </Link>
                <Link to="/signup" className="btn btn-outline">
                  Get Started
                </Link>
              </div>

              <div className="hero-stats flex gap-12 mt-16" style={{ display: 'flex', gap: '3rem', marginTop: '4rem' }}>
                <div className="hero-stat">
                  <strong className="text-4xl block" style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--dark)', display: 'block' }}>50+</strong>
                  <span className="text-sm font-medium uppercase tracking-wide opacity-60" style={{ fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.025em', opacity: '0.6' }}>Smart Rooms</span>
                </div>
                <div className="hero-stat">
                  <strong className="text-4xl block" style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--dark)', display: 'block' }}>12k</strong>
                  <span className="text-sm font-medium uppercase tracking-wide opacity-60" style={{ fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.025em', opacity: '0.6' }}>Bookings</span>
                </div>
                <div className="hero-stat">
                  <strong className="text-4xl block" style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--dark)', display: 'block' }}>98%</strong>
                  <span className="text-sm font-medium uppercase tracking-wide opacity-60" style={{ fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.025em', opacity: '0.6' }}>Utilization</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="hero-image relative hidden md:block"
              style={{ position: 'relative' }}
            >
              <div className="glass p-8 rounded-[40px] shadow-2xl relative z-10 animate-float border-white/50" style={{ padding: '2rem', borderRadius: '40px', backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.5)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <img 
                  src={`${import.meta.env.BASE_URL}campus_hero.png`} 
                  alt="Modern Campus Illustration" 
                  className="rounded-[24px] shadow-lg"
                  style={{ width: '100%', borderRadius: '24px', display: 'block' }}
                />
                {/* Floating Elements */}
                <div className="absolute glass p-4 rounded-2xl shadow-xl" style={{ position: 'absolute', top: '-1.5rem', right: '-1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '1rem', borderRadius: '1rem' }}>
                  <Calendar className="text-indigo-600" size={32} />
                </div>
                <div className="absolute glass p-6 rounded-3xl shadow-xl" style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '1.5rem', borderRadius: '1.5rem' }}>
                  <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600" style={{ width: '3rem', height: '3rem', backgroundColor: '#dcfce7', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                      <Zap size={24} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400" style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8' }}>STATUS</div>
                      <div className="text-lg font-bold" style={{ fontSize: '1.125rem', fontWeight: '700' }}>100% Efficient</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Background Decor */}
              <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-3xl -z-10 transform -translate-x-1/2 -translate-y-1/2" style={{ position: 'absolute', top: '50%', left: '50%', width: '500px', height: '500px', backgroundColor: 'rgba(199, 210, 254, 0.3)', borderRadius: '9999px', filter: 'blur(64px)', zIndex: '-1', transform: 'translate(-50%, -50%)' }}></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-white" style={{ backgroundColor: 'white', padding: '8rem 0' }}>
        <div className="container">
          <motion.div 
            {...fadeInUp}
            className="text-center max-w-2xl mx-auto mb-20"
            style={{ textAlign: 'center', maxWidth: '42rem', margin: '0 auto 5rem' }}
          >
            <span className="badge badge-blue mb-4">Core Platform</span>
            <h2 className="mb-4">Why Universities Choose Campus IQ?</h2>
            <p>From student accessibility to admin oversight, we've rebuilt the campus management loop from the ground up.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid-3"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}
          >
            {[
              { icon: <Search />, title: "Live Availability", desc: "Instantly find free classrooms or study pods across campus." },
              { icon: <Zap />, title: "Instant Booking", desc: "One-tap scheduling with automated email confirmations." },
              { icon: <Shield />, title: "Conflict Resolution", desc: "No more double-bookings. Our smart engine handles priorities." },
              { icon: <Clock />, title: "Time Optimization", desc: "Auto-releases rooms when bookings are finished or cancelled." },
              { icon: <Building2 />, title: "Smart Layouts", desc: "View detailed floor plans and room capacities before booking." },
              { icon: <BarChart3 />, title: "Heat Maps", desc: "Real-time visualization of campus traffic and room usage." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="card group hover:bg-indigo-50/30"
                style={{ padding: '2.5rem' }}
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 hover:scale-110 transition-transform" style={{ width: '3.5rem', height: '3.5rem', backgroundColor: '#eef2ff', color: '#4f46e5', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', transition: 'transform 0.4s' }}>
                  {React.cloneElement(feature.icon, { size: 28 })}
                </div>
                <h3 className="mb-4 text-xl" style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ fontSize: '0.875rem' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section overflow-hidden" style={{ padding: '8rem 0' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-16 rounded-[40px] text-center text-white overflow-hidden shadow-2xl"
            style={{ position: 'relative', padding: '4rem', borderRadius: '40px', textAlign: 'center', color: 'white', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', background: 'var(--grad-primary)' }}
          >
            <div className="relative z-10" style={{ position: 'relative', zIndex: '10' }}>
              <h2 className="text-white mb-6" style={{ color: 'white', marginBottom: '1.5rem' }}>Revolutionize Your Campus Space Today</h2>
              <p className="text-white/80 max-w-xl mx-auto mb-10 text-lg" style={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: '36rem', margin: '0 auto 2.5rem', fontSize: '1.125rem' }}>
                Join 20+ institutions that have seen a 40% increase in room utilization efficiency.
              </p>
              <div className="flex justify-center gap-4" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Link to="/signup" className="btn bg-white text-indigo-600 hover:scale-105" style={{ backgroundColor: 'white', color: '#4f46e5' }}>
                  Get Started for Free
                </Link>
                <Link to="/contact" className="btn border border-white/30 text-white hover:bg-white/10" style={{ border: '1px solid rgba(255, 255, 255, 0.3)', color: 'white' }}>
                  Contact Sales
                </Link>
              </div>
            </div>
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" style={{ position: 'absolute', top: '0', right: '0', width: '24rem', height: '24rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', filter: 'blur(64px)', marginRight: '-5rem', marginTop: '-5rem' }}></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" style={{ position: 'absolute', bottom: '0', left: '0', width: '24rem', height: '24rem', backgroundColor: 'rgba(192, 132, 252, 0.2)', borderRadius: '9999px', filter: 'blur(64px)', marginLeft: '-5rem', marginBottom: '-5rem' }}></div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
