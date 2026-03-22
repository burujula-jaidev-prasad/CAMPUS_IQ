import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { MapPin, Mail, Send, Sparkles, MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <Layout>
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="badge badge-indigo mb-6">Get in Touch</span>
              <h1 className="text-6xl font-black mb-8 leading-tight">Ready to Start <br/>Your Journey?</h1>
              <p className="text-xl text-gray-500 mb-12 max-w-lg leading-relaxed font-medium">
                Fill out the form and our campus optimization experts will reach out within 24 hours.
              </p>
              
              <div className="space-y-8">
                {[
                  { icon: <MapPin />, title: 'Visit Us', desc: '123 Innovation Drive, Bangalore' },
                  { icon: <Mail />, title: 'Email Us', desc: 'hello@campusspace.com' }
                ].map((item, i) => (
                  <div key={item.title} className="flex gap-6 items-center">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                      {React.cloneElement(item.icon, { size: 24 })}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-gray-400 font-bold text-sm tracking-wide">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass p-12 rounded-[56px] shadow-2xl border-none relative z-10 bg-white/70 backdrop-blur-3xl">
                <form onSubmit={(e) => { e.preventDefault(); alert('Request received!'); }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                    <input type="text" placeholder="John Doe" required className="w-100 px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email</label>
                       <input type="email" placeholder="john@uni.edu" required className="w-100 px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Institution</label>
                       <input type="text" placeholder="University" required className="w-100 px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Message</label>
                    <textarea rows="4" placeholder="How can we help you?" className="w-100 px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold resize-none"></textarea>
                  </div>
                  <button type="submit" className="w-100 btn btn-primary py-5 rounded-3xl text-lg font-black shadow-xl shadow-indigo-200/50 flex items-center justify-center gap-3">
                    Send Request <Send size={20} />
                  </button>
                </form>
              </div>
              {/* Floating Element */}
              <div className="absolute -bottom-10 -right-10 glass p-6 rounded-3xl shadow-xl z-20 flex items-center gap-4 bg-white animate-float">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600"><MessageSquare /></div>
                <div>
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Support</div>
                  <div className="text-sm font-bold">Agents Online</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
