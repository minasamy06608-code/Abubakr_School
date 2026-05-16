// pages/dashboard.js
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import withAuth from '../components/withAuth';
import { useStore, GRADES } from '../lib/store';
import { motion } from 'framer-motion';
import { MdPeople, MdEventSeat, MdSchool, MdClass } from 'react-icons/md';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';

function Dashboard() {
  const { students, schoolInfo } = useStore();

  const withSeat = students.filter((s) => s.seatNumber);
  const withoutSeat = students.filter((s) => !s.seatNumber);
  const totalClasses = [...new Set(students.map((s) => `${s.grade}_${s.class}`))].length;

  const gradeStats = GRADES.map((g) => ({
    ...g,
    count: students.filter((s) => s.grade === g.id).length,
    withSeat: students.filter((s) => s.grade === g.id && s.seatNumber).length,
  }));

  return (
    <Layout title="لوحة التحكم">
      {/* Welcome */}
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
        className="glass-card rounded-2xl p-6 mb-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{background:'linear-gradient(135deg,#1a3a6e,#2557b0)',border:'none'}}>
        <div>
          <h2 className="text-2xl font-black text-white mb-1">مرحباً بك 👋</h2>
          <p className="text-blue-200 text-sm">{schoolInfo.name} &mdash; العام الدراسي {schoolInfo.year}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/students" className="px-5 py-2.5 rounded-xl bg-white text-royal font-bold text-sm hover:bg-blue-50 transition-all shadow">
            + إضافة طالب
          </Link>
          <Link href="/seats" className="px-5 py-2.5 rounded-xl bg-gold text-white font-bold text-sm hover:bg-gold-light transition-all shadow">
            أرقام الجلوس
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard icon={MdPeople} label="إجمالي الطلاب" value={students.length} color="#1a3a6e" delay={0} />
        <StatCard icon={MdEventSeat} label="لديهم أرقام جلوس" value={withSeat.length} color="#16a34a" delay={0.1} subtitle={`${students.length ? Math.round(withSeat.length/students.length*100) : 0}%`} />
        <StatCard icon={MdClass} label="الفصول الدراسية" value={totalClasses} color="#c9a227" delay={0.2} />
        <StatCard icon={FiAlertCircle} label="بدون رقم جلوس" value={withoutSeat.length} color="#dc2626" delay={0.3} />
      </div>

      {/* Grade breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">
        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.3}}
          className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-royal dark:text-white text-base mb-5 flex items-center gap-2">
            <MdSchool className="text-gold" size={22}/> إحصائيات الصفوف
          </h3>
          <div className="space-y-4">
            {gradeStats.map((g) => (
              <div key={g.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700 dark:text-white/80">{g.short}</span>
                  <span className="text-gray-500 dark:text-white/50">{g.withSeat}/{g.count}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{width:0}}
                    animate={{width: g.count ? `${(g.withSeat/g.count)*100}%` : '0%'}}
                    transition={{delay:0.5,duration:0.8}}
                    className="h-full rounded-full"
                    style={{background:'linear-gradient(90deg,#1a3a6e,#2557b0)'}}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.3}}
          className="glass-card rounded-2xl p-6">
          <h3 className="font-bold text-royal dark:text-white text-base mb-5">إجراءات سريعة</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href:'/students', label:'إضافة طلاب', icon:'👨‍🎓', color:'#1a3a6e' },
              { href:'/seats', label:'توليد أرقام', icon:'🔢', color:'#16a34a' },
              { href:'/print', label:'طباعة الكشوف', icon:'🖨️', color:'#c9a227' },
              { href:'/settings', label:'الإعدادات', icon:'⚙️', color:'#7c3aed' },
            ].map((a) => (
              <Link key={a.href} href={a.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-current transition-all hover:shadow-card group"
                style={{'--tw-border-opacity':'1'}}>
                <span className="text-3xl">{a.icon}</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-white/80 group-hover:text-royal dark:group-hover:text-white transition-colors text-center">
                  {a.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent students */}
      {students.length > 0 && (
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
          className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-royal dark:text-white text-base">آخر الطلاب المضافين</h3>
            <Link href="/students" className="text-sm text-blue-500 hover:text-blue-700 font-semibold">عرض الكل</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>رقم الجلوس</th><th>الاسم</th><th>الصف</th><th>الفصل</th><th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {[...students].reverse().slice(0, 6).map((s) => (
                  <tr key={s.id}>
                    <td><div className="flex justify-center">{s.seatNumber ? <span className="seat-number">{s.seatNumber}</span> : <span className="text-gray-400">—</span>}</div></td>
                    <td className="font-semibold text-royal dark:text-white">{s.name}</td>
                    <td className="text-gray-600 dark:text-white/60 text-xs">{GRADES.find(g=>g.id===s.grade)?.short}</td>
                    <td>فصل {s.class}</td>
                    <td>
                      {s.seatNumber
                        ? <span className="badge bg-green-100 text-green-700"><FiCheckCircle className="inline ml-1" size={10}/>مكتمل</span>
                        : <span className="badge bg-red-100 text-red-600"><FiAlertCircle className="inline ml-1" size={10}/>ناقص</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </Layout>
  );
}

export default withAuth(Dashboard);
