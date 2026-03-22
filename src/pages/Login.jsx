import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { LogIn, Sparkles, Shield, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
      const userData = userDoc.data();
      if (userData?.role === 'admin') navigate('/admin');
      else navigate('/demo');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="glass p-12 rounded-[48px] shadow-2xl border-white/50 bg-white/70 backdrop-blur-2xl">
          <div className="text-center mb-10">
            <motion.div 
               initial={{ y: -20 }}
               animate={{ y: 0 }}
               className="inline-flex items-center justify-center w-20 h-20 rounded-[28px] bg-grad-primary text-white mb-6 shadow-xl shadow-indigo-200"
            >
              <LogIn size={40} />
            </motion.div>
            <h1 className="text-4xl font-black mb-3">Welcome Back</h1>
            <p className="text-gray-500 font-medium">Continue your smart campus journey</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <input
                type="email"
                required
                className="w-100 px-6 py-4 bg-white/50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <input
                type="password"
                required
                className="w-100 px-6 py-4 bg-white/50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-2">
                <Shield size={16} /> {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-100 btn btn-primary py-5 rounded-3xl text-lg font-black shadow-xl shadow-indigo-200/50 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : <>Log In to Campus IQ <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 font-bold">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-600 hover:underline">Create one</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-8 text-xs font-black uppercase tracking-widest text-gray-300">
          <span className="flex items-center gap-2"><Shield size={14} /> SECURE</span>
          <span className="flex items-center gap-2"><Sparkles size={14} /> AI-POWERED</span>
          <span className="flex items-center gap-2">● LIVE</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
