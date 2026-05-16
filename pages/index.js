// pages/index.js  (Login Page)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '../lib/store';
import { motion } from 'framer-motion';
import { FiLock, FiUser, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { MdSchool } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('يرجى إدخال اسم المستخدم وكلمة المرور'); return; }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 800));
    const ok = login(username, password);
    if (ok) {
      toast.success('تم تسجيل الدخول بنجاح');
      router.push('/dashboard');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      toast.error('بيانات خاطئة');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{background:'linear-gradient(135deg,#0f2347 0%,#1a3a6e 50%,#2557b0 100%)'}}>
      {/* Decorative circles */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full opacity-10" style={{background:'radial-gradient(circle,#60a5fa,transparent)'}} />
      <div className="absolute bottom-[-120px] left-[-80px] w-[350px] h-[350px] rounded-full opacity-10" style={{background:'radial-gradient(circle,#c9a227,transparent)'}} />
      <div className="absolute top-1/2 left-10 w-2 h-2 bg-white/30 rounded-full animate-pulse-slow" />
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-gold/30 rounded-full animate-pulse-slow" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md mx-4"
      >
        {/* Card */}
        <div className="glass-card rounded-3xl p-8 md:p-10" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)'}}>
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
              style={{background:'linear-gradient(135deg,#c9a227,#f0c040)',boxShadow:'0 8px 24px rgba(201,162,39,0.5)'}}
            >
              <MdSchool size={44} className="text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white text-center">نظام إدارة أرقام الجلوس</h1>
            <p className="text-blue-200 text-sm mt-1 text-center">الدخول للوحة الإدارة</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label className="text-blue-200 text-sm font-medium block mb-2">اسم المستخدم</label>
              <div className="relative">
                <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="w-full pr-12 pl-4 py-3 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/60 transition-all"
                  style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)'}}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-blue-200 text-sm font-medium block mb-2">كلمة المرور</label>
              <div className="relative">
                <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full pr-12 pl-12 py-3 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/60 transition-all"
                  style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)'}}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white">
                  {showPw ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-red-500/20 border border-red-500/30 text-red-200 text-sm rounded-xl px-4 py-2.5 text-center">
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
              style={{background:'linear-gradient(135deg,#c9a227,#f0c040)',color:'#0f2347',boxShadow:'0 4px 16px rgba(201,162,39,0.5)'}}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-royal/40 border-t-royal rounded-full animate-spin" />
              ) : (
                <><FiShield size={18} /> تسجيل الدخول</>
              )}
            </motion.button>
          </form>

          <p className="text-center text-white/30 text-xs mt-6">
            المستخدم الافتراضي: admin | كلمة المرور: school2024
          </p>
        </div>
      </motion.div>
    </div>
  );
}
