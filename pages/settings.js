// pages/settings.js
import { useState } from 'react';
import Layout from '../components/Layout';
import withAuth from '../components/withAuth';
import { useStore } from '../lib/store';
import { motion } from 'framer-motion';
import { MdSave, MdDarkMode, MdLightMode, MdSecurity, MdSchool, MdDeleteForever } from 'react-icons/md';
import { FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

function Settings() {
  const { schoolInfo, updateSchoolInfo, darkMode, toggleDarkMode, updateCredentials, adminCredentials, students } = useStore();
  const [school, setSchool] = useState({ ...schoolInfo });
  const [creds, setCreds] = useState({ username: adminCredentials.username, password: '', confirmPassword: '' });

  const saveSchool = () => {
    updateSchoolInfo(school);
    toast.success('تم حفظ بيانات المدرسة');
  };

  const saveCreds = () => {
    if (!creds.username) { toast.error('يرجى إدخال اسم المستخدم'); return; }
    if (creds.password && creds.password !== creds.confirmPassword) { toast.error('كلمتا المرور غير متطابقتين'); return; }
    updateCredentials(creds.username, creds.password || adminCredentials.password);
    setCreds((c) => ({ ...c, password: '', confirmPassword: '' }));
    toast.success('تم تحديث بيانات الدخول');
  };

  const clearData = () => {
    if (!confirm(`سيتم حذف جميع بيانات ${students.length} طالب. هل أنت متأكد؟`)) return;
    const { deleteStudents } = useStore.getState();
    deleteStudents(students.map((s) => s.id));
    toast.success('تم مسح جميع بيانات الطلاب');
  };

  const Section = ({ icon: Icon, title, children }) => (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="glass-card rounded-2xl p-6 mb-5">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-blue-100 dark:border-white/10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#1a3a6e,#2557b0)'}}>
          <Icon size={18} className="text-white"/>
        </div>
        <h2 className="font-bold text-royal dark:text-white text-base">{title}</h2>
      </div>
      {children}
    </motion.div>
  );

  return (
    <Layout title="الإعدادات">
      <div className="max-w-2xl">
        {/* School Info */}
        <Section icon={MdSchool} title="بيانات المدرسة">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-white/60 font-medium block mb-1.5">اسم المدرسة</label>
              <input className="input-field" value={school.name} onChange={(e)=>setSchool(s=>({...s,name:e.target.value}))} placeholder="اسم المدرسة"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60 font-medium block mb-1.5">العام الدراسي</label>
                <input className="input-field" value={school.year} onChange={(e)=>setSchool(s=>({...s,year:e.target.value}))} placeholder="2024 / 2025"/>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60 font-medium block mb-1.5">المدينة</label>
                <input className="input-field" value={school.city} onChange={(e)=>setSchool(s=>({...s,city:e.target.value}))} placeholder="القاهرة"/>
              </div>
            </div>
            <button onClick={saveSchool} className="btn-royal flex items-center gap-2">
              <MdSave size={18}/> حفظ بيانات المدرسة
            </button>
          </div>
        </Section>

        {/* Appearance */}
        <Section icon={MdDarkMode} title="المظهر">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 dark:text-white">الوضع الداكن</p>
              <p className="text-sm text-gray-500 dark:text-white/40">تبديل بين الوضع الفاتح والداكن</p>
            </div>
            <button onClick={toggleDarkMode}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${darkMode ? 'bg-royal' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 ${darkMode ? 'right-0.5' : 'left-0.5'}`}/>
            </button>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-white/5 flex items-center gap-3">
            {darkMode ? <MdDarkMode className="text-blue-400" size={24}/> : <MdLightMode className="text-amber-500" size={24}/>}
            <span className="text-sm text-gray-600 dark:text-white/60">الوضع الحالي: <strong>{darkMode ? 'داكن' : 'فاتح'}</strong></span>
          </div>
        </Section>

        {/* Security */}
        <Section icon={MdSecurity} title="الأمان وبيانات الدخول">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-white/60 font-medium block mb-1.5">اسم المستخدم</label>
              <input className="input-field" value={creds.username} onChange={(e)=>setCreds(c=>({...c,username:e.target.value}))}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60 font-medium block mb-1.5">كلمة مرور جديدة</label>
                <input className="input-field" type="password" value={creds.password} onChange={(e)=>setCreds(c=>({...c,password:e.target.value}))} placeholder="اتركها فارغة للإبقاء على القديمة"/>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60 font-medium block mb-1.5">تأكيد كلمة المرور</label>
                <input className="input-field" type="password" value={creds.confirmPassword} onChange={(e)=>setCreds(c=>({...c,confirmPassword:e.target.value}))} placeholder="أعد إدخال كلمة المرور"/>
              </div>
            </div>
            <button onClick={saveCreds} className="btn-royal flex items-center gap-2">
              <MdSave size={18}/> حفظ بيانات الدخول
            </button>
          </div>
        </Section>

        {/* Danger Zone */}
        <Section icon={FiTrash2} title="منطقة الخطر">
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40">
            <p className="font-semibold text-red-700 dark:text-red-400 mb-1">حذف جميع بيانات الطلاب</p>
            <p className="text-sm text-red-600/70 dark:text-red-400/60 mb-4">سيتم حذف جميع بيانات الطلاب ({students.length} طالب) بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.</p>
            <button onClick={clearData}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all">
              <MdDeleteForever size={18}/> مسح جميع البيانات
            </button>
          </div>
        </Section>

        {/* About */}
        <div className="text-center text-xs text-gray-400 dark:text-white/20 py-3">
          نظام إدارة أرقام الجلوس &mdash; الإصدار 1.0.0 &mdash; {new Date().getFullYear()}
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(Settings);
