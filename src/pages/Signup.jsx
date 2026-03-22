import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { UserPlus, Sparkles, Shield, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student', // default
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await setDoc(doc(db, 'users', userCred.user.uid), {
        uid: userCred.user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString(),
      });
      if (formData.role === 'admin') navigate('/admin');
      else navigate('/demo');
    } catch (err) {
      setError(err.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="glass p-12 rounded-[48px] shadow-2xl border-white/50 bg-white/70 backdrop-blur-2xl">
          <div className="text-center mb-10">
            <motion.div 
               whileHover={{ rotate: 15 }}
               className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-grad-secondary text-white mb-6 shadow-xl shadow-pink-200"
            >
              <UserPlus size={40} />
            </motion.div>
            <h1 className="text-4xl font-black mb-3">Join the Future</h1>
            <p className="text-gray-500 font-medium">Smart space management starts here</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
              <input
                type="text"
                required
                className="w-100 px-6 py-4 bg-white/50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <input
                type="email"
                required
                className="w-100 px-6 py-4 bg-white/50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                placeholder="john@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <input
                type="password"
                required
                className="w-100 px-6 py-4 bg-white/50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">I am a...</label>
              <div className="flex gap-4">
                {['student', 'admin'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({...formData, role})}
                    className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
                      formData.role === role ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-2">
                <Shield size={16} /> {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-100 btn btn-primary py-5 rounded-3xl text-lg font-black shadow-xl shadow-indigo-200/50 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : <>Create My Account <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 font-bold">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline">Log in</Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400 font-medium">
          By joining, you agree to optimize campus resources responsibly.
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
