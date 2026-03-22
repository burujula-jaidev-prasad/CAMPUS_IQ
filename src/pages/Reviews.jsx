import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Reviews = () => {
  const testimonials = [
    {
      name: "Registrar Office",
      role: "Tier 1 University",
      text: "Campus IQ transformed how we manage our 400+ classrooms. Our utilization increased by 35% in just one semester.",
      initials: "RK",
      color: "var(--indigo-500)"
    },
    {
      name: "Ananya Sharma",
      role: "Final Year Student",
      text: "Finding a project meeting room used to take 20 minutes. Now it takes 20 seconds. Every student should have this.",
      initials: "AS",
      color: "var(--pink-500)"
    },
    {
      name: "John Mathew",
      role: "Facility Manager",
      text: "The real-time visibility is a game changer for maintenance and security staff. Highly recommended.",
      initials: "JM",
      color: "var(--teal-500)"
    }
  ];

  return (
    <Layout>
      <section className="py-24 bg-gray-50">
        <div className="container">
          <div className="text-center mb-20">
            <span className="badge badge-indigo mb-6">Testimonials</span>
            <h1 className="font-black">Loved by Administrators <br/> & Students</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div 
                key={t.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[40px] shadow-xl relative border border-gray-100"
              >
                <Quote className="absolute top-8 right-8 text-gray-100" size={64} />
                <div className="flex gap-1 mb-6 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-xl font-medium text-gray-700 mb-10 leading-relaxed italic relative z-10">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg" style={{ background: `var(--grad-primary)` }}>
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-0">{t.name}</h4>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Reviews;
