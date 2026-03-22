import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Building2, Landmark, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

const Business = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <Layout>
      <section className="relative overflow-hidden py-24" style={{ background: 'var(--grad-dark)' }}>
        <div className="container relative z-10 text-center">
          <motion.div {...fadeInUp}>
            <span className="badge badge-indigo mb-6">Enterprise Solutions</span>
            <h1 className="text-white mb-6">Scale Your Infrastructure</h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Campus IQ provides the professional-grade tools needed to manage 
              complex university, healthcare, and corporate environments.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Universities', 
                icon: <Building2 />, 
                desc: 'Optimize lecture halls, labs, and faculty offices with real-time scheduling.',
                color: 'indigo'
              },
              { 
                title: 'Hospitals', 
                icon: <Landmark />, 
                desc: 'Manage operating rooms, wards, and diagnostic facilities with zero conflicts.',
                color: 'pink'
              },
              { 
                title: 'Corporates', 
                icon: <Briefcase />, 
                desc: 'Dynamic desk booking and meeting room management for hybrid teams.',
                color: 'teal'
              }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-10 bg-white rounded-[32px] border-none shadow-xl hover:shadow-2xl transition-all group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-${item.color}-50 flex items-center justify-center text-${item.color}-600 mb-8 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(item.icon, { size: 32 })}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">{item.desc}</p>
                <ul className="space-y-3 mb-10">
                  {['Real-time Analytics', 'Smart Scheduling', 'Conflict Prevention'].map(feature => (
                    <li key={feature} className="flex items-center gap-2 text-xs font-bold text-gray-400 capitalize">
                      <CheckCircle2 size={14} className="text-green-500" /> {feature}
                    </li>
                  ))}
                </ul>
                <button className="flex items-center gap-2 text-sm font-black text-indigo-600 uppercase tracking-widest hover:gap-4 transition-all">
                  Learn More <ArrowRight size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Business;
