// components/Layout.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDashboard, MdPeople, MdEventSeat, MdPrint, MdSettings,
  MdSchool, MdLogout, MdMenu, MdClose, MdDarkMode, MdLightMode,
} from 'react-icons/md';
import { FiBell } from 'react-icons/fi';

const NAV = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: MdDashboard },
  { href: '/students', label: 'الطلاب', icon: MdPeople },
  { href: '/seats', label: 'أرقام الجلوس', icon: MdEventSeat },
  { href: '/print', label: 'مركز الطباعة', icon: MdPrint },
  { href: '/settings', label: 'الإعدادات', icon: MdSettings },
];

export default function Layout({ children, title = '' }) {
  const router = useRouter();
  const { logout, darkMode, toggleDarkMode, schoolInfo, students } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); router.push('/'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:'linear-gradient(135deg,#c9a227,#f0c040)'}}>
            <MdSchool size={26} className="text-white" />
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-white text-sm leading-tight truncate">{schoolInfo.name}</p>
            <p className="text-blue-300 text-xs">{schoolInfo.year}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = router.pathname === href;
          return (
            <Link key={href} href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${active
                  ? 'text-white font-semibold'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              style={active ? {background:'linear-gradient(135deg,rgba(201,162,39,0.25),rgba(201,162,39,0.1))',borderRight:'3px solid #c9a227'} : {}}
            >
              <Icon size={20} className={active ? 'text-gold' : 'text-blue-300 group-hover:text-gold'} />
              <span className="text-sm">{label}</span>
              {href === '/students' && (
                <span className="mr-auto badge bg-royal-light/60 text-white text-xs">{students.length}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button onClick={toggleDarkMode} className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all w-full">
          {darkMode ? <MdLightMode size={20}/> : <MdDarkMode size={20}/>}
          <span className="text-sm">{darkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}</span>
        </button>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:text-white hover:bg-red-500/20 transition-all w-full">
          <MdLogout size={20}/>
          <span className="text-sm">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[270px] flex-shrink-0 fixed top-0 right-0 h-full z-30"
        style={{background:'linear-gradient(180deg,#0f2347 0%,#1a3a6e 100%)'}}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'tween',duration:0.3}}
              className="fixed top-0 right-0 h-full w-[270px] z-50 lg:hidden flex flex-col"
              style={{background:'linear-gradient(180deg,#0f2347 0%,#1a3a6e 100%)'}}>
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 left-4 text-white/60 hover:text-white">
                <MdClose size={24}/>
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:mr-[270px] flex flex-col min-h-screen page-bg">
        {/* Topbar */}
        <header className="glass-card sticky top-0 z-20 flex items-center justify-between px-5 py-4 no-print">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-royal dark:text-white p-1">
              <MdMenu size={26}/>
            </button>
            <h1 className="text-lg font-bold text-royal dark:text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-blue-100 dark:hover:bg-white/10 text-royal dark:text-white transition-all">
              <FiBell size={20}/>
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{background:'linear-gradient(135deg,#1a3a6e,#2557b0)'}}>
              م
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-5 md:p-7">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
            {children}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="text-center text-xs text-blue-400/60 py-3 no-print">
          نظام إدارة أرقام الجلوس &mdash; {schoolInfo.name} &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
